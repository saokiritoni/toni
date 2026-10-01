import { ReloadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { APPLE } from '../data/pixels'
import { prefersReducedMotion } from '../hooks/useReducedMotion'

const N = APPLE.length

// 새로 고칠 때마다 조각 모양과 순서가 달라지지 않도록 고정 시드 난수를 쓴다
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

type Cell = { key: string; kind: string; row: number; col: number }

/**
 * 블록 하나. 같은 조각의 블록은 지연(delay)·떨어지는 칸 수(fall)·옆으로 미끄러지는 칸 수(dx)가 같아서 한 덩어리로 떨어진다.
 * clear 는 다시 흩을 때 이 블록이 있는 줄이 지워지기 시작하는 시각이다
 */
type Block = Cell & { delay: number; fall: number; dx: number; clear: number }

// 테트리스 조각처럼 이웃한 블록을 최대 이만큼 묶는다
const PIECE_SIZE = 4
// 조각이 한 칸 내려가는 시간. 떨어지는 칸 수에 곱해 떨어지는 시간을 정하므로, 어느 조각이나 같은 속도로 내려온다
const ROW_MS = 42
// 조각이 떨어지기 시작하는 간격
const PIECE_GAP_MS = 110
// 조각은 처음 몇 줄을 내려오는 동안 옆으로 미끄러진다. 위쪽 줄에 들어갈 조각은 이미 쌓인 블록 위를 지나가지 않도록 미끄러지지 않는다
const SLIDE_ROWS = 2
const MAX_SLIDE = 2
// 다시 쌓기: 맨 아래 줄부터 한 줄씩 이 간격으로 번쩍이고 사라진다. CLEAR_ROW_MS 는 CSS 의 .is-clearing 애니메이션 길이와 같아야 한다
const CLEAR_STAGGER_MS = 55
const CLEAR_ROW_MS = 320

const CELLS: Cell[] = APPLE.flatMap((line, row) =>
  [...line].flatMap((kind, col) => (kind === '.' ? [] : [{ key: `${row}-${col}`, kind, row, col }])),
)

/**
 * 사과의 블록을 테트리스 조각처럼 묶으면서 떨어지는 순서를 함께 정한다.
 * 블록은 같은 열에서 자기 아래의 사과 칸이 모두 채워진 뒤에만 조각에 들어갈 수 있다. 그래서 열마다 아래부터 차오르고,
 * 떨어지는 길에 먼저 쌓인 블록이 있어 뚫고 지나가거나, 아래에 빈칸이 남았다가 나중에 갑자기 채워지는 일이 없다.
 * 조각은 가장 낮은 줄의 블록에서 시작해 이웃한 블록을 더하고, 잎·꼭지가 빨간 몸통과 섞이지 않도록 같은 색 블록을 먼저 고른다
 */
const BLOCKS: Block[] = (() => {
  const rand = seeded(7)
  const byKey = new Map(CELLS.map((c) => [c.key, c]))
  const placed = new Set<string>()
  // 같은 열에서 이 블록보다 아래에 있는 사과 칸이 모두 채워졌는지(또는 지금 만드는 조각에 들어 있는지) 본다
  const supported = (c: Cell, piece: Set<string>) =>
    CELLS.every((q) => q.col !== c.col || q.row <= c.row || placed.has(q.key) || piece.has(q.key))
  const out: Block[] = []
  let t = 0
  while (placed.size < CELLS.length) {
    const ready = CELLS.filter((c) => !placed.has(c.key) && supported(c, new Set()))
    const lowest = Math.max(...ready.map((c) => c.row))
    // 가장 낮은 줄과 한 줄 위 블록 가운데서 시작점을 고르면, 아래부터 쌓이면서도 좌우 순서가 매번 달라진다
    const starts = ready.filter((c) => c.row >= lowest - 1)
    const start = starts[Math.floor(rand() * starts.length)]
    const piece = [start]
    const inPiece = new Set([start.key])
    while (piece.length < PIECE_SIZE) {
      const next = piece
        .flatMap(({ row: r, col: c }) => [`${r - 1}-${c}`, `${r + 1}-${c}`, `${r}-${c - 1}`, `${r}-${c + 1}`])
        .map((k) => byKey.get(k))
        .filter((c): c is Cell => !!c && !placed.has(c.key) && !inPiece.has(c.key) && supported(c, inPiece))
      if (!next.length) break
      const same = next.filter((c) => c.kind === start.kind)
      const pool = same.length ? same : next
      const pick = pool[Math.floor(rand() * pool.length)]
      piece.push(pick)
      inPiece.add(pick.key)
    }

    const top = Math.min(...piece.map((c) => c.row))
    const low = Math.max(...piece.map((c) => c.row))
    const minCol = Math.min(...piece.map((c) => c.col))
    const maxCol = Math.max(...piece.map((c) => c.col))
    // 조각의 가장 아래 블록이 무대 위 가장자리 바로 위에서 출발하도록, 그 블록의 줄 번호 + 1 칸만큼 올려 둔다
    const fall = low + 1
    let dx = 0
    if (top > SLIDE_ROWS) {
      const lo = Math.max(-MAX_SLIDE, -minCol)
      const hi = Math.min(MAX_SLIDE, N - 1 - maxCol)
      dx = lo + Math.floor(rand() * (hi - lo + 1))
    }
    piece.forEach((c) => {
      out.push({ ...c, delay: t, fall, dx, clear: (N - 1 - c.row) * CLEAR_STAGGER_MS })
      placed.add(c.key)
    })
    t += PIECE_GAP_MS
  }
  return out
})()

type Phase = 'clearing' | 'empty' | 'dropping' | 'settled'
// 가장 늦게 떨어지는 조각의 지연에 그 조각이 떨어지는 시간을 더한 값
const DROP_MS = Math.max(...BLOCKS.map((b) => b.delay + b.fall * ROW_MS))
const CLEAR_MS = (N - 1) * CLEAR_STAGGER_MS + CLEAR_ROW_MS

export default function HeroStage() {
  const reduced = prefersReducedMotion()
  const [phase, setPhase] = useState<Phase>(reduced ? 'settled' : 'empty')
  const stageRef = useRef<HTMLDivElement>(null)
  const blockRefs = useRef<(HTMLSpanElement | null)[]>([])

  // (줄 지우기 →) 빈 판 → 조각이 떨어져 쌓임 → 완성
  useEffect(() => {
    if (reduced) return
    const next: Partial<Record<Phase, [Phase, number]>> = {
      clearing: ['empty', CLEAR_MS],
      empty: ['dropping', 450],
      dropping: ['settled', DROP_MS],
    }
    const step = next[phase]
    if (!step) return
    const t = window.setTimeout(() => setPhase(step[0]), step[1])
    return () => window.clearTimeout(t)
  }, [phase, reduced])

  // 그림을 눌러도 다시 쌓는다. 키보드로는 아래 "다시 쌓기" 버튼을 쓴다
  const canReplay = !reduced && phase === 'settled'
  const replay = () => setPhase('clearing')

  // 완성된 뒤 커서 근처 블록이 조금 밝아진다. 커서에 가까울수록 밝다
  useEffect(() => {
    const stage = stageRef.current
    if (reduced || phase !== 'settled' || !stage) return
    let pointer: { x: number; y: number } | null = null
    let frame = 0

    const update = () => {
      frame = 0
      const w = stage.clientWidth
      const radius = w * 0.3
      BLOCKS.forEach((b, i) => {
        const el = blockRefs.current[i]
        if (!el) return
        let lift = 0
        if (pointer) {
          const d = Math.hypot(((b.col + 0.5) / N) * w - pointer.x, ((b.row + 0.5) / N) * w - pointer.y)
          if (d < radius) lift = (1 - d / radius) ** 2
        }
        el.style.setProperty('--lift', lift.toFixed(3))
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
    return () => {
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      stage.removeEventListener('pointerup', onLeave)
      cancelAnimationFrame(frame)
      blockRefs.current.forEach((el) => el?.style.removeProperty('--lift'))
    }
  }, [phase, reduced])

  return (
    <div className="hero-stage-wrap">
      <div
        ref={stageRef}
        className={`hero-stage is-${phase}${canReplay ? ' can-replay' : ''}`}
        aria-hidden="true"
        onClick={canReplay ? replay : undefined}
      >
        {/* 블록이 들어갈 자리. 블록이 쌓이면 그 아래에 가려진다 */}
        {CELLS.map((c) => (
          <span key={`slot-${c.key}`} className="px-slot" style={{ gridRow: c.row + 1, gridColumn: c.col + 1 }} />
        ))}
        {BLOCKS.map((b, i) => (
          <span
            key={b.key}
            ref={(el) => {
              blockRefs.current[i] = el
            }}
            className="px"
            style={
              {
                gridRow: b.row + 1,
                gridColumn: b.col + 1,
                '--d': `${b.delay}ms`,
                '--fr': b.fall,
                '--fd': `${b.fall * ROW_MS}ms`,
                '--dx': b.dx,
                '--sn': Math.max(1, Math.abs(b.dx)),
                '--sd': `${SLIDE_ROWS * ROW_MS}ms`,
                '--cd': `${b.clear}ms`,
              } as CSSProperties
            }
          >
            {/* 바깥(.px)은 옆으로 미끄러지고, 안쪽(.px-in)은 아래로 떨어진다. 두 움직임의 칸 수가 달라서 요소를 나눈다 */}
            <span className={`px-in pk-${b.kind}`} />
          </span>
        ))}
      </div>
      {!reduced && (
        <div className="hero-stage-bar">
          <Button
            className="stage-replay"
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            disabled={!canReplay}
            onClick={replay}
          >
            다시 쌓기
          </Button>
        </div>
      )}
    </div>
  )
}
