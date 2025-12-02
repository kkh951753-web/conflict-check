"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [mbti, setMbti] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleStart = () => {
    if (!name || !gender || !age || !mbti || !phone) {
      alert("모든 정보를 입력해 주세요!");
      return;
    }

    if (!agreed) {
      alert("약관에 동의해 주세요.");
      return;
    }

    const params = new URLSearchParams({
      name,
      gender,
      age,
      mbti,
      phone,
    }).toString();

    window.location.href = `/test?${params}`;
  };

  return (
    <main className="page">
      <div className="card" style={{ padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="https://i.ibb.co/q0G6fq7/conflict-illustration.png"
            alt="illustration"
            style={{ width: "180px", opacity: 0.92 }}
          />
        </div>

        <h1 className="title" style={{ textAlign: "center", marginBottom: "10px" }}>
          갈등 대처 성향 테스트
        </h1>

        <p className="subtitle" style={{ textAlign: "center", marginBottom: "24px" }}>
          나의 감정 반응, 문제 해결 방식, 관계 유지 스타일을  
          <br />
          과학적으로 분석해 드립니다.
        </p>

        <div className="input-group">
          <label>이름</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label>성별</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">선택</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>

          <label>나이</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />

          <label>MBTI</label>
          <select value={mbti} onChange={(e) => setMbti(e.target.value)}>
            <option value="">선택</option>
            {[
              "INFJ","INFP","INTJ","INTP",
              "ENFJ","ENFP","ENTJ","ENTP",
              "ISFJ","ISFP","ISTJ","ISTP",
              "ESFJ","ESFP","ESTJ","ESTP"
            ].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <label>연락처</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="예: 010-0000-0000"
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            개인정보 수집 및 이용에 동의합니다.
          </label>

          <button
            type="button"
            onClick={() => setShowTerms(true)}
            style={{
              marginLeft: "12px",
              fontSize: "0.9rem",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#555",
            }}
          >
            약관 보기
          </button>
        </div>

        <button
          className="primary-btn-blue"
          style={{
            width: "100%",
            marginTop: "24px",
            opacity: agreed ? 1 : 0.6,
            cursor: agreed ? "pointer" : "not-allowed",
          }}
          onClick={handleStart}
          disabled={!agreed}
        >
          검사 시작하기
        </button>
      </div>

      {showTerms && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginBottom: "16px" }}>개인정보 수집 및 이용 동의서</h2>

            <p style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
              <strong>1. 수집하는 개인정보 항목</strong><br/>
              본 테스트는 아래 개인정보를 수집합니다.<br/>
              - 이름<br/>
              - 성별<br/>
              - 나이<br/>
              - MBTI 유형<br/>
              - 연락처(전화번호)<br/><br/>

              <strong>2. 수집 및 이용 목적</strong><br/>
              - 테스트 결과 분석 및 제공<br/>
              - 통계 분석 및 서비스 개선<br/>
              - 사용자 식별 및 중복 응답 방지<br/>
              - 사후 설문 요청 또는 상담 안내(필요 시)<br/><br/>

              <strong>3. 보유 및 이용 기간</strong><br/>
              - 수집된 정보는 테스트 결과 제공 이후 6개월간 보관 후 안전하게 파기됩니다.<br/>
              - 단, 통계 목적의 데이터는 개인 식별이 불가능한 형태로 익명화하여 보관할 수 있습니다.<br/><br/>

              <strong>4. 개인정보 제공 및 위탁</strong><br/>
              - 귀하의 개인정보는 제3자에게 제공되지 않으며 위탁 처리되지 않습니다.<br/><br/>

              <strong>5. 동의 거부 권리 및 불이익</strong><br/>
              - 개인정보 제공은 자율적이며, 동의하지 않을 수 있습니다.<br/>
              - 단, 동의하지 않을 경우 본 테스트 서비스를 이용할 수 없습니다.<br/><br/>

              본인은 위 내용을 충분히 이해하였으며, 이에 동의합니다.
            </p>

            <button
              onClick={() => setShowTerms(false)}
              style={{
                marginTop: "16px",
                padding: "10px 20px",
                backgroundColor: "#6C63FF",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
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
