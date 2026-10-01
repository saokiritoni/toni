import { BookOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Space, Tooltip } from 'antd'
import { APPLE } from '../data/pixels'
import { BLOG_URL, EMAIL, GITHUB_URL } from '../data/profile'
import PixelArt from './PixelArt'

const SOCIALS = [
  { label: 'GitHub', href: GITHUB_URL, icon: <GithubOutlined />, external: true },
  { label: 'Blog (Tistory)', href: BLOG_URL, icon: <BookOutlined />, external: true },
  { label: 'Email', href: `mailto:${EMAIL}`, icon: <MailOutlined />, external: false },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-inner">
        <div className="footer-row">
          <div className="footer-brand">
            <PixelArt pattern={APPLE} cell={4} static className="footer-apple" />
            <div>
              <div className="wordmark footer-wordmark">
                Soeun Lee<span className="dot" aria-hidden="true" />
              </div>
              <p className="footer-meta">
                Seoul, KR
                <br />
                <a href={`mailto:${EMAIL}`} className="footer-mail">
                  {EMAIL}
                </a>
                <br />© 2026 이소은 Soeun Lee. Built from scratch.
              </p>
            </div>
          </div>
          <Space size={8}>
            {SOCIALS.map((s) => (
              <Tooltip title={s.label} key={s.label}>
                <Button
                  size="large"
                  icon={s.icon}
                  href={s.href}
                  aria-label={s.label}
                  {...(s.external ? { target: '_blank', rel: 'noopener' } : {})}
                />
              </Tooltip>
            ))}
          </Space>
        </div>
      </div>
    </footer>
  )
}
