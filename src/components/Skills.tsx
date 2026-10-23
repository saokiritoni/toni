import { SKILL_GROUPS } from '../data/profile'
import { SECTION_PIXELS } from '../data/pixels'
import PixelArt from './PixelArt'

/** 분류마다 한 줄로 기술 이름만 보여 준다. 상자를 두지 않아 클릭할 수 있는 프로젝트 카드와 구분된다 */
export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <PixelArt pattern={SECTION_PIXELS.skills} className="section-mark" />
          <h2 className="section-title" id="skills-title">
            Skills
          </h2>
        </div>
        <dl className="skills-rows" data-reveal>
          {SKILL_GROUPS.map((g) => (
            <div className="skills-row" key={g.title}>
              <dt>{g.title}</dt>
              <dd>{g.items.map((s) => s.name).join(' / ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
