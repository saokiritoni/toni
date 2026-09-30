import { ExportOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'
import DetailTabs from '../components/DetailTabs'
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
        <p className="pd-p">광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션입니다. 백엔드에서는 인증·인가, 매체 계정 관리, 대량 작업 처리, 운영 알림을 개발했고, 프론트엔드도 함께 개발했습니다.</p>
        <p className="pd-p">서버 여러 대가 같은 데이터를 동시에 읽고 바꾸는 환경이라, 기능을 만들 때마다 <b>"동시에 실행되면 무엇이 깨지는가"</b>를 먼저 따졌습니다. 아래는 격리성·원자성·멱등성 같은 기본 개념을 실제 문제에 어떻게 적용했는지 정리한 내용입니다.</p>
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
                        title: '격리성: 동시에 실행되는 트랜잭션이 서로를 깨뜨리지 않게',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 조회와 변경 사이의 틈: 작업 중복 선점</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>여러 서버의 Worker가 대기 중인 작업을 조회한 뒤 상태를 바꿉니다. 조회와 변경 사이에 틈이 있으면 두 Worker가 같은 작업을 읽고 <b>둘 다 처리</b>할 수 있습니다. 처음 구현에서는 상태 변경이 커밋되기 전에 다음 조회가 같은 작업을 다시 가져가는 문제가 실제로 있었습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><code>FOR UPDATE SKIP LOCKED</code>로 행을 잠그고, <b>잠금과 상태 변경(<code>IN_PROGRESS</code>)을 한 트랜잭션에서 커밋</b>하도록 선점 로직을 분리했습니다. 커밋 시점에는 이미 상태가 바뀌어 있어서, 잠금이 풀린 뒤에도 다른 Worker가 같은 행을 다시 가져가지 않습니다. 잠긴 행은 기다리지 않고 건너뛰므로 Worker를 늘려도 서로 막지 않습니다</p></div>
                              </div>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 여러 행에 걸친 규칙: 운영자 최소 1명 유지</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>"운영자는 최소 한 명 남아야 한다"는 규칙은 행 하나가 아니라 운영자 전체에 걸린 규칙입니다. 운영자 A와 B를 강등하는 요청이 동시에 오면, 각 트랜잭션은 상대가 아직 운영자라고 읽고 둘 다 성공해 운영자가 0명이 됩니다. 두 트랜잭션이 서로 다른 행을 바꾸기 때문에 기본 격리 수준(Read Committed)으로는 막히지 않는 <b>write skew</b>입니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>강등 전에 활성 운영자 행 전체를 <code>PESSIMISTIC_WRITE</code>로 잠가 두 요청을 <b>직렬화</b>했습니다. PostgreSQL은 <code>COUNT</code>와 <code>FOR UPDATE</code>를 함께 쓸 수 없어서 행을 잠근 뒤 개수를 셉니다. 잠금 순서를 <code>id</code> 순으로 통일해 두 트랜잭션이 서로의 잠금을 기다리는 <b>교착 상태를 예방</b>했고, 일괄 강등에서는 같은 배치의 강등 대상을 빼고 남는 인원을 계산했습니다</p></div>
                              </div>
                            </div>
                            <div className="pd-work-item">
                              <h5>3. 유일성은 DB가 판정한다: 매체 인증정보 중복 등록</h5>
                              <ul className="pd-sublist">
                                <li>"이미 등록했는지 조회한 뒤 등록"하는 방식은 동시 요청 두 개가 모두 "없음"을 읽고 통과할 수 있습니다(<b>check-then-act 경쟁</b>). 그래서 최종 판정은 원자적으로 동작하는 <b>DB 유니크 인덱스</b>에 맡기고, 애플리케이션의 사전 조회는 빠르고 친절한 오류를 위한 1차 검사로만 두었습니다. 인덱스가 막은 동시 등록도 같은 409 오류로 바꿔 사용자에게 일관되게 보여 줍니다</li>
                                <li>삭제는 행을 지우지 않고 표시만 하는 방식(soft delete)이라, 모든 행에 유니크를 걸면 삭제한 계정을 다시 등록할 수 없습니다. 삭제되지 않은 행에만 적용되는 <b>Partial Unique Index</b>로 유일성의 범위를 정했습니다</li>
                                <li>인증정보는 KMS로 암호화 저장되어 매번 다른 암호문이 나오므로 암호문으로는 중복을 비교할 수 없습니다. 평문으로 만든 <b>결정적 SHA-256 지문</b>을 별도 컬럼에 두고, (회원, 매체, 지문)에 Partial Unique Index를 걸어 DB가 중복 등록을 막습니다</li>
                              </ul>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '원자성: 함께 성공하거나 함께 실패해야 하는 것',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 업무 변경과 감사로그를 한 트랜잭션에</h5>
                              <ul className="pd-sublist">
                                <li>감사로그를 업무 변경과 따로 저장하면, 변경은 커밋됐는데 로그만 빠지는 상태가 생깁니다. 그래서 초기 설계부터 변경 이벤트를 <b>같은 트랜잭션 안의 Outbox 테이블</b>에 저장해 업무 변경과 원자적으로 커밋되게 했습니다. 스케줄러가 Outbox를 감사 테이블로 옮깁니다</li>
                                <li>옮기는 단계는 실패하면 다시 시도하므로 같은 이벤트가 두 번 들어올 수 있습니다. 감사 테이블의 <code>outbox_id</code>에 유니크 제약을 두고 <code>ON CONFLICT DO NOTHING</code>으로 적재해, 여러 번 실행해도 결과가 같도록 <b>멱등하게</b> 만들었습니다</li>
                              </ul>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>운영 중 일부 회원 정보 변경 이력이 빠졌습니다. 추적해 보니 JPA <code>@PreUpdate</code>는 값을 바꾼 순간이 아니라 <b>flush 시점</b>에 호출되고, 이후 쿼리가 없는 경로에서는 flush가 커밋 직전까지 미뤄졌습니다. 그 결과 이벤트가 커밋 전 단계(<code>BEFORE_COMMIT</code>) 리스너보다 늦게 만들어져 저장되지 못했습니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>문제가 난 서비스에 <code>flush()</code>를 한 줄 넣으면 그 경로만 고쳐지고 다른 경로에서 다시 생깁니다. 그래서 <code>TransactionSynchronization.beforeCommit</code>에서 flush를 먼저 실행한 뒤 Outbox에 저장하도록 바꿔, 어떤 경로든 <b>이벤트가 커밋 전에 반드시 만들어지게</b> 했습니다</p></div>
                              </div>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 트랜잭션 경계와 외부 I/O: 회원 일괄 변경</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>CSV로 회원 정보를 일괄 변경하고 결과 파일을 S3에 올립니다. S3 업로드를 트랜잭션 안에 두면 업로드가 끝날 때까지 DB 커넥션과 잠금을 붙잡고, 업로드가 실패하면 이미 끝난 회원 변경까지 롤백됩니다. 그래서 S3 업로드를 트랜잭션 밖으로 뺐더니, <b>DB 변경은 커밋됐는데 결과 파일만 실패한 상태</b>가 생겼습니다. 이를 FAILED로 표시하면 이미 바뀐 회원 데이터를 실패라고 거짓 보고하게 됩니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>DB 변경이 커밋된 상태를 <code>APPLIED</code>로 따로 기록해 <b>실패 경계를 나눴습니다</b>. DB 변경 전에 실패하면 FAILED, 커밋되면 APPLIED, 결과 파일까지 끝나면 완료입니다. APPLIED 작업을 다시 처리할 때는 모든 행을 다시 적용하지만, JPA 변경 감지는 값이 같으면 UPDATE를 보내지 않아 <b>재적용이 멱등</b>합니다. 그래서 DB는 바뀌지 않고 결과 파일만 새로 만들어집니다</p></div>
                              </div>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '장애 상황의 동작: 무엇을 지키고 무엇을 양보할지',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 여러 서버 중 한 대만 알림을 보내게</h5>
                              <ul className="pd-sublist">
                                <li>에러 알림의 중복 억제와 요약을 서버 메모리에서 세면, 같은 에러를 서버마다 따로 세서 알림이 중복으로 나갑니다. 그래서 발송 상태를 <b>PostgreSQL 공유 테이블</b>에 두었습니다</li>
                                <li>1초마다 잠금 행 하나를 <code>FOR UPDATE SKIP LOCKED</code>로 먼저 잡은 서버만 그 회차의 발송을 맡습니다. 발송 중인 서버가 죽으면 트랜잭션이 끊기면서 잠금이 풀리고, 다음 회차에 다른 서버가 자연스럽게 이어받습니다. 별도 메시지 브로커 없이 <b>DB 잠금만으로 단일 발송자</b>를 보장했습니다</li>
                                <li>발송이 성공한 뒤에만 발송 상태를 앞으로 옮겨, 실패한 알림은 다음 회차에 다시 보냅니다(at-least-once). 같은 에러는 5분에 상세 1건만 보내고 나머지는 요약으로 묶어 폭주를 막았습니다</li>
                                <li>알림 루프가 조용히 멈추면 아무도 모르기 때문에, 루프가 주기적으로 보내는 신호가 끊기면 CloudWatch가 경보하도록 설계해 인프라 담당자에게 요청했습니다</li>
                              </ul>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 보안 기능의 실패 방향: fail-open과 fail-closed</h5>
                              <ul className="pd-sublist">
                                <li>로그인 실패나 위조 토큰을 반복하는 IP를 자동 차단합니다. 실패 횟수는 여러 서버가 동시에 올려도 값이 사라지지 않도록 DynamoDB의 <b>원자적 증가(ADD)</b>로 셉니다. 다만 "새 집계 구간인지" 판단은 읽은 뒤에 쓰는 방식이라 동시 요청에서 횟수가 조금 어긋날 수 있습니다. 목적이 무차별 대입 공격 완화라서, 완벽한 정합성보다 단순함을 택하고 이 한계를 코드에 기록했습니다</li>
                                <li>차단 저장소에 장애가 나면 요청을 <b>통과</b>시킵니다(fail-open). 차단은 보조 방어선이고 인증은 뒤 단계에서 그대로 수행되므로, 보안 기능의 장애가 정상 사용자를 막지 않게 했습니다</li>
                                <li>반대로 권한 규칙은 <b>기본 차단</b>입니다(fail-closed). 허용 목록에 없는 API는 모두 거부해서, 새 API에 권한 설정을 빠뜨려도 열리지 않습니다. 같은 "장애"라도 무엇을 보호하는지에 따라 실패 방향을 다르게 정했습니다</li>
                              </ul>
                              <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/56" target="_blank" rel="noopener">관련 글: RDBMS vs NoSQL, 동시성을 다루는 두 저장소의 철학 <ExportOutlined /></Typography.Link>
                            </div>
                            <div className="pd-work-item">
                              <h5>3. 세션: 동시에 온 토큰 갱신 요청</h5>
                              <ul className="pd-sublist">
                                <li>한 계정은 한 곳에서만 로그인되도록, 새로 로그인하면 기존 세션을 지우는 방식(Last-Write-Wins)으로 동시 로그인을 막았습니다. 밀려난 쪽에는 "다른 기기에서 로그인되어 로그아웃되었습니다"를 안내합니다</li>
                                <li>토큰 갱신 요청 두 개가 동시에 오면 둘 다 성공한 뒤 다음 요청에서 세션이 깨질 수 있습니다. "저장된 갱신 토큰 ID가 내가 알던 값일 때만 저장"하는 <b>조건부 쓰기(낙관적 동시성 제어)</b>로 한쪽만 성공하게 했습니다. 세션은 DynamoDB TTL로 로그인·갱신 후 4시간이 지나면 자동으로 만료됩니다</li>
                              </ul>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '변경에 닫힌 구조: 대량 작업 48종',
                        content: (
                          <>
                            <div className="pd-work-item">
                              <h5>1. 작업이 늘어나도 기존 코드를 고치지 않도록</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>캠페인·광고그룹·키워드·소재 등 48종의 대량 작업은 CSV 형식, 검증 방식, 호출 API가 모두 다릅니다. 하나의 Worker에서 작업 종류별로 분기하면 작업을 추가할 때마다 이미 동작하는 코드를 고쳐야 합니다</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>공통 계약을 <code>BulkTask</code>로 정하고, Dispatcher가 작업 종류로 구현체를 찾아 실행하게 했습니다(Strategy). 새 작업은 구현체 하나만 추가하면 되고 Dispatcher는 바뀌지 않습니다(<b>개방-폐쇄 원칙</b>). 행 단위 처리의 공통 흐름은 인터페이스의 기본 메서드로 두어, 단건 API 작업은 행 처리만, 일괄 API 작업은 묶음 처리만 구현합니다. <code>sealed interface</code>로 작업 갈래를 닫아 두어, 분기에서 빠진 경우가 있으면 컴파일러가 알려 줍니다</p></div>
                              </div>
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
                    <div className="pd-tags"><span>#격리성</span><span>#무엇을_보호하는가</span></div>
                    <p>처음에는 동시성 문제를 모두 "락을 걸면 된다"로 생각했습니다. 그런데 작업 선점, 운영자 강등, 중복 등록은 겉보기엔 같은 동시성 문제여도 보호할 대상이 달랐습니다. 선점은 처리량을 지키며 한 행을 한 번만 가져가는 문제였고, 강등은 여러 행에 걸친 규칙(write skew)이었고, 중복 등록은 조회와 삽입 사이의 경쟁이었습니다. <b>무엇을 보호해야 하는지 먼저 정의해야 격리 수준·락·제약조건 가운데 맞는 도구를 고를 수 있다</b>는 것을 배웠습니다.</p>
                  </div>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#원자성</span><span>#원인_추적</span></div>
                    <p>감사로그 누락은 특정 서비스에 <code>flush()</code> 한 줄을 넣으면 당장 사라지는 문제였습니다. 하지만 그렇게 하면 다른 변경 경로에서 다시 생깁니다. JPA가 언제 SQL을 보내는지, 트랜잭션이 커밋 전에 어떤 순서로 콜백을 부르는지까지 따라가서 구조를 바꿨습니다. <b>증상을 없애는 것과 원인을 없애는 것은 다르며, 원인은 개념을 정확히 알 때 보인다</b>는 것을 배웠습니다.</p>
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
                        title: '캐시 일관성: 화면의 데이터가 낡는 두 가지 경로',
                        content: (
                          <>
                            <ul className="pd-sublist">
                              <li>서버 데이터의 원본은 서버이고, 화면의 캐시는 복사본입니다. 복사본이 낡는 경로는 둘입니다. <b>내가 일으킨 변경</b>은 쓰기 직후 캐시를 무효화하면 됩니다. 하지만 <b>서버가 스스로 바꾸는 변경</b>(매체 연동 상태 등)은 화면에 쓰기 이벤트가 없어 무효화로는 잡을 수 없으므로, 화면을 열거나 창으로 돌아올 때 다시 조회하게 했습니다. 두 방식은 서로 대신할 수 없어서 함께 씁니다</li>
                              <li>무효화할 대상은 "내가 호출한 API 하나"가 아니라 그 변경으로 서버의 사실이 바뀌는 모든 목록입니다. 광고계정을 등록·삭제하면 계정 목록과 라이선스 목록을 함께 무효화하도록 한곳에 모았습니다</li>
                              <li>기준은 "이 목록이 낡았을 때 사용자가 잘못된 대상을 고를 수 있는가"입니다. 연동할 계정을 고르는 목록처럼 낡으면 위험한 곳은 캐시를 쓰지 않고 매번 새로 조회합니다. 이 기준을 FE 패턴 가이드로 정리해 팀이 같은 판단을 하도록 했습니다</li>
                            </ul>
                          </>
                        ),
                      },
                      {
                        title: 'React 재조정과 key: 필터를 바꿔도 이전 행이 남는 버그',
                        content: (
                          <>
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>광고계정 목록에서 즐겨찾기 필터를 바꾸면 이전 행이 화면에 남았고, 새로고침하면 정상으로 돌아왔습니다. 한 광고계정이 여러 라이선스와 연결되면 목록에 같은 계정이 여러 행으로 나오는데, 행 key로 광고계정 ID를 쓰고 있어서 <b>key가 중복</b>됐습니다</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>React는 key로 "같은 요소인지"를 판단해 DOM과 상태를 재사용합니다. key가 겹치면 데이터가 바뀌어도 이전 행을 그대로 재사용하고, 새로고침은 트리를 새로 그리기 때문에 문제가 가려졌습니다. 행마다 고유한 연결 ID를 key로 쓰고, 행을 식별하는 ID와 삭제 API에 넘길 ID를 명시적으로 분리했습니다. 같은 실수를 막도록 행 key 규칙을 문서로 남겼습니다</p></div>
                            </div>
                          </>
                        ),
                      },
                      {
                        title: '체감 성능: 빠른 응답에서 생기는 깜빡임',
                        content: (
                          <>
                            <ul className="pd-sublist">
                              <li>응답이 빠를 때 로딩 표시가 한 프레임 나타났다 사라지면 오히려 화면이 흔들려 보입니다. 로딩이 200ms를 넘을 때만 자리표시를 보여 주고, 그 전에 끝나면 바로 내용을 보여 주도록 했습니다</li>
                              <li>화면 전체를 한 번에 기다리지 않고, 준비된 영역부터 먼저 보여 주었습니다. 이름 길이에 따라 폭이 달라지는 영역은 부분 자리표시 대신 완성된 뒤 한 번에 나타나게 해 레이아웃 흔들림을 줄였습니다</li>
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
                    <div className="pd-tags"><span>#문서화</span><span>#팀_기준</span></div>
                    <p>AI와 함께 개발할수록 "이 팀은 어떤 기준으로 판단하는가"를 글로 남기는 일이 중요해졌습니다. 캐시 무효화 기준, 행 key 규칙, 로딩 표현 정책을 FE 패턴 가이드로 정리하자 사람과 AI가 같은 기준으로 코드를 쓰고 리뷰할 수 있었습니다. <b>코드는 한 번의 판단을 담고, 문서는 반복되는 판단을 담는다</b>는 것을 배웠습니다.</p>
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
