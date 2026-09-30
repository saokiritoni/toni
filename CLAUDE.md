# 이소은 포트폴리오 (toni)

이소은의 개인 포트폴리오 사이트다. Vite + React 19 + TypeScript + antd 6으로 만들고 Vercel에 배포한다.

## 명령

```bash
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 타입 검사(tsc -b) + 빌드. 커밋 전에 반드시 통과시킨다
npm run preview   # 빌드 결과 확인 (http://localhost:4173)
```

- Vercel 은 `vercel.json` 설정대로 `npm run build` 를 실행하고 `dist/` 를 배포한다.
- `main` 에 푸시하면 운영 사이트에 바로 배포된다. 작업은 브랜치에서 하고, Vercel 미리보기 배포로 확인한 뒤 합친다.
- 커밋 메시지는 한국어로, 무엇을 왜 바꿨는지 적는다.

## 파일 구조

| 고칠 것 | 위치 |
|---|---|
| 스킬·경력·수상·자격증·연락처 | `src/data/profile.ts` |
| 프로젝트 카드 (제목·개발한 곳·기술 스택·미리보기 항목) | `src/data/projects.tsx` |
| 상세 모달 내용 | `src/details/{프로젝트}Detail.tsx`, 연결은 `src/details/index.ts` |
| 섹션 컴포넌트 | `src/components/` |
| antd 테마 토큰 | `src/theme/AntdTheme.tsx` |
| 라이트·다크 전환 상태 | `src/theme/ThemeContext.tsx`, 첫 렌더 전 결정은 `index.html` 인라인 스크립트 |
| 전역 스타일·디자인 토큰 | `src/styles/global.css` |

상세 모달(`ProjectModal`과 `src/details/`)은 `React.lazy` 로 따로 떼어 낸 청크다. 첫 화면 코드(`Projects.tsx`, `data/projects.tsx`)에서 `src/details/` 를 import 하지 않는다. import 하면 모달 코드가 첫 화면 번들로 다시 들어간다.

## 용어

사용자와 이야기할 때 아래 이름을 쓴다.

- **카드**: 프로젝트 카드의 색 영역. AdOnChat 은 왼쪽 어두운 패널, 나머지는 위쪽 그라데이션 영역이다.
- **미리보기**: 카드 옆(AdOnChat) 또는 아래(나머지)의 본문 영역.
- **상세 모달**: 카드를 누르면 열리는 창.

## 콘텐츠 규칙

### 서술 기준

신입 개발자 포트폴리오다. 화려한 기술 이름이나 규모가 아니라 **기본 개념을 어떻게 이해했고 실제 문제에 어떻게 적용했는지**가 드러나야 한다.

- 문제를 원리로 설명한다. 예: "두 트랜잭션이 서로 다른 행을 바꿔서 기본 격리 수준으로는 막히지 않는 write skew였다."
- 해결책은 그 원리를 어떻게 적용했는지로 쓴다. 기술 이름만 나열하지 않는다.
- 약점이나 한계를 알고 받아들인 선택이면 그 사실과 이유를 함께 쓴다. 예: 원자 카운터의 판정 구간은 원자적이지 않다는 한계를 목적에 비춰 받아들였다.
- 빼는 대상: "직접 구현", "단독으로 N개 서비스" 같은 규모 강조, 도구 활용 자랑, 원리가 드러나지 않는 기능 소개, "100%"처럼 증명하기 어려운 표현.
- 회고 블록(예: "돌아보며")은 앞의 사례만 읽어서는 알 수 없는 관점 변화가 있는 프로젝트에만 둔다. 모든 모달의 형식을 똑같이 맞추지 않는다. 지금은 GPU 자동화와 인턴 과제에만 있다.
- 상세 모달의 "진행한 일"은 `WorkParts`(antd Collapse)로 Part 를 나눈다. 주제 묶음이 있으면 묶음이 Part 이고 항목 번호는 Part 마다 1부터 센다. 묶음이 없으면 항목 하나가 Part 하나다.

### 사실 확인

포트폴리오 문장은 면접에서 질문을 받는다. 확인하지 않은 내용을 쓰지 않는다.

