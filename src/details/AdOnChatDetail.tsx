import { ExportOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'
import DetailTabs from '../components/DetailTabs'
import ImplDetail from '../components/ImplDetail'
import WorkParts from '../components/WorkParts'

export default function AdOnChatDetail() {
  return (
    <>
      <div className="pd-meta">
        <Tag variant="filled">2026.05 – 현재</Tag>
        <Tag variant="filled">NHN AD</Tag>
        <Tag variant="filled">Frontend, Backend · 기여 20%</Tag>
      </div>
      <p className="pd-catch">AI Agent 기반 검색광고 운영 솔루션</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션입니다. 백엔드를 중심으로 프론트엔드와 인프라까지, 기능이 서비스되는 전 과정을 경험했습니다. 백엔드에서는 인증·인가, 매체 계정 관리, 대량 작업 처리, 감사로그, 운영 알림을 개발했고, 프론트엔드에서는 React·TypeScript로 화면을 개발했습니다. 인프라에서는 CI·배포 워크플로를 고치고, 메모리 부족(OOM)으로 멈춘 백엔드·배치 컨테이너가 그대로 남지 않고 종료되도록 설정했습니다.</p>
        <p className="pd-p">여러 서버와 사용자가 같은 데이터를 동시에 다루는 서비스라, 기능마다 <b>"이 기능이 반드시 지켜야 하는 것은 무엇인가"</b>를 먼저 정했습니다. 처리량·정합성·가용성 가운데 무엇을 우선하는지에 따라 잠금 방식과 트랜잭션 경계, 장애 때의 동작을 다르게 설계했습니다.</p>
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
                        title: '상황에 따라 다르게 적용한 동시성 제어',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. Worker의 중복 작업 선점</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>여러 서버의 Worker가 대기 작업을 동시에 조회하면서 <b>같은 작업을 중복 선점</b>하는 문제가 있었습니다. 반대로 작업 전체를 직렬화하면 Worker를 늘려도 처리량을 높일 수 없었습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>중복 선점은 막되 Worker 간 병렬성은 유지해야 한다</b>고 판단했습니다. <code>FOR UPDATE SKIP LOCKED</code>로 가져갈 행만 잠그고, 상태 변경(<code>IN_PROGRESS</code>)까지 한 트랜잭션으로 묶었습니다. 다른 Worker는 잠긴 행을 기다리지 않고 다음 작업을 가져가도록 했습니다</p></div>
                              </div>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 최소 한 명의 운영자를 지키는 동시성 제어</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>운영자 A와 B의 강등 요청이 동시에 실행되면, 각 트랜잭션이 상대를 운영자로 확인한 뒤 모두 성공해 <b>운영자가 0명</b>이 될 수 있었습니다. 두 트랜잭션이 서로 다른 행을 바꾸므로 기본 격리 수준으로는 막히지 않는 write skew입니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>이 기능은 <b>처리량보다 "운영자가 최소 한 명 남아야 한다"는 업무 규칙이 우선</b>이라고 판단했습니다. 활성 운영자를 <code>PESSIMISTIC_WRITE</code>로 잠근 뒤 남은 인원을 확인해, 강등 요청을 직렬화했습니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>PostgreSQL은 <code>COUNT</code>와 <code>FOR UPDATE</code>를 함께 쓸 수 없어서, 대상 행을 먼저 잠근 뒤 개수를 셉니다</li>
                                <li>잠금 순서를 <code>id</code> 순으로 통일해 교착 상태를 예방했습니다</li>
                                <li>일괄 강등에서는 같은 배치의 강등 대상까지 빼고 남는 운영자 수를 계산합니다</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>3. 인증정보 중복 등록 방지</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>"이미 등록했는지 조회한 뒤 등록"하면, 동시에 온 두 요청이 모두 "없음"을 읽고 통과할 수 있습니다(<b>check-then-act 경쟁</b>)</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>유일성의 최종 판정은 DB가 해야 한다</b>고 판단했습니다. 중복은 DB 유니크 인덱스가 막고, 애플리케이션의 사전 조회는 친절한 오류 안내를 위한 1차 검사로만 두었습니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>인덱스가 막은 동시 등록도 같은 409 오류로 바꿔 사용자에게 일관되게 보여 줍니다</li>
                                <li>삭제는 표시만 하는 방식(soft delete)이라, 삭제되지 않은 행에만 적용되는 <b>Partial Unique Index</b>로 유일성의 범위를 정했습니다</li>
                                <li>인증정보는 KMS로 암호화되어 매번 다른 암호문이 나오므로, 평문으로 만든 <b>결정적 SHA-256 지문</b>을 별도 컬럼에 두고 (회원, 매체, 지문)에 인덱스를 걸었습니다</li>
                              </ImplDetail>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '데이터와 기록의 일관성',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 감사로그까지 업무 변경의 일부로</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>업무 데이터와 감사로그를 따로 저장하면, 변경은 성공했는데 <b>기록은 남지 않는 상태</b>가 생길 수 있습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>감사로그도 업무 변경과 함께 성공하거나 함께 실패해야 하는 데이터</b>라고 판단했습니다. 초기 설계부터 같은 트랜잭션에서 Outbox를 저장하고, 스케줄러가 감사 테이블로 옮기도록 구성했습니다</p><p>운영 중에는 일부 변경 이력이 빠지는 문제를 발견했습니다. 추적해 보니 JPA <code>@PreUpdate</code>가 flush 시점에 실행되면서, 이벤트가 <code>BEFORE_COMMIT</code> 처리보다 늦게 만들어지는 경로가 있었습니다. 특정 서비스에 <code>flush()</code>를 넣는 대신 <code>TransactionSynchronization.beforeCommit</code>에서 flush한 뒤 Outbox를 저장하도록 바꿔, <b>모든 경로에서 같은 순서를 보장</b>했습니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>옮기는 단계는 실패하면 다시 시도하므로 같은 이벤트가 두 번 들어올 수 있습니다. 감사 테이블의 <code>outbox_id</code>에 유니크 제약을 두고 <code>ON CONFLICT DO NOTHING</code>으로 적재해 <b>멱등하게</b> 만들었습니다</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 회원 일괄 변경의 실패 경계</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>CSV로 회원 정보를 일괄 변경하고 결과 파일을 S3에 올립니다. 업로드를 트랜잭션 밖으로 빼자, <b>DB 변경은 커밋됐는데 결과 파일만 실패한 상태</b>가 생겼습니다. 이를 FAILED로 표시하면 이미 바뀐 데이터를 실패라고 잘못 알리게 됩니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>DB 변경의 성공과 결과 파일의 성공은 따로 기록해야 한다</b>고 판단했습니다. DB 변경이 커밋된 상태를 <code>APPLIED</code>로 기록해 실패 경계를 나눴고, 다시 처리해도 DB는 바뀌지 않고 결과 파일만 새로 만들어집니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>업로드를 트랜잭션 안에 두면 업로드가 끝날 때까지 DB 커넥션과 잠금을 붙잡고, 업로드가 실패하면 이미 끝난 회원 변경까지 롤백됩니다. 그래서 트랜잭션 밖으로 뺐습니다</li>
                                <li>APPLIED 작업을 다시 처리할 때는 모든 행을 다시 적용하지만, JPA 변경 감지는 값이 같으면 UPDATE를 보내지 않아 <b>재적용이 멱등</b>합니다</li>
                              </ImplDetail>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '장애 상황에서의 가용성과 안전성',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 여러 서버의 알림 단일 발송</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>에러 알림의 중복 억제를 서버 메모리에서 세면, 서버마다 따로 세서 <b>같은 알림이 중복으로 나갑니다</b></p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>발송 상태는 서버 밖 한곳에 두고, 발송은 한 서버만 맡아야 한다</b>고 판단했습니다. 발송 상태를 PostgreSQL 공유 테이블에 두고, 1초마다 잠금 행 하나를 <code>FOR UPDATE SKIP LOCKED</code>로 먼저 잡은 서버만 발송합니다. 발송 중인 서버가 죽으면 잠금이 풀려 다음 회차에 다른 서버가 이어받으므로, 메시지 브로커 없이 단일 발송자를 보장합니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>발송이 성공한 뒤에만 발송 상태를 앞으로 옮겨, 실패한 알림은 다음 회차에 다시 보냅니다(at-least-once). 같은 에러는 5분에 상세 1건만 보내고 나머지는 요약으로 묶었습니다</li>
                                <li>알림 루프가 조용히 멈추면 아무도 모르기 때문에, 루프의 주기 신호가 끊기면 CloudWatch가 경보하도록 설계해 인프라 담당자에게 요청했습니다</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 보안 기능의 fail-open과 fail-closed</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>보안 기능에도 장애가 납니다. IP 차단 저장소나 권한 규칙이 동작하지 않을 때 요청을 막을지 통과시킬지 미리 정해야 합니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>같은 장애라도 무엇을 보호하는지에 따라 실패 방향을 다르게 정했습니다</b>. IP 차단은 보조 방어선이고 인증은 뒤 단계에서 그대로 수행되므로, 차단 저장소 장애 때는 요청을 통과시킵니다(fail-open). 반대로 권한 규칙은 허용 목록에 없는 API를 모두 거부해, 새 API에 권한 설정을 빠뜨려도 열리지 않습니다(fail-closed)</p></div>
                              </div>
                              <ImplDetail>
                                <li>실패 횟수는 여러 서버가 동시에 올려도 값이 사라지지 않도록 DynamoDB의 <b>원자적 증가(ADD)</b>로 셉니다. 다만 "새 집계 구간인지" 판단은 읽은 뒤에 쓰는 방식이라 동시 요청에서 횟수가 조금 어긋날 수 있습니다. 목적이 무차별 대입 공격 완화라서, 완벽한 정합성보다 단순함을 택하고 이 한계를 코드에 기록했습니다</li>
                              </ImplDetail>
                              <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/56" target="_blank" rel="noopener">관련 글: RDBMS vs NoSQL, 동시성을 다루는 두 저장소의 철학 <ExportOutlined /></Typography.Link>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '48종 대량 작업의 공통 구조',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 작업 종류별 분기를 구현체로 분리</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>캠페인·광고그룹·키워드·소재 등 48종의 대량 작업은 CSV 형식·검증 방식·호출 API가 모두 달랐습니다. 한 Worker에서 종류별로 분기하면 작업을 추가할 때마다 <b>이미 동작하는 코드를 고쳐야</b> 했습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>작업마다 달라지는 부분만 구현체로 떼어 내야 한다</b>고 판단했습니다. 공통 계약 <code>BulkTask</code>를 두고 Dispatcher가 작업 종류로 구현체를 찾아 실행하게 해(Strategy), 새 작업은 구현체 하나만 추가하면 되는 구조를 만들었습니다(<b>개방-폐쇄 원칙</b>)</p></div>
                              </div>
                              <ImplDetail>
                                <li>행 단위 처리의 공통 흐름은 인터페이스의 기본 메서드로 두어, 단건 API 작업은 행 처리만, 일괄 API 작업은 묶음 처리만 구현합니다</li>
                                <li><code>sealed interface</code>로 작업 갈래를 닫아 두어, 분기에서 빠진 경우가 있으면 컴파일러가 알려 줍니다</li>
                              </ImplDetail>
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
                    <div className="pd-tags"><span>#동시성</span><span>#무엇을_보호하는가</span></div>
                    <p>처음에는 동시성 문제를 모두 "락을 걸면 된다"고 생각했습니다. 하지만 작업 선점은 처리량을 유지하면서 한 번만 가져오는 문제였고, 운영자 강등은 여러 행에 걸친 업무 규칙이었고, 중복 등록은 조회와 삽입 사이의 경쟁이었습니다. 같은 동시성 문제라도 보호할 대상이 다르다는 것을 알게 됐고, 이후에는 <b>기술부터 고르기보다 무엇을 지켜야 하는지 먼저 정의한 뒤 락·격리 수준·DB 제약을 선택</b>하고 있습니다.</p>
                  </div>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#원자성</span><span>#원인_추적</span></div>
                    <p>원자성을 보장하도록 처음부터 설계한 감사로그에서도, 운영 중에 로그가 빠지는 경로가 나왔습니다. 특정 서비스에 <code>flush()</code> 한 줄을 넣으면 당장 사라지는 문제였지만, 그렇게 하면 다른 변경 경로에서 다시 생깁니다. JPA가 언제 SQL을 보내는지, 트랜잭션이 커밋 전에 어떤 순서로 콜백을 부르는지까지 따라가서 구조를 바꿨습니다. <b>증상을 없애는 것과 원인을 없애는 것은 다르며, 원인은 개념을 정확히 알 때 보인다</b>는 것을 배웠습니다.</p>
                  </div>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#트레이드오프</span><span>#가용성</span></div>
                    <p>IP 차단 카운터는 완벽히 원자적이지 않고, 차단 저장소 장애 때는 요청을 통과시킵니다. 둘 다 약점처럼 보이지만, 기능의 목적과 뒤에 있는 방어선을 따져 보고 고른 선택입니다. <b>정답을 고르는 것보다, 무엇을 양보했는지 알고 그 이유를 설명할 수 있는 것이 설계</b>라는 것을 배웠습니다.</p>
                  </div>
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
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>서버의 값이 바뀌어도 화면에는 캐시된 목록이 남을 수 있습니다. 특히 연동할 광고계정을 고르는 목록이 낡으면, 사용자가 <b>이미 다른 라이선스에 연동된 계정을 다시 고를 수</b> 있습니다</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>기준을 "캐시를 쓸 수 있는가"가 아니라 <b>"이 데이터가 낡았을 때 사용자의 다음 행동이 잘못될 수 있는가"</b>로 두고 목록마다 갱신 방식을 정했습니다</p>
                                <ul className="pd-sublist">
                                  <li>낡으면 잘못된 선택으로 이어지는 목록은 캐시하지 않고 열 때마다 새로 조회합니다</li>
                                  <li>사용자가 직접 만든 변경은 저장 직후 관련 캐시를 무효화합니다. 범위는 호출한 API 하나가 아니라 <b>서버에서 함께 바뀐 사실</b>로 정해, 광고계정을 등록·삭제하면 라이선스 목록까지 함께 무효화합니다</li>
                                  <li>서버가 스스로 바꾸는 상태(매체 연동 상태 등)는, 백엔드가 그 상태를 바꿀 수 있는 계정 조회 뒤에 성공·실패와 관계없이 목록 캐시를 무효화합니다</li>
                                </ul>
                              </div>
                            </div>
                            <ImplDetail>
                              <li>연동 가능 계정·로그인 ID 드롭다운·트래커 후보 목록은 <code>staleTime</code>·<code>gcTime</code>을 0으로, <code>refetchOnMount</code>를 <code>'always'</code>로 두어 열 때마다 직전 캐시를 보여 주지 않고 새로 요청합니다</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                      {
                        title: 'React 렌더링 오류 추적',
                        content: (
                          <>
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>즐겨찾기 필터를 바꾸면 이전 행이 화면에 남았고, 새로고침하면 정상으로 돌아왔습니다. 새로고침하면 사라진다는 점을 단서로 서버 데이터뿐 아니라 <b>렌더링 과정까지 추적</b>했고, 한 광고계정이 여러 라이선스와 연결되면서 광고계정 ID가 <b>행 key로 중복</b>되고 있음을 찾았습니다</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>행 key는 행마다 유일해야 하므로, 행마다 고유한 연결 ID를 key로 쓰고 <b>화면에서 행을 식별하는 ID와 삭제 API에 넘기는 ID를 분리</b>했습니다. 같은 문제가 반복되지 않도록 행 key 규칙을 문서로 남겼습니다</p></div>
                            </div>
                            <ImplDetail>
                              <li>행 key는 광고계정과 라이선스의 연결 ID(<code>licenseAccountId</code>)입니다. 삭제는 한 계정의 모든 라이선스 연결을 한 번에 해제하는 광고계정 단위라, 선택한 연결 ID를 광고계정 ID로 되돌리고 중복을 없앤 뒤 호출합니다</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                      {
                        title: '로딩 UX와 체감 성능',
                        content: (
                          <>
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>응답이 빠를 때도 로딩 표시가 순간적으로 나타났다 사라지면서, <b>화면이 깜빡이고 오히려 더 느리게 느껴졌습니다</b></p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p><b>로딩 표시를 보여 주는 것이 항상 친절하지는 않다</b>고 판단했습니다. 로딩이 200ms를 넘을 때만 자리표시를 보여 주고, 그 전에 응답하면 바로 내용을 보여 줍니다. 화면 전체를 기다리지 않고 준비된 영역부터 보여 줍니다</p></div>
                            </div>
                            <ImplDetail>
                              <li>로딩이 200ms 넘게 이어질 때만 참이 되는 훅(<code>useDelayedFlag</code>)과 이를 감싼 <code>LoadingFade</code> 컴포넌트를 만들어, 설정 페이지·목록 테이블·채팅 메시지 이력에 적용했습니다</li>
                              <li>상단 바·사이드 메뉴·본문은 각자 자기 데이터가 준비되는 즉시 전환합니다. 페이지를 옮길 때 이미 준비된 상단 바와 사이드 메뉴를 다시 자리표시로 되돌리지 않습니다</li>
                              <li>이름 길이 등에 따라 폭이 달라지는 영역(상단 바의 사용자 영역)은 부분 자리표시를 그리면 옆 아이콘이 밀려나므로, 자리표시 없이 완성된 뒤 한 번에 보여 줍니다</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                    ]}
                  />
                </div>

                <div className="pd-block">
                  <h4>팀의 기준으로 만들기</h4>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#문서화</span><span>#팀_기준</span></div>
                    <p>캐시 무효화·행 key·로딩 표현처럼 반복되는 판단을 FE 패턴 가이드로 문서화했습니다. 이 가이드를 AI 코딩 도구가 FE 작업을 시작할 때 자동으로 읽는 파일에 두어, 사람과 AI가 같은 기준으로 코드를 쓰고 리뷰하게 했습니다. <b>코드는 한 번의 판단을 담고, 문서는 반복되는 판단을 담는다</b>는 것을 배웠습니다.</p>
                  </div>
                </div>

                <div className="pd-block">
                  <h4>성장한 점</h4>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#사용자_경험</span><span>#관점_변화</span></div>
                    <p>프론트엔드를 처음 개발할 때는 API의 데이터를 정확히 보여 주는 것이 가장 중요하다고 생각했습니다. 하지만 직접 화면을 만들면서, 데이터가 같아도 언제 갱신하고 어떤 상태를 보여 주는지에 따라 사용자의 판단과 체감이 달라진다는 것을 배웠습니다. 이후에는 <b>화면을 백엔드의 결과를 보여 주는 곳이 아니라, 사용자가 서비스를 경험하는 과정의 일부</b>로 보고 개발하고 있습니다.</p>
                  </div>
                </div>
              </>
            ),
          },
        ]}
      />
    </>
  )
}
