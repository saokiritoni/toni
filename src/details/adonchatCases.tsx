import type { ReactNode } from 'react'
import FlowDiagram from '../components/FlowDiagram'
import ImplDetail from '../components/ImplDetail'

export type CasePart = { title: string; content: ReactNode }
export type CaseGroup = {
  key: string
  label: string
  tech: string[]
  /** 목차에 오르는 사례. 대표 사례는 자세히, 나머지는 짧게 쓴다 */
  parts: CasePart[]
  /** 묶음 소개. 기술 목록 위에 둔다 */
  intro?: ReactNode
  /** 목차에 오르지 않는 짧은 보조 경험. 묶음 맨 끝에 둔다 */
  more?: CasePart
}

/** AdOnChat 상세 페이지 본문 소개. 카드의 overview 보다 한 문장 더 쓴다 */
export const ADONCHAT_OVERVIEW = '광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션입니다. 백엔드를 중심으로 프론트엔드와 인프라까지 맡고 있습니다.'

/**
 * AdOnChat 상세 페이지(src/pages/AdOnChatPage.tsx)의 사례. 묶음(Backend, Frontend, AI Agent)마다 기술과 사례 목록을 둔다.
 * 페이지 왼쪽 목차가 이 순서대로 만들어진다. 묶음마다 대표 사례 한두 개만 자세히 쓰고, 구현 근거는 접어 둔다.
 */
