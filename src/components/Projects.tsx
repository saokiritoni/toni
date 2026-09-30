import type { PointerEvent } from 'react'
import { FEATURED, GRID_PROJECTS, type GridProject, type ProjectKey } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { ArrowRightIcon } from './Icons'

type OpenHandler = (key: ProjectKey, trigger: HTMLElement) => void

function FeaturedCard({ onOpen }: { onOpen: OpenHandler }) {
  const p = FEATURED
  return (
    <button
      className="card-featured"
      type="button"
      data-reveal
      aria-haspopup="dialog"
      onClick={(e) => onOpen(p.key, e.currentTarget)}
      onPointerMove={trackSpotlight}
    >
      <div className="feat-panel">
        <p className="feat-catch">{p.catch}</p>
        <p className="feat-role">
          {p.role}
          <br />
          {p.period}
        </p>
        <div className="feat-tech">
          {p.tech.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      <div className="feat-body">
        <h3 className="feat-title">{p.title}</h3>
        <p className="feat-overview">{p.overview}</p>
        <ol className="feat-points">
          {p.points.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ol>
        <span className="card-more">
          <ArrowRightIcon />
        </span>
      </div>
    </button>
  )
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

function ProjectCard({ project: p, onOpen }: { project: GridProject; onOpen: OpenHandler }) {
  const tilt = useTilt()
  return (
    <button
      className="card"
      type="button"
      data-reveal
      aria-haspopup="dialog"
      onClick={(e) => onOpen(p.key, e.currentTarget)}
      {...tilt}
    >
      <div className={`card-thumb ${p.thumb.tone}`}>
        <span className="thumb-metric">{p.thumb.metric}</span>
        <span className="thumb-catch">{p.thumb.catch}</span>
      </div>
      <div className="card-body">
        <span className="card-role">
          {p.role}
          <span className="yr">{p.year}</span>
        </span>
        <span className="card-title">{p.title}</span>
        <ul className="card-points">
          {p.points.map((pt) => (
            <li key={pt}>{pt}</li>
          ))}
        </ul>
        <div className="card-stack">
          {p.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <span className="card-more">
          <ArrowRightIcon />
        </span>
      </div>
    </button>
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
