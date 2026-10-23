import { ArrowLeftOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import ImplDetail from '../components/ImplDetail'
import PixelArt from '../components/PixelArt'
import { PROJECT_PIXELS } from '../data/pixels'
import { FEATURED } from '../data/projects'
import { ADONCHAT_GROUPS, ADONCHAT_OVERVIEW } from '../details/adonchatCases'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const caseId = (group: string, i: number) => `${group}-${i + 1}`
const supportId = (group: string, i: number) => `${group}-s${i + 1}`

/** 목차 항목. 묶음마다 대표 사례와 보조 사례(minor)의 제목을 올린다. 짧은 보충은 올리지 않는다. 좁은 화면에서는 대표 사례만 보인다 */
const TOC = ADONCHAT_GROUPS.map((g) => ({
  key: g.key,
  label: g.label,
  items: [
    ...g.parts.map((part, i) => ({
      id: caseId(g.key, i),
      title: part.title,
      minor: false,
    })),
    ...(g.support ?? []).map((c, i) => ({
      id: supportId(g.key, i),
      title: c.title,
      minor: true,
    })),
  ],
}))
const CASE_IDS = TOC.flatMap((g) => g.items.map((it) => it.id))

/**
 * 목차에서 지금 읽는 사례를 표시한다. 화면 위쪽 1/3 선을 지난 마지막 사례가 지금 읽는 사례이고,
 * 페이지 끝에 닿으면 그 선까지 올라오지 못하는 마지막 사례를 고른다.
 * 목차를 눌러 이동하는 동안에는 지나가는 사례로 표시가 흔들리지 않도록, 누른 사례를 스크롤이 끝날 때까지 유지한다.
 */
function useCurrentCase() {
  const [current, setCurrent] = useState(CASE_IDS[0])
  const target = useRef<string | null>(null)
  useEffect(() => {
    const onScroll = () => {
      if (target.current) return
      const line = window.innerHeight / 3
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      let found = CASE_IDS[0]
      for (const id of CASE_IDS) {
        const el = document.getElementById(id)
        if (el && (el.getBoundingClientRect().top <= line || (atEnd && el.getBoundingClientRect().top < window.innerHeight))) found = id
      }
      setCurrent(found)
    }
    let release = 0
    const onScrollEnd = () => {
      window.clearTimeout(release)
      release = window.setTimeout(() => {
        target.current = null
        onScroll()
      }, 120)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scroll', onScrollEnd, { passive: true })
    return () => {
      window.clearTimeout(release)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scroll', onScrollEnd)
    }
  }, [])

  /** 목차 링크로 이동한다. 해시는 기록을 쌓지 않고 바꿔서, 뒤로 가기 한 번이면 프로젝트 목록으로 돌아간다 */
  const jumpTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    target.current = id
    setCurrent(id)
    window.history.replaceState(window.history.state, '', `#${id}`)
    el.scrollIntoView({
      block: 'start',
      behavior: prefersReducedMotion() ? 'instant' : 'smooth',
    })
    // 키보드로 이동한 사람이 이어서 Tab 을 누르면 그 사례 안에서 계속하도록 초점도 옮긴다
    el.focus({ preventScroll: true })
    // 이미 그 자리에 있어서 스크롤이 일어나지 않으면 바로 풀어 준다
    window.setTimeout(() => {
      if (target.current === id && Math.abs(el.getBoundingClientRect().top - parseFloat(getComputedStyle(el).scrollMarginTop)) < 2) target.current = null
    }, 50)
  }, [])

  // 주소에 사례 해시를 달고 바로 들어오면, 페이지 청크를 그린 뒤 그 사례로 옮긴다
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id && CASE_IDS.includes(id)) document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [])

  return [current, jumpTo] as const
}

