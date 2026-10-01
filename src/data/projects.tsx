import type { ReactNode } from 'react'

export type ProjectKey = 'nhnad' | 'ad-analytics' | 'gpu' | 'farm'

type ProjectBase = {
  key: ProjectKey
  /** 상세 모달 제목. 상세 내용 컴포넌트는 src/details/index.ts 에서 key 로 찾는다 */
  modalTitle: string
  /** 개발한 곳. 카드 제목 위에 작게 보여 준다 */
  org: string
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
  /** 카드 윗부분의 색 영역 배경. 이 영역에 개발한 곳·제목·기술 스택(stack)을 보여 준다 */
  thumb: { tone: 'g1' | 'g2' | 'g3' }
  role: string
  title: string
  points: string[]
  stack: string[]
}

export const FEATURED: FeaturedProject = {
  key: 'nhnad',
  modalTitle: 'AdOnChat',
  org: 'NHN AD',
  catch: 'AI Agent 기반 검색광고 운영 솔루션',
  role: 'Frontend, Backend',
  period: '2026.05 – 현재',
  tech: ['Kotlin', 'Spring Boot', 'PostgreSQL', 'TypeScript', 'React'],
  title: 'AdOnChat',
  overview: '광고 매체 계정을 연동해 대량 광고 작업을 처리하고, 자연어 대화로 광고 데이터를 분석하는 B2B 광고 운영 솔루션',
  points: [
    '광고 계정 연동, 권한, 대량 작업, 감사로그 등 B2B 광고 운영 기능 개발',
    '동시 강등으로 운영자가 0명이 되는 문제와 감사로그 누락 문제 해결',
    'AI 요청의 시간 제한을 조정하고, 시간 초과 후 결과가 등록되지 않도록 개선',
  ],
}

export const GRID_PROJECTS: GridProject[] = [
  {
    key: 'ad-analytics',
    modalTitle: 'AI 기반 광고 분석 서비스 / NHN AD 인턴 과제',
    org: 'NHN AD',
    thumb: { tone: 'g1' },
    role: 'Frontend, Backend',
    title: '[인턴 과제] 자연어 광고 분석 서비스',
    points: [
      '자연어 질문으로 광고 데이터를 조회하고 분석하는 AI 서비스 개발',
      '데이터 수집부터 분석과 리포트까지 2주 만에 MVP로 완성',
      '마케터의 업무 방식을 확인하고 PDF 리포트를 Excel 다운로드로 변경',
    ],
    stack: ['EventBridge', 'Lambda', 'Athena', 'Bedrock', 'Redis'],
  },
  {
    key: 'gpu',
    modalTitle: 'GPU 서버 관리 자동화 시스템',
    org: '동국대학교 GPU 서버실',
    thumb: { tone: 'g2' },
    role: 'Backend',
    title: '서버 관리 자동화 시스템',
    points: [
      'Google Sheet와 SSH로 처리하던 GPU 서버 관리 업무를 Web UI로 자동화',
      '신청 정보로 Linux 계정과 GPU 자원을 만들고, 기한이 지나면 회수',
      '신청 1건을 처리해 안내하기까지 약 30분에서 5분 이내로 단축',
    ],
    stack: ['Spring Boot', 'Kubernetes', 'Redis', 'MySQL'],
  },
  {
    key: 'farm',
    modalTitle: 'Farm System 동아리 홈페이지',
    org: '동국대학교 Farm System',
    thumb: { tone: 'g3' },
    role: 'Leader / Backend',
    title: 'Farm System 동아리 홈페이지',
    points: [
      '디자이너와 개발자 약 20명의 팀을 이끌며 동아리 홈페이지 개발과 운영',
      '주간회의에서 어려움을 공유하고 역할과 일정을 재조정',
      '170명 이상이 사용하는 서비스를 운영하며 비정상 트래픽 차단과 RDS 계정 이전 처리',
    ],
    stack: ['Spring Boot', 'AWS WAF', 'RDS', 'Docker'],
  },
]

export const ALL_PROJECTS: ProjectBase[] = [FEATURED, ...GRID_PROJECTS]
