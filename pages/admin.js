"use client";

import { useMemo, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function AdminPage() {
  const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);

  const [table, setTable] = useState("test_results");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const filteredHint = useMemo(() => {
    if (table === "test_results") return "검색: 이름/MBTI";
    return "검색: 이름/연락처/추천인";
  }, [table]);

  const login = () => {
    if (!ADMIN_PW) {
      alert("환경변수 NEXT_PUBLIC_ADMIN_PASSWORD가 설정되지 않았어요.");
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
  };

  const fetchData = async (nextPage = 1) => {
    setLoading(true);
    try {
      const from = (nextPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let queryBuilder = supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      const keyword = q.trim();
      if (keyword) {
        if (table === "test_results") {
          queryBuilder = queryBuilder.or(
            `name.ilike.%${keyword}%,mbti.ilike.%${keyword}%`
          );
        } else {
          queryBuilder = queryBuilder.or(
            `name.ilike.%${keyword}%,phone.ilike.%${keyword}%,recommender.ilike.%${keyword}%`
          );
        }
      }

      const { data, error } = await queryBuilder;
      if (error) throw error;

      setRows(data || []);
      setPage(nextPage);
    } catch (e) {
      console.error(e);
      alert("데이터를 불러오지 못했어요. (RLS 설정/권한 문제일 수도 있어요)");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!rows.length) return alert("다운로드할 데이터가 없어요.");

    const headers = Object.keys(rows[0]);
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
        <section style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 14, padding: 16 }}>
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
          <section style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            <select
              value={table}
              onChange={(e) => {
                setTable(e.target.value);
                setRows([]);
                setPage(1);
              }}
              style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)" }}
            >
              <option value="test_results">test_results (검사 참여자)</option>
              <option value="followup_requests">followup_requests (후속 신청)</option>
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
              onKeyDown={(e) => e.key === "Enter" && fetchData(1)}
            />

            <button
              onClick={() => fetchData(1)}
              style={{ padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer" }}
            >
              {loading ? "불러오는 중..." : "조회"}
            </button>

            <button
              onClick={downloadCSV}
              style={{ padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer" }}
            >
              CSV 다운로드
            </button>

            <button
              onClick={logout}
              style={{ padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer" }}
            >
              로그아웃
            </button>
          </section>

          <section style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: 12, background: "rgba(0,0,0,0.03)", display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 700 }}>{table}</div>
              <div style={{ color: "#666", fontSize: 13 }}>
                page {page} (pageSize {pageSize})
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {(rows[0] ? Object.keys(rows[0]) : ["데이터 없음"]).map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid rgba(0,0,0,0.08)", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length ? (
                    rows.map((r, idx) => (
                      <tr key={r.id ?? idx}>
                        {Object.keys(rows[0]).map((k) => (
                          <td key={k} style={{ padding: 10, borderBottom: "1px solid rgba(0,0,0,0.06)", whiteSpace: "nowrap" }}>
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
                style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", background: "white", cursor: "pointer" }}
              >
                이전
              </button>
              <button
                onClick={() => fetchData(page + 1)}
                disabled={loading}
                style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.15)", background: "white", cursor: "pointer" }}
              >
                다음
              </button>
            </div>
          </section>

          <p style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
            * 만약 조회가 안 되면 Supabase RLS 정책 때문에 차단된 걸 수 있어요.
          </p>
        </>
      )}
    </main>
  );
}

