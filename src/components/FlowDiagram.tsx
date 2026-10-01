import type { CSSProperties, ReactNode } from 'react'

type Step = {
  title: ReactNode
  sub?: ReactNode
  /** miss: 문제가 생기는 단계(강조색), key: 해결의 핵심 단계(잎 초록) */
  tone?: 'miss' | 'key'
}

type Lane = { label: string; steps: Step[]; note?: ReactNode }

/**
 * 상세 모달의 처리 흐름 그림. 레인 하나가 흐름 하나이고, 단계는 왼쪽에서 오른쪽(모바일은 위에서 아래)으로 읽는다.
 * 상세 모달 청크에서만 import 한다.
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
                <strong>{s.title}</strong>
                {s.sub && <span>{s.sub}</span>}
              </li>
            ))}
          </ol>
          {lane.note && <p className="flow-note">{lane.note}</p>}
        </div>
      ))}
    </figure>
  )
}
