import type { CSSProperties, ReactNode } from 'react'

type Step = {
  title: ReactNode
  sub?: ReactNode
  /** miss: 문제가 생기는 단계(강조색), key: 해결의 핵심 단계(초록) */
  tone?: 'miss' | 'key'
  /** 이 단계를 맡는 구성 요소 이름 (런타임, 사용자 등) */
  actor?: string
}

/** 뒤 단계에서 앞 단계로 되돌아가는 흐름. 단계 번호는 0부터 센다 */
type Loop = { from: number; to: number; label: ReactNode }

type Lane = { label: string; steps: Step[]; note?: ReactNode; loop?: Loop }

/**
 * 처리 흐름 그림. 단계마다 번호와 맡는 구성 요소를 붙이고, 테두리 없는 면으로 나눈다.
 * 문제가 생기는 단계(miss)와 해결의 핵심 단계(key)는 면 색으로 구분한다.
 * loop 를 주면 단계 아래에 되돌아가는 흐름을 그린다.
 * 레인 하나가 흐름 하나이고, 단계는 왼쪽에서 오른쪽(모바일은 위에서 아래)으로 읽는다.
 */
export default function FlowDiagram({ label, lanes }: { label: string; lanes: Lane[] }) {
  return (
    <figure className="pd-flow" aria-label={label}>
      {lanes.map((lane) => (
        <div className="flow-lane" key={lane.label}>
          <span className="flow-lane-label">{lane.label}</span>
          <ol className="flow-steps" style={{ '--n': lane.steps.length } as CSSProperties}>
            {lane.steps.map((s, i) => (
              <li key={i} className={s.tone ? `flow-step ${s.tone}` : 'flow-step'}>
                <span className="flow-no" aria-hidden="true">
                  {i + 1}
                </span>
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
