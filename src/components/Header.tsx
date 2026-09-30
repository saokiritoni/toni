import { useEffect, useState } from 'react'
import { BLOG_URL, GITHUB_URL, NAV_SECTIONS } from '../data/profile'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { ArrowUpRightIcon, GithubIcon, MenuIcon } from './Icons'

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id)

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useScrollSpy(SECTION_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container-inner">
        <div className="header-row">
          <a className="wordmark" href="#top" aria-label="Soeun Lee 홈">
            Soeun Lee<span className="dot">.</span>
          </a>
          <button
            className="nav-toggle"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MenuIcon />
          </button>
          <nav className={`nav${menuOpen ? ' open' : ''}`} id="nav" aria-label="주요">
            {NAV_SECTIONS.map((s) => (
              <a key={s.id} className={`nav-link${active === s.id ? ' active' : ''}`} href={`#${s.id}`} onClick={closeMenu}>
                {s.label}
              </a>
            ))}
            <a className="nav-link nav-link-ext" href={BLOG_URL} target="_blank" rel="noopener" onClick={closeMenu}>
              블로그
              <ArrowUpRightIcon />
            </a>
            <a className="btn-github" href={GITHUB_URL} target="_blank" rel="noopener" onClick={closeMenu}>
              <GithubIcon />
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
