import { Modal } from 'antd'
import { useState } from 'react'
import { ALL_PROJECTS, type ProjectKey } from '../data/projects'
import { DETAILS } from '../details'

type Props = {
  openKey: ProjectKey | null
  onClose: () => void
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
      title={project?.modalTitle}
      onCancel={onClose}
      afterClose={() => setShownKey(null)}
      footer={null}
      width={720}
      centered
      destroyOnHidden
      classNames={{ body: 'modal-body' }}
      closable={{ 'aria-label': '상세 닫기' }}
    >
      {Detail && <Detail key={shownKey} />}
    </Modal>
  )
}
