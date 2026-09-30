// 포트폴리오 문구 대부분은 이 파일에서 고친다. 프로젝트 카드는 projects.tsx, 상세 모달은 src/details/ 에 있다.

export const EMAIL = 'leesoeun2746@naver.com'
export const GITHUB_URL = 'https://github.com/saokiritoni'
export const BLOG_URL = 'https://kiritoni.tistory.com/'

export const HERO_PHRASES = ['Software Engineer', 'Java, Kotlin, Spring Boot', 'Backend · Frontend · Infra']

export const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
] as const

export type SkillGroup = { title: string; items: { name: string; main?: boolean }[] }

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: '// language & framework',
    items: [
      { name: 'Java', main: true },
      { name: 'Kotlin', main: true },
      { name: 'Spring Boot', main: true },
    ],
  },
  {
    title: '// database & storage',
    items: [{ name: 'PostgreSQL', main: true }, { name: 'DynamoDB' }],
  },
  {
    title: '// devops & infra',
    items: [{ name: 'AWS', main: true }, { name: 'Docker', main: true }, { name: 'Ubuntu Linux' }],
  },
  {
    title: '// collaboration & ai',
    items: [{ name: 'Git' }, { name: 'Claude Code', main: true }],
  },
]

export type TimelineItem = { period: string; company: string; role: string; desc?: string[] }

export const EXPERIENCE: TimelineItem[] = [
  {
    period: '2026.08 – 현재',
    company: 'NHN AD',
    role: 'Backend 개발 매니저',
    desc: ['광고 운영 솔루션 Backend 개발'],
  },
  {
    period: '2026.02 – 2026.08',
    company: 'NHN AD',
    role: 'Backend 개발 인턴',
    desc: [
      '광고 운영 솔루션의 인증·인가, 매체 계정 관리, 대량 광고 작업, 운영 기능 개발',
      '동시성 제어 · 데이터 정합성 · 트랜잭션 설계 · 감사로그 개선',
    ],
  },
  {
    period: '2025.09 – 2026.06',
    company: 'Google Developer Group on Campus Dongguk University',
    role: 'Server/Cloud Core Member',
  },
  {
    period: '2025.03 – 2026.02',
    company: '동국대학교 서버실',
    role: 'GPU 서버 관리자 (학생연구자)',
    desc: [
      '고성능 서버 15대 · GPU 81개 이상 운영, AI 연구자 대상 인프라 지원',
      'SSH 수작업 → Script → Web UI로 관리 업무 단계적 자동화',
    ],
  },
  {
    period: '2024.03 – 2026.02',
    company: 'Farm System (동국대학교 개발 동아리)',
    role: '보안/웹 트랙장 · 개발팀 리더',
    desc: ['약 20명 개발팀 리딩, 공식 홈페이지·내부 커뮤니티 백엔드 개발 및 AWS 운영'],
  },
]

export type Credential = { year: string; strong: string; rest: string }

export const AWARDS: Credential[] = [
  { year: '2024', strong: '고용노동부 장관상', rest: ' · KDT 해커톤' },
  { year: '2024', strong: '대상', rest: ' · 동국대 AI융합대학 해커톤' },
  { year: '2025', strong: '원장상', rest: ' · 여름 ICIP & 캡스톤디자인 발표회' },
  { year: '2025', strong: '우수상', rest: ' · 동국대 오픈소스 프로젝트 경진대회' },
]

export const LICENSES: Credential[] = [
  { year: '2026', strong: 'AWS', rest: ' Certified Solutions Architect – Associate' },
  { year: '2026', strong: 'AWS', rest: ' Certified Developer – Associate' },
  { year: '2026', strong: '리눅스마스터', rest: ' 2급' },
  { year: '2025', strong: 'SQLD', rest: ' · SQL 개발자' },
  { year: '외국어', strong: 'TOEIC Speaking', rest: ' IH' },
]
