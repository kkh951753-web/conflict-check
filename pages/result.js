// pages/result.js
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ResultPage() {
  const router = useRouter();

  const [scores, setScores] = useState({
    감정: 0,
    문제해결: 0,
    관계: 0,
    회피: 0,
  });

  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    gender: "",
    mbti: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const q = router.query;

    setScores({
      감정: Number(q["감정"]) || 0,
      문제해결: Number(q["문제해결"]) || 0,
      관계: Number(q["관계"]) || 0,
      회피: Number(q["회피"]) || 0,
    });

    setUserInfo({
      name: q.name || "",
      age: q.age || "",
      gender: q.gender || "",
      mbti: q.mbti || "",
      phone: q.phone || "",
    });

    setLoading(false);
  }, [router.isReady, router.query]);

  function pickMainType(scoresObj) {
    const arr = Object.entries(scoresObj).sort((a, b) => b[1] - a[1]);
    return arr[0][0];
  }

  const mainType = pickMainType(scores);

  // Supabase 저장
  useEffect(() => {
    if (loading) return;
    if (!userInfo.name) return;

    const saveResult = async () => {
      const { error } = await supabase.from("test_results").insert({
        name: userInfo.name,
        age: userInfo.age,
        gender: userInfo.gender,
        mbti: userInfo.mbti,
        phone: userInfo.phone,

        emotion_score: scores.감정,
        problem_score: scores.문제해결,
        relation_score: scores.관계,
        avoid_score: scores.회피,
        main_type: mainType,
      });

      if (error) {
        console.error("❌ 결과 저장 실패:", error);
      } else {
        console.log("✅ 결과 저장 완료");
      }
    };

    saveResult();
  }, [loading, userInfo, scores, mainType]);

  function getDescription(type, mbti) {
    const base = {
      감정: {
        title: "감정을 먼저 느끼고 반응하는 감정 중심형 💙",
        text: [
          "상대의 말과 행동에서 마음의 상처를 먼저 느끼고, 감정의 진폭이 행동과 선택에 영향을 주는 편입니다.",
          "상대의 의도를 빠르게 파악하지만, 분위기 변화에도 민감합니다.",
          `${mbti} 성향과 결합될 경우 감정과 논리를 동시에 고려하려 하지만, 갈등 순간에는 마음의 울림에 더 집중하는 경향이 나타납니다.`,
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
          `${mbti} 성향과 결합될 경우 더욱 빠르게 상황 판단을 하고 명확한 해결책을 제시하려는 성향이 강화됩니다.`,
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
          `${mbti} 성향과 결합되면 타인의 마음을 세심히 살피는 능력이 강해지지만, 스스로를 뒤로 미루는 경우도 생길 수 있습니다.`,
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
          `${mbti} 성향과 결합되면, 갈등을 해결보다는 안정과 거리 두기를 우선하게 됩니다.`,
          "심리적 안전이 확보되면 더 건강하게 대화를 이어갈 수 있습니다.",
        ],
        improve: [
          "회피는 잠깐의 휴식은 되지만 장기적으로 문제를 더욱 키울 수 있어요.",
          "갈등이 겁나는 이유를 차분히 명료화하는 작업이 필요합니다.",
        ],
        direction: [
          "감정 폭발이 두려움인지, 갈등 자체가 불편한 것인지 구분하면 다음 행동이 쉬워집니다.",
        ],
      },
    };

    return base[type];
  }

  const info = getDescription(mainType, userInfo.mbti);

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
        mbti: userInfo.mbti,
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
        <p>MBTI: {userInfo.mbti}</p>
        <p>연락처: {userInfo.phone}</p>

        <h3 className="section-title">나의 갈등 대처 특징</h3>
        {info.text.map((t, i) => (
          <p key={i} className="desc">{t}</p>
        ))}

        <h3 className="section-title">MBTI와의 연관성</h3>
        {info.improve.map((t, i) => (
          <p key={i} className="desc">{t}</p>
        ))}

        <h3 className="section-title">나에게 필요한 방향성</h3>
        {info.direction.map((t, i) => (
          <p key={i} className="desc">{t}</p>
        ))}

        <h3 className="section-title">내 점수 그래프</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="value" fill="#4B8CF5" />
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
