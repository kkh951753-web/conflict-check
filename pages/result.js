// pages/result.js
"use client";

import styles from "../styles/result.module.css";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ================= 공통 유틸 ================= */

const MBTI_OPTIONS = [
  "ISTJ","ISFJ","INFJ","INTJ",
  "ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP",
  "ESTJ","ESFJ","ENFJ","ENTJ",
];
const MBTI_SET = new Set(MBTI_OPTIONS);

const normalizeMbti = (v) => {
  const x = String(v || "").trim().toUpperCase();
  return MBTI_SET.has(x) ? x : "";
};

const safeNumber = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};

const RESULT_STORAGE_KEY = "lastConflictResult";

/* ================= 색상 / 자동 문구 ================= */

const typeColorMap = {
  감정: { bg: "#EEF2FF", color: "#4B63F5" },
  문제해결: { bg: "#ECFDF5", color: "#059669" },
  관계: { bg: "#F5F3FF", color: "#7C3AED" },
  회피: { bg: "#F3F4F6", color: "#6B7280" },
};

const misunderstandingMap = {
  감정: "예민하거나 감정적이라는 오해를 받기 쉽지만, 실제로는 관계에 진지한 편입니다.",
  문제해결: "차갑고 이성적으로 보일 수 있지만, 갈등을 빨리 정리하고 싶은 의도가 큽니다.",
  관계: "눈치를 많이 본다는 오해를 받지만, 관계를 소중히 여기는 선택일 뿐입니다.",
  회피: "무관심해 보일 수 있지만, 감정 소모를 줄이기 위한 방식일 수 있습니다.",
};

const comboAdviceMap = {
  감정: {
    문제해결: "감정을 충분히 표현한 뒤 해결 단계로 넘어가면 갈등이 훨씬 부드러워집니다.",
    관계: "상대 반응을 살피느라 내 감정을 미루고 있지는 않은지 점검해보세요.",
    회피: "감정이 클수록 잠시 쉬되, 다시 이야기할 시점을 정해두는 게 중요합니다.",
  },
  문제해결: {
    감정: "해결책보다 먼저 상대의 감정이 정리되었는지 확인해보세요.",
    관계: "관계를 위해서라도 문제의 핵심은 분명히 짚는 대화가 필요합니다.",
    회피: "침묵이 오해로 번지지 않도록 최소한의 신호는 남겨보세요.",
  },
  관계: {
    감정: "상대뿐 아니라 나도 충분히 서운할 수 있다는 점을 허용해보세요.",
    문제해결: "관계를 지키기 위해서라도 문제를 명확히 다루는 것이 도움이 됩니다.",
    회피: "미루는 침묵이 관계 단절로 보이지 않게 의도를 표현해보세요.",
  },
  회피: {
    감정: "피하고 싶은 마음 뒤에 어떤 감정이 있는지 차분히 들여다보세요.",
    문제해결: "모든 걸 한 번에 해결하려 하지 않아도 됩니다. 한 단계면 충분해요.",
    관계: "거리를 두더라도 관계를 끊는 신호로 보이지 않게 표현해보세요.",
  },
};

/* ================= 유형 기본 설명 ================= */

const baseDescriptionMap = {
  감정: {
    title: "감정을 먼저 느끼고 반응하는 감정 중심형 💙",
    text: [
      "상대의 말과 행동에서 감정적 신호를 빠르게 감지하는 편입니다.",
      "관계의 진정성과 감정 교류를 중요하게 여깁니다.",
    ],
    direction: [
      "감정과 사실을 분리해 바라보는 연습이 도움이 됩니다.",
      "감정을 충분히 표현한 뒤 판단해보세요.",
    ],
  },
  문제해결: {
    title: "갈등을 구조적으로 정리하려는 문제해결 중심형 🔧",
    text: [
      "갈등을 해결 가능한 문제로 인식합니다.",
      "원인과 구조를 파악하려는 경향이 강합니다.",
    ],
    direction: ["해결 전에 감정 정리가 되었는지 확인해보세요."],
  },
  관계: {
    title: "관계 유지를 중시하는 관계 중심형 🤝",
    text: [
      "조화와 관계의 안정성을 중요하게 생각합니다.",
      "상대의 반응과 분위기에 민감합니다.",
    ],
    direction: ["상대뿐 아니라 내 감정도 같은 비중으로 다뤄보세요."],
  },
  회피: {
    title: "갈등 상황에서 거리를 두려는 회피형 🌫",
    text: [
      "감정 소모를 줄이기 위해 거리를 두는 편입니다.",
      "시간이 지나야 대화가 가능한 경우가 많습니다.",
    ],
    direction: ["회피 대신 ‘언제 다시 이야기할지’를 정해보세요."],
  },
};

/* ================= MBTI 연관 설명(참고) ================= */

