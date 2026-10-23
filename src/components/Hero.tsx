import { ArrowDownOutlined, MailOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { EMAIL, NAME_EN, NAME_HANJA, NAME_KO } from '../data/profile'
import HeroStage from './HeroStage'

/**
 * 다크 모드의 첫 화면 하늘에 둘 별(위치는 첫 화면 기준 %). 위쪽 띠와 글자와 사과 사이 여백에만 두고 글자 뒤는 비운다.
 * 좁은 화면에서는 글자와 사과가 세로로 쌓여 겹치므로 CSS 가 숨기고, 사과 곁의 별만 남는다
 */
const SKY_STARS: { x: number; y: number; big?: boolean; plus?: boolean }[] = [
  { x: 4, y: 13 },
  { x: 16, y: 15, big: true },
  { x: 29, y: 11 },
  { x: 41, y: 16, plus: true },
  { x: 55, y: 12 },
  { x: 49, y: 33 },
  { x: 52, y: 55, big: true },
  { x: 57, y: 76 },
  { x: 70, y: 13 },
  { x: 83, y: 9, plus: true },
  { x: 99, y: 45 },
  { x: 35, y: 94 },
  { x: 71, y: 93 },
]

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-sky" aria-hidden="true">
        {SKY_STARS.map((s, i) => (
          <span key={i} className={`star${s.big ? ' big' : ''}${s.plus ? ' plus' : ''}`} style={{ left: `${s.x}%`, top: `${s.y}%` }} />
        ))}
      </div>
      <div className="hero-ornament" aria-hidden="true" />
      <div className="container-inner hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title" id="hero-title" data-reveal>
            문제를 이해하고
            <br />
            <em>더 나은 구조</em>를
            <br />
            만듭니다
          </h1>
          <p className="hero-name" data-reveal>
            <span className="hero-name-ko">{NAME_KO}</span>
            <span className="hero-name-en">{NAME_EN}</span>
            <span className="hero-hanja">
              {NAME_HANJA}
            </span>
          </p>
          <p className="hero-now" data-reveal>
            NHN AD에서 광고 운영 솔루션과 AI Agent를 개발하고 있습니다.
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
