// pages/test.js  (또는 app/test/page.tsx)
"use client";

import { useRouter } from "next/navigation"; // App Router
// 만약 Pages Router 사용 중이면: import { useRouter } from "next/router";

export default function TestPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push("/questions"); // 질문 페이지로 이동
  };

  return (
    <main className="page">
      <div className="card" style={{ padding: "36px", textAlign: "center" }}>
        
        <h1 className="title" style={{ marginBottom: "12px" }}>
          갈등 대처 성향 테스트
        </h1>

        <p className="subtitle" style={{ marginBottom: "24px" }}>
          준비가 되셨다면 아래 버튼을 눌러 검사를 시작하세요.
        </p>

        <button
          onClick={handleStart}
          className="primary-btn-blue"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          검사 시작하기
        </button>

      </div>
    </main>
  );
}
