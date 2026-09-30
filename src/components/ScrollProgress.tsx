import { useEffect, useRef } from 'react'

/** 페이지 상단의 스크롤 진행 막대. 스크롤마다 리렌더하지 않도록 transform 을 직접 갱신한다. */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const docEl = document.documentElement
    let ticking = false
    const update = () => {
      const h = docEl.scrollHeight - docEl.clientHeight
      const p = h > 0 ? Math.min(Math.max(window.scrollY / h, 0), 1) : 0
      if (ref.current) ref.current.style.transform = `scaleX(${p})`
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}
