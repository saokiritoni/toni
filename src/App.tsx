import { lazy, Suspense, useCallback, useState } from 'react'
import About from './components/About'
import Credentials from './components/Credentials'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import ScrollProgress from './components/ScrollProgress'
import Skills from './components/Skills'
import type { ProjectKey } from './data/projects'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

// 상세 모달(antd Modal·Tabs 와 프로젝트 상세 4건)은 첫 화면에 필요 없어서, 처음 열 때 따로 불러온다
const ProjectModal = lazy(() => import('./components/ProjectModal'))

export default function App() {
  const [openKey, setOpenKey] = useState<ProjectKey | null>(null)
  const [modalLoaded, setModalLoaded] = useState(false)
  useRevealOnScroll()

  // 닫은 뒤 카드로 포커스를 되돌리는 일은 antd Modal 이 하므로 여는 카드 요소는 쓰지 않는다
  const openProject = useCallback((key: ProjectKey) => {
    setModalLoaded(true)
    setOpenKey(key)
  }, [])
  const closeProject = useCallback(() => setOpenKey(null), [])

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="top">
        <Hero />
        <About />
        <Skills />
        <Projects onOpen={openProject} />
        <Experience />
        <Credentials />
      </main>
      <Footer />
      {modalLoaded && (
        <Suspense fallback={null}>
          <ProjectModal openKey={openKey} onClose={closeProject} />
        </Suspense>
      )}
    </>
  )
}
