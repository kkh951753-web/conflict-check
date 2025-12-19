"use client";

import { useEffect, useMemo, useState } from "react";
import supabase from "../lib/supabaseClient";

const PAGE_SIZE = 25;

// ✅ 테이블별 "표에 보여줄 컬럼" + "검색 대상 컬럼"을 명시 (안정적)
const TABLE_CONFIG = {
  test_results: {
    label: "test_results (검사 참여자)",
    // 네 테이블 컬럼명에 맞춰 두었음: id, created_at, name, gender, age, mbti
    columns: ["id", "created_at", "name", "gender", "age", "mbti"],
    searchCols: ["name", "mbti"],
    orderCandidates: ["created_at", "id"], // created_at 없으면 id로 정렬
    hint: "검색: 이름/MBTI",
  },
  followup_requests: {
    label: "followup_requests (후속 신청)",
    // ⚠️ 여기 컬럼명이 실제 테이블과 다르면 맞춰줘야 함
    // (현재 네 코드 기준: name, phone, recommender)
    columns: ["id", "created_at", "name", "phone", "recommender"],
    searchCols: ["name", "phone", "recommender"],
    orderCandidates: ["created_at", "id"],
    hint: "검색: 이름/연락처/추천인",
  },
};

export default function AdminPage() {
  const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);

  const [table, setTable] = useState("test_results");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const cfg = TABLE_CONFIG[table];

  const filteredHint = useMemo(() => cfg?.hint ?? "검색", [cfg]);

  const login = () => {
    if (!ADMIN_PW) {
      alert("환경변수 NEXT_PUBLIC_ADMIN_PASSWORD가 설정되지 않았어요. (Vercel/로컬 둘 다 확인)");
      return;
    }
    if (pw === ADMIN_PW) {
      setAuthed(true);
      setPw("");
    } else {
      alert("비밀번호가 틀렸어요.");
    }
  };

  const logout = () => {
    setAuthed(false);
    setRows([]);
    setPage(1);
    setQ("");
    setHasNext(false);
  };

  // ✅ 테이블별 select 컬럼 문자열
  const selectColumns = useMemo(() => {
    // columns를 명시하면 표 헤더/순서가 안정적
    // 혹시 컬럼이 더 필요하면 여기 추가만 하면 됨
    return (cfg?.columns && cfg.columns.length) ? cfg.columns.join(",") : "*";
  }, [cfg]);

  // ✅ 안전한 정렬: created_at 있으면 그걸로, 없으면 id로
  const buildOrderedQuery = (qb) => {
    const candidates = cfg?.orderCandidates || ["created_at", "id"];
    // Supabase는 "컬럼 존재 여부를 사전에 확인"하는 API가 없어서
    // 일단 created_at로 시도하고 실패하면 id로 재시도하는 방식을 쓴다.
    return { qb, candidates };
  };

  const fetchData = async (nextPage = 1) => {
    if (!cfg) return;

    setLoading(true);
    try {
      const from = (nextPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // 1) 기본 쿼리
      let qb = supabase.from(table).select(selectColumns).range(from, to);

      // 2) 검색어
      const keyword = q.trim();
      if (keyword && cfg.searchCols?.length) {
        // e.g. name.ilike.%kw%,mbti.ilike.%kw%
        const orExpr = cfg.searchCols.map((c) => `${c}.ilike.%${keyword}%`).join(",");
        qb = qb.or(orExpr);
      }

      // 3) 정렬 (created_at -> id fallback)
      const { candidates } = buildOrderedQuery(qb);

      let data = null;
      let error = null;

      // 후보 컬럼으로 순차 시도
      for (const col of candidates) {
        const attempt = await qb.order(col, { ascending: false });
        if (!attempt.error) {
          data = attempt.data;
          error = null;
          break;
        }
        // created_at 같은 컬럼이 없으면 여기서 실패할 수 있음
        error = attempt.error;
      }

      if (error) throw error;

      const list = data || [];
      setRows(list);
      setPage(nextPage);

      // 다음 페이지 여부: 이번 페이지가 PAGE_SIZE 꽉 찼으면 다음 있을 "가능성" O
      setHasNext(list.length === PAGE_SIZE);
    } catch (e) {
      console.error(e);

      // ✅ 여기 메시지가 “RLS”로만 나오면 헷갈려서,
      // 테이블/컬럼 불일치 케이스까지 안내
      alert(
        "데이터를 불러오지 못했어요.\n\n" +
          "체크할 것:\n" +
          "1) Supabase RLS/정책 (읽기 허용 여부)\n" +
          "2) 테이블/컬럼명이 admin.js 설정과 일치하는지\n" +
          "3) followup_requests에 created_at 컬럼이 있는지\n"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ 로그인 후/테이블 변경 시 자동으로 1페이지 조회
  useEffect(() => {
    if (!authed) return;
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, table]);

  // ✅ 검색어 Enter 시 1페이지 조회
  const onSearchEnter = (e) => {
    if (e.key === "Enter") fetchData(1);
  };

  const downloadCSV = () => {
    if (!rows.length) return alert("다운로드할 데이터가 없어요.");

    const headers = cfg?.columns?.length ? cfg.columns : Object.keys(rows[0]);

    const escape = (v) => {
      const s = String(v ?? "");
      const needsQuote = /[",\n]/.test(s);
      const out = s.replace(/"/g, '""');
      return needsQuote ? `"${out}"` : out;
    };

    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${table}_page${page}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 16px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 14 }}>
        관리자 페이지
      </h1>

      {!authed ? (
        <section
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 14,
            padding: 16,
          }}
        >
          <p style={{ marginBottom: 10 }}>비밀번호를 입력하세요.</p>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="관리자 비밀번호"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />

            <button
              onClick={login}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              로그인
            </button>
          </div>

          <p style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
            * 이 방식은 “링크 + 비밀번호” 수준의 간단 잠금입니다. (완전 보안 아님)
          </p>
        </section>
      ) : (
        <>
          <section
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <select
              value={table}
              onChange={(e) => {
                setTable(e.target.value);
                setRows([]);
                setPage(1);
                setHasNext(false);
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
            >
              <option value="test_results">{TABLE_CONFIG.test_results.label}</option>
              <option value="followup_requests">{TABLE_CONFIG.followup_requests.label}</option>
            </select>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={filteredHint}
              style={{
                flex: 1,
                minWidth: 220,
                padding: 10,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.15)",
              }}
              onKeyDown={onSearchEnter}
            />

            <button
              onClick={() => fetchData(1)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              {loading ? "불러오는 중..." : "조회"}
            </button>

            <button
              onClick={downloadCSV}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              CSV 다운로드
            </button>

            <button
              onClick={logout}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
              }}
            >
              로그아웃
            </button>
          </section>

          <section
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: 12,
                background: "rgba(0,0,0,0.03)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: 700 }}>{table}</div>
              <div style={{ color: "#666", fontSize: 13 }}>
                page {page} (pageSize {PAGE_SIZE})
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {(cfg?.columns?.length ? cfg.columns : rows[0] ? Object.keys(rows[0]) : ["데이터 없음"]).map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: 10,
                            borderBottom: "1px solid rgba(0,0,0,0.08)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.length ? (
                    rows.map((r, idx) => (
                      <tr key={r.id ?? idx}>
                        {(cfg?.columns?.length ? cfg.columns : Object.keys(rows[0])).map((k) => (
                          <td
                            key={k}
                            style={{
                              padding: 10,
                              borderBottom: "1px solid rgba(0,0,0,0.06)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {String(r[k] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td style={{ padding: 12 }}>
                        {loading ? "불러오는 중..." : "조회 버튼을 눌러 데이터를 불러오세요."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ padding: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => fetchData(Math.max(page - 1, 1))}
                disabled={page <= 1 || loading}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.15)",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                이전
              </button>
              <button
                onClick={() => fetchData(page + 1)}
                disabled={loading || !hasNext}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.15)",
                  background: "white",
                  cursor: "pointer",
                  opacity: (!hasNext || loading) ? 0.5 : 1,
                }}
              >
                다음
              </button>
            </div>
          </section>

          <p style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
            * 후속신청이 안 보이면: <b>followup_requests의 컬럼명이 (name/phone/recommender/created_at)</b>와
            일치하는지 먼저 확인하세요.
          </p>
        </>
      )}
    </main>
  );
}
