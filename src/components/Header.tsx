import { ExportOutlined, GithubOutlined, MenuOutlined } from '@ant-design/icons'
import { Anchor, Button, Drawer } from 'antd'
import { useEffect, useState, type MouseEvent } from 'react'
import { BLOG_URL, GITHUB_URL, NAV_SECTIONS } from '../data/profile'
import ThemeToggle from './ThemeToggle'

const HEADER_HEIGHT = 64
const ANCHOR_ITEMS = NAV_SECTIONS.map((s) => ({ key: s.id, href: `#${s.id}`, title: s.label }))

/** 주소 이동을 앱이 직접 처리하는 링크. 새 탭 열기(Ctrl, Cmd, Shift, 가운데 버튼)는 브라우저에 맡긴다 */
function appLink(go?: () => void) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (!go || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    go()
  }
}

/**
 * 고정 헤더. page(상세 페이지 제목)가 있으면 섹션 메뉴 대신 로고 옆에 "Projects / 제목" 경로를 둔다.
 * 로고는 첫 화면 맨 위로, Projects 는 보던 프로젝트 목록으로 간다. 좁은 화면에서는 경로 대신 "← 프로젝트" 하나만 둔다.
 */
export default function Header({ page, onHome, onList }: { page?: string; onHome?: () => void; onList?: () => void }) {
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
          <div className="header-left">
            <a className="wordmark" href={page ? '/' : '#top'} aria-label="Soeun Lee 홈" onClick={page ? appLink(onHome) : undefined}>
              Soeun Lee<span className="dot" aria-hidden="true" />
            </a>
            {page && (
              <nav className="crumb" aria-label="현재 위치">
                <a className="crumb-full" href="/#projects" onClick={appLink(onList)}>
                  Projects
                </a>
                <span className="crumb-full crumb-sep" aria-hidden="true">
                  /
                </span>
                <span className="crumb-full crumb-here" aria-current="page">
                  {page}
                </span>
                <a className="crumb-short" href="/#projects" onClick={appLink(onList)}>
                  <span aria-hidden="true">←</span> 프로젝트
                </a>
              </nav>
            )}
          </div>
          <div className="header-right">
            {/* antd Anchor 가 스크롤 위치에 맞춰 현재 섹션을 표시하고, 고정 헤더 높이만큼 비켜서 스크롤한다 */}
            {!page && (
              <Anchor
                className="nav-anchor"
                direction="horizontal"
                affix={false}
                targetOffset={HEADER_HEIGHT + 8}
                bounds={HEADER_HEIGHT}
                items={ANCHOR_ITEMS}
              />
            )}
            <Button className="nav-ext" type="text" href={BLOG_URL} target="_blank" rel="noopener" icon={<ExportOutlined />} iconPlacement="end">
              Blog
            </Button>
            <Button className="nav-ext" type="primary" href={GITHUB_URL} target="_blank" rel="noopener" icon={<GithubOutlined />}>
              GitHub
            </Button>
            <ThemeToggle />
            {!page && (
              <Button
                className="nav-toggle"
                icon={<MenuOutlined />}
                aria-label="메뉴 열기"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      <Drawer
        className="nav-drawer"
        rootClassName="nav-drawer-root"
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
            Blog
          </Button>
          <Button block type="primary" href={GITHUB_URL} target="_blank" rel="noopener" icon={<GithubOutlined />}>
            GitHub
          </Button>
        </div>
      </Drawer>
    </header>
  )
}
