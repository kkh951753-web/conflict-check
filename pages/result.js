// pages/result.js
"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import supabase from "../lib/supabaseClient"; // (현재 파일에서 사용하지 않지만, 기존 유지)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

const getMbtiTraits = (mbti) => {
  if (!mbti || mbti.length !== 4) return null;
  const [EorI, NorS, TorF, JorP] = mbti.split("");
  return { EorI, NorS, TorF, JorP };
};

// 대표유형(mainType) 공통 설명(기존 너의 문장들을 유지/정리)
const baseDescriptionMap = {
  감정: {
    title: "감정을 먼저 느끼고 반응하는 감정 중심형 💙",
    text: [
      "상대의 말과 행동에서 마음의 상처를 먼저 느끼고, 감정의 진폭이 행동과 선택에 영향을 주는 편입니다.",
      "상대의 의도를 빠르게 파악하지만, 분위기 변화에도 민감합니다.",
    ],
    improve: [
      "감정이 먼저 움직이기 때문에 상대의 의도를 과하게 해석할 위험이 있어요.",
      "상대가 바로 공감해주지 않는다고 해서 ‘내 감정을 무시한다’고 단정 짓지 마세요.",
      "내적 감정 소용돌이가 판단을 흐릴 수 있으므로 감정 정리 시간을 가져보세요.",
    ],
    direction: [
      "갈등 상황에서 본인의 감정이 어떤 니즈를 말하는지 기록해보세요.",
      "상대의 메시지를 ‘감정’과 ‘사실’로 분리해 받아들이는 연습이 도움이 됩니다.",
    ],
  },

  문제해결: {
    title: "갈등을 구조적으로 정리하려는 문제해결 중심형 🔧",
    text: [
      "갈등을 해결 가능한 문제로 바라보고, 합리적인 결론을 내리려는 유형입니다.",
      "상황을 분석하고 통제하려는 경향이 있어 감정보다 논리적 접근을 우선합니다.",
    ],
    improve: [
      "빠른 해결 의지가 때때로 상대의 감정을 놓칠 수 있어요.",
      "상대가 아직 감정 정리가 안 된 상태라면 바로 해결 단계로 넘어가지 않는 것이 중요합니다.",
      "해결책 제시 전, ‘지금 이 이야기를 해결하고 싶은지’ 먼저 물어보세요.",
    ],
    direction: [
      "해결 중심 접근을 유지하되, 감정적 안전지대를 먼저 마련해주는 것이 이상적입니다.",
      "상대의 감정 요약 → 공감 → 해결 순으로 진행하면 효과적입니다.",
    ],
  },

  관계: {
    title: "상대의 감정과 관계 유지를 우선하는 관계 중심형 🤝",
    text: [
      "갈등 상황에서 조화와 관계 유지를 중요하게 생각합니다.",
      "상대방의 표정, 분위기, 어조에 예민하게 반응하는 경향이 있습니다.",
    ],
    improve: [
      "자기 희생이 반복되면 감정 고갈이 찾아올 수 있습니다.",
      "‘상대를 지키는 것’과 ‘나를 지키는 것’ 사이 균형이 필요합니다.",
    ],
    direction: [
      "갈등 시 상대의 기분만이 아니라 내 감정도 같은 비중으로 다루는 연습이 필요합니다.",
    ],
  },

  회피: {
    title: "현재 갈등보다 감정 소모를 피하고 싶은 회피형 🌫",
    text: [
      "상대와 다투기보다 상황을 잠시 피하려는 경향이 강합니다.",
      "심리적 안전이 확보되면 더 건강하게 대화를 이어갈 수 있습니다.",
    ],
    improve: [
      "회피는 잠깐의 휴식은 되지만 장기적으로 문제를 더욱 키울 수 있어요.",
      "갈등이 겁나는 이유를 차분히 명료화하는 작업이 필요합니다.",
    ],
    direction: [
      "감정 폭발이 두려움인지, 갈등 자체가 불편한 것인지 구분하면 다음 행동이 쉬워집니다.",
      "‘지금은 잠깐 쉬고, 언제 다시 이야기하자’처럼 재개 시점을 잡아두면 회피가 ‘전략’이 됩니다.",
    ],
  },
};

