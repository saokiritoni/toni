import { Card, Flex, Tag } from 'antd'
import type { KeyboardEvent } from 'react'
import { FEATURED, GRID_PROJECTS, type GridProject, type ProjectKey } from '../data/projects'
import { PROJECT_PIXELS, SECTION_PIXELS } from '../data/pixels'
import PixelArt from './PixelArt'

type OpenHandler = (key: ProjectKey) => void

/**
 * 카드 전체를 버튼처럼 쓴다. <button> 안에는 제목·목록 같은 블록 요소를 넣을 수 없어서 role 을 준다.
 * 모달을 여는 카드는 button, 상세 페이지로 옮겨 가는 AdOnChat 카드는 link 다.
 */
function clickable(key: ProjectKey, onOpen: OpenHandler, opens: 'dialog' | 'page' = 'dialog') {
  return {
    role: opens === 'page' ? 'link' : 'button',
    tabIndex: 0,
    'aria-haspopup': opens === 'dialog' ? ('dialog' as const) : undefined,
    onClick: () => onOpen(key),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onOpen(key)
      }
    },
  }
}

/** 카드를 누르면 상세가 열린다는 표시. 카드 전체가 버튼이라 글자만 보여 준다 */
function MoreLabel() {
  return (
    <span className="card-more" aria-hidden="true">
      자세히 보기 ↗
    </span>
  )
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
      {...clickable(p.key, onOpen, 'page')}
    >
      <div className="feat-grid">
        <div className="feat-panel">
          <div className="feat-heading thumb-head">
            <div>
              <span className="project-org">{p.org}</span>
              <h3 className="feat-title">{p.title}</h3>
            </div>
            <PixelArt pattern={PROJECT_PIXELS[p.key]} className="thumb-pixel" />
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
          <MoreLabel />
        </div>
      </div>
    </Card>
  )
}

function ProjectCard({ project: p, onOpen }: { project: GridProject; onOpen: OpenHandler }) {
  return (
    <Card
      className="card"
      hoverable
      data-reveal
      cover={
        <div className={`card-thumb ${p.thumb.tone}`}>
          <div className="thumb-head">
            <div>
              <span className="project-org">{p.org}</span>
              <h3 className="thumb-title">{p.title}</h3>
            </div>
            <PixelArt pattern={PROJECT_PIXELS[p.key]} className="thumb-pixel" />
          </div>
          <TechTags items={p.stack} className="thumb-tech" />
        </div>
      }
      classNames={{ body: 'card-body' }}
      {...clickable(p.key, onOpen)}
    >
      <span className="card-role">{p.role}</span>
      <ul className="card-points">
        {p.points.map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
      <MoreLabel />
    </Card>
  )
}

export default function Projects({ onOpen }: { onOpen: OpenHandler }) {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <PixelArt pattern={SECTION_PIXELS.projects} className="section-mark" />
          <h2 className="section-title" id="projects-title">
            Projects
          </h2>
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
