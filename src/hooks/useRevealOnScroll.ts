import { useEffect } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

/**
 * [data-reveal] 요소가 화면에 들어오면 is-revealed 를 붙인다.
 * 같은 부모 아래 형제끼리는 60ms 씩 늦게 나타나도록 순서대로 지연을 준다.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          const el = en.target as HTMLElement
          const sibs = el.parentElement ? Array.from(el.parentElement.querySelectorAll(':scope > [data-reveal]')) : []
          el.style.transitionDelay = `${Math.max(0, sibs.indexOf(el)) * 60}ms`
          el.classList.add('is-revealed')
          io.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
