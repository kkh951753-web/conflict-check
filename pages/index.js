"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [mbti, setMbti] = useState("");
  const [phone, setPhone] = useState("");   // 🔥 추가됨

  const handleStart = () => {
    if (!name || !gender || !age || !mbti || !phone) {
      alert("모든 정보를 입력해 주세요!");
      return;
    }

    const params = new URLSearchParams({
      name,
      gender,
      age,
      mbti,
      phone,   // 🔥 추가됨
    }).toString();

    window.location.href = `/test?${params}`;
  };

  return (
    <main className="page">
      <div className="card" style={{ padding: "36px" }}>
        
        {/* 일러스트 */}
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

        {/* 정보 입력 */}
        <div className="input-group">
          <label>이름</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>성별</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">선택</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
            <option value="기타">기타</option>
          </select>

          <label>나이</label>
          <input 
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

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

          {/* 🔥 새로 추가된 전화번호 입력칸 */}
          <label>연락처</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="예: 010-0000-0000"
          />
        </div>

        <button
          className="primary-btn-blue"
          style={{ width: "100%", marginTop: "24px" }}
          onClick={handleStart}
        >
          검사 시작하기
        </button>

      </div>
    </main>
  );
}
