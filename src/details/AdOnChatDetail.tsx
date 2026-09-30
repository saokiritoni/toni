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
                        title: '동시에 실행되어도 데이터가 깨지지 않도록',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 여러 Worker가 같은 작업을 가져가지 않도록</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>여러 서버의 Worker가 대기 중인 작업을 조회한 뒤 상태를 바꿨습니다. 조회와 변경 사이에 틈이 있으면 두 Worker가 같은 작업을 읽고 <b>둘 다 처리</b>합니다. 처음 구현에서는 상태 변경이 커밋되기 전에 다음 조회가 같은 작업을 다시 가져가는 문제가 실제로 있었습니다. 그렇다고 작업 전체를 한 줄로 세우면 Worker를 늘려도 처리량이 늘지 않습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>한 작업은 한 번만 선점하되, Worker끼리는 서로 막지 않아야 한다</b>고 판단했습니다. <code>FOR UPDATE SKIP LOCKED</code>로 가져갈 행만 잠그고, 잠금과 상태 변경(<code>IN_PROGRESS</code>)을 한 트랜잭션에서 커밋했습니다. 잠긴 행은 기다리지 않고 건너뛰므로 Worker를 늘려도 병렬로 처리합니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>선점 로직을 작업 처리 로직과 분리해, 선점 트랜잭션이 상태를 바꾼 채로 커밋되게 했습니다. 커밋 시점에는 이미 상태가 <code>IN_PROGRESS</code>이므로, 잠금이 풀린 뒤에도 다른 Worker가 같은 행을 다시 가져가지 않습니다</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 운영자가 최소 한 명은 남도록</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>"운영자는 최소 한 명 남아야 한다"는 규칙은 행 하나가 아니라 운영자 전체에 걸린 규칙입니다. 운영자 A와 B를 강등하는 요청이 동시에 오면, 각 트랜잭션은 상대가 아직 운영자라고 읽고 둘 다 성공해 운영자가 0명이 됩니다. 두 트랜잭션이 서로 다른 행을 바꾸기 때문에 기본 격리 수준(Read Committed)으로는 막히지 않는 <b>write skew</b>입니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>이 기능은 처리량보다 업무 규칙을 지키는 것이 우선</b>이라고 판단했습니다. 강등 전에 활성 운영자 행 전체를 <code>PESSIMISTIC_WRITE</code>로 잠가, 동시에 온 강등 요청을 하나씩 차례로 처리하도록 <b>직렬화</b>했습니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>PostgreSQL은 <code>COUNT</code>와 <code>FOR UPDATE</code>를 함께 쓸 수 없어서, 행을 먼저 잠근 뒤 개수를 셉니다</li>
                                <li>잠금 순서를 <code>id</code> 순으로 통일해, 두 트랜잭션이 서로의 잠금을 기다리는 <b>교착 상태를 예방</b>했습니다</li>
                                <li>일괄 강등에서는 같은 배치의 강등 대상을 빼고 남는 인원을 계산합니다</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>3. 같은 인증정보가 두 번 등록되지 않도록</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>"이미 등록했는지 조회한 뒤 등록"하는 방식은, 동시에 온 요청 두 개가 모두 "없음"을 읽고 통과할 수 있습니다(<b>check-then-act 경쟁</b>)</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>유일성의 최종 판정은 원자적으로 동작하는 DB가 해야 한다</b>고 판단했습니다. 중복 여부는 <b>DB 유니크 인덱스</b>가 판정하고, 애플리케이션의 사전 조회는 빠르고 친절한 오류를 위한 1차 검사로만 둡니다. 인덱스가 막은 동시 등록도 같은 409 오류로 바꿔 사용자에게 일관되게 보여 줍니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>삭제는 행을 지우지 않고 표시만 하는 방식(soft delete)이라, 모든 행에 유니크를 걸면 삭제한 계정을 다시 등록할 수 없습니다. 삭제되지 않은 행에만 적용되는 <b>Partial Unique Index</b>로 유일성의 범위를 정했습니다</li>
                                <li>인증정보는 KMS로 암호화 저장되어 매번 다른 암호문이 나오므로 암호문으로는 중복을 비교할 수 없습니다. 평문으로 만든 <b>결정적 SHA-256 지문</b>을 별도 컬럼에 두고, (회원, 매체, 지문)에 Partial Unique Index를 걸어 DB가 중복 등록을 막습니다</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>4. 동시에 온 토큰 갱신 요청 중 하나만 성공하도록</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>토큰 갱신 요청 두 개가 동시에 오면 둘 다 성공한 뒤, 다음 요청에서 세션이 깨질 수 있습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>두 요청 가운데 먼저 저장한 한쪽만 인정하면 된다</b>고 판단했습니다. "저장된 갱신 토큰 ID가 내가 알던 값일 때만 저장"하는 <b>조건부 쓰기(낙관적 동시성 제어)</b>로 한쪽만 성공하게 했습니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>한 계정은 한 곳에서만 로그인되도록, 새로 로그인하면 기존 세션을 지우는 방식(Last-Write-Wins)으로 동시 로그인을 막았습니다. 밀려난 쪽에는 "다른 기기에서 로그인되어 로그아웃되었습니다"를 안내합니다</li>
                                <li>세션은 DynamoDB TTL로 로그인·갱신 후 4시간이 지나면 자동으로 만료됩니다</li>
                              </ImplDetail>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '실패해도 데이터와 기록이 어긋나지 않도록',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 업무 변경과 감사로그가 함께 커밋되도록</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>감사로그를 업무 변경과 따로 저장하면, 변경은 커밋됐는데 <b>로그만 빠지는 상태</b>가 생깁니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>감사로그는 업무 변경과 함께 성공하거나 함께 실패해야 한다</b>고 판단했습니다. 그래서 초기 설계부터 변경 이벤트를 <b>같은 트랜잭션 안의 Outbox 테이블</b>에 저장해, 업무 변경과 원자적으로 커밋되게 했습니다. 스케줄러가 Outbox를 감사 테이블로 옮깁니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>옮기는 단계는 실패하면 다시 시도하므로 같은 이벤트가 두 번 들어올 수 있습니다. 감사 테이블의 <code>outbox_id</code>에 유니크 제약을 두고 <code>ON CONFLICT DO NOTHING</code>으로 적재해, 여러 번 실행해도 결과가 같도록 <b>멱등하게</b> 만들었습니다</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 운영에서 찾은 설계의 빈틈: flush 시점</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>운영 중 일부 회원 정보 변경 이력이 빠졌습니다. 추적해 보니 JPA <code>@PreUpdate</code>는 값을 바꾼 순간이 아니라 <b>flush 시점</b>에 호출되고, 이후 쿼리가 없는 경로에서는 flush가 커밋 직전까지 미뤄졌습니다. 그 결과 이벤트가 커밋 전 단계(<code>BEFORE_COMMIT</code>) 리스너보다 늦게 만들어져 저장되지 못했습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>특정 경로를 고치는 것이 아니라, 이벤트가 만들어지는 시점을 보장해야 한다</b>고 판단했습니다. 문제가 난 서비스에 <code>flush()</code>를 한 줄 넣으면 그 경로만 고쳐지고 다른 경로에서 다시 생깁니다. 그래서 <code>TransactionSynchronization.beforeCommit</code>에서 flush를 먼저 실행한 뒤 Outbox에 저장하도록 바꿔, 어떤 경로든 <b>이벤트가 커밋 전에 반드시 만들어지게</b> 했습니다</p></div>
                              </div>
                            </div>
                            <div className="pd-work-item">
                              <h5>3. 회원 일괄 변경: DB 변경과 결과 파일의 실패를 나눠서</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>CSV로 회원 정보를 일괄 변경하고 결과 파일을 S3에 올립니다. S3 업로드를 트랜잭션 안에 두면 업로드가 끝날 때까지 DB 커넥션과 잠금을 붙잡고, 업로드가 실패하면 이미 끝난 회원 변경까지 롤백됩니다. 그래서 S3 업로드를 트랜잭션 밖으로 뺐더니, <b>DB 변경은 커밋됐는데 결과 파일만 실패한 상태</b>가 생겼습니다. 이를 FAILED로 표시하면 이미 바뀐 회원 데이터를 실패라고 거짓 보고하게 됩니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>DB 변경의 성공과 결과 파일의 성공은 따로 기록해야 한다</b>고 판단했습니다. DB 변경이 커밋된 상태를 <code>APPLIED</code>로 따로 기록해 <b>실패 경계를 나눴습니다</b>. DB 변경 전에 실패하면 FAILED, 커밋되면 APPLIED, 결과 파일까지 끝나면 완료입니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>APPLIED 작업을 다시 처리할 때는 모든 행을 다시 적용하지만, JPA 변경 감지는 값이 같으면 UPDATE를 보내지 않아 <b>재적용이 멱등</b>합니다. 그래서 DB는 바뀌지 않고 결과 파일만 새로 만들어집니다</li>
                              </ImplDetail>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '장애가 나도 지킬 것을 지키도록',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 여러 서버 중 한 대만 알림을 보내도록</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>에러 알림의 중복 억제와 요약을 서버 메모리에서 세면, 같은 에러를 서버마다 따로 세서 <b>알림이 중복으로 나갑니다</b></p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>발송 상태는 서버 밖 한곳에 두고, 발송은 한 서버만 맡아야 한다</b>고 판단해 발송 상태를 <b>PostgreSQL 공유 테이블</b>에 두었습니다. 1초마다 잠금 행 하나를 <code>FOR UPDATE SKIP LOCKED</code>로 먼저 잡은 서버만 그 회차의 발송을 맡습니다. 발송 중인 서버가 죽으면 트랜잭션이 끊기면서 잠금이 풀리고, 다음 회차에 다른 서버가 이어받습니다. 별도 메시지 브로커 없이 <b>DB 잠금만으로 단일 발송자</b>를 보장했습니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>발송이 성공한 뒤에만 발송 상태를 앞으로 옮겨, 실패한 알림은 다음 회차에 다시 보냅니다(at-least-once). 같은 에러는 5분에 상세 1건만 보내고 나머지는 요약으로 묶어 폭주를 막았습니다</li>
                                <li>알림 루프가 조용히 멈추면 아무도 모르기 때문에, 루프가 주기적으로 보내는 신호가 끊기면 CloudWatch가 경보하도록 설계해 인프라 담당자에게 요청했습니다</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 보안 기능이 실패하는 방향: fail-open과 fail-closed</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>보안 기능도 장애가 납니다. IP 차단 저장소나 권한 규칙이 제대로 동작하지 않을 때, 요청을 막을지 통과시킬지 미리 정해 두어야 합니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>같은 장애라도 무엇을 보호하는지에 따라 실패 방향을 다르게 정했습니다</b>. 차단 저장소에 장애가 나면 요청을 <b>통과</b>시킵니다(fail-open). 차단은 보조 방어선이고 인증은 뒤 단계에서 그대로 수행되므로, 보안 기능의 장애가 정상 사용자를 막지 않게 했습니다. 반대로 권한 규칙은 <b>기본 차단</b>입니다(fail-closed). 허용 목록에 없는 API는 모두 거부해서, 새 API에 권한 설정을 빠뜨려도 열리지 않습니다</p></div>
                              </div>
                              <ImplDetail>
                                <li>로그인 실패나 위조 토큰을 반복하는 IP를 자동 차단합니다. 실패 횟수는 여러 서버가 동시에 올려도 값이 사라지지 않도록 DynamoDB의 <b>원자적 증가(ADD)</b>로 셉니다. 다만 "새 집계 구간인지" 판단은 읽은 뒤에 쓰는 방식이라 동시 요청에서 횟수가 조금 어긋날 수 있습니다. 목적이 무차별 대입 공격 완화라서, 완벽한 정합성보다 단순함을 택하고 이 한계를 코드에 기록했습니다</li>
                              </ImplDetail>
                              <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/56" target="_blank" rel="noopener">관련 글: RDBMS vs NoSQL, 동시성을 다루는 두 저장소의 철학 <ExportOutlined /></Typography.Link>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '기능이 늘어나도 기존 코드를 흔들지 않도록',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 대량 작업 48종을 하나의 구조로</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>캠페인·광고그룹·키워드·소재 등 48종의 대량 작업은 CSV 형식, 검증 방식, 호출 API가 모두 달랐습니다. 하나의 Worker에서 작업 종류별로 분기하면, 작업을 추가할 때마다 이미 동작하는 코드를 고쳐야 했습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>작업마다 달라지는 부분만 구현체로 떼어 내야 한다</b>고 판단했습니다. 공통 계약을 <code>BulkTask</code>로 정하고, Dispatcher가 작업 종류로 구현체를 찾아 실행하게 했습니다(Strategy). 새 작업은 구현체 하나만 추가하면 되고 Dispatcher는 바뀌지 않는 구조를 개발했습니다(<b>개방-폐쇄 원칙</b>)</p></div>
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
                        title: '사용자가 낡은 데이터를 보고 잘못 고르지 않도록',
                        content: (
                          <>
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>화면의 목록은 캐시를 거쳐 보여 주므로, 서버의 값이 바뀐 뒤에도 낡은 목록이 남을 수 있습니다. 연동할 광고계정을 고르는 목록이 낡아 있으면, 사용자가 이미 다른 라이선스에 연동된 계정을 골라 다시 등록하려는 일이 생깁니다</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>기준을 "캐시를 쓸 수 있는가"가 아니라 <b>"이 데이터가 낡았을 때 사용자가 잘못된 행동을 할 수 있는가"</b>로 두고 목록마다 갱신 방식을 정했습니다. 연동할 계정을 고르는 목록처럼 낡으면 위험한 곳은 캐시를 쓰지 않고 열 때마다 새로 조회합니다. 나머지 목록은 캐시를 쓰되, 데이터가 낡는 경로에 맞춰 갱신합니다</p></div>
                            </div>
                            <ul className="pd-sublist pd-after-ba">
                              <li><b>내가 일으킨 변경</b>은 쓰기 직후 캐시를 무효화합니다. 하지만 <b>서버가 스스로 바꾸는 변경</b>(매체 연동 상태 등)은 화면에 쓰기 이벤트가 없어 무효화로는 잡을 수 없으므로, 화면을 열거나 창으로 돌아올 때 다시 조회하게 했습니다. 두 방식은 서로 대신할 수 없어서 함께 씁니다</li>
                              <li>무효화할 대상은 "내가 호출한 API 하나"가 아니라 그 변경으로 서버의 사실이 바뀌는 모든 목록입니다. 광고계정을 등록·삭제하면 계정 목록과 라이선스 목록을 함께 무효화하도록 한곳에 모았습니다</li>
                            </ul>
                            <ImplDetail>
                              <li>낡으면 위험한 선택 목록(연동 가능 계정·로그인 ID 드롭다운·트래커 후보)은 <code>staleTime</code>·<code>gcTime</code>을 0으로, <code>refetchOnMount</code>를 <code>'always'</code>로 두어 열 때마다 직전 캐시를 보여 주지 않고 새로 요청합니다</li>
                              <li>광고계정 등록·삭제처럼 여러 진입점이 같은 무효화 대상을 쓰는 경우, 진입점마다 손으로 나열하면 하나씩 빠뜨리므로 두 목록을 함께 무효화하는 헬퍼 하나로 모았습니다</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                      {
                        title: '필터를 바꿔도 이전 행이 남지 않도록',
                        content: (
                          <>
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>광고계정 목록에서 즐겨찾기 필터를 바꾸면 이전 행이 화면에 섞여 남았고, 새로고침하면 정상으로 돌아왔습니다. 새로고침하면 사라진다는 점을 단서로, 서버 응답뿐 아니라 화면을 다시 그리는 <b>렌더링 과정까지 추적</b>했습니다. 한 광고계정이 여러 라이선스와 연결되면 같은 계정이 여러 행으로 펼쳐지는데, 행 key로 광고계정 ID를 쓰고 있어서 <b>key가 중복</b>되고 있었습니다</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p><b>행 key는 그 행을 유일하게 식별하는 값이어야 한다</b>고 판단해, 행마다 고유한 연결 ID를 key로 바꿨습니다. 화면에서 행을 식별하는 ID와 삭제 API에 넘길 ID도 명시적으로 분리했습니다. 같은 실수가 반복되지 않도록 행 key 규칙을 문서로 남겼습니다</p></div>
                            </div>
                            <ImplDetail>
                              <li>React는 key로 "같은 요소인지"를 판단해 DOM과 상태를 재사용합니다. key가 겹치면 필터로 데이터가 바뀌어도 이전 행을 그대로 재사용하고, 새로고침은 트리를 새로 그리기 때문에 문제가 가려졌습니다</li>
                              <li>행 key는 광고계정과 라이선스의 연결 ID(<code>licenseAccountId</code>)로 바꿨습니다. 삭제는 한 계정의 모든 라이선스 연결을 한 번에 해제하는 광고계정 단위라, 선택한 연결 ID를 광고계정 ID로 되돌리고 중복을 없앤 뒤 호출합니다</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                      {
                        title: '빠른 응답에서도 화면이 깜빡이지 않도록',
                        content: (
                          <>
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>로딩 표시는 기다림을 안내하려고 보여 줍니다. 그런데 응답이 빠를 때 로딩 표시가 한 프레임 나타났다 사라지면, 오히려 <b>화면이 흔들리고 더 느리게 느껴집니다</b></p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p><b>로딩 표시를 많이 보여 주는 것이 항상 친절하지는 않다</b>고 보고, 사용자가 실제로 어떻게 느끼는지를 기준으로 정했습니다. 로딩이 200ms를 넘을 때만 자리표시를 보여 주고, 그 전에 끝나면 바로 내용을 보여 줍니다. 화면 전체를 한 번에 기다리지 않고 준비된 영역부터 먼저 보여 줍니다</p></div>
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
                    <p>캐시 무효화 기준·행 key 규칙·로딩 표현 정책처럼 반복되는 판단을 FE 패턴 가이드로 정리했습니다. AI 도구가 FE 코드를 작성하고 리뷰할 때 이 가이드를 읽도록 두어, 사람과 AI가 같은 기준으로 코드를 쓰고 리뷰할 수 있게 했습니다. <b>코드는 한 번의 판단을 담고, 문서는 반복되는 판단을 담는다</b>는 것을 배웠습니다.</p>
                  </div>
                </div>

                <div className="pd-block">
                  <h4>성장한 점</h4>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#사용자_경험</span><span>#관점_변화</span></div>
                    <p>프론트엔드를 처음 개발할 때는 API의 데이터를 화면에 정확히 보여 주는 것이 가장 중요하다고 생각했습니다. 하지만 직접 화면을 만들면서, 같은 데이터라도 언제 다시 조회하는지·어떤 상태를 먼저 보여 주는지·화면이 어떻게 전환되는지에 따라 사용자의 판단과 체감이 달라진다는 것을 알게 됐습니다. 이제는 <b>화면을 백엔드의 결과를 보여 주는 곳이 아니라, 사용자가 서비스를 실제로 경험하는 과정의 일부</b>로 보고 개발합니다.</p>
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
