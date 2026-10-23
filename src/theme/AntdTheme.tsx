import { App as AntdApp, ConfigProvider, theme } from 'antd'
import koKR from 'antd/locale/ko_KR'
import type { ReactNode } from 'react'
import { useThemeMode } from './ThemeContext'

// global.css 의 :root / [data-theme="dark"] 토큰과 같은 값을 antd 토큰으로 옮긴다.
// antd 는 CSS 변수를 토큰 값으로 받지 못하는 곳(색 파생 계산)이 있어서 hex 로 적는다.
const PALETTE = {
  light: { bg: '#ffffff', container: '#ffffff', elevated: '#ffffff', text: '#1d1d1f', border: '#e8e8ed', fill: '#f5f5f7', accent: '#c92a32', hover: '#a51f27' },
  dark: { bg: '#0b0c10', container: '#25272d', elevated: '#0b0c10', text: '#f5f5f7', border: 'rgba(255,255,255,0.1)', fill: '#191b20', accent: '#ff4d4f', hover: '#ff8f8a' },
} as const

const FONT_BODY = "'Pretendard',-apple-system,BlinkMacSystemFont,system-ui,sans-serif"
const FONT_DISPLAY = FONT_BODY
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
          colorPrimary: p.accent,
          colorLink: p.accent,
          colorLinkHover: p.hover,
          colorBgBase: p.bg,
          colorBgLayout: p.bg,
          colorBgContainer: p.container,
          colorBgElevated: p.elevated,
          colorTextBase: p.text,
          colorBorder: p.border,
          colorBorderSecondary: p.border,
          colorFillSecondary: p.fill,
          borderRadius: 12,
          borderRadiusLG: 18,
          borderRadiusSM: 6,
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
