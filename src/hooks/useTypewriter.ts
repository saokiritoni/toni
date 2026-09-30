import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

const TYPE_MS = 70
const DELETE_MS = 36
const HOLD_MS = 1600
const NEXT_MS = 280

/** 문구를 한 글자씩 쓰고 지우기를 반복한다. 동작 줄이기가 켜져 있으면 첫 문구만 보여 준다. */
export function useTypewriter(phrases: readonly string[]) {
  const reduce = useReducedMotion()
  const [text, setText] = useState('')

  useEffect(() => {
    if (reduce) {
      setText(phrases[0] ?? '')
      return
    }
    let pi = 0
    let ci = 0
    let deleting = false
    let timer: number

    const tick = () => {
      const full = phrases[pi]
      setText(full.slice(0, ci))
      if (!deleting) {
        if (ci < full.length) {
          ci++
          timer = window.setTimeout(tick, TYPE_MS)
        } else {
          deleting = true
          timer = window.setTimeout(tick, HOLD_MS)
        }
      } else if (ci > 0) {
        ci--
        timer = window.setTimeout(tick, DELETE_MS)
      } else {
        deleting = false
        pi = (pi + 1) % phrases.length
        timer = window.setTimeout(tick, NEXT_MS)
      }
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [phrases, reduce])

  return text
}
