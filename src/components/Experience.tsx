import { Timeline, Typography } from 'antd'
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
        <div data-reveal>
          <Timeline
            className="exp-timeline"
            items={EXPERIENCE.map((item) => ({
              key: item.period + item.role,
              color: 'var(--accent)',
              content: (
                <div className="tl-item">
                  <div className="tl-period">{item.period}</div>
                  <div className="tl-role">
                    <span className="co">{item.company}</span> · {item.role}
                  </div>
                  {item.desc && (
                    <Typography.Paragraph className="tl-desc">
                      {item.desc.map((line, i) => (
                        <Fragment key={i}>
                          {i > 0 && <br />}
                          {line}
                        </Fragment>
                      ))}
                    </Typography.Paragraph>
                  )}
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  )
}
