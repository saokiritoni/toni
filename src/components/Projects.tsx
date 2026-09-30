import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Card, Flex, Tag } from 'antd'
import type { KeyboardEvent, PointerEvent } from 'react'
import { FEATURED, GRID_PROJECTS, type GridProject, type ProjectKey } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'

type OpenHandler = (key: ProjectKey) => void

/** 카드 전체를 버튼처럼 쓴다. 안에 antd Button 이 있어서 <button> 대신 role="button" 을 준다. */
function clickable(key: ProjectKey, onOpen: OpenHandler) {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-haspopup': 'dialog' as const,
    onClick: () => onOpen(key),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onOpen(key)
      }
    },
  }
}

/** 카드 위 스포트라이트가 포인터를 따라가도록 좌표를 CSS 변수로 넘긴다. */
function trackSpotlight(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

/** 마우스 위치에 따라 카드를 살짝 기울인다. 터치 기기와 동작 줄이기 설정에서는 끈다. */
function useTilt() {
  const reduce = useReducedMotion()
  const finePointer = typeof window !== 'undefined' && window.matchMedia('(hover:hover) and (pointer:fine)').matches
  const enabled = !reduce && finePointer

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    trackSpotlight(e)
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    card.style.setProperty('--ry', `${(px * 3.4).toFixed(2)}deg`)
    card.style.setProperty('--rx', `${(-py * 3.4).toFixed(2)}deg`)
    card.classList.add('tilt')
  }
  const onPointerLeave = (e: PointerEvent<HTMLElement>) => {
    const card = e.currentTarget
    card.classList.remove('tilt')
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }
  return enabled ? { onPointerMove, onPointerLeave } : { onPointerMove: trackSpotlight }
}

/** 카드 오른쪽 아래 화살표. 클릭은 카드가 처리하므로 버튼은 포커스를 받지 않는다. */
function MoreButton() {
  return <Button className="card-more" shape="circle" icon={<ArrowRightOutlined />} tabIndex={-1} aria-hidden="true" />
}

function TechTags({ items, className }: { items: string[]; className?: string }) {
  return (
    <Flex wrap gap={6} className={className}>
      {items.map((t) => (
        <Tag key={t} variant="filled" className="tech-tag">
          {t}
        </Tag>
      ))}
    </Flex>
  )
}

function FeaturedCard({ onOpen }: { onOpen: OpenHandler }) {
  const p = FEATURED
  return (
    <Card
      className="card-featured"
      hoverable
      data-reveal
      styles={{ body: { padding: 0 } }}
      onPointerMove={trackSpotlight}
      {...clickable(p.key, onOpen)}
    >
      <div className="feat-grid">
        <div className="feat-panel">
          <div className="feat-heading">
            <span className="project-org">{p.org}</span>
            <h3 className="feat-title">{p.title}</h3>
          </div>
          <p className="feat-catch">{p.catch}</p>
          <p className="feat-role">
            {p.role}
            <br />
            {p.period}
          </p>
          <TechTags items={p.tech} className="feat-tech" />
        </div>
        <div className="feat-body">
          <p className="feat-overview">{p.overview}</p>
          <ol className="feat-points">
            {p.points.map((pt, i) => (
              <li key={i}>{pt}</li>
            ))}
          </ol>
          <MoreButton />
        </div>
      </div>
    </Card>
  )
}

function ProjectCard({ project: p, onOpen }: { project: GridProject; onOpen: OpenHandler }) {
  const tilt = useTilt()
  return (
    <Card
      className="card"
      hoverable
      data-reveal
      cover={
        <div className={`card-thumb ${p.thumb.tone}`}>
          <div>
            <span className="project-org">{p.org}</span>
            <h3 className="thumb-title">{p.title}</h3>
          </div>
          <span className="thumb-catch">{p.thumb.catch}</span>
        </div>
      }
      classNames={{ body: 'card-body' }}
      {...tilt}
      {...clickable(p.key, onOpen)}
    >
      <span className="card-role">
        {p.role}
        <span className="yr">{p.year}</span>
      </span>
      <ul className="card-points">
        {p.points.map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
      <TechTags items={p.stack} />
      <MoreButton />
    </Card>
  )
}

export default function Projects({ onOpen }: { onOpen: OpenHandler }) {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <h2 className="section-title" id="projects-title">
            Projects
          </h2>
          <p className="section-sub">카드를 눌러 자세히 확인하세요.</p>
        </div>
        <FeaturedCard onOpen={onOpen} />
        <div className="projects-grid">
          {GRID_PROJECTS.map((p) => (
            <ProjectCard key={p.key} project={p} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  )
}
