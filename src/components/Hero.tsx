import { ArrowDownOutlined, MailOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { EMAIL, HERO_ROLE } from '../data/profile'
import HeroStage from './HeroStage'

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-ornament" aria-hidden="true" />
      <div className="container-inner hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title" id="hero-title" data-reveal>
            문제를 이해하고
            <br />
            <em>더 나은 구조</em>를
            <br />
            만드는 개발자
          </h1>
          <p className="hero-role" data-reveal>
            <span className="prompt">$&nbsp;</span>
            {HERO_ROLE}
          </p>
          <div className="hero-ctas" data-reveal>
            <Button className="hero-cta" type="primary" size="large" href="#projects" icon={<ArrowDownOutlined />} iconPlacement="end">
              프로젝트 보기
            </Button>
            <Button className="hero-cta" size="large" shape="round" href={`mailto:${EMAIL}`} icon={<MailOutlined />}>
              이메일 보내기
            </Button>
          </div>
        </div>
        <HeroStage />
      </div>
    </section>
  )
}
