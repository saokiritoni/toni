import { Timeline } from 'antd'
import { EXPERIENCE } from '../data/profile'
import { SECTION_PIXELS } from '../data/pixels'
import PixelArt from './PixelArt'

export default function Experience() {
  return (
    <section className="section section-alt section-panel" id="experience" aria-labelledby="exp-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <PixelArt pattern={SECTION_PIXELS.experience} className="section-mark" />
          <h2 className="section-title" id="exp-title">
            Experience
          </h2>
        </div>
        <div data-reveal>
          <Timeline
            className="exp-timeline"
            items={EXPERIENCE.map((item) => ({
              key: item.period + item.role,
              className: item.period.includes('현재') ? 'is-now' : undefined,
              color: 'var(--accent)',
              content: (
                <div className="tl-item">
                  <div className="tl-period">{item.period}</div>
                  <div className="tl-company">{item.company}</div>
                  <div className="tl-role">{item.role}</div>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  )
}
