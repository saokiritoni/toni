import { ReloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { APPLE } from '../data/pixels'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const N = APPLE.length

// 새로 고칠 때마다 흩어진 모양이 달라지지 않도록 고정 시드 난수를 쓴다
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

type Pixel = { key: string; kind: string; row: number; col: number; sx: number; sy: number; sr: number; delay: number }

const PIXELS: Pixel[] = (() => {
  const rand = seeded(7)
  const out: Pixel[] = []
  APPLE.forEach((line, row) =>
    [...line].forEach((kind, col) => {
      if (kind === '.') return
      // 가운데에서 먼 블록일수록 늦게 자리를 찾아, 사과가 안쪽부터 채워진다
      const dist = Math.hypot(row - N / 2, col - N / 2) / (N / 2)
      out.push({
        key: `${row}-${col}`,
        kind,
        row,
        col,
        sx: (rand() - 0.5) * 520,
        sy: (rand() - 0.5) * 420,
        sr: (rand() - 0.5) * 180,
        delay: Math.round(dist * 520 + rand() * 260),
      })
    }),
  )
  return out
})()

type Phase = 'scattered' | 'assembling' | 'settled'
const ASSEMBLE_MS = 1900
const STATE_LABEL: Record<Phase, string> = { scattered: 'scattered', assembling: 'structuring…', settled: 'structured' }

export default function HeroStage() {
  const reduced = prefersReducedMotion()
  const [phase, setPhase] = useState<Phase>(reduced ? 'settled' : 'scattered')
  const stageRef = useRef<HTMLDivElement>(null)
  const pixelRefs = useRef<(HTMLSpanElement | null)[]>([])

  // 흩어진 상태 → 조립 → 조립 완료. 완료 뒤에는 지연 없이 짧게 반응하도록 phase 를 나눈다
  useEffect(() => {
    if (reduced) return
    if (phase === 'scattered') {
      const t = window.setTimeout(() => setPhase('assembling'), 450)
      return () => window.clearTimeout(t)
    }
    if (phase === 'assembling') {
      const t = window.setTimeout(() => setPhase('settled'), ASSEMBLE_MS)
      return () => window.clearTimeout(t)
    }
  }, [phase, reduced])

  // 커서 근처 블록은 밀어내고, 스크롤을 내리면 원래 흩어졌던 방향으로 조금씩 되돌린다
  useEffect(() => {
    const stage = stageRef.current
    if (reduced || phase !== 'settled' || !stage) return
    let pointer: { x: number; y: number } | null = null
    let frame = 0

    const update = () => {
      frame = 0
      const w = stage.clientWidth
      const radius = w * 0.34
      // 무대 위쪽이 헤더(64px) 아래로 들어가기 시작할 때부터 흩어진다. 무대를 보는 동안에는 사과 모양을 유지한다
      const top = stage.getBoundingClientRect().top
      const scroll = Math.min(1, Math.max(0, (64 - top) / w))
      PIXELS.forEach((p, i) => {
        const el = pixelRefs.current[i]
        if (!el) return
        let rx = p.sx * scroll * 0.45
        let ry = p.sy * scroll * 0.45
        if (pointer) {
          const cx = ((p.col + 0.5) / N) * w
          const cy = ((p.row + 0.5) / N) * w
          const dx = cx - pointer.x
          const dy = cy - pointer.y
          const d = Math.hypot(dx, dy) || 1
          if (d < radius) {
            const push = (1 - d / radius) ** 2 * 34
            rx += (dx / d) * push
            ry += (dy / d) * push
          }
        }
        el.style.setProperty('--rx', `${rx.toFixed(1)}px`)
        el.style.setProperty('--ry', `${ry.toFixed(1)}px`)
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect()
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top }
      schedule()
    }
    const onLeave = () => {
      pointer = null
      schedule()
    }

    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    stage.addEventListener('pointerup', onLeave)
    window.addEventListener('scroll', schedule, { passive: true })
    schedule()
    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('pointerup', onLeave)
      window.removeEventListener('scroll', schedule)
      cancelAnimationFrame(frame)
      pixelRefs.current.forEach((el) => {
        el?.style.removeProperty('--rx')
        el?.style.removeProperty('--ry')
      })
    }
  }, [phase, reduced])

  return (
    <div className="hero-stage-wrap">
      <div ref={stageRef} className={`hero-stage is-${phase}`} aria-hidden="true">
        {PIXELS.map((p, i) => (
          <span
            key={p.key}
            ref={(el) => {
              pixelRefs.current[i] = el
            }}
            className={`px pk-${p.kind}`}
            style={
              {
                gridRow: p.row + 1,
                gridColumn: p.col + 1,
                '--sx': `${p.sx}px`,
                '--sy': `${p.sy}px`,
                '--sr': `${p.sr}deg`,
                '--d': `${p.delay}ms`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="hero-stage-bar">
        <span className={`stage-state${phase === 'settled' ? ' is-on' : ''}`}>{STATE_LABEL[phase]}</span>
        {!reduced && (
          <Button
            className="stage-replay"
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            disabled={phase !== 'settled'}
            onClick={() => setPhase('scattered')}
          >
            다시 흩기
          </Button>
        )}
      </div>
    </div>
  )
}
