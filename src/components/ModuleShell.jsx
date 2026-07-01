import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { ArrowRight } from './Icons'

export default function ModuleShell({ contentKey, icon }) {
  const { t } = useLanguage()
  const c = t.shell[contentKey]

  return (
    <main className="module">
      <div className="module__inner">
        <span className="module__icon" aria-hidden="true">
          {icon}
        </span>
        <p className="eyebrow eyebrow--accent">{c.eyebrow}</p>
        <h1 className="display module__title">{c.title}</h1>
        <p className="module__body">{c.body}</p>
        <p className="module__chip">{t.shell.soonLabel}</p>
        <Link to="/" className="module__back">
          <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
          {t.shell.back}
        </Link>
      </div>
    </main>
  )
}
