import { useEffect } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

/**
 * [data-reveal] 요소가 화면 아래 15% 바깥까지 다가오면 is-revealed 를 붙여 짧게 페이드한다.
 * 화면 위로 이미 지나간 요소도 함께 드러내므로, 빠르게 스크롤하거나 뒤로 가기로 중간 위치에 돌아와도 빈 요소가 남지 않는다.
 * 메뉴·버튼(#링크)으로 이동한 섹션은 기다리지 않도록, 그 안의 요소를 페이드 없이 바로 보여 준다.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    let pending = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)'))
    if (prefersReducedMotion()) {
      pending.forEach((el) => el.classList.add('is-revealed'))
      return
    }

    let frame = 0
    const check = () => {
      frame = 0
      const line = window.innerHeight * 1.15
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top > line) return true
        el.classList.add('is-revealed')
        return false
      })
      if (!pending.length) stop()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    const revealNow = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const id = link?.getAttribute('href')?.slice(1)
      const section = id ? document.getElementById(id) : null
      if (!section) return
      section.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach((el) => {
        el.style.transition = 'none'
        el.classList.add('is-revealed')
      })
      schedule()
    }
    const stop = () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('click', revealNow, true)
    }

    // 처음 그릴 때 이미 화면 안이나 위에 있는 요소를 먼저 드러낸다
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('click', revealNow, true)
    return () => {
      cancelAnimationFrame(frame)
      stop()
    }
  }, [])
}
