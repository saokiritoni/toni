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
      <p className="pd-catch">"학생들이 쉽고 즐겁게 동아리 생활을 할 수 있도록."</p>

      <div className="pd-block">
        <h4>개요</h4>
        <ul className="pd-sublist">
          <li><b>공식 홈페이지</b>: 동국대 소프트웨어 동아리 Farm System 공식 홈페이지, 동아리 정보 제공 + 신입 부원 지원서 작성 서비스</li>
          <li><b>파밍로그</b>: 동아리 내부 커뮤니티, 세 가지 미션(출석·응원·게시글)으로 '씨앗' 적립·랭킹, 씨앗으로 미니 게임(텃밭 가꾸기) 플레이</li>
        </ul>
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
              title: '해외 악성 트래픽 차단 (AWS WAF)',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>Google Analytics·MS Clarity 모니터링 중 독일 등에서 비정상 트래픽 유입 발견, 운영 중단 없이 차단 필요</p></div>
                    <div className="ba-col after"><span className="ba-label">After</span><p>ALB에 WAF를 적용해 해외 트래픽을 막았고, 서비스 중단 없이 비정상 트래픽 <b>14,000건</b>을 차단했습니다</p></div>
                  </div>
                </>
              ),
            },
            {
              title: 'AWS 리소스 마이그레이션, RDS Double Copy',
              content: (
                <>
                  <div className="pd-ba">
                    <div className="ba-col before"><span className="ba-label">Before</span><p>교내 SW교육원 요청으로 동아리 홈페이지를 연계 회사 AWS 계정으로 이전</p></div>
                    <div className="ba-col problem"><span className="ba-label">문제</span><p>스냅샷을 공유하면 끝날 줄 알았지만, 스냅샷이 AWS 관리형 키로 암호화되어 있었습니다. AWS 관리형 키는 키 정책을 바꿀 수 없어서 다른 계정에 권한을 줄 수 없고, 그래서 받은 계정에서 복원할 수 없었습니다. <b>암호화된 데이터를 옮길 수 있는지는 키를 누가 관리하는지가 결정</b>했습니다</p></div>
                    <div className="ba-col after"><span className="ba-label">After</span><p>직접 관리하는 KMS 키(고객 관리형 키)를 만들고, 그 키로 스냅샷을 다시 암호화해 복사했습니다. 이 키의 정책에 새 계정의 사용 권한을 주고 스냅샷을 공유한 뒤, 새 계정에서 다시 복사해 인스턴스를 복원했습니다(<b>KMS Double Copy</b>)</p></div>
                  </div>
                  <Typography.Link className="pd-link" href="https://kiritoni.tistory.com/49" target="_blank" rel="noopener">관련 글: 암호화된 RDS를 다른 계정으로 이전하기, KMS Double Copy <ExportOutlined /></Typography.Link>
                </>
              ),
            },
          ]}
        />
      </div>

      <div className="pd-block">
        <h4>성장한 점</h4>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#리더십</span><span>#협업</span><span>#팀의_속도</span></div>
          <p>디자이너·프론트·백엔드·게임 개발자 약 20명을 이끌었습니다. 학년, 개발 경험, 투입 가능한 시간이 모두 달랐는데, 처음에는 일정을 촘촘하게 관리하면 팀의 속도가 오를 거라 생각했습니다. 실제로는 구성원마다 상황이 달라 기여도에 대한 불만이 생겼습니다. <b>팀의 속도를 높이는 것은 일정을 압축하는 일이 아니라 각자의 상황을 이해하고 방향을 맞추는 과정</b>이라는 것을 배웠고, 이후 신속한 공유와 집단지성으로 기술 이슈와 일정 부담을 함께 풀어갔습니다.</p>
        </div>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#회고</span><span>#기술</span><span>#의사결정</span></div>
          <p>WAF를 ALB에 적용했지만 팀 회고에서 아쉬움이 나왔습니다. 악성 트래픽이 이미 ALB까지 도달한 뒤에야 걸러지므로, 대규모 공격이 들어오면 서버 부하를 피하기 어렵다는 지적이었습니다. 그래서 <b>WAF를 CloudFront 단으로 전진 배치하면 더 효율적</b>이라는 결론에 이르렀습니다.</p>
        </div>
        <div className="pd-growth-item">
          <div className="pd-tags"><span>#보람</span><span>#가치</span></div>
          <p>170명 이상의 회원이 랭킹을 올리려 열정적으로 서비스를 쓰는 모습을 지켜봤습니다. '내 손'으로 설계·배포한 서비스가 즐거움과 활발한 소통을 이끌어낸 뿌듯함, <b>개발자의 가장 큰 즐거움은 '사람을 향한 기술'에서 온다는 가치</b>를 깨달았습니다.</p>
        </div>
      </div>
    </>
  )
}
