// pages/followup.js
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import styles from "../styles/followup.module.css";

/* ================= 결과 기반 조언 데이터 ================= */

const adviceMap = {
  감정: {
    title: "감정 중심형을 위한 조언",
    text: [
      "갈등 상황에서 감정을 빠르게 인식하는 것은 큰 강점이에요.",
      "다만 감정이 충분히 정리되기 전에 행동하면 스스로도 지칠 수 있어요.",
    ],
    tip: "감정을 느낀 직후 바로 반응하기보다, 한 박자 쉬고 표현하는 연습이 도움이 됩니다.",
  },
  문제해결: {
    title: "문제해결 중심형을 위한 조언",
    text: [
      "갈등을 구조적으로 정리하고 해결하려는 능력이 뛰어나요.",
      "하지만 상대는 아직 감정 정리가 되지 않았을 수도 있어요.",
    ],
    tip: "해결책을 말하기 전에 상대 감정을 먼저 확인해보세요.",
  },
  관계: {
    title: "관계 중심형을 위한 조언",
    text: [
      "관계의 안정과 조화를 중요하게 여기는 성향이에요.",
      "때로는 나 자신의 감정이 뒤로 밀릴 수 있어요.",
    ],
    tip: "관계를 지키기 위해서라도 내 감정을 분명히 표현하는 연습이 필요해요.",
  },
  회피: {
    title: "회피형을 위한 조언",
    text: [
      "갈등에서 감정 소모를 줄이려는 선택을 자주 해요.",
      "잠시의 거리두기는 도움이 되지만, 장기화되면 오해로 남을 수 있어요.",
    ],
    tip: "‘지금은 쉬고, 언제 다시 이야기할지’를 말로 남겨보세요.",
  },
};

const comboAdviceMap = {
  감정: {
    문제해결: "감정을 충분히 표현한 뒤 해결 방향을 정리하면 안정적인 조합이에요.",
    관계: "상대 감정을 살피느라 내 마음을 미루고 있지는 않은지 점검해보세요.",
    회피: "감정이 클수록 쉬되, 다시 대화할 시점을 명확히 정해두세요.",
  },
  문제해결: {
    감정: "해결책보다 감정 공감이 먼저일 수 있어요.",
    관계: "관계를 지키기 위해서라도 핵심 문제를 부드럽게 짚어보세요.",
    회피: "침묵이 오해로 이어지지 않도록 최소한의 신호를 남겨보세요.",
  },
  관계: {
    감정: "상대뿐 아니라 나도 충분히 서운할 수 있어요.",
    문제해결: "관계를 위해 문제를 명확히 다루는 것이 오히려 도움이 됩니다.",
    회피: "미루는 침묵이 단절로 보이지 않게 의도를 표현해보세요.",
  },
  회피: {
    감정: "피하고 싶은 마음 뒤에 어떤 감정이 있는지 천천히 들여다보세요.",
    문제해결: "모든 걸 한 번에 해결하지 않아도 괜찮아요.",
    관계: "거리를 두더라도 관계를 끊는 신호로 보이지 않게 말로 남겨보세요.",
  },
};

export default function FollowupPage() {
  const router = useRouter();
  const { mainType = "", subType = "" } = router.query;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    recommender: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const advice = adviceMap[mainType];
  const comboAdvice =
    mainType && subType ? comboAdviceMap?.[mainType]?.[subType] : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim()) return setMessage("이름을 입력해 주세요.");
    if (!form.phone.trim()) return setMessage("연락처를 입력해 주세요.");

    try {
      setSubmitting(true);

      const { error } = await supabase.from("followup_requests").insert([
        {
          name: form.name.trim(),
          phone: form.phone.trim(),
          recommender: form.recommender.trim() || null,
          type: "session_1",
        },
      ]);

      if (error) throw error;

      setMessage("신청 정보가 접수되었습니다! 확인 후 연락드리겠습니다.");
      setForm({ name: "", phone: "", recommender: "" });
    } catch (err) {
      console.error(err);
      setMessage("저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        {/* ✅ 결과 기반 조언 카드 */}
        {advice && (
          <div className={styles.adviceBox}>
            <p className={styles.adviceTitle}>{advice.title}</p>

            {advice.text.map((t, i) => (
              <p key={i} className={styles.adviceText}>
                {t}
              </p>
            ))}

            {comboAdvice && (
              <p className={styles.comboTip}>
                💡 <b>보조 경향을 고려한 조언</b>
                <br />
                {comboAdvice}
              </p>
            )}

            <p className={styles.adviceTip}>👉 {advice.tip}</p>
          </div>
        )}

        {/* 헤더 */}
        <div className={styles.header}>
          <p className={styles.label}>후속 프로그램 안내</p>
          <h1 className={styles.title}>검사 결과를 더 깊이 바라보고 싶다면</h1>
          <p className={styles.subtitle}>
            단순 결과지가 아니라, 실제 삶의 갈등 상황에 어떻게 적용할 수 있을지
            함께 정리해 보는 후속 과정입니다.
          </p>
        </div>

        <div className={styles.description}>
          <p>
            <strong>번짐</strong>에서는 검사 결과를 보다 폭넓고 심층적으로 분석하여,
            참여자분들께서 보다 접근하기 쉬운 방식으로 ‘나 자신’을 탐구할 수 있도록
            돕는 다양한 프로그램을 운영하고 있습니다.
          </p>
          <p>
            검사 결과를 기반으로 한 <strong>소통연구소 게임</strong>을 통해
            일상 속 갈등 상황을 자연스럽게 돌아보고, 보다 편안한 방식으로 소통 능력을
            확장해 보세요.
          </p>
        </div>

        <div className={styles.grid}>
          {/* 1회차 신청 */}
          <div className={styles.methodCard}>
            <h2 className={styles.methodTitle}>1회차 신청하기</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름"
                className={styles.input}
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="연락처(휴대폰 번호)"
                className={styles.input}
              />
              <input
                name="recommender"
                value={form.recommender}
                onChange={handleChange}
                placeholder="추천인"
                className={styles.input}
              />

              <button
                className={styles.primaryBtn}
                type="submit"
                disabled={submitting}
              >
                {submitting ? "접수 중..." : "신청 정보 제출하기"}
              </button>

              {message && <p className={styles.message}>{message}</p>}
            </form>

            <p className={styles.notice}>
              * 입력한 정보는 신청 안내 및 연락 목적 외에는 사용되지 않습니다.
            </p>
          </div>

          {/* 프로그램 안내 */}
          <div className={styles.methodCard}>
            <h2 className={styles.methodTitle}>프로그램 안내</h2>

            <div className={styles.centerBox}>
              <a
                href="https://www.instagram.com/bunjim21?igsh=enMyZDlvZXF4aXg="
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.secondaryBtn} ${styles.programBtn}`}
              >
                프로그램 알아보기
              </a>
            </div>
          </div>

          {/* 2~4회차 */}
          <div className={styles.methodCard}>
            <h2 className={styles.methodTitle}>2~4회차 신청하기</h2>

            <div className={styles.centerBox}>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSe6q1po7a0d3yJCWjfaN8AyUXBdsx9rTe5AU6yC_XGujmnlxQ/viewform?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.secondaryBtn} ${styles.googleBtn}`}
              >
                구글폼으로 신청하기
              </a>
            </div>

            <p className={styles.notice}>
              * 2~4회차는 별도의 신청 폼을 통해 접수됩니다.
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <Link href="/test" className={styles.linkBtn}>
            메인으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
