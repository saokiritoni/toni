import { useMemo, type CSSProperties } from 'react'
import type { PixelPattern } from '../data/pixels'

// 새로 고칠 때마다 흩어진 모양이 달라지지 않도록, 그림마다 고정된 시드로 난수를 만든다
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function build(pattern: PixelPattern, cell: number) {
  const rand = seeded(pattern.join('').length * 131 + pattern.length)
  const spread = pattern[0].length * cell * 1.4
  const out: { key: string; kind: string; row: number; col: number; style: CSSProperties }[] = []
  pattern.forEach((line, row) =>
    [...line].forEach((kind, col) => {
      if (kind === '.') return
      out.push({
        key: `${row}-${col}`,
        kind,
        row,
        col,
        style: {
          gridRow: row + 1,
          gridColumn: col + 1,
          '--sx': `${((rand() - 0.5) * spread).toFixed(1)}px`,
          '--sy': `${((rand() - 0.5) * spread).toFixed(1)}px`,
          '--d': `${Math.round(120 + rand() * 380)}ms`,
          '--i': col,
        } as CSSProperties,
      })
    }),
  )
  return out
}

/**
 * 블록으로 그린 작은 그림. [data-reveal] 조상이 화면에 들어오면 흩어진 블록이 제자리로 모인다.
 * 조상에 [data-reveal] 이 없는 곳에서는 static 으로 처음부터 모인 상태를 보여 준다.
 */
export default function PixelArt({
  pattern,
  cell = 5,
  className = '',
  static: isStatic = false,
}: {
  pattern: PixelPattern
  cell?: number
  className?: string
  static?: boolean
}) {
  const pixels = useMemo(() => build(pattern, cell), [pattern, cell])
  return (
    <span
      className={`pixel-art${isStatic ? ' is-static' : ''} ${className}`}
      aria-hidden="true"
      style={{ '--cols': pattern[0].length, '--cell': `${cell}px` } as CSSProperties}
    >
      {pixels.map((p) => (
        <span key={p.key} className={`pa-px pk-${p.kind}`} style={p.style} />
      ))}
    </span>
  )
}
