import type { CSSProperties, ReactNode } from 'react'

type Step = {
  title: ReactNode
  sub?: ReactNode
  /** miss: 문제가 생기는 단계(강조색), key: 해결의 핵심 단계(초록) */
  tone?: 'miss' | 'key'
  /** numbered 에서 이 단계를 맡는 구성 요소 이름 (런타임, 사용자 등) */
  actor?: string
}

/** 뒤 단계에서 앞 단계로 되돌아가는 흐름. 단계 번호는 0부터 센다 */
type Loop = { from: number; to: number; label: ReactNode }

type Lane = { label: string; steps: Step[]; note?: ReactNode; loop?: Loop }

/**
 * 처리 흐름 그림. 내용에 따라 모양을 고른다.
 * - boxes: 단계 상자를 화살표로 잇는다. loop 를 주면 상자 아래에 되돌아가는 흐름을 그린다
 * - timeline: 한 줄 위의 점으로 순서만 보여 준다. 고치기 전과 뒤처럼 같은 단계의 순서 차이를 비교할 때 쓴다
 * - numbered: 번호와 맡는 구성 요소를 붙인 단계. 누가 무엇을 하는지가 중요할 때 쓴다
 * 레인 하나가 흐름 하나이고, 단계는 왼쪽에서 오른쪽(모바일은 위에서 아래)으로 읽는다.
 */
export default function FlowDiagram({
  label,
  lanes,
  variant = 'boxes',
}: {
  label: string
  lanes: Lane[]
  variant?: 'boxes' | 'timeline' | 'numbered'
}) {
  return (
    <figure className={`pd-flow is-${variant}`} aria-label={label}>
      {lanes.map((lane) => (
        <div className="flow-lane" key={lane.label}>
          <span className="flow-lane-label">{lane.label}</span>
          <ol className="flow-steps" style={{ '--n': lane.steps.length } as CSSProperties}>
            {lane.steps.map((s, i) => (
              <li key={i} className={s.tone ? `flow-step ${s.tone}` : 'flow-step'}>
                {variant === 'numbered' && (
                  <span className="flow-no" aria-hidden="true">
                    {i + 1}
                  </span>
                )}
                {s.actor && <span className="flow-actor">{s.actor}</span>}
                <strong>{s.title}</strong>
                {s.sub && <span className="flow-sub">{s.sub}</span>}
              </li>
            ))}
            {lane.loop && (
              <li
                className="flow-loop"
                aria-label="되돌아가는 흐름"
                style={{ '--loop-start': lane.loop.to + 1, '--loop-end': lane.loop.from + 2 } as CSSProperties}
              >
                <span>{lane.loop.label}</span>
              </li>
            )}
          </ol>
          {lane.note && <p className="flow-note">{lane.note}</p>}
        </div>
      ))}
    </figure>
  )
}
