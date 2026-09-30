import { App as AntdApp, ConfigProvider, theme } from 'antd'
import koKR from 'antd/locale/ko_KR'
import type { ReactNode } from 'react'
import { useThemeMode } from './ThemeContext'

// global.css 의 :root / [data-theme="dark"] 토큰과 같은 값을 antd 토큰으로 옮긴다.
// antd 는 CSS 변수를 토큰 값으로 받지 못하는 곳(색 파생 계산)이 있어서 hex 로 적는다.
const PALETTE = {
  light: { bg: '#f2f1ed', container: '#f7f7f4', elevated: '#f2f1ed', text: '#26251e', border: 'rgba(38,37,30,0.1)', fill: '#ebeae5' },
  dark: { bg: '#15140f', container: '#1b1a15', elevated: '#15140f', text: '#edebe3', border: 'rgba(237,235,227,0.1)', fill: '#24231d' },
} as const

const FONT_BODY = "'Pretendard','Space Grotesk',system-ui,sans-serif"
const FONT_DISPLAY = "'Space Grotesk','Pretendard',system-ui,sans-serif"
const FONT_MONO = "'JetBrains Mono',ui-monospace,'SF Mono',monospace"

export default function AntdTheme({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode()
  const p = PALETTE[mode]

  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#f54e00',
          colorLink: '#f54e00',
          colorLinkHover: mode === 'dark' ? '#ff6a8b' : '#cf2d56',
          colorBgBase: p.bg,
          colorBgLayout: p.bg,
          colorBgContainer: p.container,
          colorBgElevated: p.elevated,
          colorTextBase: p.text,
          colorBorder: p.border,
          colorBorderSecondary: p.border,
          colorFillSecondary: p.fill,
          borderRadius: 8,
          borderRadiusLG: 10,
          borderRadiusSM: 4,
          fontFamily: FONT_BODY,
          fontFamilyCode: FONT_MONO,
          motionEaseInOut: 'cubic-bezier(.4,0,.2,1)',
        },
        components: {
          Button: { fontWeight: 500, primaryShadow: 'none', defaultShadow: 'none' },
          Tag: { defaultBg: p.fill },
          Tabs: { titleFontSize: 15, horizontalItemPadding: '10px 14px', horizontalItemGutter: 4 },
          Timeline: { tailColor: p.border, dotBg: p.bg },
          Modal: { contentBg: p.bg, headerBg: p.bg, titleFontSize: 25 },
          Anchor: { linkPaddingBlock: 4 },
          Card: { headerFontSize: 19 },
        },
      }}
    >
      <AntdApp component={false}>{children}</AntdApp>
    </ConfigProvider>
  )
}

export { FONT_DISPLAY, FONT_MONO }
