import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageToggle from './LanguageToggle'
import { Compass } from './Icons'

export default function NavBar() {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onHome = location.pathname === '/'

  // On the landing page, section links scroll. Elsewhere, they route home + hash.
  const sectionLink = (hash, label) => {
    if (onHome) {
      return (
        <a className="nav__link" href={`#${hash}`}>
          {label}
        </a>
      )
    }
    return (
      <button className="nav__link" type="button" onClick={() => navigate(`/#${hash}`)}>
        {label}
      </button>
    )
  }

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <Link to="/" className="nav__brand" aria-label={t.nav.brand}>
          <span className="nav__mark" aria-hidden="true">
            <Compass size={22} />
          </span>
          <span className="nav__brand-text">
            <span className="nav__brand-name">{t.nav.brand}</span>
            <span className="nav__brand-tag">{t.nav.tagline}</span>
          </span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {sectionLink('promise', t.nav.promise)}
          {sectionLink('how', t.nav.how)}
          <Link className="nav__link" to="/learning">
            {t.nav.learning}
          </Link>
        </nav>

        <div className="nav__actions">
          <LanguageToggle compact />
          <Link to="/checkup" className="btn btn--primary btn--sm">
            {t.nav.begin}
          </Link>
        </div>
      </div>
    </header>
  )
}
