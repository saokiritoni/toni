import { useEffect } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

/**
 * [data-reveal] 요소가 화면에 들어오기 조금 전에 is-revealed 를 붙인다.
 * 메뉴·버튼(#링크)으로 이동한 섹션은 기다리지 않도록, 그 안의 요소를 페이드 없이 바로 보여 준다.
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
          en.target.classList.add('is-revealed')
          io.unobserve(en.target)
        })
      },
      // 화면 아래 15% 바깥에서 미리 드러내서, 보이는 순간에는 이미 나타나 있게 한다
      { threshold: 0, rootMargin: '0px 0px 15% 0px' },
    )
    els.forEach((el) => io.observe(el))

    const revealNow = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const id = link?.getAttribute('href')?.slice(1)
      const section = id ? document.getElementById(id) : null
      if (!section) return
      section.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach((el) => {
        el.style.transition = 'none'
        el.classList.add('is-revealed')
        io.unobserve(el)
      })
    }
    document.addEventListener('click', revealNow, true)
    return () => {
      io.disconnect()
      document.removeEventListener('click', revealNow, true)
    }
  }, [])
}
