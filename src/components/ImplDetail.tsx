import type { ReactNode } from 'react'

/**
 * 상세 모달 사례의 "구현 상세" 목록. 모달 → Part → 구현 상세로 세 번 열어야 읽히지 않도록 접지 않고 바로 보여 준다.
 */
export default function ImplDetail({ children }: { children: ReactNode }) {
  return (
    <div className="pd-impl">
      <span className="pd-impl-label">구현 상세</span>
      <ul className="pd-sublist">{children}</ul>
    </div>
  )
}
