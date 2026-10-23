import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from 'react'
import { flushSync } from 'react-dom'
import About from './components/About'
import Credentials from './components/Credentials'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Projects from './components/Projects'
import ScrollProgress from './components/ScrollProgress'
import Skills from './components/Skills'
import { FEATURED, type ProjectKey } from './data/projects'
import { prefersReducedMotion } from './hooks/useReducedMotion'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

// 상세 모달(antd Modal 과 프로젝트 상세 3건)은 첫 화면에 필요 없어서, 처음 열 때 따로 불러온다
const ProjectModal = lazy(() => import('./components/ProjectModal'))
// AdOnChat 은 사례가 많아 모달 대신 별도 페이지로 연다. vercel.json 이 이 주소를 index.html 로 돌려준다.
// 화면 전환이 페이지를 그린 뒤의 모습을 찍을 수 있도록, React.lazy 대신 청크를 먼저 받아 둔 뒤 그린다
const ADONCHAT_PATH = '/projects/adonchat'
type PageComponent = ComponentType<{ onBack: () => void }>
let pageChunk: Promise<PageComponent> | null = null
const loadPage = () => (pageChunk ??= import('./pages/AdOnChatPage').then((m) => m.default))

/**
 * 첫 화면과 상세 페이지를 바꾸는 갱신을 화면 전환(View Transition)으로 감싼다.
 * 카드와 상세 페이지의 제목, 픽셀 아이콘만 이어지고 나머지는 짧게 바뀐다.
 * 지원하지 않는 브라우저와 모션 감소 설정에서는 기다리지 않고 바로 바꾼다.
 */
function transition(update: (page?: PageComponent) => void, needPage = false) {
  const ready = needPage ? loadPage() : Promise.resolve(undefined)
  if (!document.startViewTransition || prefersReducedMotion()) {
    ready.then(update)
    return
  }
  document.startViewTransition(async () => {
    const page = await ready
    flushSync(() => update(page))
  })
}

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

/** 상세 페이지에서 돌아온 첫 화면은 이미 본 화면이므로, 등장 효과 없이 모두 바로 보여 준다 */
function revealAllNow() {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.classList.add('reveal-instant', 'is-revealed')
  })
}

export default function App() {
  const [path, setPath] = useState(() => window.location.pathname)
  const [Page, setPage] = useState<PageComponent | null>(null)
  const [openKey, setOpenKey] = useState<ProjectKey | null>(null)
  const [modalLoaded, setModalLoaded] = useState(false)
  // 상세 페이지로 가기 전의 첫 화면 스크롤 위치. 돌아왔을 때 보던 카드 위치로 되돌린다
  const homeScroll = useRef<number | null>(null)
  // 돌아온 뒤 초점을 AdOnChat 카드로 되돌릴지. 로고로 홈에 갈 때는 되돌리지 않는다
  const focusCard = useRef(false)
  const onPage = path === ADONCHAT_PATH
  const wasOnPage = useRef(onPage)

  // 주소로 바로 들어오면 페이지 청크를 받아 그린다
  useEffect(() => {
    if (onPage && !Page) loadPage().then((C) => setPage(() => C))
  }, [onPage, Page])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    const onPop = () => {
      const next = window.location.pathname
      const toPage = next === ADONCHAT_PATH
      if (!toPage) focusCard.current = true
      transition((page) => {
        if (page) setPage(() => page)
        setPath(next)
      }, toPage)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useLayoutEffect(() => {
    const cameBack = wasOnPage.current && !onPage
    wasOnPage.current = onPage
    if (onPage) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    if (!cameBack) return
    revealAllNow()
    if (homeScroll.current !== null) {
      window.scrollTo({ top: homeScroll.current, behavior: 'instant' })
      homeScroll.current = null
    } else {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'instant' })
    }
    if (focusCard.current) document.querySelector<HTMLElement>('.pcard-feat .pcard-link')?.focus({ preventScroll: true })
    focusCard.current = false
  }, [onPage])

  // 닫은 뒤 카드로 포커스를 되돌리는 일은 antd Modal 이 하므로 여는 카드 요소는 쓰지 않는다
  const openProject = useCallback((key: ProjectKey) => {
    if (key === 'nhnad') {
      homeScroll.current = window.scrollY
      window.history.pushState({ fromHome: true }, '', ADONCHAT_PATH)
      transition((page) => {
        if (page) setPage(() => page)
        setPath(ADONCHAT_PATH)
      }, true)
      return
    }
    setModalLoaded(true)
    setOpenKey(key)
  }, [])
  const closeProject = useCallback(() => setOpenKey(null), [])

  /**
   * 프로젝트 목록으로 돌아간다. 첫 화면에서 들어왔으면 이전 기록이 곧 목록이므로 뒤로 가기로 돌아가고(보던 위치가 남는다),
   * 주소로 바로 들어왔으면 새 기록을 쌓고 첫 화면의 Projects 로 간다.
   */
  const backToList = useCallback(() => {
    if (window.history.state?.fromHome) {
      window.history.back()
      return
    }
    focusCard.current = true
    window.history.pushState(null, '', '/#projects')
    transition(() => setPath('/'))
  }, [])

  /** 로고: 첫 화면 맨 위로 간다 */
  const goHome = useCallback(() => {
    homeScroll.current = 0
    window.history.pushState(null, '', '/')
    transition(() => setPath('/'))
  }, [])

  return (
    <>
      <ScrollProgress />
      <Header page={onPage ? FEATURED.title : undefined} onHome={goHome} onList={backToList} />
      {onPage ? Page ? <Page onBack={backToList} /> : <main className="pp" /> : <Home onOpen={openProject} />}
      <Footer />
      {modalLoaded && (
        <Suspense fallback={null}>
          <ProjectModal openKey={openKey} onClose={closeProject} />
        </Suspense>
      )}
    </>
  )
}
