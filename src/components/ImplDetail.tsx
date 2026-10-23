import type { ReactNode } from 'react'

/**
 * 사례의 "구현 상세" 목록. 상세 모달에서는 모달 → Part → 구현 상세로 세 번 열어야 읽히지 않도록 접지 않고 바로 보여 준다.
 * AdOnChat 상세 페이지는 사례가 많아 fold 로 접어 두고, 근거가 궁금한 사람만 연다.
 */
export default function ImplDetail({ children, fold = false, label = '구현 상세' }: { children: ReactNode; fold?: boolean; label?: string }) {
  if (fold) {
    return (
      <details className="pd-impl is-fold">
        <summary className="pd-impl-label">{label}</summary>
        <ul className="pd-sublist">{children}</ul>
      </details>
    )
  }
  return (
    <div className="pd-impl">
      <span className="pd-impl-label">{label}</span>
      <ul className="pd-sublist">{children}</ul>
    </div>
  )
}