const MBTI_HINT = {
  I: "혼자 정리하는 시간이 있어야 감정/생각이 정돈되는 편",
  E: "대화를 하면서 생각이 정리되고 에너지가 붙는 편",
  N: "의미/맥락/의도를 먼저 읽고 큰 그림을 선호",
  S: "사실/상황/구체적 표현을 기준으로 판단하는 편",
  F: "관계/정서적 납득이 중요해서 말의 온도를 크게 느낄 수 있음",
  T: "문제/기준/일관성을 중요하게 봐서 해결 중심으로 흐르기 쉬움",
  J: "정리·결론이 나야 마음이 편해지는 편",
  P: "열어두고 유연하게 가야 부담이 덜한 편",
};

const explainMbtiRelation = (mbti) => {
  const x = normalizeMbti(mbti);
  if (!x) return [];
  return [
    { dim: x[0], text: MBTI_HINT[x[0]] },
    { dim: x[1], text: MBTI_HINT[x[1]] },
    { dim: x[2], text: MBTI_HINT[x[2]] },
    { dim: x[3], text: MBTI_HINT[x[3]] },
  ].filter((v) => v.text);
};

/* ================= 16유형 동물 키 계산용 ================= */

// 대표유형(4) -> 번호(1~4)
const MAIN_TO_NUM = {
  감정: "1",
  문제해결: "2",
  관계: "3",
  회피: "4",
};

