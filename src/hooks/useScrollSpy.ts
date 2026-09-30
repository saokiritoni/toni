import { useEffect, useState } from 'react'

/** 화면 가운데를 지나는 섹션의 id 를 돌려준다. */
export function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)
    if (!('IntersectionObserver' in window) || targets.length === 0) return
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    targets.forEach((t) => spy.observe(t))
    return () => spy.disconnect()
  }, [ids])

  return active
}
