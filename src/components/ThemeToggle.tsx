import { useTheme } from '../hooks/useTheme'
import { MoonIcon, SunIcon } from './Icons'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const label = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={label} title={label}>
      <SunIcon className="ic-sun" />
      <MoonIcon className="ic-moon" />
    </button>
  )
}
