// pages/followup.js

import Link from "next/link";

export default function FollowupPage() {
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
            OO에서는 검사지의 결과를 보다 심층적으로 분석 및{" "}
            다른 검사지를 통한 성격유형 파악을 통해{" "}
            <strong>3~4회의 상담 커리큘럼</strong>으로
            피드백 방향성을 제공하는 후속프로그램을 운영중에 있습니다.
          </p>
          <p>
            아래의 신청 방법 중 선호하시는 방법에 따라 신청해주시면,
            추후 담당자를 통해 연락드리겠습니다.
          </p>
        </div>

        {/* 신청 방법 카드 2개 */}
        <div className="followup-methods">
          {/* 대면 신청 카드 */}
          <div className="followup-method-card">
            <h2 className="followup-method-title">대면 신청하기</h2>
            <p className="followup-method-text">
              직접 대면 상담으로 보다 안정적인 환경에서
              갈등 패턴과 감정 반응을 함께 점검합니다.
            </p>
            <ul className="followup-list">
              <li>검사 결과에 대한 심층 피드백</li>
              <li>갈등 상황에 맞춘 대화 연습 및 역할 연기</li>
              <li>3~4회기 구성의 맞춤형 상담 커리큘럼</li>
            </ul>
            <p className="followup-notice">
              대면 신청하기를 누를 경우 :{" "}
              <strong>서포터즈를 통해 안내 및 신청해주시면 됩니다.</strong>
            </p>
            <button
  className="followup-button primary"
  onClick={() => {
    alert("서포터즈에게 요일과 시간, 연락처를 남겨주시면 추후 안내를 통해 상담사와 연결시켜드리겠습니다.");
  }}
>
  대면 신청하기
</button>

          </div>

          {/* 인스타 신청 카드 */}
          <div className="followup-method-card">
            <h2 className="followup-method-title">인스타그램 신청하기</h2>
            <p className="followup-method-text">
              DM으로 간단히 문의를 남기고, 일정과 내용을 조율할 수 있는
              보다 편안한 신청 방법입니다.
            </p>
            <ul className="followup-list">
              <li>인스타그램 DM으로 간단 신청</li>
              <li>상담 가능 요일·시간 조율</li>
              <li>필요 시 추가 안내 자료 제공</li>
            </ul>
            <a
              href="https://www.instagram.com/wish.story2024?igsh=MXFmYjF1cmxob3V6ZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="followup-button secondary"
            >
              인스타그램 신청하기
            </a>
          </div>
        </div>

        {/* 하단 안내/버튼 영역 */}
        <div className="followup-footer">
          <p className="followup-footer-text">
            지금 고민되는 갈등 상황이나 반복되는 패턴이 있다면,
            혼자 떠안기보다 함께 정리해 보는 것도 좋은 선택일 수 있어요.
          </p>

          <div className="followup-footer-actions">
            <Link href="/" className="followup-link-button">
              메인으로 돌아가기
            </Link>
            {/* 결과 페이지 경로를 /result 로 쓰고 있다면 이렇게 */}
            {/* <Link href="/result" className="followup-link-button subtle">
              검사 결과 다시 보기
            </Link> */}
          </div>
        </div>
      </section>
    </main>
  );
}