"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { questions } from "../data/questions";
import styles from "../styles/test.module.css"; // ✅ 모듈 CSS 연결

export default function QuestionsPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({
    감정: 0,
    문제해결: 0,
    관계: 0,
    회피: 0,
  });
  const [animateKey, setAnimateKey] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true);
  }, [router.isReady]);

  if (!ready) return <p className={styles.loading}>정보 불러오는 중...</p>;

  const total = questions.length;
  const q = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / total) * 100);

  const handleOptionClick = (option) => {
    const type = option.type;
    const finalScores = {
      ...scores,
      [type]: (scores[type] || 0) + 1,
    };

    const nextIndex = currentIndex + 1;

    if (nextIndex < total) {
      setScores(finalScores);
      setCurrentIndex(nextIndex);
      setAnimateKey((prev) => prev + 1);
      return;
    }

    const { name = "", age = "", gender = "", mbti = "", phone = "" } = router.query;

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
    <main className={styles.page}>
      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressInner} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.progressText}>
          {currentIndex + 1} / {total}
        </div>
      </div>

      <section key={animateKey} className={`${styles.card} ${styles.slideIn}`}>
        <h2 className={styles.question}>{q.text}</h2>

        <div className={styles.options}>
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={styles.optionBtn}
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
