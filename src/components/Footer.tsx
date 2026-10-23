import { APPLE } from '../data/pixels'
import { BLOG_URL, EMAIL, GITHUB_URL } from '../data/profile'
import PixelArt from './PixelArt'

const LINKS = [
  { label: 'GitHub', href: GITHUB_URL },
  { label: 'Blog', href: BLOG_URL },
]

/** 다크 모드에서만 작은 사과 곁에 보이는 별. 첫 화면의 밤 분위기를 한 번 더 잇는다 */
const STARS = [
  { x: -16, y: 8 },
  { x: -5, y: -12, plus: true },
  { x: -20, y: 40 },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-inner">
        <div className="footer-row">
          <div className="footer-brand">
            <span className="footer-mark">
              <PixelArt pattern={APPLE} cell={4} static className="footer-apple" />
              <span className="night-stars" aria-hidden="true">
                {STARS.map((s, i) => (
                  <span key={i} className={`star${s.plus ? ' plus' : ''}`} style={{ left: `${s.x}px`, top: `${s.y}px` }} />
                ))}
              </span>
            </span>
            <div>
              <div className="wordmark footer-wordmark">
                Soeun Lee<span className="dot" aria-hidden="true" />
              </div>
              <p className="footer-meta">
                <a href={`mailto:${EMAIL}`} className="footer-mail">
                  {EMAIL}
                </a>
                <br />© 2026 이소은 Soeun Lee
              </p>
            </div>
          </div>
          <nav className="footer-links" aria-label="외부 링크">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener">
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
