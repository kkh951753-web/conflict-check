// pages/questions.js
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { questions } from "./data/questions";

export default function QuestionsPage() {
  const router = useRouter();

  // 현재 몇 번째 질문인지
  const [currentIndex, setCurrentIndex] = useState(0);

  // 점수 상태
  const [scores, setScores] = useState({
    감정: 0,
    문제해결: 0,
    관계: 0,
    회피: 0,
  });

  // 슬라이드 애니메이션용
  const [animateKey, setAnimateKey] = useState(0);

  // URL에서 기본정보 가져오기 준비되었는지 체크
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true);
  }, [router.isReady]);

  if (!ready) {
    return <p className="test-loading">정보 불러오는 중...</p>;
  }

  const total = questions.length;
  const q = questions[currentIndex]; // 현재 질문

  // 진행률 (0 ~ 100)
  const progress = Math.round(((currentIndex + 1) / total) * 100);

  const handleOptionClick = (option) => {
    const type = option.type; // 감정 / 문제해결 / 관계 / 회피

    // 1) 이 클릭까지 포함한 최종 점수 계산
    const finalScores = {
      ...scores,
      [type]: (scores[type] || 0) + 1,
    };

    const nextIndex = currentIndex + 1;

    // 2) 아직 질문이 남아 있을 때 → 다음 질문으로
    if (nextIndex < total) {
      setScores(finalScores);
      setCurrentIndex(nextIndex);
      setAnimateKey((prev) => prev + 1); // 슬라이드 다시 트리거
      return;
    }

    // 3) 마지막 질문을 고른 경우 → 결과 페이지로 이동
    const { name = "", age = "", gender = "", mbti = "", phone = "" } =
      router.query;

    const params = new URLSearchParams({
      name: String(name),
      age: String(age),
      gender: String(gender),
      mbti: String(mbti),
      phone: String(phone),
      감정: String(finalScores["감정"] || 0),
      문제해결: String(finalScores["문제해결"] || 0),
      관계: String(finalScores["관계"] || 0),
      회피: String(finalScores["회피"] || 0),
    }).toString();

    router.push(`/result?${params}`);
  };

  return (
    <main className="test-page">
      {/* 진행 바 */}
      <div className="test-progress-wrapper">
        <div className="test-progress-bar">
          <div
            className="test-progress-inner"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="test-progress-text">
          {currentIndex + 1} / {total}
        </div>
      </div>

      {/* 질문 카드 */}
      <section
        key={animateKey}
        className="test-card slide-in"
      >
        <h2 className="test-question-text">{q.text}</h2>

        <div className="test-options">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className="test-option-button"
              onClick={() => handleOptionClick(opt)}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
