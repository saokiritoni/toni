import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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

// 상세 모달(antd Modal 과 프로젝트 상세 3건)은 첫 화면에 필요 없어서, 처음 열 때 따로 불러온다
const ProjectModal = lazy(() => import('./components/ProjectModal'))
// AdOnChat 은 사례가 많아 모달 대신 별도 페이지로 연다. vercel.json 이 이 주소를 index.html 로 돌려준다
const AdOnChatPage = lazy(() => import('./pages/AdOnChatPage'))
const ADONCHAT_PATH = '/projects/adonchat'

/** 첫 화면. 다시 돌아올 때마다 새로 그려지므로, 스크롤 등장 관찰도 여기서 다시 시작한다 */
function Home({ onOpen }: { onOpen: (key: ProjectKey) => void }) {
  useRevealOnScroll()
  return (
    <main id="top">
      <Hero />
      <About />
      <Projects onOpen={onOpen} />
      <Skills />
      <Experience />
      <Credentials />
    </main>
  )
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [openKey, setOpenKey] = useState<ProjectKey | null>(null)
  const [modalLoaded, setModalLoaded] = useState(false)
  // 상세 페이지로 가기 전의 첫 화면 스크롤 위치. 돌아왔을 때 보던 카드 위치로 되돌린다
  const homeScroll = useRef<number | null>(null)
  const onPage = path === ADONCHAT_PATH

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useLayoutEffect(() => {
    if (onPage) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else if (homeScroll.current !== null) {
      window.scrollTo({ top: homeScroll.current, behavior: 'instant' })
      homeScroll.current = null
    }
  }, [onPage])

  // 닫은 뒤 카드로 포커스를 되돌리는 일은 antd Modal 이 하므로 여는 카드 요소는 쓰지 않는다
  const openProject = useCallback((key: ProjectKey) => {
    if (key === 'nhnad') {
      homeScroll.current = window.scrollY
      window.history.pushState({ fromHome: true }, '', ADONCHAT_PATH)
      setPath(ADONCHAT_PATH)
      return
    }
    setModalLoaded(true)
    setOpenKey(key)
  }, [])
  const closeProject = useCallback(() => setOpenKey(null), [])

  // 첫 화면에서 들어왔으면 뒤로 가기로 돌아가고, 주소로 바로 들어왔으면 첫 화면의 Projects 로 간다
  const backToList = useCallback(() => {
    if (window.history.state?.fromHome) {
      window.history.back()
      return
    }
    window.history.pushState(null, '', '/')
    setPath('/')
    requestAnimationFrame(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'instant' }))
  }, [])

  return (
    <>
      <ScrollProgress />
      <Header page={onPage} onHome={backToList} />
      {onPage ? (
        <Suspense fallback={<main className="pp" />}>
          <AdOnChatPage onBack={backToList} />
        </Suspense>
      ) : (
        <Home onOpen={openProject} />
      )}
      <Footer />
      {modalLoaded && (
        <Suspense fallback={null}>
          <ProjectModal openKey={openKey} onClose={closeProject} />
        </Suspense>
      )}
    </>
  )
}
