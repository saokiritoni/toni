import { ExportOutlined, GithubOutlined, MenuOutlined } from '@ant-design/icons'
import { Anchor, Button, Drawer } from 'antd'
import { useEffect, useState } from 'react'
import { BLOG_URL, GITHUB_URL, NAV_SECTIONS } from '../data/profile'
import ThemeToggle from './ThemeToggle'

const HEADER_HEIGHT = 64
const ANCHOR_ITEMS = NAV_SECTIONS.map((s) => ({ key: s.id, href: `#${s.id}`, title: s.label }))

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container-inner">
        <div className="header-row">
          <a className="wordmark" href="#top" aria-label="Soeun Lee 홈">
            Soeun Lee<span className="dot">.</span>
          </a>
          <div className="header-right">
            {/* antd Anchor 가 스크롤 위치에 맞춰 현재 섹션을 표시하고, 고정 헤더 높이만큼 비켜서 스크롤한다 */}
            <Anchor
              className="nav-anchor"
              direction="horizontal"
              affix={false}
              targetOffset={HEADER_HEIGHT + 8}
              bounds={HEADER_HEIGHT}
              items={ANCHOR_ITEMS}
            />
            <Button className="nav-ext" type="text" href={BLOG_URL} target="_blank" rel="noopener" icon={<ExportOutlined />} iconPlacement="end">
              블로그
            </Button>
            <Button className="nav-ext" type="primary" href={GITHUB_URL} target="_blank" rel="noopener" icon={<GithubOutlined />}>
              GitHub
            </Button>
            <ThemeToggle />
            <Button
              className="nav-toggle"
              icon={<MenuOutlined />}
              aria-label="메뉴 열기"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>
      </div>

      <Drawer
        className="nav-drawer"
        placement="right"
        size={280}
        title="Soeun Lee."
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Anchor
          affix={false}
          targetOffset={HEADER_HEIGHT + 8}
          items={ANCHOR_ITEMS}
          onClick={() => setMenuOpen(false)}
        />
        <div className="nav-drawer-actions">
          <Button block href={BLOG_URL} target="_blank" rel="noopener" icon={<ExportOutlined />} iconPlacement="end">
            블로그
          </Button>
          <Button block type="primary" href={GITHUB_URL} target="_blank" rel="noopener" icon={<GithubOutlined />}>
            GitHub
          </Button>
        </div>
      </Drawer>
    </header>
  )
}
