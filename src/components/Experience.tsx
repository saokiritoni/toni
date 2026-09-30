import { Fragment } from 'react'
import { EXPERIENCE } from '../data/profile'

export default function Experience() {
  return (
    <section className="section section-alt section-panel" id="experience" aria-labelledby="exp-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <h2 className="section-title" id="exp-title">
            Experience
          </h2>
        </div>
        <ul className="timeline">
          {EXPERIENCE.map((item) => (
            <li className="tl-item" data-reveal key={item.period + item.role}>
              <div className="tl-period">{item.period}</div>
              <div className="tl-role">
                <span className="co">{item.company}</span> · {item.role}
              </div>
              {item.desc && (
                <p className="tl-desc">
                  {item.desc.map((line, i) => (
                    <Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
