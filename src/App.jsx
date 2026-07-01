import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Hub from './hub/Hub'
import TopicExplorer from './topics/TopicExplorer'
import Roadmap from './pages/Roadmap'
import Checkup from './pages/Checkup'
import Learning from './pages/Learning'

/* Scroll to top on route change, or to a hash target if one is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        window.scrollTo({ top: 0 })
      })
      return
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <div className="app">
      <ScrollManager />
      <NavBar />
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/explore/:topicId" element={<TopicExplorer />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/checkup" element={<Checkup />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  )
}
