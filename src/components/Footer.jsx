import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageToggle from './LanguageToggle'
import { Compass } from './Icons'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="nav__mark" aria-hidden="true">
            <Compass size={22} />
          </span>
          <div>
            <p className="footer__name">{t.nav.brand}</p>
            <p className="footer__mission">{t.footer.mission}</p>
          </div>
        </div>

        <nav className="footer__col" aria-label={t.footer.colExplore}>
          <p className="footer__col-title">{t.footer.colExplore}</p>
          <Link to="/roadmap">{t.footer.links.roadmap}</Link>
          <Link to="/checkup">{t.footer.links.checkup}</Link>
          <Link to="/learning">{t.footer.links.learning}</Link>
        </nav>

        <nav className="footer__col" aria-label={t.footer.colTrust}>
          <p className="footer__col-title">{t.footer.colTrust}</p>
          <Link to="/#promise">{t.footer.links.promise}</Link>
          <div className="footer__lang">
            <span className="footer__lang-label">{t.footer.lang}</span>
            <LanguageToggle />
          </div>
        </nav>
      </div>

      <div className="footer__note">
        <p className="footer__note-title">{t.footer.disclaimerTitle}</p>
        <p>{t.footer.disclaimer}</p>
      </div>

      <div className="footer__base">
        <p>{t.footer.rights}</p>
      </div>
    </footer>
  )
}