// MBTI별 한 줄 개인화(16개만 관리)
const mbtiOneLiner = {
  ISTJ: "원칙과 약속의 기준이 분명해서, 갈등이 생기면 ‘기준 위반’에 특히 민감할 수 있어요.",
  ISFJ: "상대의 감정을 먼저 살피는 경향이 있어, 갈등에서 내 감정이 뒤로 밀릴 수 있어요.",
  INFJ: "관계의 의미를 깊게 해석해, 작은 갈등도 ‘관계 전체’로 확장해 생각할 수 있어요.",
  INTJ: "문제의 구조를 빠르게 잡지만, 감정의 속도를 기다리는 일이 과제로 남을 수 있어요.",
  ISTP: "감정 소모를 최소화하려는 경향이 있어, 거리두기가 ‘무관심’으로 오해될 수 있어요.",
  ISFP: "감정의 진정성과 분위기를 중시해, 강한 압박/공격 톤에 특히 힘들 수 있어요.",
  INFP: "가치와 진심의 영역에서 상처를 받으면 오래 남을 수 있어요. 회복 루틴이 중요해요.",
  INTP: "감정도 논리로 이해하려 하지만, 실제 대화에선 ‘표현 타이밍’이 과제가 될 수 있어요.",
  ESTP: "즉각 대응력이 강해 갈등을 빠르게 전환시키는 힘이 있지만, 말이 세게 나갈 수 있어요.",
  ESFP: "분위기 회복 능력이 좋지만, 불편한 감정을 ‘미루는 방식’이 될 수 있어요.",
  ENFP: "상대 의도를 다양하게 추측해 생각이 커질 수 있어요. 사실 확인이 안정감을 줍니다.",
  ENTP: "논쟁을 탐색처럼 느낄 수 있지만 상대는 ‘공격’으로 느낄 수 있어요. 톤 조절이 핵심!",
  ESTJ: "정리·결정이 빠르지만 상대는 ‘압박/통제’로 느낄 수 있어요. 순서(공감→해결)가 중요해요.",
  ESFJ: "관계 조화를 위해 애쓰며, 갈등에서 ‘내 감정의 우선순위’를 잃기 쉬워요.",
  ENFJ: "관계 전체를 조율하려 하지만, 과부하가 오면 감정 소진이 빨라질 수 있어요.",
  ENTJ: "추진력이 강하지만 감정 확인 단계를 건너뛰면 반발이 생길 수 있어요. 체크인이 도움이 돼요.",
};

