import { ArrowLeftOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import PixelArt from '../components/PixelArt'
import { PROJECT_PIXELS } from '../data/pixels'
import { FEATURED } from '../data/projects'
import { ADONCHAT_GROUPS, ADONCHAT_OVERVIEW } from '../details/adonchatCases'

const caseId = (group: string, i: number) => `${group}-${i + 1}`
const CASE_IDS = ADONCHAT_GROUPS.flatMap((g) => g.parts.map((_, i) => caseId(g.key, i)))

/** 목차에서 지금 읽는 사례를 표시한다. 화면 위쪽 1/3 선을 지난 마지막 사례가 지금 읽는 사례다 */
function useCurrentCase() {
  const [current, setCurrent] = useState(CASE_IDS[0])
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight / 3
      let found = CASE_IDS[0]
      for (const id of CASE_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) found = id
      }
      setCurrent(found)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return current
}

/**
 * AdOnChat 상세 페이지. 사례가 많아 모달 대신 한 페이지에 두고, 데스크톱에서는 왼쪽에 사례 목차를 고정한다.
 * 사례는 접지 않고 Backend, Frontend 순서로 모두 펼쳐 둔다.
 */
export default function AdOnChatPage({ onBack }: { onBack: () => void }) {
  const p = FEATURED
  const current = useCurrentCase()

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
            {ADONCHAT_GROUPS.map((g) => (
              <div key={g.key}>
                <span className="pp-toc-group">{g.label}</span>
                <ol>
                  {g.parts.map((part, i) => {
                    const id = caseId(g.key, i)
                    const isCurrent = current === id
                    return (
                      <li key={id}>
                        <a href={`#${id}`} className={isCurrent ? 'is-current' : undefined} aria-current={isCurrent ? 'location' : undefined}>
                          {part.title}
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
                  <article key={part.title} className="pp-case" id={caseId(g.key, i)}>
                    <h3 className="pp-case-title">{part.title}</h3>
                    {part.content}
                  </article>
                ))}
                {g.more && (
                  <section className="pp-more" aria-label={g.more.title}>
                    <h3 className="pp-more-title">{g.more.title}</h3>
                    {g.more.content}
                  </section>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
