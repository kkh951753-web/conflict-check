// pages/terms.js

export default function TermsPage() {
  return (
    <main className="page">
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto", lineHeight: 1.7 }}>
        <h1 className="title" style={{ marginBottom: "16px" }}>
          개인정보 수집·이용 동의 및 이용 안내
        </h1>

        <p className="subtitle" style={{ marginBottom: "24px" }}>
          본 페이지는 강원도 춘천시 청년을 대상으로 진행되는
          <br />
          <strong>“갈등 대처 성향 심리검사”</strong>와 관련된 개인정보 수집·이용에 대한 내용을 안내합니다.
        </p>

        {/* 1. 수집하는 개인정보 항목 */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            1. 수집하는 개인정보 항목
          </h2>
          <ul style={{ paddingLeft: "18px" }}>
            <li>필수항목: 이름, 나이, 성별, 연락처(전화번호)</li>
            <li>선택항목: MBTI 유형</li>
            <li>기타: 심리검사 문항에 대한 응답 내용 (16문항에 대한 선택 결과)</li>
          </ul>
        </section>

        {/* 2. 수집 및 이용 목적 */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            2. 개인정보의 수집 및 이용 목적
          </h2>
          <p>
            수집된 개인정보는 다음 목적을 위해 사용됩니다.
          </p>
          <ul style={{ paddingLeft: "18px" }}>
            <li>개인별 갈등 대처 성향 분석 및 검사 결과 제공</li>
            <li>연령·성별 등 기본 특성에 따른 통계 분석 (개인 식별이 불가능한 형태)</li>
            <li>추가 상담 또는 후속 프로그램(대면/온라인)의 참여 의사를 밝힌 경우, 연락을 위한 활용</li>
          </ul>
        </section>

        {/* 3. 보유 및 이용 기간 */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            3. 개인정보의 보유 및 이용 기간
          </h2>
          <p>
            수집된 개인정보는 <strong>프로그램 종료 후 최대 1년</strong>까지 보관되며,
            해당 기간 경과 시 지체 없이 안전한 방법으로 파기됩니다.
          </p>
          <p style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}>
            ※ 실제 운영 시에는 프로젝트 성격에 맞게 보유 기간을 조정하고,
            담당 기관 또는 전문가와 상의해 주시기 바랍니다.
          </p>
        </section>

        {/* 4. 동의 거부 권리 및 불이익 */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            4. 동의 거부 권리 및 불이익
          </h2>
          <p>
            개인정보 제공에 대한 동의를 거부할 권리가 있습니다.
            다만, <strong>필수 항목에 대한 동의를 거부하시는 경우</strong>에는
            심리검사 진행 및 결과 제공이 어려울 수 있습니다.
          </p>
          <p style={{ marginTop: "8px" }}>
            선택 항목(MBTI 등)에 대한 미작성 또는 미동의는
            검사 참여에 불이익이 없습니다.
          </p>
        </section>

        {/* 5. 정보주체의 권리 */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            5. 정보주체의 권리
          </h2>
          <p>
            참여자는 언제든지 본인의 개인정보에 대해
            <strong>열람, 정정, 삭제, 이용정지</strong>를 요청할 수 있습니다.
            요청 방법은 아래 연락처로 문의해 주세요.
          </p>
          <ul style={{ paddingLeft: "18px" }}>
            <li>문의처: (예시) &lt;운영자 이메일 또는 연락처 기입&gt;</li>
          </ul>
        </section>

        {/* 6. 개인정보 제3자 제공 및 위탁 여부 */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            6. 개인정보의 제3자 제공 및 처리 위탁
          </h2>
          <p>
            본 심리검사에서 수집된 개인정보는
            <strong>원칙적으로 외부 기관이나 제3자에게 제공되지 않습니다.</strong>
          </p>
          <p style={{ marginTop: "4px" }}>
            다만, 향후 연구 목적 또는 행정 절차상 불가피하게
            제3자 제공 또는 처리가 필요한 경우,
            별도의 동의를 다시 받거나 법령이 허용하는 범위 내에서만 진행됩니다.
          </p>
        </section>

        {/* 7. 온라인 서비스(예: Supabase 등) 사용에 대한 안내 (간단하게) */}
        <section style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            7. 온라인 저장소 사용 안내
          </h2>
          <p>
            본 검사지 사이트는 검사 결과와 기본 정보를 저장하기 위해
            <strong>온라인 데이터베이스 서비스</strong>를 사용하고 있습니다.
            저장되는 정보는 개발자가 설정한 보안 규칙에 따라 보호되며,
            외부에서 임의로 접근할 수 없도록 관리됩니다.
          </p>
        </section>

        {/* 8. 동의 문구 요약 */}
        <section style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
            8. 동의 문구 요약
          </h2>
          <p>
            위 내용을 충분히 읽고 이해하셨다면,
            <br />
            기본 정보 입력 화면에서 <strong>「개인정보 수집·이용에 동의합니다」</strong>에 체크한 뒤
            검사를 진행해 주세요.
          </p>
        </section>

        {/* 하단 안내 + 돌아가기 버튼 */}
        <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
          ※ 위 약관 및 동의 내용은 예시이며, 실제 사용 시에는
          운영 목적과 관련 법령에 맞게 수정·보완이 필요합니다.
        </p>

        <button
          className="primary-btn-blue"
          style={{ width: "100%" }}
          onClick={() => (window.location.href = "/test")}
        >
          기본 정보 입력 화면으로 돌아가기
        </button>
      </div>
    </main>
  );
}
