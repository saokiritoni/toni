// 사이트 곳곳에 쓰는 픽셀 그림. 한 글자가 블록 하나이고, '.' 은 빈칸이다.
// 글자마다 색이 정해져 있다 (global.css 의 .pk-*):
// R 사과 빨강, D 사과 그늘, H 하이라이트, L 잎, G 짙은 잎, S 꼭지, K 글자색, d 흐린 글자색, Y 금색, W 흰색, w 반투명 흰색
export type PixelPattern = readonly string[]

export const APPLE: PixelPattern = [
  '.....S.LL..',
  '.....SLLL..',
  '..RRR.RRR..',
  '.RHRRRRRRR.',
  'RHRRRRRRRRR',
  'RRRRRRRRRRD',
  'RRRRRRRRRRD',
  'RRRRRRRRRDD',
  '.RRRRRRRDD.',
  '..RRRRRDD..',
  '...RD.DD...',
]

// 섹션 제목 옆 아이콘
export const SECTION_PIXELS = {
  about: ['.RR.RR.', 'RHRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...'],
  skills: ['..K...K.K..', '.K....K..K.', 'K....R....K', '.K..K....K.', '..K.K...K..'],
  projects: ['KKKKKKK', 'KRKLKKK', 'K.....K', 'K.ddd.K', 'K.....K', 'K.dd..K', 'KKKKKKK'],
  experience: ['.K...K.', 'RRRRRRR', 'RRRRRRR', 'K.....K', 'K.d.d.K', 'K.d.L.K', 'KKKKKKK'],
  credentials: ['YYYYYYY', 'Y.YYY.Y', '.YYYYY.', '..YYY..', '...Y...', '..KKK..', '.KKKKK.'],
} satisfies Record<string, PixelPattern>

// About 카드 아이콘: 문제를 들여다보는 돋보기, 함께 나누는 말풍선, 자라나는 새싹
export const ABOUT_PIXELS: PixelPattern[] = [
  ['.KKKK....', 'K....K...', 'K.RR.K...', 'K.RH.K...', 'K....K...', '.KKKK....', '.....KK..', '......KK.', '.......KK'],
  ['RRRRRR...', 'RRRRRR...', 'RRRRRR...', '.R.LLLLLL', '...LLLLLL', '...LLLLLL', '.......L.'],
  ['..LL.LL..', '...LGL...', '....G....', '....G....', '.SSSSSSS.', '..SSSSS..', '..SSSSS..'],
]

// 프로젝트 카드 커버의 흰색 아이콘
export const PROJECT_PIXELS = {
  nhnad: ['wwwwwww', 'wWwWwWw', 'wwwwwww', '.ww....', '.w.....'],
  'ad-analytics': ['.....W.', '...W.W.', '...W.W.', '.W.W.W.', '.W.W.W.', 'wwwwwww'],
  gpu: ['wLwwwww', 'wwwwwww', '.......', 'wLwwwww', 'wwwwwww', '.......', 'wLwwwww', 'wwwwwww'],
  farm: ['.WW.WW.', '..WWW..', '...W...', '...W...', 'wwwwwww', '.wwwww.'],
} satisfies Record<string, PixelPattern>
