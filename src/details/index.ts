import type { ComponentType } from 'react'
import type { ProjectKey } from '../data/projects'
import AdAnalyticsDetail from './AdAnalyticsDetail'
import FarmDetail from './FarmDetail'
import GpuDetail from './GpuDetail'

// 상세 모달 안에서만 쓰이므로 ProjectModal 과 함께 지연 로딩되는 청크에 들어간다.
// AdOnChat 은 모달이 아니라 상세 페이지(src/pages/AdOnChatPage.tsx)로 열려서 여기에 없다
export const DETAILS: Partial<Record<ProjectKey, ComponentType>> = {
  'ad-analytics': AdAnalyticsDetail,
  gpu: GpuDetail,
  farm: FarmDetail,
}
