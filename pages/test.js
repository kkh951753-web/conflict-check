// pages/test.js
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { questions } from "./data/questions";

export default function TestPage() {
  const router = useRouter();

  // 기본 정보 (URL에서 가져오기)
  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    gender: "",
    mbti: "",
    phone: "",
  });

  // 현재 문항 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);

  // 점수
  const [scores, setScores] = useState({
    감정: 0,
    문제해결: 0,
    관계: 0,
    회피: 0,
  });

  // 라우터 준비되면 URL 파라미터에서 정보 읽기
  useEffect(() => {
    if (!router.isReady) return;

    const { name, age, gender, mbti, phone } = router.query;

    setUserInfo({
      name: (name || "").toString(),
      age: (age || "").toString(),
      gender: (gender || "").toString(),
      mbti: (mbti || "").toString(),
      phone: (phone || "").toString(),
    });
  }, [router.isReady, router.query]);

  // 현재 문제
  const currentQuestion = questions[currentIndex];

  // 진행률 (퍼센트)
  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  // 보기 선택했을 때
  const handleOptionClick = (option) => {
    const nextScores = {
      ...scores,
      [option.type]: scores[option.type] + 1,
    };

    // 마지막 문항이면 결과 페이지로 이동
    if (currentIndex + 1 === questions.length) {
      const params = new URLSearchParams({
        name: userInfo.name,
        age: userInfo.age,
        gender: userInfo.gender,
        mbti: userInfo.mbti,
        phone: userInfo.phone,
        감정: String(nextScores["감정"]),
        문제해결: String(nextScores["문제해결"]),
        관계: String(nextScores["관계"]),
        회피: String(nextScores["회피"]),
      }).toString();

      router.push(`/result?${params}`);
      return;
    }

    // 다음 문항으로
    setScores(nextScores);
    setCurrentIndex((prev) => prev + 1);
  };

  // 아직 정보 못 읽었을 때
  if (!currentQuestion) {
    return <p>정보 불러오는 중...</p>;
  }

  return (
    <main className="test-container">
      <div className="test-inner">
        {/* 진행 바 */}
        <div className="test-progress-wrapper">
          <div className="test-progress">
            <div
              className="test-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="test-progress-text">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        {/* 질문 카드 */}
        {/* key 를 question.id 로 주면, 질문이 바뀔 때마다 카드가 새로 마운트 → CSS 애니메이션 매번 실행 */}
        <section className="test-card" key={currentQuestion.id}>
          <p className="test-question-text">{currentQuestion.text}</p>

          <div className="test-options">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.text}
                className="test-option-button"
                onClick={() => handleOptionClick(opt)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
