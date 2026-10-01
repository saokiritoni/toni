import { ExportOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'
import ImplDetail from '../components/ImplDetail'
import WorkParts from '../components/WorkParts'

export default function GpuDetail() {
  return (
    <>
      <div className="pd-meta">
        <Tag variant="filled">2025.07 – 2026.02 (8개월)</Tag>
        <Tag variant="filled">동국대 서버실</Tag>
        <Tag variant="filled">Backend</Tag>
        <Tag variant="filled">서버 15대 / GPU 81개+</Tag>
      </div>
      <p className="pd-catch">GPU 서버 사용 신청부터 자원 생성과 회수까지 관리하는 웹 서비스</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">2025년 3월부터 GPU 서버 관리자로 서버 15대와 GPU 81개 이상을 운영하며 직접 겪은 반복 업무를 자동화한, Kubernetes 기반 GPU 자원 관리 시스템입니다. 연구자의 데이터를 다루는 서버라 명령어 하나의 실수도 큰 부담이었습니다.</p>
      </div>

      <div className="pd-block">
        <h4>핵심 기능</h4>
        <ul className="pd-sublist">
          <li><b>자원 프로비저닝</b>: Linux 서버 계정을 만들고 Kubernetes 자원을 할당합니다.</li>
          <li><b>자원 수명 관리</b>: 만료 기한이 지난 Pod와 웹 계정을 찾아 회수하고, 만료 예정 / 삭제 알림을 Slack과 Email로 보냅니다.</li>
        </ul>
      </div>

      <div className="pd-block">
        <h4>Tech</h4>
        <div className="pd-tech"><Tag variant="filled">Spring Boot</Tag><Tag variant="filled">MySQL</Tag><Tag variant="filled">Redis</Tag><Tag variant="filled">Kubernetes (on-premise)</Tag><Tag variant="filled">Helm</Tag><Tag variant="filled">GitHub Actions</Tag><Tag variant="filled">Docker</Tag></div>
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
                    <div className="ba-col before"><span className="ba-label">Before</span><p>Google Sheet의 신청 정보를 보고 SSH로 서버에 접속해 컨테이너 생성과 권한 부여를 직접 수행했습니다. 실수를 막으려고 명령어를 여러 번 확인해야 했고, Sheet와 실제 서버 상태가 어긋나기도 했습니다.</p></div>
                    <div className="ba-col problem"><span className="ba-label">1단계 / Script</span><p>Docker 생성, 권한 부여 같은 반복 명령을 Script로 묶어 직접 입력을 줄였습니다. 다만 사람이 신청 정보를 보고 인자를 넘기는 이상, 잘못된 인자를 넘길 가능성은 그대로 남았습니다.</p></div>
                    <div className="ba-col after"><span className="ba-label">2단계 / Web UI</span><p>신청 정보를 입력으로 받아 Linux 계정 생성, UID/GID 발급, Kubernetes 자원 생성과 할당, 만료 자원 탐지와 회수까지 이어지게 했습니다. 신청 1건을 처리해 사용자에게 완료 안내를 보내기까지 약 30분 걸리던 시간이 5분 안으로 줄었습니다.</p></div>
                  </div>
                </>
              ),
            },
            {
              title: 'Slack Rate Limit과 작업 분리',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>만료 계정과 컨테이너 정리와 Slack 알림이 같은 흐름에 있어, 알림이 몰려 Rate Limit(429)이 나면 알림 실패 때문에 정리 작업까지 멈췄습니다.</p></div>
                    <div className="ba-col after"><span className="ba-label">After</span><p>자원 정리는 반드시 끝나야 하지만 알림은 늦게 보내도 되므로, Redis List 기반 Producer-Consumer로 두 작업의 실패 범위를 나눴습니다. 알림은 정리가 커밋된 뒤에만 큐에 넣도록 <code>AFTER_COMMIT</code> 이벤트를 써서, 롤백된 작업에 "정리됐습니다" 알림이 나가지 않게 했습니다.</p></div>
                  </div>
                  <ImplDetail>
                    <li>Consumer는 <code>BRPOP</code>으로 메시지를 하나씩 꺼내 Slack이 허용하는 속도로 보냅니다.</li>
                    <li>메모리 큐로 옮기면 서버가 재시작될 때 대기 중인 알림이 사라지므로, 메시지를 Redis에 두어 재시작에도 남게 했습니다.</li>
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
        <p className="pd-p">처음에는 명령어와 입력값을 여러 번 확인하는 것이 실수를 막는 최선이라고 생각했습니다. 같은 작업을 반복하면서, 확인을 더 꼼꼼히 하기보다 사람이 확인해야 하는 지점 자체를 줄이는 쪽으로 생각이 바뀌었고, 이것이 Script를 거쳐 Web UI까지 만든 계기가 됐습니다.</p>
        <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/50" target="_blank" rel="noopener">관련 글: 1년간 GPU 서버 관리자로 일하며 배운 것 <ExportOutlined /></Typography.Link>
      </div>
    </>
  )
}
