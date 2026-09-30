import { SKILL_GROUPS } from '../data/profile'

export default function Skills() {
  return (
    <section className="section section-alt section-panel" id="skills" aria-labelledby="skills-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <h2 className="section-title" id="skills-title">
            Skills
          </h2>
        </div>
        <div className="skills-groups">
          {SKILL_GROUPS.map((g) => (
            <div className="skill-group" data-reveal key={g.title}>
              <h3>{g.title}</h3>
              <div className="pills">
                {g.items.map((s) => (
                  <span key={s.name} className={`pill${s.main ? ' main' : ''}`}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
