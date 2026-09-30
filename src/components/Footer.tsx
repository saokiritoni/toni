import { BLOG_URL, EMAIL, GITHUB_URL } from '../data/profile'
import { BookOpenIcon, GithubIcon, MailIcon } from './Icons'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-inner">
        <div className="footer-row">
          <div>
            <div className="wordmark" style={{ fontSize: 16 }}>
              Soeun Lee<span className="dot">.</span>
            </div>
            <p className="footer-meta" style={{ marginTop: 8 }}>
              Software Engineer · Seoul, KR
              <br />
              <a href={`mailto:${EMAIL}`} className="footer-mail">
                {EMAIL}
              </a>
              <br />© 2026 이소은 Soeun Lee. Built from scratch.
            </p>
          </div>
          <div className="socials">
            <a className="social" href={GITHUB_URL} target="_blank" rel="noopener" aria-label="GitHub">
              <GithubIcon aria-hidden={undefined} />
            </a>
            <a className="social" href={BLOG_URL} target="_blank" rel="noopener" aria-label="Blog (Tistory)">
              <BookOpenIcon aria-hidden={undefined} />
            </a>
            <a className="social" href={`mailto:${EMAIL}`} aria-label="Email">
              <MailIcon aria-hidden={undefined} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