export default function ResultPage() {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({ name: "-", age: "-", gender: "-", mbti: "" });
  const [scores, setScores] = useState({ 감정: 0, 문제해결: 0, 관계: 0, 회피: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const q = router.query || {};

    const scoresFromQuery = {
      감정: safeNumber(q["감정"]),
      문제해결: safeNumber(q["문제해결"]),
      관계: safeNumber(q["관계"]),
      회피: safeNumber(q["회피"]),
    };

    const hasQueryScores =
      scoresFromQuery.감정 + scoresFromQuery.문제해결 + scoresFromQuery.관계 + scoresFromQuery.회피 > 0;

    let payload = null;
    if (!hasQueryScores && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(RESULT_STORAGE_KEY);
        payload = raw ? JSON.parse(raw) : null;
      } catch {
        payload = null;
      }
    }

    const finalUserInfo = {
      name: q.name || payload?.userInfo?.name || "-",
      age: q.age || payload?.userInfo?.age || "-",
      gender: q.gender || payload?.userInfo?.gender || "-",
      mbti: normalizeMbti(q.mbti || payload?.userInfo?.mbti || ""),
    };

    const finalScores = hasQueryScores
      ? scoresFromQuery
      : payload?.scores || { 감정: 0, 문제해결: 0, 관계: 0, 회피: 0 };

    setUserInfo(finalUserInfo);
    setScores(finalScores);
    setLoading(false);
  }, [router.isReady, router.query]);

  const { mainType, subType, tiedTop, sortedEntries, gapToSecond } = useMemo(() => {
    const order = ["감정", "문제해결", "관계", "회피"];
    const entries = order.map((k) => [k, scores[k] ?? 0]);
    entries.sort((a, b) => b[1] - a[1]);

    const mainType = entries[0][0];
    const mainScore = entries[0][1];

    const tiedTop = entries.filter(([, v]) => v === mainScore && v > 0).map(([k]) => k);

    const subType =
      tiedTop.length > 1 ? null : entries[1] && entries[1][1] > 0 ? entries[1][0] : null;

    const gapToSecond = entries[1] ? entries[0][1] - entries[1][1] : 0;

    return { mainType, subType, tiedTop, sortedEntries: entries, gapToSecond };
  }, [scores]);

  const comboAdvice = useMemo(() => {
    if (!mainType || !subType) return null;
    return comboAdviceMap?.[mainType]?.[subType] || null;
  }, [mainType, subType]);

  const info = baseDescriptionMap[mainType] || baseDescriptionMap["감정"];

  const chartData = [
    { name: "감정형", value: scores.감정 },
    { name: "문제해결형", value: scores.문제해결 },
    { name: "관계형", value: scores.관계 },
    { name: "회피형", value: scores.회피 },
  ];

  const mbtiTips = useMemo(() => explainMbtiRelation(userInfo.mbti), [userInfo.mbti]);

  const scoreInsight = useMemo(() => {
    const total = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
    const top = sortedEntries?.[0];
    const second = sortedEntries?.[1];

    if (!total || !top) {
      return "점수가 아직 충분히 입력되지 않았어요. 다시 검사하거나 입력값을 확인해 주세요.";
    }

    if (tiedTop.length > 1) {
      return "두 가지 이상 성향이 비슷하게 나타났어요. 상황/상대/스트레스 강도에 따라 반응이 달라질 수 있습니다.";
    }

    if (second && gapToSecond >= 3) {
      return "대표 유형이 비교적 뚜렷하게 나타났어요. 갈등 상황에서 이 패턴이 자동으로 먼저 올라올 가능성이 큽니다.";
    }

    return "대표 유형은 정해졌지만, 2순위 성향도 꽤 가까워요. 상황에 따라 보조경향이 함께 작동할 수 있습니다.";
  }, [scores, sortedEntries, gapToSecond, tiedTop.length]);

  // ✅ 주유형 + MBTI(NS/FT) -> 16유형 키 (예: "2nt")
  const animalKey = useMemo(() => {
    const num = MAIN_TO_NUM[mainType];          // "1"~"4"
    const mbti = normalizeMbti(userInfo.mbti);  // "ENTJ"
    const ns = mbti[1];                         // N/S
    const ft = mbti[2];                         // F/T
    return `${num}${ns}${ft}`.toLowerCase();    // "2nt"
  }, [mainType, userInfo.mbti]);

  // ✅ 이미지 경로: public/animals/2nt.png
  const animalImgSrc = useMemo(() => `/animals/${animalKey}.png`, [animalKey]);

  const goToRetest = () => router.push("/test");

  const goToNextStepPage = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          RESULT_STORAGE_KEY,
          JSON.stringify({
            userInfo,
            scores,
            mainType,
            subType: subType || "",
            savedAt: Date.now(),
          })
        );
      } catch {}
    }

    router.push({
      pathname: "/followup",
      query: {
        mainType,
        subType: subType || "",
        name: userInfo.name,
        mbti: userInfo.mbti || "",
      },
    });
  };

  if (loading) return <p className={styles.loading}>결과 불러오는 중...</p>;

  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <h1 className={styles.title}>나의 R-STYLE 결과</h1>

        <h2 className={styles.subtitle} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <span>대표 유형: {mainType}형</span>

          {subType && (
            <span
              className={styles.subBadge}
              style={{
                backgroundColor: typeColorMap[subType].bg,
                color: typeColorMap[subType].color,
              }}
            >
              보조 경향 · {subType}형
            </span>
          )}
        </h2>

        {/* ✅ 동물 이미지: 텍스트 전부 제거, 이미지만 크게 */}
        <div style={{ marginTop: "16px", marginBottom: "10px", textAlign: "center" }}>
          <img
            src={animalImgSrc}
            alt="동물 이미지"
            style={{
              width: "260px",
              maxWidth: "80vw",
              height: "auto",
              borderRadius: "22px",
              display: "block",
              margin: "0 auto",
              boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
            }}
          />
        </div>

        {tiedTop.length > 1 && (
          <p className={styles.desc}>
            <b>{tiedTop.join("형 · ")}형</b> 성향이 비슷하게 나타났어요.
          </p>
        )}

        <p className={styles.desc} style={{ marginTop: "8px" }}>
          <b>대표 유형</b>은 갈등에서 내가 가장 먼저 자동 반응하기 쉬운 방식이고,{" "}
          <b>보조 경향</b>은 상황에 따라 대표 유형을 “보완/가속/완화”시키는 성향이에요.
          <br />
          {scoreInsight}
        </p>

        {comboAdvice && (
          <p
            className={styles.tipBox}
            style={{
              borderLeft: `4px solid ${typeColorMap[mainType].color}`,
            }}
          >
            💡 <b>이 조합을 위한 한 가지 팁</b>
            <br />
            {comboAdvice}
          </p>
        )}

        <p className={styles.desc} style={{ marginTop: "6px" }}>
          ⚠️ <b>자주 받는 오해</b> · {misunderstandingMap[mainType]}
        </p>

        <p className={styles.highlight}>{info.title}</p>

        <h3 className={styles.sectionTitle}>나의 갈등 대처 특징</h3>
        {info.text.map((t, i) => (
          <p key={i} className={styles.desc}>
            {t}
          </p>
        ))}

        <h3 className={styles.sectionTitle}>나에게 필요한 방향성</h3>
        {info.direction.map((t, i) => (
          <p key={i} className={styles.desc}>
            {t}
          </p>
        ))}

        <h3 className={styles.sectionTitle}>MBTI와의 연관성 (참고)</h3>
        <p className={styles.desc}>
          입력한 MBTI는 <b>{userInfo.mbti}</b>예요. 이 검사는 MBTI를 대체하는 것이 아니라,
          갈등 상황에서의 반응 패턴을 따로 측정하고{" "}
          <b>MBTI 성향이 그 패턴에 어떤 식으로 영향을 줄 수 있는지</b> 참고로 설명합니다.
        </p>

        {mbtiTips.length > 0 ? (
          <ul className={styles.list}>
            {mbtiTips.map((m, i) => (
              <li key={i}>
                <b>{m.dim}</b>: {m.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>MBTI 설명 데이터를 찾지 못했어요.</p>
        )}

        <h3 className={styles.sectionTitle}>내 점수 그래프</h3>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4B8CF5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className={`${styles.card} ${styles.nextCard}`}>
        <h2 className={styles.sectionTitle}>다음 단계</h2>
        <p className={styles.desc}>
          지금 결과를 바탕으로 나의 패턴을 더 깊게 이해하거나, 후속 프로그램에
          참여해 실제 갈등 장면에서 적용해볼 수 있어요.
        </p>

        <div className={styles.buttonRow}>
          <button className={styles.btnOutline} onClick={goToRetest}>
            다시 검사하기
          </button>
          <button className={styles.btnPrimary} onClick={goToNextStepPage}>
            후속 프로그램 안내 보기
          </button>
        </div>
      </section>
    </main>
  );
}
