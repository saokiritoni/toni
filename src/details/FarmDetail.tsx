import { ExportOutlined } from '@ant-design/icons'
import { Tag, Typography } from 'antd'
import WorkParts from '../components/WorkParts'

export default function FarmDetail() {
  return (
    <>
      <div className="pd-meta">
        <Tag variant="filled">2025.01 – 2026.02 (1년)</Tag>
        <Tag variant="filled">동아리</Tag>
        <Tag variant="filled">Leader · Backend 30%</Tag>
      </div>
      <p className="pd-catch">"20명이 함께 만들고 170명이 사용한 동아리 서비스."</p>

      <div className="pd-block">
        <h4>개요</h4>
        <p className="pd-p">디자이너·프론트엔드·백엔드·게임 개발자 약 20명의 팀을 이끌며, 동국대 소프트웨어 동아리 Farm System의 공식 홈페이지와 내부 커뮤니티를 개발·운영했습니다. 공식 홈페이지는 동아리 정보와 신입 부원 지원서 작성 기능을 제공했고, 내부 커뮤니티 '파밍로그'는 출석·응원·게시글 미션으로 '씨앗'을 모아 랭킹을 올리고 미니 게임(텃밭 가꾸기)을 즐길 수 있게 했습니다. <b>170명 이상의 회원</b>이 실제로 사용했습니다.</p>
      </div>

      <div className="pd-block">
        <h4>Tech</h4>
        <div className="pd-tech"><Tag variant="filled">Spring Boot 3.x (Java 17)</Tag><Tag variant="filled">MySQL</Tag><Tag variant="filled">Redis</Tag><Tag variant="filled">AWS Route 53</Tag><Tag variant="filled">ALB</Tag><Tag variant="filled">WAF</Tag><Tag variant="filled">EC2</Tag><Tag variant="filled">S3</Tag><Tag variant="filled">RDS</Tag><Tag variant="filled">Docker</Tag></div>
      </div>

      <div className="pd-block">
        <h4>진행한 일</h4>
        <WorkParts
          parts={[
            {
              title: '운영 중 발견한 비정상 트래픽 대응',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col problem"><span className="ba-label">문제</span><p>Google Analytics·MS Clarity로 모니터링하던 중 해외에서 들어오는 비정상 트래픽을 발견했습니다. 실제 사용자가 이용 중인 서비스라 <b>운영을 멈추지 않고</b> 대응해야 했습니다</p></div>
                    <div className="ba-col after"><span className="ba-label">해결</span><p>ALB에 AWS WAF를 적용해 해외 트래픽을 막아, 서비스를 멈추지 않고 비정상 트래픽 <b>14,000건</b>을 차단했습니다. 이후 팀 회고에서는 트래픽이 ALB까지 들어온 뒤에야 걸러진다는 점을 짚고, CloudFront처럼 더 앞단에서 차단하는 구조와 비교했습니다</p></div>
                  </div>
                </>
              ),
            },
            {
              title: '암호화된 RDS의 계정 간 이전',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col problem"><span className="ba-label">문제</span><p>교내 SW교육원 요청으로 홈페이지를 연계 회사의 AWS 계정으로 옮기면서 RDS 스냅샷을 공유했지만, 스냅샷이 AWS 관리형 KMS 키로 암호화되어 있어 새 계정에서 복원할 수 없었습니다. AWS 관리형 키는 키 정책을 바꿀 수 없어서 다른 계정에 사용 권한을 줄 수 없기 때문입니다</p></div>
                    <div className="ba-col after"><span className="ba-label">해결</span><p><b>암호화된 데이터를 옮기려면 데이터뿐 아니라 암호화 키의 권한도 함께 옮겨야 한다</b>고 판단했습니다. 고객 관리형 KMS 키로 스냅샷을 다시 암호화하고, 그 키의 정책에 새 계정의 사용 권한을 준 뒤 스냅샷을 공유·복사해 RDS를 복원했습니다(KMS Double Copy)</p></div>
                  </div>
                  <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/49" target="_blank" rel="noopener">관련 글: 암호화된 RDS를 다른 계정으로 이전하기, KMS Double Copy <ExportOutlined /></Typography.Link>
                </>
              ),
            },
            {
              title: '20명이 함께 개발하는 방식',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col problem"><span className="ba-label">문제</span><p>팀원 약 20명은 학년·개발 경험·참여할 수 있는 시간이 모두 달랐습니다. 처음에는 업무를 비슷한 크기로 나누고 주간회의에서 진척을 확인하는 것이 공평한 협업이라고 생각했습니다. 하지만 일부에게 부담이 몰리면서 <b>기여도에 대한 불만</b>이 생겼고, 회의는 각자의 진행 상황만 보고하는 자리가 됐습니다</p></div>
                    <div className="ba-col after"><span className="ba-label">해결</span><p><b>개인의 의지보다 협업 방식의 문제</b>라고 판단했습니다. 주간회의를 기술 관심사와 어려움을 공유하는 자리로 바꾸고, 이를 바탕으로 역할과 일정을 다시 조정했습니다. 막힌 문제는 함께 논의하면서 각자의 작업을 하나의 결과로 연결했습니다</p></div>
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
