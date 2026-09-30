import type { ReactNode } from 'react'

export type ProjectKey = 'nhnad' | 'ad-analytics' | 'gpu' | 'farm'

type ProjectBase = {
  key: ProjectKey
  /** 상세 모달 제목. 상세 내용 컴포넌트는 src/details/index.ts 에서 key 로 찾는다 */
  modalTitle: string
}

/** 상단 가로형 카드 (AdOnChat). 왼쪽 패널에 제목(title)과 부제(catch)를 보여 준다 */
export type FeaturedProject = ProjectBase & {
  catch: string
  role: string
  period: string
  tech: string[]
  title: string
  overview: string
  points: ReactNode[]
}

/** 3열 그리드 카드 */
export type GridProject = ProjectBase & {
  /** 카드 윗부분의 색 영역. 제목(title)과 한 줄 소개(catch)를 보여 준다 */
  thumb: { tone: 'g1' | 'g2' | 'g3'; catch: string }
  role: string
  year: string
  title: string
  points: string[]
  stack: string[]
}

export const FEATURED: FeaturedProject = {
  key: 'nhnad',
  modalTitle: 'AdOnChat',
  catch: 'AI Agent 기반 검색광고 운영 솔루션',
  role: 'NHN AD · Frontend, Backend · 기여 20%',
  period: '2026.05 – 현재',
  tech: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'TypeScript', 'React'],
  title: 'AdOnChat',
  overview: '광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션',
  points: [
    <>
      <b>Backend</b>: 여러 서버가 동시에 처리하는 대량 광고 작업의 동시성과 데이터 정합성을 DB 락·제약조건으로 보장하고, 약
      60종의 대량 작업을 하나의 공통 구조로 묶어 기존 코드를 고치지 않고 새 작업을 추가할 수 있도록 설계
    </>,
    <>
      <b>Backend</b>: 소셜 로그인·세션·비정상 접근 차단·운영 알림까지 인증과 운영 기반을 설계·구현
    </>,
    <>
      <b>Frontend</b>: TanStack Query 캐시 전략과 로딩 UX를 설계해 화면 데이터의 신선도와 체감 속도를 개선
    </>,
  ],
}

export const GRID_PROJECTS: GridProject[] = [
  {
    key: 'ad-analytics',
    modalTitle: 'AI 기반 광고 분석 서비스 · NHN AD 인턴 과제',
    thumb: {
      tone: 'g1',
      catch: '"대시보드를 보지 말고, 대화하세요."',
    },
    role: 'Frontend, Backend · 기여 100%',
    year: '2026 · 2주',
    title: 'AI 기반 광고 분석 서비스 · NHN AD 인턴 과제',
    points: ['자연어로 광고 데이터를 분석하는 AI 서비스', '13개 AWS 서비스 서버리스 아키텍처를 2주 단독 설계, 응답 99.58%↓ · 비용 83%↓'],
    stack: ['EventBridge', 'Lambda', 'Athena', 'Bedrock', 'Redis'],
  },
  {
    key: 'gpu',
    modalTitle: 'GPU 서버 관리 자동화 시스템',
    thumb: { tone: 'g2', catch: '"관리 시간을 5분 안으로 단축하다."' },
    role: 'Backend · 기여 30%',
    year: '2025–26',
    title: 'GPU 서버 관리 자동화',
    points: ['AI 연구자용 GPU 서버 자원·권한을 관리하는 Kubernetes 자동화 시스템', '백엔드 개발, 관리 시간 30분→5분(90%↓) · 알림 발송 안정화'],
    stack: ['Spring Boot', 'Kubernetes', 'Redis', 'MySQL'],
  },
  {
    key: 'farm',
    modalTitle: 'Farm System 동아리 홈페이지',
    thumb: {
      tone: 'g3',
      catch: '"쉽고 즐거운 동아리 생활을 위해."',
    },
    role: 'Leader · Backend 30%',
    year: '2025–26',
    title: 'Farm System 동아리 홈페이지',
    points: ['동아리 공식 홈페이지 + 내부 커뮤니티(파밍로그) 서비스', '20여 명 팀 리드 · AWS 운영, 악성 트래픽 14,000건 무중단 차단'],
    stack: ['Spring Boot', 'AWS WAF', 'RDS', 'Docker'],
  },
]

export const ALL_PROJECTS: ProjectBase[] = [FEATURED, ...GRID_PROJECTS]
