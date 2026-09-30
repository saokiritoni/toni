import { Card, Flex, Tag } from 'antd'
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
            <Card className="skill-group" size="small" key={g.title} data-reveal title={g.title}>
              <Flex wrap gap={8}>
                {g.items.map((s) => (
                  <Tag key={s.name} className={`skill-tag${s.main ? ' is-main' : ''}`} variant="outlined">
                    {s.name}
                  </Tag>
                ))}
              </Flex>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
