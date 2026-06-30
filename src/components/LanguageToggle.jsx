import { useLanguage } from '../i18n/LanguageContext'
import { LANGUAGES } from '../i18n/translations'

export default function LanguageToggle({ compact = false }) {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className={`lang-toggle${compact ? ' lang-toggle--compact' : ''}`}
      role="group"
      aria-label="Select language"
    >
      {LANGUAGES.map((option) => {
        const active = lang === option.code
        return (
          <button
            key={option.code}
            type="button"
            className={`lang-toggle__btn${active ? ' is-active' : ''}`}
            aria-pressed={active}
            onClick={() => setLang(option.code)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