export const ADONCHAT_GROUPS: CaseGroup[] = [
  {
    key: 'be',
    label: 'Backend',
    tech: ['Kotlin', 'Spring Boot', 'JPA', 'PostgreSQL', 'DynamoDB', 'AWS'],
    parts: [
      {
        title: '감사로그와 트랜잭션',
        content: (
          <>
            <div className="pd-work-item">
              <h5>1. 감사로그 누락 원인 추적과 개선</h5>
              <div className="pd-ba stack">
                <div className="ba-col problem"><span className="ba-label">문제</span><p>업무 데이터와 감사로그를 따로 저장하면, 변경은 성공했는데 기록은 남지 않는 상태가 생길 수 있습니다.</p></div>
                <div className="ba-col after"><span className="ba-label">해결</span><p>처음부터 업무 변경과 같은 트랜잭션에서 Outbox에 감사 이벤트를 저장하고, 스케줄러가 감사 테이블로 옮기도록 구성했습니다. 감사 이벤트는 업무 변경과 함께 커밋되거나 함께 롤백됩니다.</p><p>운영 중에는 일부 변경 이력이 빠지는 문제를 발견했습니다. 추적해 보니 JPA <code>@PreUpdate</code>가 flush 시점에 실행되면서, 이벤트가 <code>BEFORE_COMMIT</code> 처리보다 늦게 만들어지는 경로가 있었습니다. 특정 서비스에 <code>flush()</code>를 넣는 대신, <code>TransactionSynchronization.beforeCommit</code>에서 flush한 뒤 Outbox를 저장하도록 바꿔 모든 경로에 같은 순서를 적용했습니다.</p></div>
              </div>
              <FlowDiagram
                variant="timeline"
                label="감사로그가 Outbox를 거쳐 감사 테이블에 쌓이는 순서"
                lanes={[
                  {
                    label: '고치기 전: 커밋 직전 리스너(BEFORE_COMMIT)가 이벤트를 모읍니다',
                    steps: [
                      { title: '업무 엔티티 변경', sub: '뒤에 쿼리가 없어 flush가 미뤄짐' },
                      { title: 'BEFORE_COMMIT 리스너', sub: '아직 이벤트가 없어 Outbox에 저장할 것이 없음' },
                      { title: '커밋 시점 flush', sub: <><code>@PreUpdate</code>가 이제야 이벤트를 만듦</>, tone: 'miss' },
                      { title: '커밋', sub: '감사로그 없이 업무 변경만 저장', tone: 'miss' },
                    ],
                  },
                  {
                    label: '고친 뒤: 커밋 직전(beforeCommit)에 먼저 flush 합니다',
                    steps: [
                      { title: '업무 엔티티 변경' },
                      { title: 'beforeCommit에서 flush', sub: <><code>@PreUpdate</code>가 이벤트를 만듦</>, tone: 'key' },
                      { title: 'Outbox 저장', sub: '모인 이벤트를 같은 트랜잭션에서 저장' },
                      { title: '커밋', sub: '업무 변경과 Outbox를 함께 저장', tone: 'key' },
                    ],
                  },
                ]}
              />
              <ImplDetail fold>
                <li>옮기는 단계는 실패하면 다시 시도하므로 같은 이벤트가 두 번 들어올 수 있습니다. 감사 테이블의 <code>outbox_id</code>에 유니크 제약을 두고 <code>ON CONFLICT DO NOTHING</code>으로 적재해 멱등하게 만들었습니다.</li>
              </ImplDetail>
            </div>
            <div className="pd-work-item">
              <h5>2. 회원 일괄 변경의 실패 경계</h5>
              <p className="pd-p">CSV로 회원 정보를 일괄 변경한 뒤 결과 파일을 S3에 올립니다. 업로드를 트랜잭션 밖으로 빼자 DB 변경은 커밋됐는데 결과 파일만 실패한 상태가 생겼고, 이를 FAILED로 표시하면 이미 바뀐 데이터를 실패라고 알리게 됩니다. DB 변경이 커밋된 상태를 <code>APPLIED</code>로 기록해 결과 파일 실패와 구분했습니다.</p>
              <ImplDetail fold>
                <li>업로드를 트랜잭션 안에 두면 업로드가 끝날 때까지 DB 커넥션과 잠금을 붙잡고, 업로드가 실패하면 이미 끝난 회원 변경까지 롤백됩니다. 그래서 트랜잭션 밖으로 뺐습니다.</li>
                <li>재처리 시 같은 값을 다시 적용하고 결과 파일을 생성하며, 값이 달라지지 않은 엔티티에는 UPDATE가 발생하지 않습니다.</li>
                <li>재처리는 CSV의 모든 행을 다시 적용합니다. JPA 변경 감지는 값이 같으면 UPDATE를 보내지 않으므로, 이미 적용된 행은 DB에 다시 쓰이지 않습니다.</li>
              </ImplDetail>
            </div>
          </>
        ),
      },
      {
        title: '동시성과 데이터 정합성',
        content: (
          <>
            <div className="pd-work-item">
              <h5>1. 운영자 강등 시 최소 인원 보장</h5>
              <p className="pd-p">운영자 A와 B의 강등 요청이 동시에 실행되면, 각 트랜잭션이 상대를 운영자로 확인한 뒤 모두 성공해 운영자가 0명이 될 수 있었습니다. 두 트랜잭션이 서로 다른 행을 바꾸므로 기본 격리 수준으로는 막히지 않는 write skew입니다. 활성 운영자를 <code>PESSIMISTIC_WRITE</code>로 잠근 뒤 남은 인원을 확인해 강등 요청을 순서대로 처리했고, 동시 처리량은 줄지만 운영자가 0명이 되는 경우는 생기지 않습니다.</p>
              <ImplDetail fold>
                <li>PostgreSQL은 <code>COUNT</code>와 <code>FOR UPDATE</code>를 함께 쓸 수 없어서, 대상 행을 먼저 잠근 뒤 개수를 셉니다.</li>
                <li>잠금 순서를 <code>id</code> 순으로 통일해 교착 상태 위험을 줄였습니다.</li>
                <li>일괄 강등에서는 같은 배치의 강등 대상까지 빼고 남는 운영자 수를 계산합니다.</li>
              </ImplDetail>
            </div>
            <div className="pd-work-item">
              <h5>2. 인증정보 중복 등록 방지</h5>
              <p className="pd-p">"이미 등록했는지 조회한 뒤 등록"하면, 동시에 온 두 요청이 모두 "없음"을 읽고 통과할 수 있습니다(check-then-act 경쟁). 동시 등록은 DB 유니크 인덱스로 막고, 애플리케이션의 사전 조회는 오류 안내에만 사용했습니다.</p>
              <ImplDetail fold>
                <li>인덱스가 막은 동시 등록도 같은 409 오류로 바꿔 사용자에게 일관되게 보여 줍니다.</li>
                <li>soft delete를 쓰기 때문에, 삭제되지 않은 행에만 적용되는 Partial Unique Index를 걸었습니다.</li>
                <li>인증정보는 KMS로 암호화되어 매번 다른 암호문이 나오므로, 평문의 SHA-256 해시를 별도 컬럼에 저장하고 (회원, 매체, 해시)에 인덱스를 걸었습니다.</li>
              </ImplDetail>
            </div>
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
              <div><dt>진입 측정</dt><dd>최신 메시지 표시와 초기 API 응답 크기. 메시지가 200개 이상인 같은 채팅에서 브라우저 캐시를 끄고, 조회 요청부터 최신 메시지 첫 페인트까지 측정했습니다. 최신 메시지 표시의 개선 후 값은 3회 측정의 중앙값입니다.</dd></div>
              <div><dt>입력 측정</dt><dd>타이핑 롱태스크. 이전 기록까지 모두 불러와 전체 메시지가 200개 이상인 상태에서, CPU 4배 제한을 적용하고 26글자를 입력했습니다.</dd></div>
            </dl>

            <h6 className="pd-sub-h">문제</h6>
            <p className="pd-p">메시지가 많이 쌓인 채팅에 들어가면 화면이 위에서부터 끊기며 내려간 뒤 최신 메시지가 보였습니다. 메시지가 200개 이상인 채팅에서 조회 요청부터 최신 메시지가 표시되기까지 3.58초가 걸린 반면 API 응답은 85ms여서, 응답 이후 브라우저의 렌더링 과정을 먼저 분석했습니다.</p>

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
              <li>단계별 측정값: 1단계 뒤 진입 중 말풍선 반복 렌더링은 약 20회에서 0회로, 최신 메시지 표시는 3.58초에서 0.65초로 줄었습니다. 2단계 뒤 첫 렌더는 511ms에서 117ms로 줄었습니다.</li>
              <li>Chrome Performance 기록과 Playwright로 진입, 타이핑, 스크롤을 측정했고, 배포한 뒤에도 같은 시나리오로 다시 확인했습니다.</li>
              <li>이전 메시지를 앞에 붙일 때 애플리케이션의 스크롤 보정과 Chrome의 스크롤 앵커링이 두 번 겹쳐 적용되는 문제도 발견했습니다. 보던 메시지가 실제로 움직인 만큼만 보정하도록 고쳤습니다.</li>
              <li>가상 스크롤도 검토했지만, 메시지 200개 이상을 모두 불러온 상태에서도 스크롤 중 롱태스크는 관찰되지 않았습니다. 그래서 남은 병목인 타이핑 시 레이아웃 계산을 줄이는 방식을 골랐습니다.</li>
            </ImplDetail>
          </>
        ),
      },
    ],
    more: {
      title: '그 밖의 화면 개선',
      content: (
        <ul className="pd-sublist">
          <li>광고계정 선택 목록은 열 때마다 새로 조회하고, 광고계정을 등록하거나 삭제하면 관련 라이선스 캐시도 갱신했습니다.</li>
          <li>라이선스 연결 ID를 행 key로 사용해, 필터를 바꾼 뒤 이전 행이 남는 오류를 고쳤습니다.</li>
          <li>로딩이 200ms를 넘을 때만 스켈레톤을 표시하고, 준비된 화면 영역부터 보여 주도록 바꿨습니다.</li>
        </ul>
      ),
    },
  },
  {
    key: 'ai',
    label: 'AI Agent',
    intro: (
      <>
        <p className="pd-p">Python 기반 AI 런타임과 Kotlin, Spring 백엔드에서 Google Ads 조회 기능과 공통 승인 실행 구조를 구현했습니다. 선택한 광고 매체에 맞춰 도구와 지시문을 구성하고, 모델이 만든 조회 명세를 코드로 검증한 뒤 실행하도록 설계했습니다.</p>
        <p className="pd-p">백엔드에서 선택 계정의 매체를 런타임에 전달하고, 같은 매체 판정 기준으로 도구 목록과 지시문을 선택하도록 구성했습니다. 지시문 조립본에 사용할 수 없는 도구 이름이 포함되면 테스트가 실패하도록 했습니다.</p>
      </>
    ),
    tech: ['Python', 'Kotlin', 'Spring Boot', 'Amazon Bedrock AgentCore Runtime', 'Strands Agents', 'Google Ads API'],
    parts: [
      {
        title: 'Google Ads 조회 명세 검증',
        content: (
          <>
            <h6 className="pd-sub-h">배경</h6>
            <p className="pd-p">기능별로 조회 코드를 추가하는 방식에서는 사용자가 요청할 수 있는 항목이 미리 구현한 범위로 제한됐습니다. Google Ads의 광고 설정과 구조 데이터를 다양한 조건으로 조회할 수 있도록, 모델은 조회 명세를 만들고 코드가 이를 검증해 쿼리를 조립하는 방식으로 구현했습니다.</p>

            <h6 className="pd-sub-h">구현</h6>
            <p className="pd-p">모델은 대상 리소스, 조회 항목, 조건, 정렬과 개수 등의 명세를 전달합니다. 검증 계층에서 필드와 허용 범위를 확인하고, 통과한 명세로 쿼리를 만듭니다.</p>
            <FlowDiagram
              label="조회 명세가 검증을 거쳐 쿼리로 조립되고 실행되는 순서"
              lanes={[
                {
                  label: '조회 명세 검증 → 쿼리 조립 → 실행',
                  steps: [
                    { title: '조회 명세', sub: '모델이 리소스, 항목, 조건, 정렬과 개수를 전달' },
                    { title: '검증', sub: '필드와 허용 범위 확인', tone: 'key' },
                    { title: '쿼리 조립', sub: '통과한 명세로만 쿼리 생성' },
                    { title: '실행', sub: '모델에는 미리보기와 열별 요약 전달' },
                  ],
                  loop: { from: 1, to: 0, label: '통과하지 못하면 항목별 사유를 모델에 돌려줘 명세를 고치게 함' },
                },
              ]}
            />
            <p className="pd-p">광고 설정과 구조 조회에 허용한 리소스 30종을 대상으로 하며, 노출, 클릭, 비용 같은 성과 지표가 섞이지 않도록 AI 도구와 백엔드 양쪽에서 범위를 확인합니다. 두 곳의 허용 목록이 일치하는지도 테스트합니다.</p>
            <p className="pd-p">API 규격에서 생성한 카탈로그, 실제 API로 확인한 메타데이터, 수동 보정값은 구분해 관리했습니다. 규격에 정의된 필드라도 조회 메타데이터에서 확인되지 않는 경우가 있어, 규격만으로 조회 가능 여부를 판단하지 않았습니다.</p>

            <h6 className="pd-sub-h">확인한 결과</h6>
            <p className="pd-p">반응형 검색광고의 제목과 설명 연결 정보를 조회하는 요청을 지원 범위에 추가할 때, 별도 기능별 클라이언트를 작성하지 않고 리소스 목록과 조회 계획 코드를 확장했습니다. 이 시나리오는 개발 서버 재테스트에서 통과했습니다.</p>

            <ImplDetail fold>
              <li>조회 명세가 잘못되면 항목별 사유를 모델에 반환해 수정할 수 있게 했습니다.</li>
              <li>모델에 전달하는 결과는 미리보기 50행과 열별 요약으로 제한했습니다. 미리보기만으로 전체 데이터를 단정하지 않도록 결과 범위도 함께 전달했습니다.</li>
              <li>전체 건수와 묶음별 개수는 미리보기에서 추론하지 않고 별도 집계 경로로 처리했습니다.</li>
            </ImplDetail>
          </>
        ),
      },
      {
        title: '승인 요청 실행',
        content: (
          <>
            <h6 className="pd-sub-h">배경</h6>
            <p className="pd-p">사용자가 승인 카드를 누른 뒤 모델이 요청을 다시 구성해 실행하면, 승인한 내용과 실행 인자가 달라질 수 있었습니다.</p>

            <h6 className="pd-sub-h">구현</h6>
            <p className="pd-p">검증을 마친 실행 내용을 요청 ID와 함께 런타임에 보관하고, 백엔드가 사용자의 승인 여부와 선택한 요청 ID를 전달하도록 했습니다.</p>
            <p className="pd-p">공통 실행 도구는 별도 실행 인자를 받지 않고, 선택된 요청의 보관본을 꺼내 실행합니다. 모델이 승인 이후 실행 내용을 다시 구성하는 경로를 없앴습니다.</p>
            <FlowDiagram
              variant="numbered"
              label="승인 대상을 보관하고 사용자가 고른 요청의 보관본만 실행하는 순서"
              lanes={[
                {
                  label: '승인 대상 보관 → 사용자 선택 → 보관본 실행',
                  steps: [
                    { actor: 'AI 런타임', title: '승인 대상 보관', sub: '검증을 마친 실행 내용을 요청 ID와 함께 보관' },
                    { actor: '사용자, 백엔드', title: '사용자 선택', sub: '한 카드에서 체크한 요청 ID를 백엔드가 전달' },
                    { actor: '공통 실행 도구', title: '보관본 실행', sub: '실행 인자 없이 보관본을 꺼내 실행', tone: 'key' },
                  ],
                },
              ]}
            />
            <p className="pd-p">여러 요청은 하나의 카드에 모으고, 사용자가 체크한 요청만 실행하도록 연결했습니다.</p>

            <h6 className="pd-sub-h">맡은 부분과 검증</h6>
            <p className="pd-p">요청 묶음 보관, 공통 실행기, 백엔드의 선택 요청 전달과 Google Ads 연결을 맡았습니다.</p>
            <p className="pd-p">보관한 요청이 실행되는지, 선택하지 않은 요청이 제외되는지, 런타임 보관본이 한 번만 소비되는지를 테스트했습니다. 개발 서버에서는 브라우저 자동화로 묶음 카드와 요청 선택, 결과 표시를 확인했습니다.</p>

            <ImplDetail fold>
              <li>실행 요청은 런타임 프로세스 메모리에 보관합니다. 재시작 등으로 보관본이 사라진 경우에는 실행하지 않고 만료를 안내합니다.</li>
            </ImplDetail>
          </>
        ),
      },
    ],
    more: {
      title: 'AI 에이전트 타임아웃 조정',
      content: (
        <>
          <p className="pd-p">백엔드는 480초 뒤 타임아웃으로 응답하고 세션 잠금을 해제했지만, 에이전트 런타임은 최대 900초까지 실행돼 사용자가 오류를 받은 뒤에도 답변이 대화 이력에 저장됐습니다. 런타임 제한을 450초, 조회 도구의 실행 예산을 390초로 줄여 백엔드 타임아웃 전에 처리를 마치도록 조정하고, 각 구성 요소의 시간 제한 관계를 테스트로 확인하게 했습니다.</p>
          <ImplDetail fold>
            <li>응답 반환에 30초, 모델 처리에 60초를 확보했으며, 모델 처리 시간은 실측값 47초를 참고했습니다.</li>
            <li>이전 실행이 끝나기 전에 같은 세션의 새 요청이 들어올 수도 있었습니다. 테스트는 백엔드 설정값을 포함해 조회 도구, 런타임, 백엔드, SSE, 세션 잠금의 시간 제한 관계를 확인합니다.</li>
            <li>타임아웃 이후에도 실행 중인 Python 워커 스레드는 종료되지 않았습니다. 취소 플래그(<code>threading.Event</code>)를 추가하고 파일 등록 직전에 확인해, 시간 초과로 실패를 안내한 요청의 결과가 뒤늦게 등록되지 않도록 했습니다. 이미 시작된 쿼리와 S3 작업은 계속 실행됩니다.</li>
          </ImplDetail>
        </>
      ),
    },
  },
]
