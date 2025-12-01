// pages/questions.js
"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import questions from "../data/questions";

export default function QuestionsPage() {
  const router = useRouter();

  const [current, setCurrent] = useState(0);

  const [scores, setScores] = useState({
    감정: 0,
    문제해결: 0,
    관계: 0,
    회피: 0,
  });

  // test.js에서 입력했던 사용자 정보
  const userInfo = router.query;

  const handleSelect = (type, value) => {
    const updated = { ...scores, [type]: scores[type] + value };

    // 마지막 문제까지 풀었으면 결과 페이지로 이동
    if (current === questions.length - 1) {
      router.push({
        pathname: "/result",
        query: {
          ...userInfo,
          감정: updated["감정"],
          문제해결: updated["문제해결"],
          관계: updated["관계"],
          회피: updated["회피"],
        },
      });
      return;
    }

    // 다음 문제로 이동
    setScores(updated);
    setCurrent(current + 1);
  };

  const q = questions[current];

  return (
    <main className="page">
      <div className="card">
        <h2 className="title">
          Q{current + 1}. {q.question}
        </h2>

        {q.options.map((opt, i) => (
          <button
            key={i}
            className="option-btn"
            onClick={() => handleSelect(opt.type, opt.value)}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </main>
  );
}
