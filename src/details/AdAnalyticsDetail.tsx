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
        <p className="pd-p">광고 성과를 보려면 매체마다 대시보드를 조작하고 엑셀로 다시 정리해야 하는 마케터의 반복 업무를 줄이기 위해, 자연어로 광고 성과를 조회·분석하는 AI 리포트 서비스를 2주 동안 설계하고 개발했습니다. Amazon Bedrock(Claude)이 질문을 해석해 SQL을 만들고, Athena에서 광고 데이터를 조회합니다.</p>
        <p className="pd-p">모든 기능을 만들기보다 <b>핵심 가치인 AI 채팅과 데이터 수집을 최우선</b>으로 두고, 나머지는 최소한으로 구현하는 방식으로 MVP의 우선순위를 정했습니다.</p>
        <ul className="pd-whr">
          <li><span className="k">Why</span><span>매체마다 대시보드를 조작하고 엑셀로 정리하는 반복 리포트 업무</span></li>
          <li><span className="k">How</span><span>Bedrock Tool Use로 자연어 질문을 Athena 조회로 연결, 데이터 수집·리포트 생성은 서버리스로 구성</span></li>
          <li><span className="k">Result</span><span>자연어 기반 광고 데이터 분석 · 대시보드 응답 시간 개선 · 2주 MVP 완성</span></li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>아키텍처 (AWS)</h4>
        <ul className="pd-sublist">
          <li><b>데이터 수집</b>: 광고 API(Google Ads·Kakao Moment)의 일별 성과를 매일 자동 수집하도록 설계했습니다(EventBridge → SQS → Lambda → S3). 매체별로 수집 작업을 나눠 큐에 넣어, <b>한 매체의 수집이 실패해도 다른 매체는 계속 진행</b>되고 실패한 작업만 다시 처리됩니다. 과제 기간에는 광고 API 실사용 권한을 받지 못해, 분석에는 전달받은 임시 데이터를 적재해 사용했습니다</li>
          <li><b>AI 분석</b>: 자연어 질문을 받으면 Bedrock이 SQL을 만들어 Athena를 조회하고, 결과를 자연어로 정리해 SSE로 스트리밍합니다. 답변은 질문에 맞게 텍스트·표·차트로 보여 줍니다</li>
          <li><b>캐싱</b>: 대시보드 요약 결과를 Redis에 1시간 동안 캐시해, 다시 접근할 때 Athena를 조회하지 않게 했습니다. 서버를 늘려도 캐시를 공유할 수 있도록 서버 메모리 대신 Redis에 두었습니다. 대시보드 응답 시간이 <b>99.58% 감소</b>했습니다</li>
          <li><b>리포트</b>: 매주 월요일 지난주 성과 리포트를 AI가 자동으로 만들고, 로그인 없이 볼 수 있는 읽기 전용 공유 링크와 Excel 다운로드를 제공합니다</li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>진행한 일</h4>
        <WorkParts
          parts={[
            {
              title: '자연어 질문을 실제 데이터 조회로 연결하도록',
              content: (
                <>
                  <ul className="pd-sublist">
                    <li>사용자가 자연어로 광고 성과를 물으면, Bedrock(Claude)이 질문을 분석해 조회가 필요한지 판단하고 Athena SQL을 만들어 조회 도구를 호출합니다(Tool Use). 서버가 그 SQL을 Athena에서 실행해 결과를 돌려주면, AI가 결과를 자연어로 정리하고 서버가 SSE로 스트리밍합니다</li>
                    <li>결과를 텍스트·표·차트 가운데 어떤 형식으로 보여 줄지도 AI가 질문에 맞게 고릅니다. 그래서 <b>데이터 구조나 SQL을 모르는 사용자도 질문만으로 실제 광고 데이터를 조회</b>할 수 있습니다</li>
                    <li>한 번의 조회로 답이 나오지 않으면 결과를 보고 다시 조회할 수 있도록, AI와 서버가 여러 번 주고받는 반복 구조(ReAct 루프)로 만들었습니다. AI가 조회를 끝없이 반복하거나 호출 비용이 불어나지 않도록 반복 횟수의 상한을 5회로 정했습니다. 운영하면서 조정하는 장치가 아니라, MVP에서 최소한의 안전장치로 둔 상한입니다</li>
                    <li>Google과 Kakao는 같은 지표도 컬럼 이름과 단위가 다릅니다(비용: <code>cost_micros</code>와 <code>spending</code>). 두 매체를 같은 기준으로 다루도록 프롬프트에 매체 통일 규칙과 쿼리 규칙을 넣었습니다</li>
                  </ul>
                </>
              ),
            },
            {
              title: '데이터마다 다시 읽히는 방식에 맞게 보관하도록',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>엑셀 파일·주간 리포트·Athena 조회 결과가 같은 버킷에 쌓이지만, 다시 읽히는 빈도와 필요한 보관 기간이 서로 달랐습니다</p></div>
                    <div className="ba-col after"><span className="ba-label">After</span><p>같은 S3 데이터라도 <b>다시 읽히는 방식에 따라 보관 정책을 달리</b>했습니다. 엑셀은 다운로드 링크가 1시간 뒤 만료되므로 1일 뒤 삭제하고, Athena 결과는 다시 쓰지 않는 임시 파일이라 7일 뒤 삭제합니다. 주간 리포트는 과거 이력을 조회하는 기능이 있어 삭제하지 않고 Standard → IA → Glacier IR 순으로 옮깁니다. Glacier IR은 즉시 조회할 수 있어 사용자 경험에 영향이 없습니다. 리포트의 전환 시점은 광고 계약 주기에 맞췄고, 장기 보관 구간의 저장 단가를 GB당 $0.023에서 $0.004 수준으로 낮출 수 있도록 설계했습니다</p></div>
                  </div>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className="pd-block">
        <h4>성장한 점</h4>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#사용자_업무</span><span>#판단_수정</span></div>
          <p>처음에는 주간 리포트를 PDF로 내보내도록 만들었지만, 돌아보니 제 시선에서만 내린 결정이었습니다. 사내 마케터에게 실제 업무 방식을 여쭤보니 일간·주간·월간 리포트를 엑셀로 작성하는 일이 업무 대부분이었습니다. 그래서 다음 날 PDF 내보내기를 Excel 내보내기로 바꾸고, 요약·일별 추이·매체별 상세 시트에 필터와 차트를 미리 넣어 마케터가 raw 데이터를 다시 가공하지 않아도 되게 했습니다. S3 생명주기 기간도 광고 계약 주기를 파악한 뒤에야 적절한 기준을 잡을 수 있었습니다. <b>좋은 기술적 판단은 사용자의 업무를 이해하는 데서 시작한다</b>는 것을 배웠습니다.</p>
        </div>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#MVP</span><span>#우선순위</span><span>#외부_일정</span></div>
          <p>2주 안에 동작하는 서비스를 만들기 위해, 핵심 가치인 AI 채팅과 데이터 수집을 최우선으로 두고 고가용성 구성·모니터링·회원 관리는 MVP 범위에서 뺐습니다. 프론트엔드도 우선순위가 높은 채팅을 먼저 연동하고 로그인은 하루 뒤로 미뤘습니다. 광고 API 사용 심사처럼 끝나는 날을 예측할 수 없는 외부 일정은 기다리지 않고 전달받은 임시 데이터로 먼저 개발했고, 연동이 미뤄진 날에는 프론트엔드 보충 작업으로 일정을 돌렸습니다. 발표 직전에는 Kakao Moment API 연동까지 마쳤습니다. <b>완벽한 계획보다 변화에 빠르게 대응하는 계획이 더 강하다</b>는 것을 배웠습니다.</p>
        </div>
      </div>
    </>
  )
}
