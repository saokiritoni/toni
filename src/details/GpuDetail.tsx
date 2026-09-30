import { ExportOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'
import WorkParts from '../components/WorkParts'

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
        <WorkParts
          parts={[
            {
              title: '서버 관리 방식의 단계적 자동화',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>Google Sheet의 신청 정보를 보고 SSH로 서버에 접속해 컨테이너 생성, 권한 부여를 직접 수행. 명령어를 여러 번 확인해야 했고 Sheet와 실제 서버 상태가 어긋나기도 했습니다</p></div>
                    <div className="ba-col problem"><span className="ba-label">1단계 · Script</span><p>Docker 생성, 권한 부여 등 반복 명령을 Script로 묶어 직접 입력을 줄임. 다만 사람이 잘못된 인자를 넘길 가능성은 그대로 남았습니다</p></div>
                    <div className="ba-col after"><span className="ba-label">2단계 · Web UI</span><p>신청 정보를 입력으로 받아 <b>Linux 계정 생성, UID/GID 발급, Kubernetes 자원 생성·할당, 만료 자원 탐지·회수</b>까지 이어지는 웹 기반 관리 시스템 개발. 신청 정보와 실제 자원 생성 흐름을 하나로 연결</p></div>
                  </div>
                </>
              ),
            },
            {
              title: '모놀리식 아키텍처 관심사 분리',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>하나의 앱이 사용자 요청 처리(Web)와 무거운 K8s 제어를 함께 맡았습니다(Client → Flask → K8s). K8s 쪽이 느려지거나 실패하면 <b>그 영향이 웹 응답까지 그대로 번지는</b> 구조였습니다</p></div>
                    <div className="ba-col after"><span className="ba-label">After</span><p>역할을 Web Server와 K8s Worker로 나눴습니다(Client → Spring Boot → Flask → K8s). Spring Boot는 신청·수락·UID/GID 할당·스케줄러를, Flask는 K8s 제어·자원 할당을 맡습니다. 관심사를 나누자 한쪽의 장애가 다른 쪽으로 번지는 범위가 줄었고, 코드 범위가 명확해져 빌드·배포도 빨라졌습니다</p></div>
                  </div>
                </>
              ),
            },
            {
              title: 'Slack Rate Limit으로 인한 핵심 작업 장애 격리',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>만료 계정·컨테이너 정리 스케줄러가 Slack API를 같은 흐름 안에서 바로 호출했습니다. 알림이 몰려 429(Rate Limit)가 나면 <b>부가 기능인 알림의 실패 때문에 핵심 작업인 계정 정리까지 멈췄습니다</b>. 메모리 큐로 옮기면 서버가 재시작될 때 대기 중인 알림이 사라집니다</p></div>
                    <div className="ba-col after"><span className="ba-label">After</span><p>계정 정리는 반드시 끝나야 하는 핵심 작업이고, 알림은 실패해도 핵심에 영향을 주면 안 되는 부가 작업입니다. <b>두 작업의 실패 범위를 분리</b>하려고 Redis List 기반 Producer-Consumer로 나눴습니다. Consumer는 <code>BRPOP</code>으로 하나씩 꺼내 Slack이 허용하는 속도로 보내고, 메시지는 Redis에 남아 재시작에도 사라지지 않습니다. 또 알림은 <code>AFTER_COMMIT</code> 이벤트에서만 큐에 넣어, <b>트랜잭션이 커밋된 뒤에만 부수 효과가 일어나게</b> 했습니다. 롤백된 작업에 대해 "정리됐습니다" 알림이 나가는 일을 막기 위해서입니다</p></div>
                  </div>
                  <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/52" target="_blank" rel="noopener">관련 글: Slack Rate Limit을 Redis 메시지 큐로 해결하기 <ExportOutlined /></Typography.Link>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className="pd-block">
        <h4>성장한 점</h4>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#서버관리자</span><span>#수작업</span><span>#불편함</span></div>
          <p>처음에는 실수하지 않으려고 명령어를 여러 번 확인하는 것이 최선이었습니다. 1년간 Google Sheet 수기 관리와 SSH 수동 작업을 반복하다 보니 생각이 바뀌었습니다. <b>반복해서 확인해야 하는 일이 있다면 그 확인 자체를 줄일 방법을 찾는 것이 엔지니어의 일</b>이라는 것. 그렇게 Script를 거쳐 Web UI까지 자동화했고, 연구자들이 연구에만 몰입할 환경을 '내 손'으로 개선한 뿌듯함을 느꼈습니다.</p>
        </div>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#트랜잭션</span><span>#프록시</span></div>
          <p>스케줄러의 트랜잭션을 작업 단위로 나누다가, <code>@Transactional</code>을 붙인 메서드가 트랜잭션 없이 실행되는 문제를 만났습니다. 스프링의 <code>@Transactional</code>은 객체를 감싼 프록시가 호출을 가로채 트랜잭션을 시작하는 방식인데, 같은 클래스 안에서 메서드를 부르면(self-invocation) 프록시를 거치지 않기 때문이었습니다. 호출이 프록시를 거치도록 호출 구조를 바꿔 해결했습니다. <b>애너테이션이 "어떻게" 동작하는지 알아야 그것이 동작하지 않는 순간을 알아챌 수 있다</b>는 것, 그리고 처음부터 서비스 계층을 역할별로 나눠 두는 설계의 중요성을 배웠습니다.</p>
        </div>
        <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/50" target="_blank" rel="noopener">관련 글: 1년간 GPU 서버 관리자로 일하며 배운 것 <ExportOutlined /></Typography.Link>
      </div>
    </>
  )
}
