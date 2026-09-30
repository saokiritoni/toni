import { Typography } from 'antd'
import { AWARDS, LICENSES, type Credential } from '../data/profile'

function CredList({ title, items }: { title: string; items: Credential[] }) {
  return (
    <div className="cred-col" data-reveal>
      <Typography.Title level={3} className="cred-title">
        {title}
      </Typography.Title>
      <ul className="cred-list">
        {items.map((c) => (
          <li key={c.year + c.strong + c.rest}>
            <span className="yr">{c.year}</span>
            <Typography.Text className="name">
              <Typography.Text strong>{c.strong}</Typography.Text>
              {c.rest}
            </Typography.Text>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Credentials() {
  return (
    <section className="section" id="credentials" aria-labelledby="cred-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <h2 className="section-title" id="cred-title">
            Awards &amp; Licenses
          </h2>
        </div>
        <div className="creds-grid">
          <CredList title="수상 (Awards)" items={AWARDS} />
          <CredList title="자격증 (Licenses)" items={LICENSES} />
        </div>
      </div>
    </section>
  )
}
