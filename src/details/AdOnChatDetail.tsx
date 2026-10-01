import { Tag } from 'antd'
import DetailTabs from '../components/DetailTabs'
import FlowDiagram from '../components/FlowDiagram'
import ImplDetail from '../components/ImplDetail'
import WorkParts from '../components/WorkParts'

export default function AdOnChatDetail() {
  return (
    <>
      <div className="pd-meta">
        <Tag variant="filled">2026.05 – 현재</Tag>
        <Tag variant="filled">NHN AD</Tag>
        <Tag variant="filled">Frontend, Backend</Tag>
      </div>
      <p className="pd-catch">AI Agent 기반 검색광고 운영 솔루션</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션입니다. 백엔드를 중심으로 프론트엔드와 인프라까지 맡고 있습니다.</p>
      </div>

      <DetailTabs
        label="AdOnChat 상세 영역"
        tabs={[
          {
            key: 'be',
            label: 'Backend',
            content: (
              <>
                <div className="pd-block">
                  <h4>Tech</h4>
                  <div className="pd-tech"><Tag variant="filled">Kotlin</Tag><Tag variant="filled">Spring Boot</Tag><Tag variant="filled">JPA</Tag><Tag variant="filled">PostgreSQL</Tag><Tag variant="filled">DynamoDB</Tag><Tag variant="filled">AWS</Tag></div>
                </div>

                <div className="pd-block">
                  <h4>진행한 일</h4>
                  <WorkParts
                    parts={[
                      {
                        title: '동시성과 데이터 정합성',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 운영자 강등 시 최소 인원 보장</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>운영자 A와 B의 강등 요청이 동시에 실행되면, 각 트랜잭션이 상대를 운영자로 확인한 뒤 모두 성공해 운영자가 0명이 될 수 있었습니다. 두 트랜잭션이 서로 다른 행을 바꾸므로 기본 격리 수준으로는 막히지 않는 write skew입니다.</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>활성 운영자를 <code>PESSIMISTIC_WRITE</code>로 잠근 뒤 남은 인원을 확인해, 강등 요청을 순서대로 처리했습니다. 동시 처리량은 줄지만 운영자가 0명이 되는 경우는 생기지 않습니다.</p></div>
                              </div>
                              <ImplDetail>
                                <li>PostgreSQL은 <code>COUNT</code>와 <code>FOR UPDATE</code>를 함께 쓸 수 없어서, 대상 행을 먼저 잠근 뒤 개수를 셉니다.</li>
                                <li>잠금 순서를 <code>id</code> 순으로 통일해 교착 상태 위험을 줄였습니다.</li>
                                <li>일괄 강등에서는 같은 배치의 강등 대상까지 빼고 남는 운영자 수를 계산합니다.</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 인증정보 중복 등록 방지</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>"이미 등록했는지 조회한 뒤 등록"하면, 동시에 온 두 요청이 모두 "없음"을 읽고 통과할 수 있습니다(check-then-act 경쟁).</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>동시 등록은 DB 유니크 인덱스로 막고, 애플리케이션의 사전 조회는 오류 안내에만 사용했습니다.</p></div>
                              </div>
                              <ImplDetail>
                                <li>인덱스가 막은 동시 등록도 같은 409 오류로 바꿔 사용자에게 일관되게 보여 줍니다.</li>
                                <li>soft delete를 쓰기 때문에, 삭제되지 않은 행에만 적용되는 Partial Unique Index를 걸었습니다.</li>
                                <li>인증정보는 KMS로 암호화되어 매번 다른 암호문이 나오므로, 평문의 SHA-256 해시를 별도 컬럼에 저장하고 (회원, 매체, 해시)에 인덱스를 걸었습니다.</li>
                              </ImplDetail>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '트랜잭션과 실패 경계',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 감사로그의 원자성과 flush 문제</h5>
                              <div className="pd-ba stack">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>업무 데이터와 감사로그를 따로 저장하면, 변경은 성공했는데 기록은 남지 않는 상태가 생길 수 있습니다.</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>처음부터 업무 변경과 같은 트랜잭션에서 Outbox에 감사 이벤트를 저장하고, 스케줄러가 감사 테이블로 옮기도록 구성했습니다. 감사 이벤트는 업무 변경과 함께 커밋되거나 함께 롤백됩니다.</p><p>운영 중에는 일부 변경 이력이 빠지는 문제를 발견했습니다. 추적해 보니 JPA <code>@PreUpdate</code>가 flush 시점에 실행되면서, 이벤트가 <code>BEFORE_COMMIT</code> 처리보다 늦게 만들어지는 경로가 있었습니다. 특정 서비스에 <code>flush()</code>를 넣는 대신, <code>TransactionSynchronization.beforeCommit</code>에서 flush한 뒤 Outbox를 저장하도록 바꿔 모든 경로에 같은 순서를 적용했습니다.</p></div>
                              </div>
                              <FlowDiagram
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
                                  {
                                    label: '커밋 뒤: 스케줄러가 10초마다 옮깁니다',
                                    steps: [
                                      { title: 'Outbox 조회' },
                                      { title: '감사 테이블 적재', sub: <><code>ON CONFLICT DO NOTHING</code>으로 같은 이벤트는 한 번만</> },
                                      { title: 'Outbox 삭제' },
                                    ],
                                  },
                                ]}
                              />
                              <ImplDetail>
                                <li>옮기는 단계는 실패하면 다시 시도하므로 같은 이벤트가 두 번 들어올 수 있습니다. 감사 테이블의 <code>outbox_id</code>에 유니크 제약을 두고 <code>ON CONFLICT DO NOTHING</code>으로 적재해 멱등하게 만들었습니다.</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 회원 일괄 변경의 실패 경계</h5>
                              <div className="pd-ba stack">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>CSV로 회원 정보를 일괄 변경하고 결과 파일을 S3에 올립니다. 업로드를 트랜잭션 밖으로 빼자, DB 변경은 커밋됐는데 결과 파일만 실패한 상태가 생겼습니다. 이를 FAILED로 표시하면 이미 바뀐 데이터를 실패라고 잘못 알리게 됩니다.</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>DB 변경이 커밋된 상태를 <code>APPLIED</code>로 기록해 결과 파일 실패와 구분했습니다. 재처리 시 같은 값을 다시 적용하고 결과 파일을 생성하며, 값이 달라지지 않은 엔티티에는 UPDATE가 발생하지 않습니다.</p></div>
                              </div>
                              <ImplDetail>
                                <li>업로드를 트랜잭션 안에 두면 업로드가 끝날 때까지 DB 커넥션과 잠금을 붙잡고, 업로드가 실패하면 이미 끝난 회원 변경까지 롤백됩니다. 그래서 트랜잭션 밖으로 뺐습니다.</li>
                                <li>재처리는 CSV의 모든 행을 다시 적용합니다. JPA 변경 감지는 값이 같으면 UPDATE를 보내지 않으므로, 이미 적용된 행은 DB에 다시 쓰이지 않습니다.</li>
                              </ImplDetail>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: 'AI 에이전트 타임아웃과 후속 처리 개선',
                        content: (
                          <>
                            <div className="pd-ba stack">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>백엔드는 480초 뒤 타임아웃으로 응답하고 세션 잠금을 해제했지만, 에이전트 런타임은 최대 900초까지 실행됐습니다. 사용자는 오류를 받았는데 뒤늦게 생성된 답변은 대화 이력에 저장됐고, 이전 실행이 끝나기 전에 같은 세션의 새 요청이 들어올 수도 있었습니다.</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>런타임 제한을 450초, 조회 도구의 실행 예산을 390초로 줄여 백엔드 타임아웃 전에 처리를 마치도록 조정했습니다. 응답 반환에 30초, 모델 처리에 60초를 확보했으며, 모델 처리 시간은 실측값 47초를 참고했습니다.</p><p>각 구성 요소의 시간 제한 관계를 검증하는 테스트도 추가해, 설정 변경으로 같은 문제가 반복되지 않도록 했습니다.</p></div>
                            </div>
                            <ImplDetail>
                              <li>백엔드 설정값을 포함해 조회 도구, 런타임, 백엔드, SSE, 세션 잠금의 시간 제한 관계를 테스트합니다.</li>
                              <li>타임아웃 이후에도 실행 중인 Python 워커 스레드는 종료되지 않았습니다. 취소 플래그(<code>threading.Event</code>)를 추가하고 파일 등록 직전에 확인해, 시간 초과로 실패를 안내한 요청의 결과가 뒤늦게 등록되지 않도록 했습니다. 이미 시작된 쿼리와 S3 작업은 계속 실행됩니다.</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                    ]}
                  />
                </div>
              </>
            ),
          },
          {
            key: 'fe',
            label: 'Frontend',
            content: (
              <>
                <div className="pd-block">
                  <h4>Tech</h4>
                  <div className="pd-tech"><Tag variant="filled">React</Tag><Tag variant="filled">TypeScript</Tag><Tag variant="filled">Vite</Tag><Tag variant="filled">Ant Design</Tag><Tag variant="filled">TanStack Query</Tag></div>
                </div>

                <div className="pd-block">
                  <h4>진행한 일</h4>
                  <WorkParts
                    parts={[
                      {
                        title: '캐시와 데이터 갱신',
                        content: (
                          <>
                            <div className="pd-ba stack">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>서버의 값이 바뀌어도 화면에는 캐시된 목록이 남을 수 있습니다. 특히 연동할 광고계정을 고르는 목록이 낡으면, 사용자가 이미 다른 라이선스에 연동된 계정을 다시 고를 수 있습니다.</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>다른 라이선스에 연동된 계정을 다시 선택하지 않도록, 선택 목록은 캐시하지 않고 열 때마다 조회했습니다. 나머지 목록은 캐시를 쓰고, 아래 시점에 무효화합니다.</p>
                                <ul className="pd-sublist">
                                  <li>사용자가 저장하면 관련 캐시를 바로 무효화합니다. 광고계정을 등록하거나 삭제하면 서버에서 라이선스 정보도 함께 바뀌므로 라이선스 목록 캐시도 무효화합니다.</li>
                                  <li>매체 연동 상태처럼 서버가 갱신하는 값은, 이 값을 바꿀 수 있는 계정 조회 요청이 끝나면 성공 여부와 관계없이 목록 캐시를 무효화합니다.</li>
                                </ul>
                              </div>
                            </div>
                            <ImplDetail>
                              <li>연동 가능 계정, 로그인 ID 드롭다운, 트래커 후보 목록은 <code>staleTime</code> / <code>gcTime</code>을 0으로, <code>refetchOnMount</code>를 <code>'always'</code>로 두어 열 때마다 직전 캐시를 보여 주지 않고 새로 요청합니다.</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                      {
                        title: 'React 렌더링 오류 추적',
                        content: (
                          <>
                            <div className="pd-ba stack">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>즐겨찾기 필터를 바꾸면 이전 행이 화면에 남았고, 새로고침하면 정상으로 돌아왔습니다. 서버 데이터보다 렌더링 쪽 문제로 보고 확인해 보니, 한 광고계정이 여러 라이선스와 연결될 때 광고계정 ID가 행 key로 중복되고 있었습니다.</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>행 key를 행마다 고유한 연결 ID로 바꾸고, 화면에서 쓰는 ID와 삭제 API에 넘기는 ID를 분리했습니다. 행 key 규칙은 문서로 남겼습니다.</p></div>
                            </div>
                            <ImplDetail>
                              <li>행 key는 광고계정과 라이선스의 연결 ID(<code>licenseAccountId</code>)입니다. 삭제는 한 계정의 모든 라이선스 연결을 한 번에 해제하는 광고계정 단위라, 선택한 연결 ID를 광고계정 ID로 되돌리고 중복을 없앤 뒤 호출합니다.</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                      {
                        title: '로딩 UX와 체감 성능',
                        content: (
                          <>
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>응답이 빠를 때도 로딩 표시가 순간적으로 나타났다 사라지면서 화면이 깜빡이고 오히려 더 느리게 느껴졌습니다.</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>로딩이 200ms를 넘을 때만 스켈레톤을 보여 주고, 그 전에 응답하면 바로 내용을 보여 줍니다. 화면 전체를 기다리지 않고 준비된 영역부터 보여 줍니다.</p></div>
                            </div>
                            <ImplDetail>
                              <li>로딩이 200ms 넘게 이어질 때만 true가 되는 훅(<code>useDelayedFlag</code>)과 이를 감싼 <code>LoadingFade</code> 컴포넌트를 만들어, 설정 페이지, 목록 테이블, 채팅 메시지 이력에 적용했습니다.</li>
                              <li>상단 바, 사이드 메뉴, 본문은 각자 자기 데이터가 준비되는 즉시 전환합니다. 페이지를 옮길 때 이미 준비된 상단 바와 사이드 메뉴를 다시 스켈레톤으로 되돌리지 않습니다.</li>
                              <li>이름 길이 등에 따라 폭이 달라지는 영역(상단 바의 사용자 영역)은 부분 스켈레톤을 그리면 옆 아이콘이 밀려나므로, 스켈레톤 없이 완성된 뒤 한 번에 보여 줍니다.</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                    ]}
                  />
                  <p className="pd-note">캐시 무효화, 행 key, 로딩 표시 규칙은 FE 패턴 가이드로 정리했습니다.</p>
                </div>
              </>
            ),
          },
        ]}
      />
    </>
  )
}
