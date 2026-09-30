import { Tag } from 'antd'
import WorkParts from '../components/WorkParts'

export default function AdAnalyticsDetail() {
  return (
    <>
      <div className="pd-meta">
        <Tag variant="filled">2026.02 – 2026.03 (2주)</Tag>
        <Tag variant="filled">NHN AD</Tag>
        <Tag variant="filled">Frontend, Backend · 기여 100%</Tag>
      </div>
      <p className="pd-catch">"대시보드를 보지 말고, 대화하세요."</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">'방대한 광고 데이터를 사람이 직접 조작해야 한다'는 페인 포인트에서 출발해, 자연어로 광고 데이터를 분석하는 서비스를 만들었습니다. 이를 위해 <b>13개 AWS 서비스를 조합한 서버리스 아키텍처를 2주 안에 단독으로 설계·구축</b>했습니다.</p>
        <ul className="pd-whr">
          <li><span className="k">Why</span><span>마케터가 raw 데이터를 직접 조작, 반복되는 엑셀 리포트 수작업</span></li>
          <li><span className="k">How</span><span>AWS 서버리스 파이프라인 + Bedrock(Claude) Tool-Use</span></li>
          <li><span className="k">Result</span><span>자연어 질문 → AI가 직접 쿼리 작성·조회, 인프라 비용 83% 절감 설계</span></li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>아키텍처 (AWS)</h4>
        <ul className="pd-sublist">
          <li><b>데이터 수집 파이프라인</b>: 광고 API(Kakao·Google)의 일별 성과를 서버 없이 자동 수집(EventBridge → SQS → Lambda → S3). 일부가 실패해도 전체가 멈추지 않는 큐 기반 구조</li>
          <li><b>AI 분석</b>: 자연어 질문을 받으면 AI(Bedrock)가 직접 SQL을 만들어 데이터 레이크(Athena)를 조회하고 자연어로 답변</li>
          <li><b>캐싱</b>: Redis 캐싱으로 대시보드 응답 시간 <b>99.58% 감소</b></li>
          <li><b>리포트 공유</b>: 매주 자동 생성되는 리포트를 로그인 없이 볼 수 있는 읽기 전용 링크로 공유, Excel 다운로드 지원</li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>진행한 일</h4>
        <WorkParts
          parts={[
            {
              title: 'S3 생명주기 비용 최적화',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>광고 데이터 누적으로 S3 비용 증가, 접근 빈도별 스토리지 전략 부재</p></div>
                    <div className="ba-col after"><span className="ba-label">After</span><p>3단계 전환 설계, 엑셀: Standard+1일 삭제 / 리포트: Standard→IA→Glacier IR / Athena 결과: Standard+7일 삭제. GB당 $0.023→$0.004(<b>약 83% 절감</b>). 전환 기준은 광고 계약 주기라는 도메인 지식에서 도출</p></div>
                  </div>
                </>
              ),
            },
            {
              title: 'AI Tool Use 설계',
              content: (
                <>
                  <ul className="pd-sublist">
                    <li>Bedrock Tool Use로 AI가 질문 분석 → SQL 자동 생성 → Athena 조회 → 자연어 답변(SSE 스트리밍: 텍스트·차트·표). 5회 API 호출 제한으로 정확도 보완</li>
                    <li>비개발자도 자연어 질문만으로 광고 성과를 조회할 수 있게 되어, 퍼포먼스 마케터의 리포트 작업 시간을 단축</li>
                  </ul>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className="pd-block">
        <h4>성장한 점</h4>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#도메인_지식</span><span>#WHY</span><span>#공감</span></div>
          <p>주간리포트 PDF 내보내기를 구현했지만, 돌아보니 내 시선에서만 내린 결정이었습니다. 그래서 사내 마케터에게 실제 업무 방식을 여쭤봤더니 일간·주간·월간 리포트를 엑셀로 작성하는 일이 업무 대부분이었고, S3 생명주기 기간도 광고 계약 주기를 파악한 뒤에야 적절한 기준을 잡을 수 있었습니다. <b>도메인을 이해하고 공감하는 것이 기술적 결정보다 먼저임을 배웠습니다.</b></p>
        </div>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#이슈</span><span>#대응</span><span>#계획</span></div>
          <p>2주라는 타이트한 일정에서는 이슈 핸들링이 최우선이었습니다. 그래서 MVP 우선순위로 개발 순서를 정했고, 카카오 API 심사 승인처럼 예측하기 어려운 외부 이슈는 여유 시간을 미리 확보해 대응했습니다. <b>완벽한 계획보다 변화에 빠르게 대응하는 계획이 더 강하다는 것을 배웠습니다.</b></p>
        </div>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#Claude_Code</span><span>#Gemini</span><span>#교차검증</span></div>
          <p>Claude와 Gemini 교차 피드백으로 결과물을 검증하고, Claude가 설계·Claude Code가 구현을 맡는 역할 분담을 설계하며 효율을 대폭 높였습니다. <b>AI의 역량을 나의 역량으로 흡수하는 방법을 아는 것이 곧 경쟁력임을 깨달았습니다.</b></p>
        </div>
      </div>
    </>
  )
}
