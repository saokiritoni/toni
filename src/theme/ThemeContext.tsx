import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const SWITCH_MS = 320

type ThemeState = { mode: ThemeMode; toggle: () => void }

const ThemeContext = createContext<ThemeState | null>(null)

function readMode(): ThemeMode {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/**
 * html[data-theme] 과 React 상태를 함께 관리한다. 첫 값은 index.html 인라인 스크립트가 이미 정해 두었다.
 * 우리 CSS 는 data-theme 을, antd 는 이 컨텍스트의 mode 를 보고 색을 바꾼다.
 * 사용자가 직접 고른 값은 localStorage 에 남기고, 고른 적이 없으면 OS 설정 변경을 따라간다.
 */
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readMode)

  const apply = useCallback((next: ThemeMode) => {
    const root = document.documentElement
    root.classList.add('theme-switching')
    root.dataset.theme = next
    setMode(next)
    window.setTimeout(() => root.classList.remove('theme-switching'), SWITCH_MS)
  }, [])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem(STORAGE_KEY)
      } catch {
        // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 OS 설정만 따른다
      }
      if (!saved) apply(e.matches ? 'dark' : 'light')
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [apply])

  const toggle = useCallback(() => {
    const next: ThemeMode = readMode() === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // 저장하지 못해도 이번 방문 동안에는 전환이 유지된다
    }
    apply(next)
  }, [apply])

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeMode 는 ThemeModeProvider 안에서만 쓸 수 있다')
  return ctx
}
