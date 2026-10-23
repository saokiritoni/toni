import type { ReactNode } from 'react'
import FlowDiagram from '../components/FlowDiagram'
import ImplDetail from '../components/ImplDetail'

/** 대표 사례. 목차에 하나씩 오르고, 사례 제목과 도식, 접는 구현 상세를 둘 수 있다 */
export type CasePart = { title: string; content: ReactNode }
/** 보조 사례. 문제와 조치를 한 문단에 쓰고 도식을 두지 않는다. 근거는 접어 둔다 */
export type SupportCase = { title: string; body: ReactNode; detail?: ReactNode }
/** 짧은 보충. 제목과 한 문단만 둔다. 목차에 오르지 않는다 */
export type CaseNote = { title: string; body: ReactNode }
export type CaseGroup = {
  key: string
  label: string
  tech: string[]
  /** 묶음 소개. 기술 목록 위에 둔다 */
  intro?: ReactNode
  parts: CasePart[]
  support?: SupportCase[]
  notes?: CaseNote[]
}

/** AdOnChat 상세 페이지 본문 소개. 카드의 overview 보다 한 문장 더 쓴다 */
export const ADONCHAT_OVERVIEW = '광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션입니다.'

/**
 * AdOnChat 상세 페이지(src/pages/AdOnChatPage.tsx)의 사례. 묶음(Backend, Frontend, AI Agent)마다 기술과 사례를 둔다.
 * 대표 사례(parts)는 자세히, 보조 사례(support)는 한 문단으로, 짧은 보충(notes)은 제목과 한 문단으로 쓴다.
 * 페이지 왼쪽 목차는 대표 사례와 보조 사례의 제목으로 만들어진다.
 */
