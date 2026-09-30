import { useCallback, useEffect, useRef, useState } from 'react'
import { ALL_PROJECTS, type ProjectKey } from '../data/projects'
import { prefersReducedMotion } from '../hooks/useReducedMotion'
import { CloseIcon } from './Icons'

/** 닫힘 트랜지션(.modal-overlay opacity 250ms)이 끝난 뒤 내용을 비우는 시간 */
const CLOSE_MS = 260
const FOCUSABLE = 'button, a[href], [tabindex]:not([tabindex="-1"])'

type Props = {
  openKey: ProjectKey | null
  trigger: HTMLElement | null
  onClose: () => void
}

/**
 * 프로젝트 상세 모달.
 * 열리면 배경 스크롤을 잠그고 대화상자로 포커스를 옮기며, 닫히면 연 카드로 포커스를 돌려준다.
 * ESC·배경 클릭으로 닫히고, Tab 키 포커스는 모달 안에서만 돈다.
 */
export default function ProjectModal({ openKey, trigger, onClose }: Props) {
  // shownKey 는 닫힘 트랜지션 동안에도 내용을 남겨 두려고 openKey 와 따로 둔다.
  const [shownKey, setShownKey] = useState<ProjectKey | null>(null)
  const [visible, setVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (openKey === null) return
    triggerRef.current = trigger
    setShownKey(openKey)
    document.body.style.overflow = 'hidden'
    // 한 프레임 뒤에 open 클래스를 붙여야 hidden 해제 직후에도 트랜지션이 재생된다.
    const raf = requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = 0
      setVisible(true)
    })
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), prefersReducedMotion() ? 0 : 20)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(focusTimer)
    }
  }, [openKey, trigger])

  useEffect(() => {
    if (openKey !== null || shownKey === null) return
    setVisible(false)
    document.body.style.overflow = ''
    const done = () => {
      setShownKey(null)
      triggerRef.current?.focus()
      triggerRef.current = null
    }
    if (prefersReducedMotion()) {
      done()
      return
    }
    const t = window.setTimeout(done, CLOSE_MS)
    return () => window.clearTimeout(t)
  }, [openKey, shownKey])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !overlayRef.current) return
      const f = Array.from(overlayRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest('[hidden]'))
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      const activeEl = document.activeElement
      if (e.shiftKey) {
        if (activeEl === first || activeEl === dialogRef.current) {
          e.preventDefault()
          last.focus()
        }
      } else if (activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (openKey === null) return
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openKey, onKeyDown])

  const project = ALL_PROJECTS.find((p) => p.key === shownKey)
  const Detail = project?.Detail

  return (
    <div
      className={`modal-overlay${visible ? ' open' : ''}`}
      ref={overlayRef}
      hidden={shownKey === null}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" ref={dialogRef} tabIndex={-1}>
        <div className="modal-head">
          <h3 className="modal-title" id="modalTitle">
            {project?.modalTitle}
          </h3>
          <button className="modal-close" type="button" aria-label="상세 닫기" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body" ref={bodyRef}>
          {Detail && <Detail key={shownKey} />}
        </div>
      </div>
    </div>
  )
}
