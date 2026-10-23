import { Flex, Tag } from 'antd'
import type { MouseEvent } from 'react'
import { FEATURED, GRID_PROJECTS, type GridProject, type ProjectKey } from '../data/projects'
import { PROJECT_PIXELS, SECTION_PIXELS } from '../data/pixels'
import PixelArt from './PixelArt'

type OpenHandler = (key: ProjectKey) => void

/** 카드를 누르면 상세가 열린다는 표시. 카드 전체가 눌리므로 글자만 보여 준다 */
function MoreLabel() {
  return (
    <span className="card-more" aria-hidden="true">
      자세히 보기 <span className="card-more-arrow">→</span>
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

/**
 * AdOnChat 카드. 상세 페이지로 옮겨 가므로 제목을 실제 링크(<a href>)로 두고, 링크의 ::after 가 카드 전체를 덮어 어디를 눌러도 이동한다.
 * 새 탭 열기(Ctrl, Cmd, Shift, 가운데 버튼)는 브라우저에 맡긴다.
 */
function FeaturedCard({ onOpen }: { onOpen: OpenHandler }) {
  const p = FEATURED
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    onOpen(p.key)
  }
  return (
    <article className="pcard pcard-feat" data-reveal>
      <div className="feat-panel">
        <div className="feat-heading thumb-head">
          <div>
            <span className="project-org">{p.org}</span>
            <h3 className="feat-title">
              <a className="pcard-link" href="/projects/adonchat" onClick={onClick}>
                {p.title}
              </a>
            </h3>
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
    </article>
  )
}

/**
 * 상세 모달을 여는 카드. 제목을 <button> 으로 두고, 버튼의 ::after 가 카드 전체를 덮는다.
 * 프로젝트 색은 위쪽 가는 띠와 픽셀 아이콘에만 쓰고, 면은 중립 회색으로 둔다.
 */
function ProjectCard({ project: p, onOpen }: { project: GridProject; onOpen: OpenHandler }) {
  return (
    <article className={`pcard pcard-grid tone-${p.thumb.tone}`} data-reveal>
      <div className="pcard-top">
        <div className="thumb-head">
          <div>
            <span className="project-org">{p.org}</span>
            <h3 className="thumb-title">
              <button type="button" className="pcard-link" aria-haspopup="dialog" onClick={() => onOpen(p.key)}>
                {p.title}
              </button>
            </h3>
          </div>
          <PixelArt pattern={PROJECT_PIXELS[p.key]} className="thumb-pixel" />
        </div>
        <TechTags items={p.stack} className="thumb-tech" />
      </div>
      <span className="card-role">{p.role}</span>
      <ul className="card-points">
        {p.points.map((pt) => (
          <li key={pt}>{pt}</li>
        ))}
      </ul>
      <MoreLabel />
    </article>
  )
}

export default function Projects({ onOpen }: { onOpen: OpenHandler }) {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="container-inner">
        <div className="section-head" data-reveal>
          <PixelArt pattern={SECTION_PIXELS.projects} cell={4} className="section-mark" />
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