/**
 * AdOnChat 상세 페이지. 사례가 많아 모달 대신 한 페이지에 두고, 데스크톱에서는 왼쪽에 사례 목차를 고정한다.
 * 묶음마다 대표 사례, 보조 사례, 짧은 보충 순서로 둔다. 사례 본문은 접지 않고 구현 상세만 접는다.
 */
export default function AdOnChatPage({ onBack }: { onBack: () => void }) {
  const p = FEATURED
  const [current, jumpTo] = useCurrentCase()

  useEffect(() => {
    const prev = document.title
    document.title = `${p.title} | 이소은 Soeun Lee`
    return () => {
      document.title = prev
    }
  }, [p.title])

  return (
    <main className="pp" id="top">
      <div className="container-inner">
        <a
          className="pp-back"
          href="/#projects"
          onClick={(e) => {
            e.preventDefault()
            onBack()
          }}
        >
          <ArrowLeftOutlined /> 프로젝트 목록
        </a>

        {/* 색 띠 배너 대신 페이지 글자로 머리를 세운다. 픽셀 아이콘의 흰 블록은 밝은 바탕에서 보이도록 CSS 에서 다시 칠한다 */}
        <header className="pp-intro">
          <div className="pp-hero">
            <PixelArt pattern={PROJECT_PIXELS[p.key]} cell={8} static className="pp-pixel" />
            <div>
              <span className="pp-org">{p.org}</span>
              <h1 className="pp-title">{p.title}</h1>
            </div>
          </div>
          <p className="pp-catch">{p.catch}</p>
          <p className="pp-meta">
            {p.period} / {p.role}
          </p>
          <p className="pd-p pp-overview">{ADONCHAT_OVERVIEW}</p>
        </header>

        <div className="pp-layout">
          <nav className="pp-toc" aria-label="사례 목차">
            {TOC.map((g) => (
              <div key={g.key}>
                <span className="pp-toc-group">{g.label}</span>
                <ol>
                  {g.items.map(({ id, title, minor }) => {
                    const isCurrent = current === id
                    return (
                      <li key={id} className={minor ? 'is-minor' : undefined}>
                        <a
                          href={`#${id}`}
                          className={isCurrent ? 'is-current' : undefined}
                          aria-current={isCurrent ? 'location' : undefined}
                          onClick={(e) => {
                            e.preventDefault()
                            jumpTo(id)
                          }}
                        >
                          {title}
                        </a>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </nav>

          <div className="pp-body">
            {ADONCHAT_GROUPS.map((g) => (
              <section key={g.key} className="pp-group" aria-labelledby={`${g.key}-title`}>
                <h2 className="pp-group-title" id={`${g.key}-title`}>
                  {g.label}
                </h2>
                {g.intro && <div className="pp-group-intro">{g.intro}</div>}
                <div className="pd-tech">
                  {g.tech.map((t) => (
                    <Tag key={t} variant="filled">
                      {t}
                    </Tag>
                  ))}
                </div>
                {g.parts.map((part, i) => (
                  <article key={part.title} className="pp-case" id={caseId(g.key, i)} tabIndex={-1}>
                    <h3 className="pp-case-title">{part.title}</h3>
                    {part.content}
                  </article>
                ))}
                {/* 보조 사례는 대표 사례보다 작은 제목과 한 문단으로 둔다 */}
                {g.support?.map((c, i) => (
                  <article key={c.title} className="pp-support" id={supportId(g.key, i)} tabIndex={-1}>
                    <h3 className="pp-support-title">{c.title}</h3>
                    <p className="pd-p">{c.body}</p>
                    {c.detail && <ImplDetail fold>{c.detail}</ImplDetail>}
                  </article>
                ))}
                {/* 짧은 보충은 목차에 올리지 않고, 본문 크기의 제목과 한 문단만 둔다 */}
                {g.notes?.map((n) => (
                  <section key={n.title} className="pp-note" aria-label={n.title}>
                    <h3 className="pp-note-title">{n.title}</h3>
                    <p className="pd-p">{n.body}</p>
                  </section>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
