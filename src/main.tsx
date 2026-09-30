import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

// JS 가 살아 있으면 [data-reveal] 의 2초 강제 노출 애니메이션을 끄고 IntersectionObserver 가 노출을 맡는다.
document.documentElement.classList.add('js-ready')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
