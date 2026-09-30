import { useId, useRef, useState, type ReactNode } from 'react'

type Tab = { key: string; label: string; content: ReactNode }

/** 상세 모달 안의 밑줄 탭. 탭을 바꾸면 탭 바가 모달 상단에 보이도록 스크롤을 되돌린다. */
export default function DetailTabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].key)
  const listRef = useRef<HTMLDivElement>(null)
  const id = useId()

  const select = (key: string) => {
    setActive(key)
    const list = listRef.current
    const scroller = list?.closest<HTMLElement>('.modal-body')
    if (!list || !scroller) return
    const top = list.offsetTop - 34
    if (scroller.scrollTop > top) scroller.scrollTop = top
  }

  return (
    <>
      <div className="pd-tabs" role="tablist" aria-label={label} ref={listRef}>
        {tabs.map((t) => (
          <button
            key={t.key}
            id={`${id}-tab-${t.key}`}
            className={`pd-tab${active === t.key ? ' is-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={active === t.key}
            aria-controls={`${id}-pane-${t.key}`}
            onClick={() => select(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.key}
          id={`${id}-pane-${t.key}`}
          className="pd-pane"
          role="tabpanel"
          aria-labelledby={`${id}-tab-${t.key}`}
          hidden={active !== t.key}
        >
          {t.content}
        </div>
      ))}
    </>
  )
}
