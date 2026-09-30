import { useCallback, useState } from 'react'
import About from './components/About'
import Credentials from './components/Credentials'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import ProjectModal from './components/ProjectModal'
import Projects from './components/Projects'
import ScrollProgress from './components/ScrollProgress'
import Skills from './components/Skills'
import type { ProjectKey } from './data/projects'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

export default function App() {
  const [modal, setModal] = useState<{ key: ProjectKey | null; trigger: HTMLElement | null }>({ key: null, trigger: null })
  useRevealOnScroll()

  const openProject = useCallback((key: ProjectKey, trigger: HTMLElement) => setModal({ key, trigger }), [])
  const closeProject = useCallback(() => setModal((m) => ({ ...m, key: null })), [])

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
      <ProjectModal openKey={modal.key} trigger={modal.trigger} onClose={closeProject} />
    </>
  )
}
