import { Tabs } from 'antd'
import { useRef, type ReactNode } from 'react'

type Tab = { key: string; label: string; content: ReactNode }

/**
 * 상세 모달 안의 탭 (antd Tabs). 밑줄 이동 애니메이션은 antd 가 그린다.
 * 탭을 바꾸면 탭 바가 모달 상단에 보이도록 모달 본문의 스크롤을 되돌린다.
 */
export default function DetailTabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const rootRef = useRef<HTMLDivElement>(null)

  const onChange = () => {
    const root = rootRef.current
    const scroller = root?.closest<HTMLElement>('.modal-body')
    if (!root || !scroller) return
    const top = root.offsetTop - 8
    if (scroller.scrollTop > top) scroller.scrollTop = top
  }

  return (
    <div ref={rootRef} className="pd-tabs-root">
      <Tabs
        className="pd-tabs"
        aria-label={label}
        onChange={onChange}
        items={tabs.map((t) => ({ key: t.key, label: t.label, children: t.content }))}
      />
    </div>
  )
}
