import { Tag } from 'antd'
import FlowDiagram from '../components/FlowDiagram'
import WorkParts from '../components/WorkParts'

export default function AdAnalyticsDetail() {
  return (
    <>
      <div className="pd-meta">
        <Tag variant="filled">2026.02 – 2026.03 (2주)</Tag>
        <Tag variant="filled">NHN AD</Tag>
        <Tag variant="filled">Frontend, Backend</Tag>
      </div>
      <p className="pd-catch">"대시보드를 보지 말고, 대화하세요."</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">광고 성과를 보려면 매체마다 대시보드를 조작하고 엑셀로 다시 정리해야 하는 마케터의 반복 업무를 줄이기 위해, 자연어로 광고 성과를 조회·분석하는 AI 서비스를 2주 동안 설계하고 개발했습니다. Amazon Bedrock(Claude)이 질문을 해석해 SQL을 만들고, Athena에서 광고 데이터를 조회하도록 구성했습니다.</p>
        <ul className="pd-whr">
          <li><span className="k">Why</span><span>매체마다 대시보드를 조작하고 엑셀로 정리하는 반복 리포트 업무</span></li>
          <li><span className="k">How</span><span>Bedrock Tool Use로 자연어 질문을 Athena 조회로 연결, 데이터 수집·리포트 생성은 서버리스로 구성</span></li>
          <li><span className="k">Result</span><span>자연어 기반 광고 데이터 분석 · 2주 MVP 완성</span></li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>아키텍처 (AWS)</h4>
        <FlowDiagram
          label="광고 데이터 수집과 자연어 조회 흐름"
          lanes={[
            {
              label: '데이터 수집: 매일 03:00',
              steps: [
                { title: 'EventBridge Scheduler', sub: '매체마다 일정을 따로 둠' },
                { title: 'SQS', sub: '매체별 메시지 1건' },
                { title: 'Lambda', sub: 'Google Ads·Kakao Moment API 호출' },
                { title: 'S3', sub: 'Parquet로 저장' },
                { title: 'Glue', sub: '파티션 등록, Athena로 조회 가능' },
              ],
              note: '매체마다 메시지를 따로 보내기 때문에, 한 매체의 수집이 실패해도 다른 매체의 수집은 그대로 진행됩니다.',
            },
            {
              label: '자연어 조회',
              steps: [
                { title: '사용자 질문', sub: '채팅 화면' },
                { title: 'Spring Boot', sub: '질문과 조회 도구를 Bedrock에 전달' },
                { title: 'Bedrock (Claude)', sub: '질문을 해석해 SQL을 만들고 조회 도구 호출', tone: 'key' },
                { title: 'Athena', sub: 'S3의 광고 데이터 조회' },
                { title: 'SSE', sub: '조회 결과로 만든 답변을 스트리밍' },
              ],
              note: 'Bedrock은 조회 결과를 보고 추가 조회가 필요하면 Athena를 다시 호출합니다. 반복은 최대 5회입니다.',
            },
          ]}
        />
        <ul className="pd-sublist">
          <li><b>데이터 수집</b>: EventBridge → SQS → Lambda → S3로 Google Ads·Kakao Moment 성과 수집 파이프라인을 구성했습니다. 매체별 작업을 큐로 나눠, 한 매체의 수집이 실패해도 다른 매체의 수집에 영향을 주지 않게 했습니다.</li>
          <li><b>AI 분석</b>: Bedrock이 자연어 질문을 SQL로 바꿔 Athena를 조회하고, 결과를 텍스트·표·차트로 구성해 SSE로 전달합니다.</li>
          <li><b>캐싱</b>: 반복 조회되는 대시보드 결과를 Redis에 1시간 캐시해, 같은 조회가 다시 들어오면 Athena를 조회하지 않고 캐시된 결과를 돌려줍니다.</li>
          <li><b>리포트</b>: 주간 성과 리포트를 자동으로 만들고, 읽기 전용 공유 링크와 Excel 다운로드를 제공했습니다.</li>
        </ul>
        <p className="pd-note">※ 과제 기간 중 광고 API 사용 승인이 끝나지 않아 제공받은 데이터로 분석 기능을 먼저 개발했고, 발표 전 Kakao Moment API 연동을 마쳤습니다.</p>
      </div>

      <div className="pd-block">
        <h4>진행한 일</h4>
        <WorkParts
          parts={[
            {
              title: '자연어 기반 광고 데이터 조회',
              content: (
                <>
                  <ul className="pd-sublist">
                    <li>사용자가 자연어로 광고 성과를 물으면 Bedrock이 질문을 분석해 SQL을 만들고, Athena 조회 도구를 호출하도록 구성했습니다(Tool Use). 조회 결과는 다시 AI에 전달해 자연어 답변으로 만들고 SSE로 스트리밍했습니다.</li>
                    <li>한 번의 조회로 답하기 어려운 질문은 결과를 바탕으로 추가 조회할 수 있도록 반복 구조를 만들었습니다. 다만 <b>불필요한 반복과 호출 비용 증가를 막기 위해</b> 반복은 최대 5회로 제한했습니다.</li>
                  </ul>
                </>
              ),
            },
            {
              title: '데이터 특성에 따른 S3 보관 정책',
              content: (
                <>
                  <ul className="pd-sublist">
                    <li>Excel 다운로드 파일·Athena 조회 결과·주간 리포트는 다시 쓰는 빈도와 필요한 보관 기간이 달랐습니다. Excel은 1일, Athena 결과는 7일 뒤 삭제하고, 오래 보관해야 하는 리포트는 Standard → IA → Glacier IR로 옮기도록 수명 주기 규칙을 구성했습니다.</li>
                    <li>데이터를 한꺼번에 같은 방식으로 보관하지 않고, <b>실제로 쓰이는 방식에 맞춰 저장 비용과 조회 가능성을 함께 고려</b>했습니다.</li>
                  </ul>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className="pd-block">
        <h4>사용자를 이해하는 법</h4>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#사용자_업무</span><span>#판단_수정</span></div>
          <p>처음에는 주간 리포트를 PDF로 제공했지만, 사내 마케터에게 실제 업무를 여쭤보니 일·주·월간 리포트를 Excel로 가공하는 일이 많았습니다. 제 기준에서 편한 방식을 사용자의 방식이라고 생각했던 것입니다. 다음 날 Excel 다운로드로 바꾸고 요약·일별 추이·매체별 상세 시트를 구성해, 다시 가공해야 하는 작업을 줄였습니다. 이후로는 기술을 고르기 전에 <b>사용자가 실제로 어떻게 일하는지부터 확인</b>하려고 합니다.</p>
        </div>
      </div>
    </>
  )
}
