// pages/test.js
"use client";

import { useRouter } from "next/router";
import { useState } from "react";

export default function TestPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    mbti: "",
    phone: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStart = (e) => {
    e.preventDefault();

    if (!form.name || !form.age || !form.gender || !form.phone) {
      alert("이름, 나이, 성별, 연락처를 모두 입력해 주세요.");
      return;
    }

    if (!form.agree) {
      alert("개인정보 수집 · 이용에 동의해 주세요.");
      return;
    }

    const params = new URLSearchParams({
      name: form.name,
      age: form.age,
      gender: form.gender,
      mbti: form.mbti,
      phone: form.phone,
    }).toString();

    router.push(`/questions?${params}`);
  };

  return (
    <main className="test-container">
      <section className="test-card">
        <h1 className="title">갈등 대처 유형 테스트</h1>
        <p className="subtitle">
          간단한 정보를 입력하고 검사를 시작해 보세요.
        </p>

        <form className="test-form" onSubmit={handleStart}>
          {/* 이름 */}
          <div className="form-row">
            <label className="form-label">이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              placeholder="이름을 입력해 주세요"
            />
          </div>

          {/* 나이 */}
          <div className="form-row">
            <label className="form-label">나이</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="form-input"
              placeholder="예: 27"
            />
          </div>

          {/* 성별 */}
          <div className="form-row">
            <label className="form-label">성별</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">선택해 주세요</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
              <option value="기타">기타 / 응답 안함</option>
            </select>
          </div>

          {/* MBTI */}
          <div className="form-row">
            <label className="form-label">MBTI (선택)</label>
            <input
              name="mbti"
              value={form.mbti}
              onChange={handleChange}
              className="form-input"
              placeholder="예: ENTP (선택사항)"
            />
          </div>

          {/* 연락처 */}
          <div className="form-row">
            <label className="form-label">연락처</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="예: 010-0000-0000"
            />
          </div>

          {/* 동의 + 약관 링크 */}
          <div className="terms-row">
            <label className="terms-check">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              개인정보 수집 · 이용에 동의합니다 (필수)
            </label>

            <button
              type="button"
              className="terms-link"
              onClick={() => router.push("/terms")}
            >
              약관 보기
            </button>
          </div>

          <button type="submit" className="btn-primary start-button">
            검사 시작하기
          </button>
        </form>
      </section>
    </main>
  );
}
