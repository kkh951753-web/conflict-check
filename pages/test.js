// pages/test.js
"use client";

import styles from "../styles/intro.module.css";
import supabase from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/router";

const MBTI_OPTIONS = [
  "ISTJ","ISFJ","INFJ","INTJ",
  "ISTP","ISFP","INFP","INTP",
  "ESTP","ESFP","ENFP","ENTP",
  "ESTJ","ESFJ","ENFJ","ENTJ",
];

export default function TestPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    mbti: "", // 선택사항: ""이면 미선택
    agree: false,
  });

  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "age") {
      const onlyDigits = value.replace(/[^\d]/g, "");
      setForm((prev) => ({ ...prev, age: onlyDigits }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStart = async () => {
    if (submitting) return;

    if (!form.name.trim() || !form.age.trim() || !form.gender) {
      alert("이름, 나이, 성별을 모두 입력해 주세요.");
      return;
    }

    const ageNum = parseInt(form.age, 10);
    if (Number.isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      alert("나이는 1~120 사이의 숫자로 입력해 주세요.");
      return;
    }

    if (!form.agree) {
      alert("개인정보 수집 · 이용에 동의해 주세요.");
      return;
    }

    const mbti = form.mbti ? String(form.mbti).trim().toUpperCase() : "";
    if (mbti && !MBTI_OPTIONS.includes(mbti)) {
      alert("MBTI는 목록에서 선택해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        age: ageNum,
        gender: form.gender,
        mbti: mbti || null,
      };

      const { error } = await supabase.from("test_results").insert([payload]);
      if (error) throw error;

      router.push({
        pathname: "/questions",
        query: {
          name: payload.name,
          age: String(payload.age),
          gender: payload.gender,
          mbti: mbti || "",
          agree: "true",
        },
      });
    } catch (err) {
      console.error("❌ Supabase 저장 오류:", err?.message || err);
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>

        <div className={styles.formGroup}>
          {/* ✅ 이름(6) + 나이(4) 한 줄 */}
          <div className={styles.formRowNameAge}>
            <div className={styles.formField}>
              <label>이름</label>
              <input
                className={styles.control}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="이름을 입력해 주세요"
                autoComplete="name"
              />
            </div>

            <div className={styles.formField}>
              <label>나이</label>
              <input
                className={styles.control}
                type="text"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="숫자만 입력"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
          </div>

          {/* ✅ MBTI + 성별 한 줄 */}
          <div className={styles.formRowTwo}>
            <div className={styles.formField}>
              <label>MBTI (선택)</label>
              <select
                className={styles.control}
                name="mbti"
                value={form.mbti}
                onChange={handleChange}
              >
                <option value="">선택 안 함</option>
                {MBTI_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formField}>
              <label>성별</label>
              <select
                className={styles.control}
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">선택해 주세요</option>
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.agreeRow}>
          <label className={styles.agreeLabel}>
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              disabled={submitting}
            />
            <span>개인정보 수집 · 이용에 동의합니다 (필수)</span>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTerms(true);
              }}
              className={styles.termsInline}
              disabled={submitting}
            >
              약관 보기
            </button>
          </label>
        </div>

        <button
          className={styles.primaryButton}
          onClick={handleStart}
          disabled={!form.agree || submitting}
          style={{ opacity: !form.agree || submitting ? 0.6 : 1 }}
        >
          {submitting ? "저장 중..." : "검사 시작하기"}
        </button>
      </div>

      {showTerms && (
        <div
          onClick={() => setShowTerms(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              padding: "24px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginBottom: "16px" }}>개인정보 수집 및 이용 동의서</h2>

            <p style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
              <strong>1. 수집하는 개인정보 항목</strong>
              <br />
              - 이름, 성별, 나이, MBTI 유형
              <br />
              <br />
              <strong>2. 수집 및 이용 목적</strong>
              <br />
              - 테스트 결과 분석 및 제공
              <br />
              - 통계 분석 및 서비스 개선
              <br />
              - 사용자 식별 및 중복 응답 방지
              <br />
              - 사후 설문 요청 또는 상담 안내
              <br />
              <br />
              <strong>3. 보유 및 이용 기간</strong>
              <br />
              - 수집된 정보는 테스트 결과 제공 이후 6개월간 보관 후 파기됩니다.
              <br />
              - 통계용 정보는 익명화 후 보관될 수 있습니다.
              <br />
              <br />
              <strong>4. 개인정보 제공 및 위탁</strong>
              <br />
              - 제3자에게 제공되지 않으며, 외부에 위탁하지 않습니다.
              <br />
              <br />
              <strong>5. 동의 거부 권리</strong>
              <br />
              - 동의하지 않을 수 있으나, 서비스 이용에 제한이 있습니다.
              <br />
              <br />
              위 내용을 충분히 이해하였으며, 이에 동의합니다.
            </p>

            <button
              type="button"
              onClick={() => setShowTerms(false)}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                backgroundColor: "#6C63FF",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
