import { Tag } from 'antd'
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
        <p className="pd-p">광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션입니다. 백엔드를 중심으로 프론트엔드와 인프라까지, 기능이 서비스되는 전 과정을 경험했습니다.</p>
        <p className="pd-p">여러 서버와 사용자가 같은 데이터를 동시에 다루기 때문에, 기능을 구현할 때 <b>무엇을 반드시 지켜야 하는지</b> 먼저 정의했습니다. 처리량·정합성·가용성 등 우선순위에 따라 동시성 제어와 트랜잭션 경계를 다르게 설계했습니다.</p>
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
                              <h5>1. 최소 한 명의 운영자를 지키는 동시성 제어</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>운영자 A와 B의 강등 요청이 동시에 실행되면, 각 트랜잭션이 상대를 운영자로 확인한 뒤 모두 성공해 <b>운영자가 0명</b>이 될 수 있었습니다. 두 트랜잭션이 서로 다른 행을 바꾸므로 기본 격리 수준으로는 막히지 않는 write skew입니다.</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p>이 기능은 <b>처리량보다 "운영자가 최소 한 명 남아야 한다"는 업무 규칙이 우선</b>이라고 판단했습니다. 활성 운영자를 <code>PESSIMISTIC_WRITE</code>로 잠근 뒤 남은 인원을 확인해, 강등 요청을 직렬화했습니다.</p></div>
                              </div>
                              <ImplDetail>
                                <li>PostgreSQL은 <code>COUNT</code>와 <code>FOR UPDATE</code>를 함께 쓸 수 없어서, 대상 행을 먼저 잠근 뒤 개수를 셉니다.</li>
                                <li>잠금 순서를 <code>id</code> 순으로 통일해 교착 상태를 예방했습니다.</li>
                                <li>일괄 강등에서는 같은 배치의 강등 대상까지 빼고 남는 운영자 수를 계산합니다.</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 인증정보 중복 등록 방지</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>"이미 등록했는지 조회한 뒤 등록"하면, 동시에 온 두 요청이 모두 "없음"을 읽고 통과할 수 있습니다(<b>check-then-act 경쟁</b>).</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>유일성의 최종 판정은 DB가 해야 한다</b>고 판단했습니다. 중복은 DB 유니크 인덱스가 막고, 애플리케이션의 사전 조회는 친절한 오류 안내를 위한 1차 검사로만 두었습니다.</p></div>
                              </div>
                              <ImplDetail>
                                <li>인덱스가 막은 동시 등록도 같은 409 오류로 바꿔 사용자에게 일관되게 보여 줍니다.</li>
                                <li>삭제는 표시만 하는 방식(soft delete)이라, 삭제되지 않은 행에만 적용되는 <b>Partial Unique Index</b>로 유일성의 범위를 정했습니다.</li>
                                <li>인증정보는 KMS로 암호화되어 매번 다른 암호문이 나오므로, 평문으로 만든 <b>결정적 SHA-256 지문</b>을 별도 컬럼에 두고 (회원, 매체, 지문)에 인덱스를 걸었습니다.</li>
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
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>업무 데이터와 감사로그를 따로 저장하면, 변경은 성공했는데 <b>기록은 남지 않는 상태</b>가 생길 수 있습니다.</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>감사로그도 업무 변경과 함께 성공하거나 함께 실패해야 하는 데이터</b>라고 판단했습니다. 초기 설계부터 같은 트랜잭션에서 Outbox를 저장하고, 스케줄러가 감사 테이블로 옮기도록 구성했습니다.</p><p>운영 중에는 일부 변경 이력이 빠지는 문제를 발견했습니다. 추적해 보니 JPA <code>@PreUpdate</code>가 flush 시점에 실행되면서, 이벤트가 <code>BEFORE_COMMIT</code> 처리보다 늦게 만들어지는 경로가 있었습니다. 특정 서비스에 <code>flush()</code>를 넣는 대신 <code>TransactionSynchronization.beforeCommit</code>에서 flush한 뒤 Outbox를 저장하도록 바꿔, <b>모든 경로에서 같은 순서를 보장</b>했습니다.</p></div>
                              </div>
                              <ImplDetail>
                                <li>옮기는 단계는 실패하면 다시 시도하므로 같은 이벤트가 두 번 들어올 수 있습니다. 감사 테이블의 <code>outbox_id</code>에 유니크 제약을 두고 <code>ON CONFLICT DO NOTHING</code>으로 적재해 <b>멱등하게</b> 만들었습니다.</li>
                              </ImplDetail>
                            </div>
                            <div className="pd-work-item">
                              <h5>2. 회원 일괄 변경의 실패 경계</h5>
                              <div className="pd-ba">
                                <div className="ba-col problem"><span className="ba-label">문제</span><p>CSV로 회원 정보를 일괄 변경하고 결과 파일을 S3에 올립니다. 업로드를 트랜잭션 밖으로 빼자, <b>DB 변경은 커밋됐는데 결과 파일만 실패한 상태</b>가 생겼습니다. 이를 FAILED로 표시하면 이미 바뀐 데이터를 실패라고 잘못 알리게 됩니다.</p></div>
                                <div className="ba-col after"><span className="ba-label">해결</span><p><b>DB 변경의 성공과 결과 파일의 성공은 따로 기록해야 한다</b>고 판단했습니다. DB 변경이 커밋된 상태를 <code>APPLIED</code>로 기록해 실패 경계를 나눴고, 다시 처리해도 DB는 바뀌지 않고 결과 파일만 새로 만들어집니다.</p></div>
                              </div>
                              <ImplDetail>
                                <li>업로드를 트랜잭션 안에 두면 업로드가 끝날 때까지 DB 커넥션과 잠금을 붙잡고, 업로드가 실패하면 이미 끝난 회원 변경까지 롤백됩니다. 그래서 트랜잭션 밖으로 뺐습니다.</li>
                                <li>APPLIED 작업을 다시 처리할 때는 모든 행을 다시 적용하지만, JPA 변경 감지는 값이 같으면 UPDATE를 보내지 않아 <b>재적용이 멱등</b>합니다.</li>
                              </ImplDetail>
                            </div>
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
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>서버의 값이 바뀌어도 화면에는 캐시된 목록이 남을 수 있습니다. 특히 연동할 광고계정을 고르는 목록이 낡으면, 사용자가 <b>이미 다른 라이선스에 연동된 계정을 다시 고를 수</b> 있습니다.</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>기준을 "캐시를 쓸 수 있는가"가 아니라 <b>"이 데이터가 낡았을 때 사용자의 다음 행동이 잘못될 수 있는가"</b>로 두고 목록마다 갱신 방식을 정했습니다.</p>
                                <ul className="pd-sublist">
                                  <li>낡으면 잘못된 선택으로 이어지는 목록은 캐시하지 않고 열 때마다 새로 조회합니다.</li>
                                  <li>사용자가 직접 만든 변경은 저장 직후 관련 캐시를 무효화합니다. 범위는 호출한 API 하나가 아니라 <b>서버에서 함께 바뀐 사실</b>로 정해, 광고계정을 등록·삭제하면 라이선스 목록까지 함께 무효화합니다.</li>
                                  <li>서버가 스스로 바꾸는 상태(매체 연동 상태 등)는, 백엔드가 그 상태를 바꿀 수 있는 계정 조회 뒤에 성공·실패와 관계없이 목록 캐시를 무효화합니다.</li>
                                </ul>
                              </div>
                            </div>
                            <ImplDetail>
                              <li>연동 가능 계정·로그인 ID 드롭다운·트래커 후보 목록은 <code>staleTime</code>·<code>gcTime</code>을 0으로, <code>refetchOnMount</code>를 <code>'always'</code>로 두어 열 때마다 직전 캐시를 보여 주지 않고 새로 요청합니다.</li>
                            </ImplDetail>
                          </>
                        ),
                      },
                      {
                        title: 'React 렌더링 오류 추적',
                        content: (
                          <>
                            <div className="pd-ba">
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>즐겨찾기 필터를 바꾸면 이전 행이 화면에 남았고, 새로고침하면 정상으로 돌아왔습니다. 새로고침하면 사라진다는 점을 단서로 서버 데이터뿐 아니라 <b>렌더링 과정까지 추적</b>했고, 한 광고계정이 여러 라이선스와 연결되면서 광고계정 ID가 <b>행 key로 중복</b>되고 있음을 찾았습니다.</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p>행 key는 행마다 유일해야 하므로, 행마다 고유한 연결 ID를 key로 쓰고 <b>화면에서 행을 식별하는 ID와 삭제 API에 넘기는 ID를 분리</b>했습니다. 같은 문제가 반복되지 않도록 행 key 규칙을 문서로 남겼습니다.</p></div>
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
                              <div className="ba-col problem"><span className="ba-label">문제</span><p>응답이 빠를 때도 로딩 표시가 순간적으로 나타났다 사라지면서, <b>화면이 깜빡이고 오히려 더 느리게 느껴졌습니다</b>.</p></div>
                              <div className="ba-col after"><span className="ba-label">해결</span><p><b>로딩 표시를 보여 주는 것이 항상 친절하지는 않다</b>고 판단했습니다. 로딩이 200ms를 넘을 때만 자리표시를 보여 주고, 그 전에 응답하면 바로 내용을 보여 줍니다. 화면 전체를 기다리지 않고 준비된 영역부터 보여 줍니다.</p></div>
                            </div>
                            <ImplDetail>
                              <li>로딩이 200ms 넘게 이어질 때만 참이 되는 훅(<code>useDelayedFlag</code>)과 이를 감싼 <code>LoadingFade</code> 컴포넌트를 만들어, 설정 페이지·목록 테이블·채팅 메시지 이력에 적용했습니다.</li>
                              <li>상단 바·사이드 메뉴·본문은 각자 자기 데이터가 준비되는 즉시 전환합니다. 페이지를 옮길 때 이미 준비된 상단 바와 사이드 메뉴를 다시 자리표시로 되돌리지 않습니다.</li>
                              <li>이름 길이 등에 따라 폭이 달라지는 영역(상단 바의 사용자 영역)은 부분 자리표시를 그리면 옆 아이콘이 밀려나므로, 자리표시 없이 완성된 뒤 한 번에 보여 줍니다.</li>
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
                    <p>캐시 무효화·행 key·로딩 표현처럼 반복되는 판단을 FE 패턴 가이드로 정리했습니다. <b>코드는 한 번의 판단을 담고, 문서는 반복되는 판단을 담는다</b>고 생각합니다.</p>
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
