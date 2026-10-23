import type { ReactNode } from 'react'
import FlowDiagram from '../components/FlowDiagram'
import ImplDetail from '../components/ImplDetail'

/** 대표 사례. 목차에 하나씩 오르고, 사례 제목과 도식, 접는 구현 상세를 둘 수 있다 */
export type CasePart = { title: string; content: ReactNode }
/** 보조 사례. 조치를 첫 문장에 두고 짧은 문단 몇 개로 쓴다. 도식과 접는 상세를 두지 않는다 */
export type SupportCase = { title: string; body: ReactNode }
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
 * 대표 사례(parts)는 자세히, 보조 사례(support)는 짧은 문단 몇 개로, 짧은 보충(notes)은 제목과 한 문단으로 쓴다.
 * 사례마다 첫 문장에 무엇을 했는지 두고, 그 뒤에 원인과 조치를 한 번씩만 쓴다.
 * 페이지 왼쪽 목차는 대표 사례와 보조 사례의 제목으로 만들어진다.
 */
export const ADONCHAT_GROUPS: CaseGroup[] = [
  {
    key: 'be',
    label: 'Backend',
    tech: ['Kotlin', 'Spring Boot', 'JPA', 'PostgreSQL', 'DynamoDB', 'AWS'],
    parts: [
      {
        title: '업무 변경과 감사 이력을 연결하는 공통 구조 설계',
        content: (
          <>
            <p className="pd-p">여러 엔티티의 변경 이력을 공통으로 기록하기 위해 <code>BaseEntity</code> 기반의 감사로그 구조를 설계했습니다. 서비스마다 기록 코드를 추가하면 중복이 생기고 새로운 변경 경로에서 기록을 빠뜨릴 수 있어, 변경 감지를 공통화했습니다.</p>
            <p className="pd-p"><strong>업무 변경과 감사 이력의 후속 처리를 분리하되, 처리할 이벤트는 DB에 남기도록 설계했습니다.</strong> 업무 변경이 커밋된 뒤에만 감사 이벤트를 처리하면, 후속 처리에 실패했을 때 이벤트가 남지 않아 이력이 누락될 수 있습니다. 반대로 감사 이력 저장까지 같은 트랜잭션에 넣으면, 감사 처리 실패로 업무 변경도 롤백됩니다.</p>
            <p className="pd-p">업무 변경과 Outbox 이벤트 저장만 같은 트랜잭션으로 묶고, 감사 이력 테이블 반영은 커밋 이후 별도 스케줄러가 맡도록 구성했습니다. <strong>업무 변경이 커밋될 때 이벤트도 함께 저장하고, 이후 감사 이력 반영에 실패하면 재처리할 수 있도록 했습니다.</strong></p>
            <FlowDiagram
              label="같은 트랜잭션에서 처리하는 범위와 커밋 이후 따로 처리하는 범위"
              lanes={[
                {
                  label: '같은 트랜잭션',
                  steps: [
                    { actor: '업무 서비스', title: '업무 데이터 변경' },
                    { actor: '트랜잭션 동기화', title: 'Outbox 이벤트 저장', tone: 'key' },
                    { actor: '트랜잭션', title: '커밋', sub: 'Outbox 저장에 실패하면 업무 변경도 롤백' },
                  ],
                },
                {
                  label: '커밋 이후 별도 처리',
                  steps: [
                    { actor: '스케줄러', title: 'Outbox 조회' },
                    { actor: '스케줄러', title: '감사 이력 반영', sub: '실패해도 커밋된 업무 변경은 유지' },
                  ],
                  loop: { from: 1, to: 0, label: '실패하면 Outbox 이벤트로 재처리' },
                },
              ]}
            />
            <ImplDetail fold label="처리 순서 보완과 검증">
              <li>운영자가 회원의 역할을 변경하는 경로에서 감사 이벤트가 누락되는 문제를 발견했습니다. JPA의 <code>@PreUpdate</code>는 엔티티 값을 변경할 때가 아니라 flush 시점에 실행되는데, 일부 경로에서는 Outbox 저장 처리가 이벤트 생성보다 먼저 실행됐습니다. 커밋 전에 flush를 실행한 뒤 수집된 이벤트를 Outbox에 저장하도록 순서를 조정했습니다.</li>
              <li>변경 뒤 추가 조회가 없는 경로를 재현하는 통합 테스트를 작성했습니다. 추가 조회가 있는 경로와 없는 경로, 실제 회원 역할 변경에서 Outbox 저장과 변경 전후 값을 확인했습니다. 테스트는 H2의 PostgreSQL 호환 모드에서 실행했습니다.</li>
            </ImplDetail>
          </>
        ),
      },
    ],
    support: [
      {
        title: '운영자 강등 시 최소 인원 보장',
        body: (
          <>
            <p className="pd-p">활성 운영자 행에 비관적 잠금(<code>PESSIMISTIC_WRITE</code>)을 적용하고, 잠금 획득 후 남은 운영자 수를 확인하도록 구현했습니다.</p>
            <p className="pd-p">운영자 두 명의 강등 요청이 동시에 실행되면, 각 요청이 상대방을 남아 있는 운영자로 확인해 둘 다 강등될 수 있었습니다. 잠금을 기다리는 동안 다른 강등 요청은 멈추므로 동시 처리량은 줄어듭니다.</p>
            <p className="pd-p">교착 상태를 피하려고 여러 행의 잠금 순서를 ID 순으로 통일했습니다. 일괄 강등에서는 같은 작업의 강등 대상까지 빼고 남은 인원을 계산했습니다.</p>
          </>
        ),
      },
      {
        title: '인증정보 중복 등록 방지',
        body: (
          <>
            <p className="pd-p">동시 등록에 대비해 DB 유니크 인덱스를 적용하고, 제약 위반을 중복 등록 오류로 처리했습니다.</p>
            <p className="pd-p">저장 전 중복 조회만으로는 동시에 들어온 두 요청이 모두 통과할 수 있었습니다. 사전 조회는 사용자에게 오류를 안내하는 데 쓰고, 최종 중복 판정은 DB에 맡겼습니다. soft delete로 지운 정보를 다시 등록할 수 있도록, 삭제되지 않은 행에만 적용되는 Partial Unique Index를 사용했습니다.</p>
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

            <p className="pd-p">메시지가 많은 채팅에 들어가면 최신 메시지가 늦게 보이던 문제를 줄였습니다. API 응답은 85ms였지만 최신 메시지가 보이기까지 시간이 걸려, 응답 이후의 브라우저 렌더링 과정을 분석했습니다.</p>

            <ol className="pd-steps">
              <li>
                <strong>1. 불필요한 반복 렌더링 제거</strong>
                <p>스크롤 애니메이션 중 상태가 바뀌면서 메시지 목록이 약 20회 다시 렌더링되고 있었습니다. 메시지 컴포넌트에 메모이제이션을 적용하고, 진입할 때 애니메이션 없이 최신 메시지로 이동하도록 바꿨습니다.</p>
              </li>
              <li>
                <strong>2. 초기 조회 범위 축소</strong>
                <p>최근 질문 20개와 답변을 먼저 불러오고, 위로 스크롤하면 이전 기록을 조회하는 커서 기반 페이지네이션을 적용했습니다. 질문과 답변이 페이지 사이에서 나뉘지 않도록 질문 수를 기준으로 조회했습니다.</p>
              </li>
              <li>
                <strong>3. 입력창과 메시지 목록의 레이아웃 계산 분리</strong>
                <p>입력창의 높이가 바뀔 때마다 메시지 목록까지 레이아웃을 다시 계산하고 있었습니다. 메시지 목록에 CSS containment를 적용해 계산 범위를 분리했습니다.</p>
              </li>
            </ol>

            <ImplDetail fold label="측정 및 구현 상세">
              <li>1단계는 <code>MessageBubble</code>에 <code>React.memo</code>를, 진입 이동에 <code>useLayoutEffect</code>를 썼고, 3단계는 목록 영역에 <code>contain: strict</code>를 적용했습니다.</li>
              <li>Chrome Performance와 Playwright로 진입, 입력, 스크롤 동작을 측정하고, 배포 후 같은 시나리오로 다시 확인했습니다.</li>
              <li>전체 기록을 불러온 상태에서도 스크롤 중 롱태스크가 관찰되지 않아, 가상 스크롤 도입보다 입력 시 레이아웃 계산을 줄이는 데 집중했습니다.</li>
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
      <>
        <p className="pd-p">Python AI 런타임과 Kotlin, Spring 백엔드에서 Google Ads 조회 명세 검증과 사용자 승인 후 실행 기능을 구현했습니다.</p>
        <p className="pd-p">모델이 생성한 조회 요청을 검증하고, 사용자가 승인한 요청을 보관해 실행하는 부분을 담당했습니다.</p>
      </>
    ),
    tech: ['Python', 'Kotlin', 'Spring Boot', 'Amazon Bedrock AgentCore Runtime', 'Strands Agents', 'Google Ads API'],
    parts: [
      {
        title: 'Google Ads 조회 명세 검증',
        content: (
          <>
            <p className="pd-p">모델이 조회 항목과 조건을 만들고, 코드가 검증한 뒤 실행하도록 구성했습니다.</p>
            <p className="pd-p">기능별 조회 코드를 미리 작성하는 방식으로는 다양한 자연어 요청을 지원하기 어려웠습니다. 모델이 만드는 조회 명세는 조회할 리소스, 필드, 조건, 정렬과 개수를 담은 요청이고, 코드는 이 명세가 허용 범위 안에 있을 때만 쿼리를 조립합니다.</p>
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
            <p className="pd-p">지원 범위는 광고 설정과 구조 조회에 필요한 리소스 30종입니다. 성과 지표 조회와 구분하도록 AI 도구와 백엔드에서 허용 범위를 검사하고, 두 목록이 일치하는지 테스트합니다.</p>

            <ImplDetail fold>
              <li>API 규격뿐 아니라 실제 조회 메타데이터를 확인해 필드 지원 여부를 판단했습니다.</li>
              <li>모델에는 최대 50행의 미리보기와 결과 범위를 전달하고, 전체 건수와 묶음별 건수는 별도 경로로 집계했습니다.</li>
            </ImplDetail>
          </>
        ),
      },
      {
        title: '승인 요청 실행',
        content: (
          <>
            <p className="pd-p">승인한 요청을 다시 생성하지 않고, 보관한 내용 그대로 실행하도록 구성했습니다.</p>
            <p className="pd-p">모델이 승인 후 요청을 다시 구성하면 사용자가 확인한 내용과 실행 인자가 달라질 수 있었습니다. 검증한 요청을 ID와 함께 런타임에 보관하고, 백엔드는 사용자가 선택한 요청 ID만 전달하도록 했습니다. 실행 도구는 실행 인자를 받지 않고 해당 ID에 보관된 요청을 사용합니다.</p>
            <p className="pd-p">선택한 요청만 실행되는지와 보관한 요청이 한 번만 소비되는지를 테스트했습니다. 테스트한 범위는 런타임 내부 처리까지이고, Google Ads 쪽에서 작업이 정확히 한 번 반영되는지는 확인하지 않았습니다. 요청은 런타임 메모리에 보관하므로, 재시작으로 사라진 경우에는 실행하지 않고 만료를 안내합니다.</p>
          </>
        ),
      },
    ],
    notes: [
      {
        title: 'AI 에이전트 타임아웃 조정',
        body: '런타임 제한을 450초로 줄여 백엔드의 480초 타임아웃보다 먼저 끝나도록 조정했습니다. 기존에는 런타임이 최대 900초까지 실행돼, 사용자가 타임아웃 오류를 받은 뒤에도 답변이 대화 이력에 저장됐습니다. 조회 도구의 제한도 함께 줄이고, 구성 요소 간 시간 제한 관계를 검사하는 테스트를 추가했습니다.',
      },
    ],
  },
]
