import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { useThemeMode } from '../theme/ThemeContext'

export default function ThemeToggle() {
  const { mode, toggle } = useThemeMode()
  const label = mode === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
  return (
    <Tooltip title={label} placement="bottom">
      <Button
        className="theme-toggle"
        shape="circle"
        aria-label={label}
        onClick={toggle}
        icon={
          <span className="theme-toggle-icons" aria-hidden="true">
            <SunOutlined className="ic-sun" />
            <MoonOutlined className="ic-moon" />
          </span>
        }
      />
    </Tooltip>
  )
}