// 대표유형 × MBTI 특성(I/E, N/S, T/F, J/P) 보정 문장(‘가벼운 조합형’ 핵심)
const comboAddons = {
  감정: {
    F: [
      "감정 공감 능력이 강점이라, 관계 회복의 ‘첫 단추’를 잘 끼우는 편이에요.",
      "다만 감정이 과부하 되면 자기비난으로 빠질 수 있어, 감정-사실 분리 연습이 특히 중요합니다.",
    ],
    T: [
      "감정을 느끼면서도 머리로 정리하려는 힘이 있어, 감정 폭발로 번질 위험은 상대적으로 낮을 수 있어요.",
      "다만 ‘감정이 생긴 나 자신’을 평가하기보다 감정 자체를 신호로 받아들이는 연습이 도움이 됩니다.",
    ],
    N: [
      "상대의 의도/맥락을 크게 해석하는 경향이 있어, 혼자 생각이 커질 수 있어요. 사실 확인이 안정감을 줍니다.",
    ],
    S: [
      "당장의 말/행동에 반응이 즉각적이라, 빠르게 상처받거나 빠르게 회복하는 편일 수 있어요.",
    ],
    I: [
      "혼자 감정을 정리할 시간이 필요할 수 있어요. ‘잠깐 정리하고 다시 이야기하자’가 효과적입니다.",
    ],
    E: [
      "감정을 말로 풀어야 회복되는 편일 수 있어요. 단, 감정이 고조된 순간엔 짧게 말하고 잠깐 쉬는 것도 좋아요.",
    ],
    J: [
      "마무리/정리가 되어야 마음이 놓이는 편이라, 대화의 ‘끝맺음 문장’을 만들어두면 도움이 됩니다.",
    ],
    P: [
      "흐름 속에서 감정이 바뀔 수 있어요. 결론을 급히 내기보다 ‘지금은 이렇게 느껴’처럼 임시 결론이 좋아요.",
    ],
  },

  문제해결: {
    T: [
      "해결 전략을 세우는 능력이 강해, 갈등을 ‘정리 가능한 문제’로 만드는 데 장점이 있어요.",
      "다만 상대가 감정 정리 전이라면 해결책 제시는 ‘압박’으로 느껴질 수 있어요.",
    ],
    F: [
      "해결을 원하면서도 관계 감정선을 고려하려 해, ‘부드러운 해결자’가 되기 쉬워요.",
      "다만 갈등이 길어지면 감정 피로가 누적될 수 있어, 타임박스를 두는 게 도움이 됩니다.",
    ],
    N: [
      "큰 그림으로 해법을 찾는 장점이 있어요. 대신 실행 단계에서는 구체적인 합의(언제/어떻게)를 남겨보세요.",
    ],
    S: [
      "현실적인 조치로 빠르게 안정시키는 힘이 있어요. 대신 감정적 납득이 뒤따르는지도 점검해 주세요.",
    ],
    I: [
      "혼자 정리 후 말하는 편이라, 대화 전에 핵심을 메모해두면 더 명확해져요.",
    ],
    E: [
      "말하며 정리되는 편이라, 브레인스토밍처럼 ‘가능한 해결안’을 함께 뽑아보는 방식이 잘 맞아요.",
    ],
    J: [
      "결론을 빠르게 내릴 수 있어요. 상대가 따라올 시간을 주는 ‘중간 체크인’을 추가하면 좋아요.",
    ],
    P: [
      "유연한 대안 탐색이 강점이에요. 다만 ‘결정 미루기’로 비치지 않게 최소 합의는 잡아두세요.",
    ],
  },

  관계: {
    F: [
      "관계 유지 감각이 뛰어나서, 갈등의 톤을 부드럽게 만드는 역할을 자주 맡게 돼요.",
      "다만 ‘내 마음을 미루는 습관’이 생기지 않게 경계선(나는 무엇이 불편한가)을 세워보세요.",
    ],
    T: [
      "관계를 지키면서도 기준과 원칙을 놓치지 않으려 해, ‘공정한 조율자’가 될 수 있어요.",
      "다만 너무 합리적으로만 조율하면 상대는 ‘차갑다’고 느낄 수 있어요. 표현에 온도를 더해보세요.",
    ],
    N: [
      "관계를 ‘의미’로 바라보는 힘이 있어요. 다만 의미가 커질수록 부담도 커질 수 있어요.",
    ],
    S: [
      "일상 속 배려로 관계를 회복시키는 힘이 있어요. 다만 불편했던 사실도 함께 다뤄야 반복을 막을 수 있어요.",
    ],
    I: [
      "조용히 배려하며 버티는 편일 수 있어요. ‘나도 힘들어’라는 한 문장을 연습해두면 좋아요.",
    ],
    E: [
      "분위기를 살리며 관계를 이어가는 힘이 있어요. 대신 내 속마음도 놓치지 않게 체크해 주세요.",
    ],
    J: [
      "관계를 안정적으로 만들고 싶어해요. 규칙/약속을 ‘부드럽게 합의’하는 방식이 특히 잘 맞습니다.",
    ],
    P: [
      "상대 흐름에 맞추는 유연함이 있어요. 다만 중요한 이슈는 ‘언제 다시 이야기할지’만큼은 잡아두세요.",
    ],
  },

  회피: {
    I: [
      "혼자 정리 시간이 꼭 필요한 편이라, 잠깐 거리를 두는 전략이 회복에 도움이 될 수 있어요.",
      "다만 ‘영구 회피’가 되지 않도록, 대화 재개 시점을 미리 잡아두면 좋아요.",
    ],
    E: [
      "회피를 하더라도 결국 대화로 풀고 싶은 욕구가 남을 수 있어요.",
      "감정이 올라올 때는 잠깐 멈추고, 짧은 문장으로 ‘지금은 쉬고 싶다’를 표현해보세요.",
    ],
    N: [
      "갈등을 ‘의미 있게’ 해석하다가 부담이 커져 회피로 이어질 수 있어요. 지금 필요한 건 ‘한 단계만’ 해결하는 것일 수 있어요.",
    ],
    S: [
      "당장의 불편을 피하려는 회피가 생길 수 있어요. 작은 행동 합의(예: 톤, 시간, 장소)부터 시작해보세요.",
    ],
    T: [
      "감정 소모를 줄이려는 전략으로 회피가 나타날 수 있어요. 대신 ‘언제 다시 이야기할지’의 구조를 만들어두면 좋아요.",
    ],
    F: [
      "상대 감정에 휘말릴까 봐 회피가 강해질 수 있어요. 감정선은 존중하되, 내 한계를 말로 설정하는 연습이 필요해요.",
    ],
    J: [
      "끝이 안 보이면 피로해질 수 있어요. 대화에 ‘종료 조건’을 정해두면 회피가 줄어듭니다.",
    ],
    P: [
      "압박감이 강하면 회피가 나올 수 있어요. ‘지금은 어렵고, 내일 10분만 이야기하자’처럼 작게 잡아보세요.",
    ],
  },
};

