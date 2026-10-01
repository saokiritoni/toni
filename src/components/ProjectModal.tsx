import { Modal } from 'antd'
import { useEffect, useState } from 'react'
import { PROJECT_PIXELS } from '../data/pixels'
import { ALL_PROJECTS, GRID_PROJECTS, type ProjectKey } from '../data/projects'
import { DETAILS } from '../details'
import PixelArt from './PixelArt'

type Props = {
  openKey: ProjectKey | null
  onClose: () => void
}

/** 모달 머리의 색 띠는 누른 카드의 색 영역과 같은 배경을 쓴다. AdOnChat 은 가로형 카드의 왼쪽 패널 색이다 */
function toneOf(key: ProjectKey) {
  return GRID_PROJECTS.find((p) => p.key === key)?.thumb.tone ?? 'feat'
}

/** 모달 머리. 열린 뒤 한 프레임 늦게 is-revealed 를 붙여 픽셀 아이콘이 흩어진 상태에서 모이게 한다 */
function ModalHead({ projectKey, org, title }: { projectKey: ProjectKey; org: string; title: string }) {
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <div className={`pm-head tone-${toneOf(projectKey)}${revealed ? ' is-revealed' : ''}`}>
      <div className="pm-head-text">
        <span className="project-org">{org}</span>
        <span className="pm-title">{title}</span>
      </div>
      <PixelArt pattern={PROJECT_PIXELS[projectKey]} cell={6} className="pm-pixel" />
    </div>
  )
}

/**
 * 프로젝트 상세 모달 (antd Modal).
 * 포커스 가두기·ESC·배경 클릭·배경 스크롤 잠금·닫은 뒤 카드로 포커스 되돌리기는 antd Modal 이 처리한다.
 */
export default function ProjectModal({ openKey, onClose }: Props) {
  // 닫힘 애니메이션 동안에도 내용을 남겨 두려고, 마지막으로 연 프로젝트를 따로 기억한다.
  const [shownKey, setShownKey] = useState<ProjectKey | null>(null)
  if (openKey !== null && openKey !== shownKey) setShownKey(openKey)

  const project = ALL_PROJECTS.find((p) => p.key === shownKey)
  const Detail = shownKey ? DETAILS[shownKey] : null

  return (
    <Modal
      rootClassName="project-modal"
      open={openKey !== null}
      title={project && <ModalHead key={project.key} projectKey={project.key} org={project.org} title={project.modalTitle} />}
      transitionName="pm-pop"
      onCancel={onClose}
      afterClose={() => setShownKey(null)}
      footer={null}
      width={840}
      centered
      destroyOnHidden
      classNames={{ body: 'modal-body' }}
      closable={{ 'aria-label': '상세 닫기' }}
    >
      {Detail && <Detail key={shownKey} />}
    </Modal>
  )
}
