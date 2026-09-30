import { ExportOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'

export default function GpuDetail() {
  return (
    <>
      <div className="pd-meta">
        <Tag variant="filled">2025.07 – 2026.02 (6개월)</Tag>
        <Tag variant="filled">동국대 서버실</Tag>
        <Tag variant="filled">Backend · 기여 30%</Tag>
        <Tag variant="filled">서버 15대 · GPU 81개+</Tag>
      </div>
      <p className="pd-catch">"30분의 GPU 관리 시간을 5분 안으로 단축하다."</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">'미니 AWS'처럼 온프레미스 환경에서 AI 연구자들의 GPU 자원과 권한을 관리하는 Kubernetes 기반 자동화 시스템입니다. 고성능 서버 15대, GPU 81개 이상을 운영하는 서버실에서 GPU 서버 관리자로 일하며 직접 겪은 수작업을 자동화했습니다.</p>
        <ul className="pd-whr">
          <li><span className="k">Why</span><span>Google Sheet로 신청을 확인하고 SSH로 접속해 직접 작업하는 수작업. 연구자 데이터를 다루기에 명령어 하나의 실수도 큰 부담</span></li>
          <li><span className="k">How</span><span>반복 작업을 Script로, 이어서 신청 정보가 실제 자원 생성까지 이어지는 Web UI로 단계적 자동화</span></li>
          <li><span className="k">Result</span><span>관리 업무 약 <b>30분 → 5분</b>, 신청 정보와 서버 상태가 어긋나는 운영 부담 해소</span></li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>핵심 기능</h4>
        <ul className="pd-sublist">
          <li><b>사용자·자원 프로비저닝</b>: Spring WebFlux로 리눅스 서버 계정 생성 및 Kubernetes PVC 할당 등 외부 API 연동</li>
          <li><b>리소스 수명 관리 스케줄러</b>: Spring Scheduler로 만료 기한(Pod·웹 계정) 자동 감지·삭제, 만료 예정·삭제 알림 발송(Slack·Email)</li>
          <li><b>Slack API 성능·안정성 최적화</b>: 대량 발송 시 생기는 Rate Limit 문제를 Redis Message Queue 비동기 구조로 전환해 해결하고, 최다 호출 API(users.list)에는 Redis 캐싱 적용</li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>Tech</h4>
        <div className="pd-tech"><Tag variant="filled">Spring Boot 3.x (Java 17)</Tag><Tag variant="filled">MySQL</Tag><Tag variant="filled">Redis</Tag><Tag variant="filled">Kubernetes (on-premise)</Tag><Tag variant="filled">Helm</Tag><Tag variant="filled">GitHub Actions</Tag><Tag variant="filled">Docker</Tag></div>
      </div>

      <div className="pd-block">
        <h4>진행한 일</h4>
        <div className="pd-work-item">
          <h5>1. 서버 관리 방식의 단계적 자동화</h5>
          <div className="pd-ba">
            <div className="ba-col before"><span className="ba-label">Before</span><p>Google Sheet의 신청 정보를 보고 SSH로 서버에 접속해 컨테이너 생성, 권한 부여를 직접 수행. 명령어를 여러 번 확인해야 했고 Sheet와 실제 서버 상태가 어긋나기도 했습니다</p></div>
            <div className="ba-col problem"><span className="ba-label">1단계 · Script</span><p>Docker 생성, 권한 부여 등 반복 명령을 Script로 묶어 직접 입력을 줄임. 다만 사람이 잘못된 인자를 넘길 가능성은 그대로 남았습니다</p></div>
            <div className="ba-col after"><span className="ba-label">2단계 · Web UI</span><p>신청 정보를 입력으로 받아 <b>Linux 계정 생성, UID/GID 발급, Kubernetes 자원 생성·할당, 만료 자원 탐지·회수</b>까지 이어지는 웹 기반 관리 시스템 개발. 신청 정보와 실제 자원 생성 흐름을 하나로 연결</p></div>
          </div>
        </div>
        <div className="pd-work-item">
          <h5>2. 모놀리식 아키텍처 관심사 분리</h5>
          <div className="pd-ba">
            <div className="ba-col before"><span className="ba-label">Before</span><p>단일 앱에 사용자 요청 처리(Web)와 리소스 집약적 K8s 제어 로직이 혼재, K8s 부하/오류가 웹 응답 저하로 이어질 위험 (Client → Flask → K8s)</p></div>
            <div className="ba-col after"><span className="ba-label">After</span><p>Web Server와 K8s Worker로 역할 분리 (Client → Spring Boot → Flask → K8s). Spring Boot: 신청·수락·UID/GID 할당·스케줄러 / Flask: K8s 제어·리소스 할당. 코드베이스 분리로 범위 파악 용이, 빌드·배포 속도 개선</p></div>
          </div>
        </div>
        <div className="pd-work-item">
          <h5>3. Slack Rate Limit으로 인한 핵심 작업 장애 격리</h5>
          <div className="pd-ba">
            <div className="ba-col before"><span className="ba-label">Before</span><p>만료 계정·컨테이너 정리 스케줄러가 Slack API를 동기 호출. 대량 알림에서 429가 발생하면 알림 실패 때문에 <b>핵심 작업인 계정 정리까지 중단</b>. 메모리 큐는 서버 재시작 시 대기 알림 유실 위험</p></div>
            <div className="ba-col after"><span className="ba-label">After</span><p>계정 정리는 반드시 수행돼야 할 핵심 로직, 알림은 실패해도 핵심에 영향을 주면 안 되는 부가 기능. <b>두 작업의 실패 범위가 같아선 안 된다</b>고 판단해 Redis List 기반 Producer-Consumer로 분리. Consumer가 BRPOP으로 Slack 속도에 맞춰 발송하고, 이미 운영 중인 Redis를 써 재시작에도 메시지 보존. <code>AFTER_COMMIT</code> 이벤트로 DB 롤백 시 알림만 나가는 문제 차단</p></div>
          </div>
          <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/52" target="_blank" rel="noopener">관련 글: Slack Rate Limit을 Redis 메시지 큐로 해결하기 <ExportOutlined /></Typography.Link>
        </div>
      </div>

      <div className="pd-block">
        <h4>성장한 점</h4>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#서버관리자</span><span>#수작업</span><span>#불편함</span></div>
          <p>처음에는 실수하지 않으려고 명령어를 여러 번 확인하는 것이 최선이었습니다. 1년간 Google Sheet 수기 관리와 SSH 수동 작업을 반복하다 보니 생각이 바뀌었습니다. <b>반복해서 확인해야 하는 일이 있다면 그 확인 자체를 줄일 방법을 찾는 것이 엔지니어의 일</b>이라는 것. 그렇게 Script를 거쳐 Web UI까지 자동화했고, 연구자들이 연구에만 몰입할 환경을 '내 손'으로 개선한 뿌듯함을 느꼈습니다.</p>
        </div>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#연구_데이터</span><span>#트랜잭션</span><span>#에러_핸들링</span></div>
          <p>수많은 AI 연구생의 데이터가 담긴 인프라 관리, '단 한 번의 로직 실수로 자원이 유실되어선 안 된다'는 원칙으로 엄격한 트랜잭션 제어와 보수적 에러 핸들링을 적용하며 <b>시스템 안정성·데이터 무결성에 대한 책임감</b>을 배웠습니다.</p>
        </div>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#아키텍처</span><span>#리팩토링</span></div>
          <p>스케줄러 성능을 최적화하며 트랜잭션을 분리하다가, 같은 클래스 안의 메서드 호출(self-invocation)이 스프링 프록시를 거치지 않아 트랜잭션이 걸리지 않는 문제를 만났습니다. 프록시 동작 방식을 확인해 호출 구조를 바꿔 해결했지만, 초기 설계 때 서비스 레이어를 더 세밀하게 분리해뒀다면 겪지 않았을 문제였습니다. 그래서 <b>확장성과 가독성을 고려한 초기 아키텍처 설계의 중요성</b>을 실감했고, 지금도 구조 개선을 고민하고 있습니다.</p>
        </div>
        <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/50" target="_blank" rel="noopener">관련 글: 1년간 GPU 서버 관리자로 일하며 배운 것 <ExportOutlined /></Typography.Link>
      </div>
    </>
  )
}