export default function ResultPage() {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    name: "-",
    age: "-",
    gender: "-",
    mbti: "",
    phone: "-",
  });

  const [scores, setScores] = useState({
    감정: 0,
    문제해결: 0,
    관계: 0,
    회피: 0,
  });

  const [loading, setLoading] = useState(true);

  // 쿼리 파라미터 불러오기
  useEffect(() => {
    if (!router.isReady) return;

    const q = router.query;

    const mbti = normalizeMbti(q.mbti);

    const newInfo = {
      name: q.name || "-",
      age: q.age || "-",
      gender: q.gender || "-",
      mbti, // "" or valid MBTI
      phone: q.phone || "-",
    };

    const newScores = {
      감정: parseInt(q["감정"] || 0, 10),
      문제해결: parseInt(q["문제해결"] || 0, 10),
      관계: parseInt(q["관계"] || 0, 10),
      회피: parseInt(q["회피"] || 0, 10),
    };

    setUserInfo(newInfo);
    setScores(newScores);
    setLoading(false);
  }, [router.isReady]);

  // 로딩 이후 대표유형 계산(안정)
  const mainType = useMemo(() => {
    const entries = Object.entries(scores);
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] || "감정";
  }, [scores]);

  const info = baseDescriptionMap[mainType] || baseDescriptionMap["감정"];

  const traits = useMemo(() => getMbtiTraits(userInfo.mbti), [userInfo.mbti]);

  // 조합형 문장 생성
  const mbtiComboLines = useMemo(() => {
    if (!traits) return [];
    const byType = comboAddons[mainType];
    if (!byType) return [];

    const lines = [];

    // 우선순위: F/T → N/S → I/E → J/P (원하면 바꿀 수 있음)
    if (byType[traits.TorF]) lines.push(...byType[traits.TorF]);
    if (byType[traits.NorS]) lines.push(...byType[traits.NorS]);
    if (byType[traits.EorI]) lines.push(...byType[traits.EorI]);
    if (byType[traits.JorP]) lines.push(...byType[traits.JorP]);

    // 너무 길면 4~5줄로 제한(가벼운 조합형 유지)
    return lines.slice(0, 5);
  }, [traits, mainType]);

  const oneLiner = userInfo.mbti ? mbtiOneLiner[userInfo.mbti] : "";

  const chartData = [
    { name: "감정형", value: scores.감정 },
    { name: "문제해결형", value: scores.문제해결 },
    { name: "관계형", value: scores.관계 },
    { name: "회피형", value: scores.회피 },
  ];

  const goToRetest = () => router.push("/test");
  const goToNextStepPage = () =>
    router.push({
      pathname: "/followup",
      query: {
        mainType,
        name: userInfo.name,
        mbti: userInfo.mbti || "-",
      },
    });

  if (loading) return <p>결과 불러오는 중...</p>;

  return (
    <main className="result-container">
      <section className="result-card">
        <h1 className="title">갈등 대처 유형 결과</h1>
        <h2 className="subtitle">대표 유형: {mainType}형</h2>
        <p className="highlight">{info.title}</p>

        <h3 className="section-title">기본 정보</h3>
        <p>이름: {userInfo.name}</p>
        <p>나이: {userInfo.age}</p>
        <p>성별: {userInfo.gender}</p>
        <p>MBTI: {userInfo.mbti ? userInfo.mbti : "-"}</p>
        <p>연락처: {userInfo.phone}</p>

        <h3 className="section-title">나의 갈등 대처 특징</h3>
        {info.text.map((t, i) => (
          <p key={i} className="desc">
            {t}
          </p>
        ))}

        <h3 className="section-title">MBTI와의 연관성</h3>

        {/* MBTI가 없으면 안내 */}
        {!userInfo.mbti ? (
          <p className="desc">
            MBTI를 선택하지 않아, 대표 유형({mainType}형) 중심으로 기본 해석을 제공했어요.
          </p>
        ) : (
          <>
            {oneLiner && <p className="desc">• {oneLiner}</p>}
            {mbtiComboLines.map((t, i) => (
              <p key={i} className="desc">
                {t}
              </p>
            ))}
          </>
        )}

        <h3 className="section-title">나에게 필요한 방향성</h3>
        {info.direction.map((t, i) => (
          <p key={i} className="desc">
            {t}
          </p>
        ))}

        <h3 className="section-title">내 점수 그래프</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="value" fill="#4B8CF5" animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="result-card next-step-card">
        <h2 className="section-title">7. 다음 단계로</h2>
        <p className="desc">
          지금 결과를 바탕으로 나의 패턴을 더 깊게 이해하거나, 후속 프로그램에
          참여해 실제 갈등 장면에서 적용해볼 수 있어요.
        </p>

        <div className="button-row">
          <button className="btn-outline" onClick={goToRetest}>
            다시 검사하기
          </button>
          <button className="btn-primary" onClick={goToNextStepPage}>
            후속 프로그램 안내 보기
          </button>
        </div>
      </section>
    </main>
  );
}
