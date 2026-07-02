import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageToggle from './LanguageToggle'
import { Horizon } from './Icons'

export default function NavBar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__brand" aria-label={t.nav.brand}>
          <span className="nav__mark" aria-hidden="true">
            <Horizon size={26} />
          </span>
          <span className="nav__brand-text">
            <span className="nav__brand-name">{t.nav.brand}</span>
            <span className="nav__brand-tag">{t.nav.tagline}</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          <Link className="nav__link" to="/learning">{t.nav.learning}</Link>
          <Link className="nav__link" to="/roadmap">{t.footer.links.roadmap}</Link>
        </nav>

        <div className="nav__actions">
          <LanguageToggle />
          <Link to="/checkup" className="btn btn--primary btn--sm">{t.nav.begin}</Link>
        </div>
      </div>
    </header>
  )
}
