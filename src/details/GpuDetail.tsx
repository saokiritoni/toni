import { ExportOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'
import ImplDetail from '../components/ImplDetail'
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
        <p className="pd-p">GPU 서버 관리자로 일하며 직접 겪은 반복 업무를 자동화한, Kubernetes 기반 GPU 자원 관리 시스템입니다. 서버 15대와 GPU 81개 이상을 운영하면서 Google Sheet의 신청 정보를 확인하고 SSH로 접속해 컨테이너 생성과 권한 부여를 직접 수행했습니다. 처음에는 반복 명령을 Script로 줄였고, 이후 신청 정보가 실제 자원 생성과 회수까지 이어지는 Web UI로 확장했습니다.</p>
        <ul className="pd-whr">
          <li><span className="k">Why</span><span>Google Sheet로 신청을 확인하고 SSH로 접속해 직접 작업하는 수작업. 연구자 데이터를 다루기에 명령어 하나의 실수도 큰 부담</span></li>
          <li><span className="k">How</span><span>반복 작업을 Script로, 이어서 신청 정보가 실제 자원 생성까지 이어지는 Web UI로 단계적 자동화</span></li>
          <li><span className="k">Result</span><span>관리 업무 약 <b>30분 → 5분</b> · 신청부터 자원 생성까지 하나의 흐름으로 연결</span></li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>핵심 기능</h4>
        <ul className="pd-sublist">
          <li><b>자원 프로비저닝</b>: Linux 서버 계정을 만들고 Kubernetes 자원을 할당합니다</li>
          <li><b>자원 수명 관리</b>: 만료 기한이 지난 Pod·웹 계정을 찾아 회수하고, 만료 예정·삭제 알림을 Slack·Email로 보냅니다</li>
          <li><b>운영 자동화</b>: 신청 정보부터 자원 생성·회수까지 Web UI에서 관리합니다</li>
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
                    <div className="ba-col before"><span className="ba-label">Before</span><p>Google Sheet의 신청 정보를 보고 SSH로 서버에 접속해 컨테이너 생성과 권한 부여를 직접 수행했습니다. 실수를 막으려고 명령어를 여러 번 확인해야 했고, Sheet와 실제 서버 상태가 어긋나기도 했습니다</p></div>
                    <div className="ba-col problem"><span className="ba-label">1단계 · Script</span><p>Docker 생성·권한 부여 같은 반복 명령을 Script로 묶어 직접 입력을 줄였습니다. 다만 사람이 신청 정보를 보고 인자를 넘기는 이상, 잘못된 인자를 넘길 가능성은 그대로 남았습니다</p></div>
                    <div className="ba-col after"><span className="ba-label">2단계 · Web UI</span><p>신청 정보를 입력으로 받아 <b>Linux 계정 생성, UID/GID 발급, Kubernetes 자원 생성·할당, 만료 자원 탐지·회수</b>까지 이어지게 했습니다. 사람이 명령을 옮겨 입력하던 과정을 시스템의 흐름으로 바꿔, 약 30분 걸리던 관리 작업을 5분 안으로 줄였습니다</p></div>
                  </div>
                </>
              ),
            },
            {
              title: 'Slack Rate Limit과 작업 분리',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>만료 계정·컨테이너 정리와 Slack 알림이 같은 흐름에 있어, 알림이 몰려 Rate Limit(429)이 나면 <b>부가 기능인 알림의 실패 때문에 핵심 작업인 정리까지 멈췄습니다</b></p></div>
                    <div className="ba-col after"><span className="ba-label">After</span><p><b>자원 정리는 반드시 성공해야 하지만 알림은 나중에 보내도 된다</b>고 판단해, Redis List 기반 Producer-Consumer로 두 작업의 실패 범위를 분리했습니다. 알림은 정리가 커밋된 뒤에만 큐에 넣도록 <code>AFTER_COMMIT</code> 이벤트를 써서, 롤백된 작업에 "정리됐습니다" 알림이 나가지 않게 했습니다</p></div>
                  </div>
                  <ImplDetail>
                    <li>Consumer는 <code>BRPOP</code>으로 메시지를 하나씩 꺼내 Slack이 허용하는 속도로 보냅니다</li>
                    <li>메모리 큐로 옮기면 서버가 재시작될 때 대기 중인 알림이 사라지므로, 메시지를 Redis에 두어 재시작에도 남게 했습니다</li>
                  </ImplDetail>
                  <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/52" target="_blank" rel="noopener">관련 글: Slack Rate Limit을 Redis 메시지 큐로 해결하기 <ExportOutlined /></Typography.Link>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className="pd-block">
        <h4>돌아보며</h4>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#서버관리자</span><span>#반복_확인</span></div>
          <p>처음에는 실수하지 않기 위해 명령어와 입력값을 여러 번 확인하는 것이 최선이라고 생각했습니다. 하지만 같은 작업을 반복하면서 생각이 바뀌었습니다. <b>반복해서 확인해야 하는 일이 있다면 더 꼼꼼하게 확인하는 것보다, 그 확인 자체가 필요 없는 구조를 만드는 것이 엔지니어의 역할</b>이라고 배웠습니다. 이 생각이 Script를 거쳐 Web UI까지 자동화하는 계기가 됐습니다.</p>
        </div>
        <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/50" target="_blank" rel="noopener">관련 글: 1년간 GPU 서버 관리자로 일하며 배운 것 <ExportOutlined /></Typography.Link>
      </div>
    </>
  )
}