export const ADONCHAT_GROUPS: CaseGroup[] = [
  {
    key: 'be',
    label: 'Backend',
    tech: ['Kotlin', 'Spring Boot', 'JPA', 'PostgreSQL', 'DynamoDB', 'AWS'],
    parts: [
      {
        title: '감사로그 누락 원인 추적과 개선',
        content: (
          <>
            <p className="pd-p">일부 회원 정보 변경은 정상 반영됐지만 감사로그가 남지 않았습니다. 기존에는 업무 변경과 같은 트랜잭션에서 Outbox에 이벤트를 저장했지만, 특정 실행 경로에서는 JPA의 변경 이벤트가 Outbox 저장 시점보다 늦게 생성됐습니다.</p>
            <p className="pd-p">감사 이벤트를 만드는 JPA <code>@PreUpdate</code>는 값을 바꾼 순간이 아니라 flush 시점에 실행됩니다. 변경 뒤에 다른 쿼리가 없는 경로에서는 flush가 커밋 시점까지 미뤄져, Outbox에 저장하는 <code>BEFORE_COMMIT</code> 리스너가 이벤트보다 먼저 지나갔습니다.</p>
            <p className="pd-p">문제가 난 서비스에 <code>flush()</code>를 넣으면 그 경로만 고쳐집니다. 트랜잭션의 공통 단계인 <code>TransactionSynchronization.beforeCommit</code>에서 먼저 flush하고, 그때 모인 이벤트를 Outbox에 저장하도록 순서를 바꿨습니다.</p>
            <FlowDiagram
              label="커밋 전 단계의 실행 순서를 바꾸기 전과 후"
              lanes={[
                {
                  label: 'Before',
                  steps: [
                    { actor: '업무 서비스', title: '업무 엔티티 변경', sub: '뒤에 쿼리가 없어 flush가 미뤄짐' },
                    { actor: '이벤트 리스너', title: 'BEFORE_COMMIT에서 Outbox 저장', sub: '아직 이벤트가 없어 저장할 것이 없음' },
                    { actor: 'JPA', title: '커밋 시점 flush', sub: <><code>@PreUpdate</code>가 이제야 이벤트를 만듦</>, tone: 'miss' },
                    { actor: '트랜잭션', title: '커밋', sub: '감사로그 없이 업무 변경만 저장', tone: 'miss' },
                  ],
                },
                {
                  label: 'After',
                  steps: [
                    { actor: '업무 서비스', title: '업무 엔티티 변경' },
                    { actor: '트랜잭션 동기화', title: 'beforeCommit에서 flush', sub: <><code>@PreUpdate</code>가 이벤트를 만듦</>, tone: 'key' },
                    { actor: '트랜잭션 동기화', title: 'Outbox 저장', sub: '모인 이벤트를 같은 트랜잭션에서 저장' },
                    { actor: '트랜잭션', title: '커밋', sub: '업무 변경과 Outbox를 함께 커밋', tone: 'key' },
                  ],
                },
              ]}
            />
          </>
        ),
      },
    ],
    support: [
      {
        title: '운영자 강등 시 최소 인원 보장',
        body: (
          <>
            운영자 A와 B의 강등 요청이 동시에 실행되면, 각 트랜잭션이 상대를 운영자로 확인한 뒤 모두 성공해 운영자가 0명이 될 수 있었습니다. 두 트랜잭션이 서로 다른 행을 바꾸므로 기본 격리 수준으로는 막히지 않는 write skew입니다. 활성 운영자 행을 <code>PESSIMISTIC_WRITE</code>로 잠근 뒤 남은 인원을 세어, 강등 요청을 순서대로 판정했습니다. 동시 처리량은 줄지만 운영자가 0명이 되는 순서는 생기지 않습니다.
          </>
        ),
        detail: (
          <>
            <li>PostgreSQL은 <code>COUNT</code>와 <code>FOR UPDATE</code>를 함께 쓸 수 없어서, 대상 행을 먼저 잠근 뒤 개수를 셉니다.</li>
            <li>잠금 순서를 <code>id</code> 순으로 통일해 교착 상태 위험을 줄였습니다.</li>
            <li>일괄 강등에서는 같은 배치의 강등 대상까지 빼고 남는 운영자 수를 계산합니다.</li>
          </>
        ),
      },
      {
        title: '인증정보 중복 등록 방지',
        body: '이미 등록했는지 조회한 뒤 등록하면, 동시에 온 두 요청이 모두 "없음"을 읽고 함께 통과할 수 있었습니다(경쟁 조건). 동시 등록은 DB 유니크 인덱스로 막고, 애플리케이션의 사전 조회는 오류 안내에만 사용했습니다.',
        detail: (
          <>
            <li>soft delete를 쓰기 때문에, 삭제되지 않은 행에만 적용되는 Partial Unique Index를 걸었습니다.</li>
            <li>인증정보는 KMS로 암호화되어 매번 다른 암호문이 나오므로, 평문의 SHA-256 해시를 별도 컬럼에 저장하고 (회원, 매체, 해시)에 인덱스를 걸었습니다.</li>
          </>
        ),
      },
    ],
    notes: [
      {
        title: '회원 일괄 변경의 APPLIED 상태',
        body: (
          <>
            CSV로 회원 정보를 일괄 변경한 뒤 결과 파일을 S3에 올립니다. 업로드가 끝날 때까지 DB 커넥션과 잠금을 붙잡지 않도록 업로드를 트랜잭션 밖에 두자, DB 변경은 커밋됐는데 결과 파일만 실패한 상태가 생겼습니다. 이를 FAILED로 표시하면 이미 바뀐 데이터를 실패라고 알리게 되므로, DB 변경이 커밋된 상태를 <code>APPLIED</code>로 따로 기록했습니다.
          </>
        ),
      },
    ],
  },
  {
    key: 'fe',
    label: 'Frontend',
    tech: ['React', 'TypeScript', 'Vite', 'Ant Design', 'TanStack Query'],
    parts: [
      {
        title: '채팅 진입과 입력 성능',
        content: (
          <>
            <ul className="pd-metrics">
              <li className="pd-metric">
                <span className="pd-metric-k">최신 메시지 표시</span>
                <em className="pd-metric-v">0.20초</em>
                <span className="pd-metric-was">기존 3.58초</span>
              </li>
              <li className="pd-metric">
                <span className="pd-metric-k">초기 API 응답 크기</span>
                <em className="pd-metric-v">44KB</em>
                <span className="pd-metric-was">기존 332KB</span>
              </li>
              <li className="pd-metric">
                <span className="pd-metric-k">타이핑 롱태스크</span>
                <em className="pd-metric-v">1회</em>
                <span className="pd-metric-was">기존 26회</span>
              </li>
            </ul>
            <dl className="pd-metric-notes">
              <div><dt>진입 지표</dt><dd>메시지가 200개 이상인 같은 채팅에서 브라우저 캐시를 끄고, 조회 요청부터 최신 메시지 첫 페인트까지 쟀습니다. 개선 후 값은 3회 측정의 중앙값입니다.</dd></div>
              <div><dt>타이핑 지표</dt><dd>이전 기록까지 모두 불러와 메시지가 200개 이상인 상태에서, CPU 4배 제한을 걸고 26글자를 입력했습니다.</dd></div>
            </dl>

            <h6 className="pd-sub-h">문제</h6>
            <p className="pd-p">메시지가 많이 쌓인 채팅에 들어가면 화면이 위에서부터 끊기며 내려간 뒤 최신 메시지가 보였습니다. API 응답은 85ms였으므로, 지연의 대부분이 생기는 응답 이후의 브라우저 렌더링 과정을 먼저 분석했습니다.</p>

            <h6 className="pd-sub-h">개선 과정</h6>
            <ol className="pd-steps">
              <li>
                <strong>1. 스크롤 중 반복 렌더링 제거</strong>
                <p>진입할 때 스크롤 애니메이션을 따라 현재 질문을 나타내는 상태가 바뀌면서, 200개가 넘는 메시지 전체가 약 20회 다시 렌더링되고 있었습니다. <code>MessageBubble</code>에 <code>React.memo</code>를 적용하고, <code>useLayoutEffect</code>에서 애니메이션 없이 최신 메시지로 이동하도록 바꿨습니다.</p>
              </li>
              <li>
                <strong>2. 초기 조회와 렌더링 범위 축소</strong>
                <p>반복 렌더링을 없앤 뒤에도 첫 렌더에 511ms가 걸렸습니다. 전체 메시지를 한 번에 불러오는 대신 최근 질문 20개와 그 답변을 먼저 받고, 위로 스크롤하면 이전 기록을 가져오는 커서 페이징을 적용했습니다. 질문과 답변이 페이지 사이에서 나뉘지 않도록 메시지 수가 아니라 질문 수를 기준으로 조회했습니다.</p>
              </li>
              <li>
                <strong>3. 타이핑 시 레이아웃 계산 범위 분리</strong>
                <p>이전 메시지를 모두 불러온 상태에서는 입력할 때마다 지연이 생겼습니다. 입력창이 자동으로 높이를 조절할 때마다 레이아웃을 다시 계산했고, 그 계산이 메시지 목록 전체까지 번지고 있었습니다. 목록 영역에 CSS <code>contain: strict</code>를 적용해 계산 범위를 분리했습니다.</p>
              </li>
            </ol>

            <ImplDetail fold label="측정 및 구현 상세">
              <li>단계별 측정값: 1단계 뒤 진입 중 말풍선 반복 렌더링은 0회, 최신 메시지 표시는 0.65초가 됐습니다. 2단계 뒤 첫 렌더는 117ms가 됐습니다.</li>
              <li>Chrome Performance 기록과 Playwright로 진입, 타이핑, 스크롤을 측정했고, 배포한 뒤에도 같은 시나리오로 다시 확인했습니다.</li>
              <li>가상 스크롤도 검토했지만, 메시지 200개 이상을 모두 불러온 상태에서도 스크롤 중 롱태스크는 관찰되지 않았습니다. 그래서 남은 병목인 타이핑 시 레이아웃 계산을 줄이는 방식을 골랐습니다.</li>
            </ImplDetail>
          </>
        ),
      },
    ],
  },
  {
    key: 'ai',
    label: 'AI Agent',
    intro: (
      <p className="pd-p">Python AI 런타임과 Kotlin, Spring 백엔드에서 Google Ads 조회 기능과 공통 승인 실행 구조를 구현했습니다. 조회에서는 모델이 만든 조회 명세를 코드로 검증하는 부분을, 승인 실행에서는 요청 묶음 보관과 공통 실행기, 백엔드의 선택 요청 전달과 Google Ads 연결을 맡았습니다.</p>
    ),
    tech: ['Python', 'Kotlin', 'Spring Boot', 'Amazon Bedrock AgentCore Runtime', 'Strands Agents', 'Google Ads API'],
    parts: [
      {
        title: 'Google Ads 조회 명세 검증',
        content: (
          <>
            <p className="pd-p">기능마다 조회 코드를 추가하는 방식에서는 사용자가 요청할 수 있는 항목이 미리 구현한 범위로 제한됐습니다. 모델은 조회 명세만 만들고, 코드가 그 명세를 검증한 뒤에만 쿼리를 조립해 실행하도록 바꿨습니다.</p>
            <FlowDiagram
              label="모델이 만든 조회 명세를 코드가 검증한 뒤 실행하는 순서"
              lanes={[
                {
                  label: '조회 명세 → 검증 → 쿼리 조립 → 실행',
                  steps: [
                    { actor: '모델', title: '조회 명세 작성', sub: '리소스, 항목, 조건, 정렬과 개수' },
                    { actor: '검증 계층', title: '검증', sub: '필드와 허용 범위 확인', tone: 'key' },
                    { actor: '조회 도구', title: '쿼리 조립', sub: '통과한 명세로만 생성' },
                    { actor: 'Google Ads API', title: '실행', sub: '결과는 미리보기와 열별 요약으로 모델에 전달' },
                  ],
                  loop: { from: 1, to: 0, label: '통과하지 못하면 항목별 사유를 모델에 돌려줘 명세를 고치게 함' },
                },
              ]}
            />
            <p className="pd-p">검증 대상은 광고 설정과 구조 조회에 허용한 리소스 30종입니다. 노출, 클릭, 비용 같은 성과 지표가 섞이지 않도록 AI 도구와 백엔드 양쪽에서 범위를 확인하고, 두 곳의 허용 목록이 일치하는지 테스트합니다.</p>
            <p className="pd-p">반응형 검색광고의 제목과 설명 연결 정보를 조회하는 요청을 지원 범위에 추가할 때, 별도 기능별 클라이언트를 작성하지 않고 리소스 목록과 조회 계획 코드를 확장했습니다.</p>

            <ImplDetail fold>
              <li>백엔드가 선택 계정의 매체를 런타임에 전달하고, 런타임은 같은 매체 판정 기준으로 도구 목록과 지시문을 고릅니다. 지시문 조립본에 사용할 수 없는 도구 이름이 들어 있으면 테스트가 실패합니다.</li>
              <li>API 규격에서 생성한 카탈로그, 실제 API로 확인한 메타데이터, 수동 보정값은 구분해 관리했습니다. 규격에 정의된 필드라도 조회 메타데이터에서 확인되지 않는 경우가 있어, 규격만으로 조회 가능 여부를 판단하지 않았습니다.</li>
              <li>모델에 전달하는 미리보기는 50행으로 제한하고, 미리보기만으로 전체 데이터를 단정하지 않도록 결과 범위를 함께 전달했습니다. 전체 건수와 묶음별 개수는 미리보기에서 추론하지 않고 별도 집계 경로로 처리했습니다.</li>
            </ImplDetail>
          </>
        ),
      },
      {
        title: '승인 요청 실행',
        content: (
          <>
            <p className="pd-p">사용자가 승인 카드를 누른 뒤 모델이 요청을 다시 구성해 실행하면, 승인한 내용과 실행 인자가 달라질 수 있었습니다.</p>
            <p className="pd-p">검증을 마친 실행 내용을 요청 ID와 함께 런타임에 보관하고, 백엔드는 사용자가 한 카드에서 체크한 요청 ID만 전달합니다. 공통 실행 도구는 실행 인자를 받지 않고 그 ID의 보관본을 꺼내 실행하므로, 승인한 내용이 그대로 실행 인자가 됩니다.</p>
            <p className="pd-p">보관한 요청이 실행되는지, 선택하지 않은 요청이 제외되는지, 런타임 보관본이 한 번만 소비되는지를 테스트했습니다. 테스트한 범위는 런타임 안의 소비까지이고, Google Ads 쪽에서 작업이 정확히 한 번 반영되는지는 확인하지 않았습니다.</p>

            <ImplDetail fold>
              <li>실행 요청은 런타임 프로세스 메모리에 보관합니다. 재시작 등으로 보관본이 사라진 경우에는 실행하지 않고 만료를 안내합니다.</li>
            </ImplDetail>
          </>
        ),
      },
    ],
    notes: [
      {
        title: 'AI 에이전트 타임아웃 조정',
        body: '백엔드는 480초 뒤 타임아웃으로 응답하고 세션 잠금을 해제했지만, 에이전트 런타임은 최대 900초까지 실행돼 사용자가 오류를 받은 뒤에도 답변이 대화 이력에 저장됐습니다. 런타임 제한을 450초, 조회 도구의 실행 예산을 390초로 줄여 백엔드 타임아웃 전에 처리를 마치도록 조정하고, 각 구성 요소의 시간 제한 관계를 테스트로 확인하게 했습니다.',
      },
    ],
  },
]
