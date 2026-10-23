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
      <p className="pd-catch">자연어 질문으로 광고 성과를 조회하는 AI 분석 서비스</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">자연어로 광고 성과를 조회하고 분석하는 AI 서비스를 2주 동안 설계하고 개발했습니다. 매체마다 대시보드를 조작하고 엑셀로 다시 정리해야 하던 마케터의 반복 업무를 줄이기 위한 서비스입니다.</p>
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
                { title: 'Lambda', sub: 'Google Ads / Kakao Moment API 호출' },
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
            },
          ]}
        />
      </div>

      <div className="pd-block">
        <h4>진행한 일</h4>
        <WorkParts
          parts={[
            {
              title: '조회 반복 제한과 캐싱',
              content: (
                <ul className="pd-sublist">
                  <li>한 번의 조회로 답하기 어려운 질문은 결과를 바탕으로 추가 조회하게 했고, 불필요한 반복과 호출 비용 증가를 막기 위해 반복은 최대 5회로 제한했습니다.</li>
                  <li>반복 조회되는 대시보드 결과는 Redis에 1시간 캐시해, 같은 조회가 다시 들어오면 Athena를 조회하지 않고 캐시된 결과를 돌려줍니다.</li>
                </ul>
              ),
            },
            {
              title: '데이터 특성에 따른 S3 보관 정책',
              content: (
                <p className="pd-p">Excel 다운로드 파일, Athena 조회 결과, 주간 리포트는 다시 쓰는 빈도와 필요한 보관 기간이 달랐습니다. Excel은 1일, Athena 결과는 7일 뒤 삭제하고, 오래 보관해야 하는 리포트는 Standard → IA → Glacier IR로 옮기도록 수명 주기 규칙을 구성했습니다.</p>
              ),
            },
          ]}
        />
      </div>
    </>
  )
}
