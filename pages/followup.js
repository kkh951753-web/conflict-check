// pages/followup.js
import Link from "next/link";
import { useState } from "react";
import supabase from "../lib/supabaseClient"; // 프로젝트에 있는 경로 기준

export default function FollowupPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    recommender: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // 아주 기본적인 검증
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
    <main className="followup-container">
      <section className="followup-card">
        {/* 상단 타이틀 영역 */}
        <div className="followup-header">
          <p className="followup-label">후속 프로그램 안내</p>
          <h1 className="followup-title">검사 결과를 더 깊이 바라보고 싶다면</h1>
          <p className="followup-subtitle">
            단순 결과지가 아니라, 실제 삶의 갈등 상황에 어떻게 적용할 수 있을지
            함께 정리해 보는 후속 과정입니다.
          </p>
        </div>

        {/* 프로그램 설명 영역 */}
        <div className="followup-description">
          <p>
            <strong>번짐</strong>에서는 검사 결과를 보다 폭넓고 심층적으로 분석하여,
            참여자분들께서 보다 접근하기 쉬운 방식으로 ‘나 자신’을 탐구할 수 있도록
            돕는 다양한 프로그램을 운영하고 있습니다.
          </p>
          <p>
            검사 결과를 기반으로 한 <strong>소통연구소 게임</strong>을 통해
            일상 속 갈등 상황을 자연스럽게 돌아보고,
            보다 편안한 방식으로 소통 능력을 확장해 보세요.
          </p>
        </div>

        {/* 신청 영역 */}
        <div className="followup-methods">
          {/* 1회차 신청하기 */}
          <div className="followup-method-card">
            <h2 className="followup-method-title">1회차 신청하기</h2>

            <form onSubmit={handleSubmit} style={{ marginTop: "12px" }}>
              <div style={{ display: "grid", gap: "10px" }}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="이름"
                  className="followup-input"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="연락처(휴대폰 번호)"
                  className="followup-input"
                />
                <input
                  name="recommender"
                  value={form.recommender}
                  onChange={handleChange}
                  placeholder="추천인"
                  className="followup-input"
                />

                <button
                  className="followup-button primary"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "접수 중..." : "신청 정보 제출하기"}
                </button>

                {message && (
                  <p style={{ marginTop: "6px", lineHeight: 1.5 }}>{message}</p>
                )}
              </div>
            </form>

            <p className="followup-notice" style={{ marginTop: "12px" }}>
              * 입력한 정보는 신청 안내 및 연락 목적 외에는 사용되지 않습니다.
            </p>
          </div>

          {/* 프로그램 안내 (인스타) */}
          <div className="followup-method-card">
            <h2 className="followup-method-title">프로그램 안내</h2>

            <a
              href="https://www.instagram.com/bunjim21?igsh=enMyZDlvZXF4aXg="
              target="_blank"
              rel="noopener noreferrer"
              className="followup-button secondary"
              style={{ marginTop: "12px", display: "inline-flex" }}
            >
              프로그램 알아보기
            </a>
          </div>

          {/* 2~4회차 신청하기 (구글폼) */}
          <div className="followup-method-card">
            <h2 className="followup-method-title">2~4회차 신청하기</h2>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSe6q1po7a0d3yJCWjfaN8AyUXBdsx9rTe5AU6yC_XGujmnlxQ/viewform?usp=sharing&ouid=111347953525023561322"
              target="_blank"
              rel="noopener noreferrer"
              className="followup-button secondary"
              style={{ marginTop: "12px", display: "inline-flex" }}
            >
              구글폼으로 신청하기
            </a>

            <p className="followup-notice" style={{ marginTop: "10px" }}>
              * 2~4회차는 별도의 신청 폼을 통해 접수됩니다.
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="followup-footer">
          <div className="followup-footer-actions">
            <Link href="/test" className="followup-link-button">
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </section>

      {/* 최소 input 스타일 */}
      <style jsx>{`
        .followup-input {
          width: 100%;
          padding: 12px 12px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          outline: none;
          font-size: 14px;
        }
        .followup-input:focus {
          border-color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </main>
  );
}
