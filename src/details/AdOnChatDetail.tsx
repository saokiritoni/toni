import DetailTabs from '../components/DetailTabs'

export default function AdOnChatDetail() {
  return (
    <>
      <div className="pd-meta">
        <span>2026.04 – 현재</span>
        <span>NHN AD</span>
        <span>Frontend, Backend</span>
      </div>
      <p className="pd-catch">AI 기반 광고 운영 솔루션</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션입니다. 인증·인가, 매체 계정 관리, 대량 광고 작업, 운영 기능을 백엔드에서 개발했습니다. 여러 서버가 같은 데이터를 동시에 바꾸는 환경이라 <b>동시성 제어, 데이터 정합성, 트랜잭션 설계</b>가 핵심 과제였고, 그 위에서 프론트엔드도 함께 개발했습니다.</p>
        <p className="pd-note">아래 내용은 실제 코드베이스를 기준으로 직접 구현·개선한 범위만 기술했습니다.</p>
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
                  <div className="pd-tech"><span>Kotlin</span><span>Spring Boot</span><span>JPA</span><span>PostgreSQL</span><span>DynamoDB</span><span>Redis</span><span>AWS</span></div>
                </div>

                <div className="pd-block">
                  <h4>진행한 일 · 동시성과 데이터 정합성</h4>
                  <div className="pd-work-item">
                    <h5>1. 다중 인스턴스 환경의 대량 작업 선점</h5>
                    <div className="pd-ba">
                      <div className="ba-col problem"><span className="ba-label">문제</span><p>대량 광고 작업을 여러 서버가 동시에 조회해 처리하는 구조. 작업을 조회한 뒤 상태를 바꾸는 사이에 두 서버가 같은 작업을 집어 <b>중복 처리</b>될 수 있었습니다</p></div>
                      <div className="ba-col after"><span className="ba-label">해결</span><p>PostgreSQL <code>FOR UPDATE SKIP LOCKED</code>로 작업을 선점. 한 Worker가 잠근 행은 다른 Worker가 기다리지 않고 건너뛰어 다음 작업을 가져갑니다. 별도 분산락 없이 <b>중복 방지와 병렬 처리량을 동시에</b> 확보</p></div>
                    </div>
                  </div>
                  <div className="pd-work-item">
                    <h5>2. 운영자 권한 변경의 직렬화</h5>
                    <div className="pd-ba">
                      <div className="ba-col problem"><span className="ba-label">문제</span><p>"운영자는 최소 한 명 남아야 한다"는 규칙. 운영자 A와 B를 각각 강등하는 요청이 동시에 들어오면 각 트랜잭션은 다른 운영자가 있다고 판단해 둘 다 성공하고, <b>운영자가 0명</b>이 될 수 있었습니다</p></div>
                      <div className="ba-col after"><span className="ba-label">해결</span><p><code>PESSIMISTIC_WRITE</code>로 관련 행을 잠가 직렬화. 여러 행을 잠글 때는 <b>같은 순서로 락을 획득</b>하도록 정렬해 교착을 예방하고, 일괄 강등 시에는 이미 강등 대상인 운영자를 제외해 남는 운영자 수를 계산</p></div>
                    </div>
                    <ul className="pd-whr">
                      <li><span className="k">판단</span><span>같은 "동시성 문제"라도 성격이 다릅니다. 대량 작업은 처리량을 유지하며 선점해야 하므로 <b>SKIP LOCKED</b>, 운영자 변경은 하나의 비즈니스 상태를 보호해야 하므로 <b>PESSIMISTIC_WRITE</b>. 무엇을 보호해야 하는지부터 판단하고 전략을 골랐습니다</span></li>
                    </ul>
                  </div>
                  <div className="pd-work-item">
                    <h5>3. DB 제약조건으로 보장하는 유일성</h5>
                    <ul className="pd-sublist">
                      <li>한 사용자가 같은 광고계정을 중복 등록하면 안 됩니다. 애플리케이션의 사전 중복 조회는 동시 요청에서 둘 다 "중복 없음"으로 통과할 수 있어, <b>DB Unique Constraint를 최종 방어선</b>으로 두었습니다</li>
                      <li>Soft Delete된 행까지 유니크에 포함하면 삭제한 계정을 재등록할 수 없는 문제가 생겨, 활성 행에만 적용되는 <b>PostgreSQL Partial Unique Index</b>를 사용</li>
                      <li>인증정보는 암호화 저장되고 매번 다른 암호문이 나와 직접 비교가 불가능합니다. 원본 기반의 <b>결정적 SHA-256 fingerprint</b>를 별도 컬럼에 두고 Unique Constraint로 중복을 판별. 보안과 정합성을 함께 확보</li>
                      <li>원칙: 애플리케이션은 빠르고 명확한 오류를, DB는 동시 요청에서도 깨지지 않는 최종 정합성을 담당</li>
                    </ul>
                  </div>
                  <div className="pd-work-item">
                    <h5>4. 감사로그 누락 원인 분석과 트랜잭션 구조 개선</h5>
                    <div className="pd-ba">
                      <div className="ba-col problem"><span className="ba-label">문제</span><p>기존 감사로그에서 일부 회원 정보 변경 이력이 기록되지 않았습니다. 추적 결과 JPA <code>@PreUpdate</code>는 변경 순간이 아닌 <b>flush 시점</b>에 호출되고, 이후 쿼리가 없는 경로에서는 flush가 commit까지 지연돼 기존 BEFORE_COMMIT 처리보다 이벤트 생성이 늦었습니다</p></div>
                      <div className="ba-col after"><span className="ba-label">해결</span><p>특정 서비스에 <code>flush()</code>를 강제하는 방식은 그 경로만 고칠 뿐이라 배제. <code>TransactionSynchronization</code>으로 <b>커밋 직전 flush 시점을 제어</b>하고, 변경 이벤트를 같은 트랜잭션의 Outbox에 저장한 뒤 별도 작업이 감사 테이블로 이동. 재처리 시 중복 적재는 <code>outbox_id</code> Unique + <code>ON CONFLICT DO NOTHING</code>으로 차단(멱등성)</p></div>
                    </div>
                  </div>
                </div>

                <div className="pd-block">
                  <h4>진행한 일 · 설계와 구조</h4>
                  <div className="pd-work-item">
                    <h5>5. 약 60종 대량 광고 작업의 객체지향 구조</h5>
                    <div className="pd-ba">
                      <div className="ba-col problem"><span className="ba-label">문제</span><p>캠페인·광고그룹·키워드·소재 등 약 60종의 대량 작업이 CSV 구조, 검증 방식, 호출 API, 처리 방식이 모두 달랐습니다. 하나의 Worker에서 <code>when</code>으로 분기하면 <b>작업이 늘 때마다 기존 코드가 바뀌는</b> 구조</p></div>
                      <div className="ba-col after"><span className="ba-label">해결</span><p>공통 계약을 <b>BulkTask</b>로 추상화하고, 행 단위 작업의 공통 흐름은 <b>RowProcessingTask</b>로 분리(Template Method). Dispatcher는 구현체를 직접 알지 않고 <b>taskType으로 Registry에서 찾아 실행</b>(Strategy). 단건 API 작업은 <code>processRow()</code>만 구현하고, Bulk API 작업은 <code>processChunk()</code>를 재정의</p></div>
                    </div>
                    <p className="pd-note">결과: 새 작업 유형을 추가할 때 Dispatcher의 조건문을 고치는 대신 BulkTask 구현체를 하나 추가하는 방식으로 확장. 매체 연동 영역에는 여전히 매체별 분기가 남아 있어, 전체를 완전히 추상화했다고 주장하지는 않습니다.</p>
                  </div>
                  <div className="pd-work-item">
                    <h5>6. 광고 매체 계정 데이터 모델링</h5>
                    <ul className="pd-sublist">
                      <li>요구사항: 하나의 광고계정은 전역에서 하나지만 여러 사용자가 각자의 인증수단으로 같은 계정을 쓸 수 있고, 한 사용자가 같은 계정을 중복 등록해서는 안 됩니다</li>
                      <li><b>media_account</b>(실제 광고계정) · <b>media_license</b>(사용자별 인증수단) · <b>license_account</b>(둘의 연결 관계) 세 개념으로 분리. 광고계정과 사용자 인증정보는 <b>생명주기가 다르기 때문에</b> 하나의 Entity로 합치지 않고 현실의 관계를 그대로 모델에 표현</li>
                    </ul>
                  </div>
                  <div className="pd-work-item">
                    <h5>7. 비동기 회원 일괄 변경의 상태 설계</h5>
                    <div className="pd-ba">
                      <div className="ba-col problem"><span className="ba-label">문제</span><p>CSV 기반 회원 일괄 변경은 DB 변경과 결과 파일 생성·S3 업로드를 수행합니다. 외부 I/O를 트랜잭션 안에 두면 S3가 끝날 때까지 DB 커넥션을 점유해 둘을 분리했는데, 그러자 <b>DB는 성공했지만 후속 처리가 실패</b>하는 상태가 생겼습니다. 이를 FAILED로 표시하면 이미 바뀐 회원 데이터가 실패한 것처럼 보입니다</p></div>
                      <div className="ba-col after"><span className="ba-label">해결</span><p>DB 변경이 끝난 상태를 <b>APPLIED</b>로 별도 표현. DB 변경 전 실패는 FAILED, 변경 완료는 APPLIED, 후속 결과 처리까지 끝나면 최종 완료. APPLIED 상태에서는 후속 Worker가 결과 생성만 이어서 재시도할 수 있어 <b>실패 범위와 재시도 지점이 명확</b>해졌습니다</p></div>
                    </div>
                  </div>
                </div>

                <div className="pd-block">
                  <h4>진행한 일 · 인증·보안·운영</h4>
                  <div className="pd-work-item">
                    <h5>8. 인증 시스템 직접 구현</h5>
                    <ul className="pd-sublist">
                      <li>Google/Naver 소셜 로그인부터 JWT 발급까지, 인증 전 과정을 라이브러리에 위임하지 않고 직접 설계·구현</li>
                      <li><b>Shadow Login</b>: 운영자가 사용자의 화면 그대로 들어가 문의를 처리하는 기능. 모든 활동이 "누가(운영자) 누구로(사용자)" 했는지 감사 기록에 남도록 설계</li>
                      <li>세션 저장소는 <b>DynamoDB</b>로 구현. 요청마다 만료 시간을 4시간 뒤로 연장해 별도 정리 작업 없이 미사용 세션이 자동 만료. 동시 로그인 차단, "다른 기기에서 로그인됨" 안내 등 세션 정책 구현</li>
                    </ul>
                  </div>
                  <div className="pd-work-item">
                    <h5>9. 비정상 접근 자동 차단</h5>
                    <ul className="pd-sublist">
                      <li>로그인 실패나 위조된 토큰을 반복해서 보내는 IP를 자동 차단하는 방어 계층 구현. 실패 횟수는 여러 서버가 동시에 기록해도 어긋나지 않도록 <b>DynamoDB 원자 카운터</b>로 집계</li>
                      <li>차단 저장소에 장애가 나도 서비스는 멈추지 않도록 설계. <b>"보안 기능의 장애가 정상 사용자를 막아선 안 된다"</b>는 우선순위를 명시적으로 선택하고 문서화</li>
                      <li>허용 목록에 없는 API는 기본 차단(default-deny). 새 기능을 추가하다 권한 설정을 빠뜨려도 <b>실수로 열리는 사고가 구조적으로 불가능</b>하게 설계</li>
                    </ul>
                    <a className="pd-link" href="https://kiritoni.tistory.com/56" target="_blank" rel="noopener">관련 글: RDBMS vs NoSQL, 동시성을 다루는 두 저장소의 철학 <span className="ext" aria-hidden="true">↗</span></a>
                  </div>
                  <div className="pd-work-item">
                    <h5>10. 운영 알림 체계 설계 (PostgreSQL 기반)</h5>
                    <ul className="pd-sublist">
                      <li>장애가 나면 협업 메신저로 즉시 알림. <b>같은 에러가 수만 건 터져도 상세 1건 + 요약 1건으로 수렴</b>하는 폭주 방어 설계</li>
                      <li>별도 메시지 브로커 없이 PostgreSQL만으로 구현. 발송 담당 서버 1대를 <b>FOR UPDATE SKIP LOCKED로 선출</b>해 중복 발송을 제거하고, 담당 서버가 죽으면 다른 서버가 자동 승계. 발송 상태를 DB에 두어 재시작·배포에도 유실 없음</li>
                      <li>"알림 시스템 자체가 조용히 멈추면 누가 아는가"까지 설계. 외부 감시(CloudWatch)가 알림 루프의 생존을 감시하는 이중 구조</li>
                    </ul>
                  </div>
                </div>

                <div className="pd-block">
                  <h4>성장한 점</h4>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#동시성</span><span>#정합성</span><span>#판단</span></div>
                    <p>처음에는 "동시성을 다뤄봤다"가 목표였습니다. 하지만 대량 작업 선점, 운영자 강등, 중복 등록, 감사로그 누락을 차례로 겪으며 매번 다른 답이 나왔습니다. SKIP LOCKED, PESSIMISTIC_WRITE, Partial Unique Index, Outbox. <b>여러 실행 주체가 같은 상태를 바꾸는 상황에서 무엇을 보호해야 하는지 먼저 판단하고, 그 성격에 맞는 제어 방식을 고르는 것이 동시성 설계의 본질임을 배웠습니다.</b></p>
                  </div>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#원인_추적</span><span>#구조적_해결</span></div>
                    <p>감사로그 누락은 특정 서비스에 flush()를 한 줄 추가하면 당장 사라지는 문제였습니다. 하지만 그 경로만 고치는 것이라 다른 변경 경로에서 재발할 것이 분명했습니다. JPA flush 시점까지 원인을 추적해 트랜잭션 구조를 바꾸는 데 시간을 더 썼고, <b>증상을 없애는 것과 원인을 없애는 것은 다른 일이며 후자만이 다음 문제를 줄인다는 것을 배웠습니다.</b></p>
                  </div>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#트레이드오프</span><span>#보안</span><span>#가용성</span></div>
                    <p>보안 기능을 만들며 "완벽한 방어"와 "서비스 가용성"이 계속 충돌했습니다. 같은 시스템 안에서도 상황마다 다른 선택을 해야 했고, 중요한 것은 그 이유를 설명하고 기록하는 일이었습니다. <b>좋은 설계란 정답을 고르는 것이 아니라 트레이드오프를 명시적으로 선택하고 설명할 수 있는 것임을 깨달았습니다.</b></p>
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
                  <div className="pd-tech"><span>React</span><span>TypeScript</span><span>Vite</span><span>Ant Design</span><span>TanStack Query</span></div>
                </div>

                <div className="pd-block">
                  <h4>진행한 일 · Frontend</h4>
                  <div className="pd-work-item">
                    <h5>1. 서버 상태 캐시 전략 설계 (TanStack Query)</h5>
                    <ul className="pd-sublist">
                      <li>화면 데이터가 낡는 두 경로를 구분했습니다. <b>내가 일으킨 변경</b>은 쓰기 직후 캐시를 무효화(invalidate-on-write)하고, <b>서버가 배치로 뒤집는 변경</b>(매체 연동 상태 등)은 주기적으로 다시 조회(refetch-for-freshness). 둘은 대체가 아닌 보완 관계임을 팀 표준으로 정립</li>
                      <li>하나의 쓰기가 여러 목록을 바꾸면 관련 캐시를 <b>전부</b> 무효화. 하나라도 빠지면 낡은 데이터가 조용히 남는 버그가 되므로, 무효화 세트를 헬퍼 하나로 단일화</li>
                      <li>낡은 데이터가 위험한 목록(연동 가능 계정 선택)만 선별적으로 캐시 제외. 성능과 신선도를 화면 단위로 조절</li>
                    </ul>
                  </div>
                  <div className="pd-work-item">
                    <h5>2. 테이블 렌더링 버그 원인 분석</h5>
                    <div className="pd-ba">
                      <div className="ba-col problem"><span className="ba-label">문제</span><p>1:N 펼침 목록에서 데이터가 바뀐 뒤에도 <b>이전 행이 화면에 남아 보이는</b> 현상. 재현은 되지만 원인이 서버 응답인지 화면 갱신인지 불분명했습니다</p></div>
                      <div className="ba-col after"><span className="ba-label">해결</span><p>원인은 antd Table의 <code>rowKey</code> 중복. 키가 같으면 React가 바뀐 행을 새 행으로 인식하지 못해 다시 그리지 않았습니다. 펼침 목록의 <b>행 고유 키 규칙</b>을 세워 해결하고 재발 방지 규칙으로 문서화</p></div>
                    </div>
                  </div>
                  <div className="pd-work-item">
                    <h5>3. 로딩 UX 설계</h5>
                    <ul className="pd-sublist">
                      <li><b>200ms 지연 게이트</b>: 빠른 응답에서 스켈레톤이 한 프레임 떴다 사라지는 깜빡임을 제거. 짧으면 자리표시 없이 바로 페이드인, 길면 스켈레톤</li>
                      <li><b>점진 노출</b>: GNB·LNB·본문이 각자 준비되는 즉시 전환. 전체 화면 스켈레톤으로 준비된 영역까지 묶어두지 않아 체감 대기 시간 감소</li>
                      <li>GNB 사용자 영역은 부분 스켈레톤 대신 완성 후 한 번에 페이드인. 이름 길이에 따라 아이콘이 튀는 레이아웃 시프트 제거</li>
                      <li><code>prefers-reduced-motion</code> 사용자에게는 페이드 없이 즉시 표시</li>
                    </ul>
                  </div>
                </div>

                <div className="pd-block">
                  <h4>성장한 점</h4>
                  <div className="pd-growth-item">
                    <div className="pd-tags"><span>#AI_주도_개발</span><span>#문서화</span><span>#하네스</span></div>
                    <p>AI 주도 개발에서는 문서화가 곧 개발 속도였습니다. 캐시 전략, 로딩 UX 정책 같은 팀 기준을 패턴 문서(SSOT)로 정립하자 AI가 참조할 맥락이 생겼고, AI가 같은 실수를 반복하지 않도록 팀 내 하네스(컨벤션, 체크리스트, 가드)를 설정하는 일이 코드 작성만큼 중요해졌습니다. <b>AI 시대의 팀 품질은 문서와 하네스가 결정한다는 것을 배웠습니다.</b></p>
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