- AdOnChat(AOC)은 aoc 저장소(`~/IdeaProjects/aoc`)의 코드와 git 기록으로 확인한다. 본인 커밋은 `saokiritori` 또는 `이소은`(이메일 `soeun-lee@nhnad.com`)이다. 다른 사람이 만든 것을 본인 설계로 쓰지 않는다.
- AOC-Memo vault 는 정본이 아니다. vault 와 aoc 코드가 어긋나면 코드를 믿는다.
- 인턴 과제(AI 광고 분석 서비스)는 GitHub 저장소 세 개를 클론해서 확인한다. 인프라 [soeun-cdk](https://github.com/hyper-rookies/soeun-cdk)(README·계획서 PDF 포함), 백엔드 [soeun-chat](https://github.com/hyper-rookies/soeun-chat), 프론트엔드 [soeun-report-frontend](https://github.com/hyper-rookies/soeun-report-frontend).
  - 저장소에 없는 수치(대시보드 응답 99.58% 감소, S3 저장 단가 $0.023 → $0.004, 리포트 전환 시점과 광고 계약 주기)는 사용자가 발표 때 확인한 값이므로 그대로 믿는다.
  - 인프라는 직접 설계한 구조와 이유만 쓴다. CDK 로 만들었다는 사실이나 큐 재시도 횟수 같은 CDK 설정 세부는 쓰지 않는다.
- 나머지 프로젝트(서버 관리 자동화·Farm System)는 코드가 이 컴퓨터에 없다. 원문에 없는 절차·이유·수치를 짐작해서 덧붙이지 않는다. 설명을 보태야 하면 사용자에게 먼저 확인한다.

### 카드와 미리보기

- 카드: 개발한 곳(`org`) → 제목 → 기술 스택 순서. 캐치프레이즈(따옴표 문구)와 지표 숫자는 넣지 않는다.
- 미리보기: 제목을 다시 쓰지 않는다. 날짜를 넣지 않는다. 미리보기 항목은 프로젝트마다 3줄로, 모달 요약이 아니라 이 프로젝트를 눌러 볼 이유를 쓴다. 역할·기여도·기술 스택은 카드에 이미 보이므로 항목에서 기술명을 나열하지 않는다. 네 프로젝트가 서로 다른 인상으로 기억되게 한다(AdOnChat: 실무·안정성, 인턴 과제: AI·빠른 MVP·사용자 업무 이해, GPU: 자동화·30분→5분, Farm System: 협업·실사용자).
- 카드와 상세 모달 상단의 기간·소속·기여도·부제는 서로 같아야 한다. 한쪽을 고치면 다른 쪽도 고친다.

## 디자인 규칙

### 토큰과 테마

- 색은 `global.css` 의 `:root` 토큰(`--bg`, `--surface-*`, `--text`, `--text-dim`, `--accent`, `--hover`, `--border*` 등)만 쓴다. 새 hex 를 쓰지 않는다. 테마마다 달라지는 반투명 색도 토큰으로 만든다.
- 다크 모드는 `:root[data-theme="dark"]` 에서 토큰을 다시 정의한다. 새 색을 추가하면 두 테마 값을 모두 정한다.
- antd 는 CSS 변수를 토큰으로 받지 못하는 곳이 있어서 `AntdTheme.tsx` 의 `PALETTE` 에 hex 로 같은 값을 적는다. `global.css` 토큰을 바꾸면 `PALETTE` 도 같이 바꾼다.
- 강조색은 `--accent`(#f54e00), hover 는 `--hover`. 헤더 GitHub·히어로 "프로젝트 보기" 같은 주 버튼은 antd primary 의 주황이 아니라 어두운 색(`--text` 배경)으로 덮어쓴다.

### 글꼴

- 제목: `--f-display`(Space Grotesk), 본문: `--f-body`(Pretendard), 코드·라벨: `--f-mono`(JetBrains Mono), 모달 부제: `--f-serif`(Fraunces).
- JetBrains Mono 에는 한글이 없다. 한글이 들어가는 라벨에 `--f-mono` 를 쓰지 않는다.

### antd 오버라이드

- antd 스타일은 `:where()` 로 우선순위가 낮고 우리 CSS 보다 먼저 들어간다. 같은 우선순위(예: `.ant-card.card .card-body`)로 덮으면 된다. `!important` 를 쓰지 않는다.
- `Tag` 에 `color` 로 hex 를 넘기면 antd 가 밝은 배경색을 인라인 스타일로 넣어서 다크 모드에서 튄다. 색은 클래스(`is-main` 등)와 CSS 로 준다.
- `Card` 의 `cover` 는 antd 가 자식을 `display:block` 으로 바꾼다. 커버 안에서 flex 배치가 필요하면 `.ant-card .ant-card-cover > .card-thumb` 로 되돌린다.
- 카드 안에 antd `Button` 이 있으므로 카드는 `<button>` 이 아니라 `role="button"` + Enter/Space 키 처리로 만든다.
- 대체한 요소의 옛 CSS 규칙은 남기지 않고 지운다.

### 모션

- `transform`·`opacity` 만 애니메이트한다. `prefers-reduced-motion` 에서는 `global.css` 맨 아래 가드가 모두 끈다. 새 효과를 넣으면 가드에도 추가한다.
- 스크롤 등장은 `[data-reveal]` 속성과 `useRevealOnScroll` 이 맡는다. JS 가 없으면 2초 뒤 강제로 보인다.

## 화면 확인

- 수정한 뒤 라이트·다크 두 테마와 모바일 폭(390px)을 확인한다.
- 헤드리스 Chrome 의 `--virtual-time-budget` 캡처에서는 CSS 전환과 antd 애니메이션이 멈춰, 요소가 투명하게 찍히거나 모달이 안 보일 수 있다. 실제 버그가 아니다. `--run-all-compositor-stages-before-draw` 를 함께 쓰거나, DevTools 프로토콜(CDP)로 실제 시간 흐름에서 조작·캡처한다.
- 모달 내용을 크게 고치면 이전 커밋과 텍스트를 비교해서 빠진 문장이 없는지 확인한다.
