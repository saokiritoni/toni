import { EMAIL, HERO_PHRASES } from '../data/profile'
import { useTypewriter } from '../hooks/useTypewriter'
import { ArrowDownIcon, MailIcon } from './Icons'

export default function Hero() {
  const typed = useTypewriter(HERO_PHRASES)

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-ornament" aria-hidden="true" />
      <div className="container-inner">
        <h1 className="hero-title" id="hero-title" data-reveal>
          문제를 이해하고
          <br />
          <em>더 나은 구조</em>를 만드는 개발자
        </h1>
        <p className="hero-typed" data-reveal aria-live="polite">
          <span className="prompt">$&nbsp;</span>
          <span id="typed">{typed}</span>
          <span className="caret blink" aria-hidden="true" />
        </p>
        <div className="hero-ctas" data-reveal>
          <a className="btn-primary" href="#projects">
            프로젝트 보기
            <ArrowDownIcon />
          </a>
          <a className="btn-secondary" href={`mailto:${EMAIL}`}>
            <MailIcon width={17} height={17} />
            이메일 보내기
          </a>
        </div>
      </div>
    </section>
  )
}
