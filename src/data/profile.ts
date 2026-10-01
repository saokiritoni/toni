// 포트폴리오 문구 대부분은 이 파일에서 고친다. 프로젝트 카드는 projects.tsx, 상세 모달은 src/details/ 에 있다.

export const EMAIL = 'leesoeun2746@naver.com'
export const GITHUB_URL = 'https://github.com/saokiritoni'
export const BLOG_URL = 'https://kiritoni.tistory.com/'

export const HERO_NAME = '이소은 Soeun Lee'
// 히어로 이름 줄 옆 한자 이름. index.html 의 Noto Serif KR 은 이 세 글자만 받아 오므로, 바꾸면 그 링크의 text= 도 바꾼다
export const NAME_HANJA = '李炤垠'

export const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
] as const

export type SkillGroup = { title: string; items: { name: string }[] }

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: '// language & framework',
    items: [
      { name: 'Java' },
      { name: 'Kotlin' },
      { name: 'Spring Boot' },
    ],
  },
  {
    title: '// database & storage',
    items: [{ name: 'PostgreSQL' }, { name: 'DynamoDB' }],
  },
  {
    title: '// devops & infra',
    items: [{ name: 'AWS' }, { name: 'Docker' }, { name: 'Ubuntu Linux' }],
  },
  {
    title: '// collaboration & ai',
    items: [{ name: 'Git' }, { name: 'Claude Code' }],
  },
]

export type TimelineItem = { period: string; company: string; role: string }

export const EXPERIENCE: TimelineItem[] = [
  {
    period: '2026.08 – 현재',
    company: 'NHN AD',
    role: '개발자 / 매니저',
  },
  {
    period: '2026.02 – 2026.08',
    company: 'NHN AD',
    role: '개발자 / 인턴',
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
  },
  {
    period: '2024.03 – 2026.02',
    company: 'Farm System (동국대학교 개발 동아리)',
    role: '보안/웹 트랙장, 개발팀 리더',
  },
  {
    period: '2021.03 – 2026.02',
    company: '동국대학교 서울캠퍼스',
    role: '경영정보학과 / 융합소프트웨어',
  },
]

export type Credential = { year: string; strong: string; rest: string }

export const AWARDS: Credential[] = [
  { year: '2024', strong: '고용노동부 장관상', rest: ' / KDT 해커톤' },
  { year: '2024', strong: '대상', rest: ' / 동국대 AI융합대학 해커톤' },
  { year: '2025', strong: '원장상', rest: ' / 여름 ICIP & 캡스톤디자인 결과발표회' },
  { year: '2025', strong: '우수상', rest: ' / 동국대 오픈소스 프로젝트 경진대회' },
]

export const LICENSES: Credential[] = [
  { year: '2026', strong: 'AWS', rest: ' Certified Solutions Architect – Associate' },
  { year: '2026', strong: 'AWS', rest: ' Certified Developer – Associate' },
  { year: '2026', strong: '리눅스마스터', rest: ' 2급' },
  { year: '2025', strong: 'SQLD', rest: ' / SQL 개발자' },
  { year: '외국어', strong: 'TOEIC Speaking', rest: ' IH' },
]
