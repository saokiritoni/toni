import type { ComponentType } from 'react'
import type { ProjectKey } from '../data/projects'
import AdAnalyticsDetail from './AdAnalyticsDetail'
import AdOnChatDetail from './AdOnChatDetail'
import FarmDetail from './FarmDetail'
import GpuDetail from './GpuDetail'

// 상세 모달 안에서만 쓰이므로 ProjectModal 과 함께 지연 로딩되는 청크에 들어간다
export const DETAILS: Record<ProjectKey, ComponentType> = {
  nhnad: AdOnChatDetail,
  'ad-analytics': AdAnalyticsDetail,
  gpu: GpuDetail,
  farm: FarmDetail,
}
