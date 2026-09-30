import type { ReactNode } from 'react'

/**
 * 상세 모달 사례의 "구현 상세"를 접어 둔다 (네이티브 details).
 * 문제·해결 칸은 핵심 판단만 보여 주고, 구현 근거는 펼쳐서 읽게 한다.
 */
export default function ImplDetail({ children }: { children: ReactNode }) {
  return (
    <details className="pd-impl">
      <summary>구현 상세</summary>
      <ul className="pd-sublist">{children}</ul>
    </details>
  )
}
