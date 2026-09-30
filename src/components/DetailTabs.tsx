import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type Tab = { key: string; label: string; content: ReactNode }

/**
 * 상세 모달 안의 밑줄 탭.
 * 활성 탭의 위치와 너비를 재서 밑줄이 탭 사이를 미끄러지듯 이동하게 하고,
 * 탭을 바꾸면 탭 바가 모달 상단에 보이도록 스크롤을 되돌린다.
 */
export default function DetailTabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].key)
  const listRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const id = useId()

  useLayoutEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!list || !indicator) return
    const place = () => {
      const tab = list.querySelector<HTMLElement>('.pd-tab.is-active')
      if (!tab) return
      indicator.style.setProperty('--x', `${tab.offsetLeft}px`)
      indicator.style.setProperty('--w', `${tab.offsetWidth}px`)
    }
    place()
    // 웹폰트가 늦게 로드되면 탭 너비가 바뀌므로 크기 변화를 따라간다
    const ro = new ResizeObserver(place)
    ro.observe(list)
    return () => ro.disconnect()
  }, [active])

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
      <div className="pd-tabs has-indicator" role="tablist" aria-label={label} ref={listRef}>
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
        <span className="pd-tab-indicator" ref={indicatorRef} aria-hidden="true" />
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
