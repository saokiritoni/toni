import { ExportOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'
import WorkParts from '../components/WorkParts'

export default function FarmDetail() {
  return (
    <>
      <div className="pd-meta">
        <Tag variant="filled">2025.01 – 2026.02 (1년)</Tag>
        <Tag variant="filled">동아리</Tag>
        <Tag variant="filled">Leader / Backend</Tag>
      </div>
      <p className="pd-catch">동아리 공식 홈페이지와 회원 커뮤니티</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">디자이너, 프론트엔드, 백엔드, 게임 개발자 약 20명의 팀을 이끌며, 동국대 소프트웨어 동아리 Farm System의 홈페이지를 개발하고 운영했습니다. 신입 부원 지원서 접수와 회원 커뮤니티(파밍로그)를 제공했고, 170명 이상의 회원이 사용했습니다.</p>
      </div>

      <div className="pd-block">
        <h4>Tech</h4>
        <div className="pd-tech"><Tag variant="filled">Spring Boot</Tag><Tag variant="filled">MySQL</Tag><Tag variant="filled">Redis</Tag><Tag variant="filled">Docker</Tag><Tag variant="filled">AWS (EC2 / RDS / ALB / WAF)</Tag></div>
      </div>

      <div className="pd-block">
        <h4>진행한 일</h4>
        <WorkParts
          parts={[
            {
              title: '운영 중 발견한 비정상 트래픽 대응',
              content: (
                <>
                  <div className="pd-ba stack">
                    <div className="ba-col problem"><span className="ba-label">문제</span><p>Google Analytics와 MS Clarity로 모니터링하던 중 해외에서 들어오는 비정상 트래픽을 발견했습니다. 실제 사용자가 이용 중인 서비스라 운영을 멈추지 않고 대응해야 했습니다.</p></div>
                    <div className="ba-col after"><span className="ba-label">해결</span><p>서비스 이용자가 Farm System 회원과 신규 지원자로 한정되므로, ALB에 AWS WAF를 적용해 한국에서 오는 접속만 허용했습니다. 서비스를 멈추지 않고 비정상 트래픽 14,000건을 차단했습니다. 이후 팀 회고에서는 트래픽이 ALB까지 들어온 뒤에야 걸러진다는 점을 짚고, CloudFront처럼 더 앞단에서 차단하는 구조와 비교했습니다.</p></div>
                  </div>
                </>
              ),
            },
            {
              title: '암호화된 RDS의 계정 간 이전',
              content: (
                <>
                  <div className="pd-ba stack">
                    <div className="ba-col problem"><span className="ba-label">문제</span><p>교내 SW교육원 요청으로 홈페이지를 연계 회사의 AWS 계정으로 옮기면서 RDS 스냅샷을 공유했지만, 스냅샷이 AWS 관리형 KMS 키로 암호화되어 있어 새 계정에서 복원할 수 없었습니다. AWS 관리형 키는 키 정책을 바꿀 수 없어서 다른 계정에 사용 권한을 줄 수 없기 때문입니다.</p></div>
                    <div className="ba-col after"><span className="ba-label">해결</span><p>고객 관리형 KMS 키로 스냅샷을 다시 암호화하고, 그 키의 정책에 새 계정의 사용 권한을 준 뒤 스냅샷을 공유하고 복사해 RDS를 복원했습니다(KMS Double Copy).</p></div>
                  </div>
                  <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/49" target="_blank" rel="noopener">관련 글: 암호화된 RDS를 다른 계정으로 이전하기, KMS Double Copy <ExportOutlined /></Typography.Link>
                </>
              ),
            },
            {
              title: '20명이 함께 개발하는 방식',
              content: (
                <>
                  <div className="pd-ba stack">
                    <div className="ba-col problem"><span className="ba-label">문제</span><p>팀원 약 20명은 학년, 개발 경험, 참여할 수 있는 시간이 모두 달랐습니다. 처음에는 업무를 비슷한 크기로 나누고 주간회의에서 진척을 확인하는 것이 공평한 협업이라고 생각했습니다. 하지만 일부에게 부담이 몰리면서 기여도에 대한 불만이 생겼고, 회의는 각자의 진행 상황만 보고하는 자리가 됐습니다.</p></div>
                    <div className="ba-col after"><span className="ba-label">해결</span><p>주간회의를 진행 보고 대신 기술 관심사와 어려움을 공유하는 자리로 바꾸고, 여기서 나온 이야기를 바탕으로 역할과 일정을 다시 조정했습니다. 막힌 문제는 회의에서 함께 논의했습니다.</p></div>
                  </div>
                </>
              ),
            },
          ]}
        />
      </div>
    </>
  )
}
