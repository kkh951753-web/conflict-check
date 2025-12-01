"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function FollowupPage() {
  const router = useRouter();

  const [info, setInfo] = useState({
    name: "",
    mbti: "",
    mainType: "",
  });

  // 결과 페이지에서 넘어온 정보 받기
  useEffect(() => {
    if (!router.isReady) return;

    const { name = "", mbti = "", mainType = "" } = router.query;
    setInfo({ name, mbti, mainType });
  }, [router.isReady, router.query]);

  // 대면 신청 버튼 클릭 시 안내 문구
  const handleOfflineClick = () => {
    alert(
      "서포터즈에게 요일과 시간, 연락처를 남겨주시면\n추후 안내를 통해 상담사와 연결시켜드리겠습니다."
    );
  };

  // 인스타그램 버튼 클릭 시 새 창으로 열기
  const handleInstagramClick = () => {
    // 👉 여기 주소를 본인 인스타그램 신청 링크로 바꿔줘!
    window.open("https://instagram.com/your_instagram_id", "_blank");
  };

  // 다시 결과 보기
  const handleBackToResult = () => {
    router.push("/result");
  };

  return (
    <main className="followup-container">
      {/* 왼쪽 : 설명 영역 */}
      <section className="followup-card followup-main">
        <p className="followup-eyebrow">후속 단계 안내</p>
        <h1 className="followup-title">
          {info.name ? `${info.name}님의` : "나의"} 갈등 대처 패턴,
          <br />
          이제 실제 삶에 적용해 볼 차례예요.
        </h1>

        <div className="followup-tag-row">
          {info.mainType && (
            <span className="tag">
              대표 유형: <strong>{info.mainType}형</strong>
            </span>
          )}
          {info.mbti && (
            <span className="tag">
              MBTI: <strong>{info.mbti}</strong>
            </span>
          )}
        </div>

        <p className="followup-desc">
          검사 결과는 단순한 “유형 설명”이 아니라, 앞으로 갈등을 대하는
          <b> 나만의 기준</b>을 세우는 첫 단계예요.{" "}
          <br />
          아래 후속 프로그램을 통해 실제 대화 장면에서 어떤 말을 꺼내고,
          무엇을 먼저 챙길지 차근차근 같이 정리해 볼 수 있어요.
        </p>

        <div className="followup-block">
          <h2 className="section-title">후속 상담 안내</h2>
          <p className="desc">
            · 1:1 맞춤 상담에서 최근 겪었던 갈등 상황을 함께 풀어보고,
            내 유형에 맞는 표현 문장을 같이 만들어 봅니다. <br />
            · 대면 상담이 어려운 경우, 인스타그램 DM을 통해 온라인으로도
            연결해 드려요. <br />
            · 모든 내용은 프로그램 외부로 공유되지 않으며, 안전한
            비밀보장을 원칙으로 합니다.
          </p>
        </div>

        <button className="btn-outline mt-32" onClick={handleBackToResult}>
          결과 화면으로 돌아가기
        </button>
      </section>

      {/* 오른쪽 : 신청 카드 영역 */}
      <aside className="followup-card followup-side">
        <h2 className="section-title">어떤 방식이 편하신가요?</h2>
        <p className="desc">
          아래 버튼 중 편한 방식을 선택해 주세요.{" "}
          <br />
          신청 후 서포터즈가 순차적으로 확인 후 연락을 드립니다.
        </p>

        <div className="followup-options">
          {/* 대면 상담 신청 버튼 (기존 안내 문구 복원) */}
          <button className="btn-primary wide" onClick={handleOfflineClick}>
            대면 상담 신청하기
          </button>

          {/* 인스타그램 신청 버튼 (다시 추가) */}
          <button className="btn-ghost wide" onClick={handleInstagramClick}>
            인스타그램으로 신청하기
          </button>
        </div>

        <div className="followup-note">
          <p className="followup-note-title">신청 전 안내</p>
          <p className="followup-note-text">
            · “대면 상담 신청하기” 버튼을 누르면 안내 문구를 참고해
            요일·시간·연락처를 정리한 뒤 전달해 주세요.
            <br />
            · “인스타그램으로 신청하기” 버튼은 서포터즈 공식 계정 DM으로
            연결됩니다. 간단한 자기소개와 함께 상담 희망 사유를 남겨주시면
            더욱 원활하게 진행돼요.
          </p>
        </div>
      </aside>
    </main>
  );
}
