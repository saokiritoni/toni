import { Collapse } from 'antd'
import type { ReactNode } from 'react'

type Part = { title: string; content: ReactNode }

/**
 * 상세 모달의 "진행한 일"을 Part 단위로 접고 펼친다 (antd Collapse).
 * 첫 Part 만 펼쳐 두어, 모달을 열었을 때 내용이 바로 보이면서도 전체 길이가 짧아지게 한다.
 */
export default function WorkParts({ parts }: { parts: Part[] }) {
  return (
    <Collapse
      className="work-parts"
      defaultActiveKey={['part-1']}
      expandIconPlacement="end"
      items={parts.map((part, i) => ({
        key: `part-${i + 1}`,
        label: (
          <span className="work-part-label">
            <span className="work-part-no">Part {i + 1}</span>
            <span className="work-part-title">{part.title}</span>
          </span>
        ),
        children: part.content,
      }))}
    />
  )
}
