import { checkupContent } from './checkupContent'
import { useLanguage } from '../i18n/LanguageContext'

export default function QuestionStep({ question, value, onChange, currency }) {
  const { lang } = useLanguage()
  const c = checkupContent[lang]
  const symbol = currency === 'krw' ? '₩' : '$'

  return (
    <div className="ck-q">
      <label className="ck-q__label" htmlFor={`q-${question.id}`}>
        {question.label}
      </label>
      {question.help && <p className="ck-q__help">{question.help}</p>}

      {question.type === 'number' ? (
        <div className="ck-q__field">
          <div className="ck-q__input-wrap">
            <span className="ck-q__symbol" aria-hidden="true">
              {symbol}
            </span>
            <input
              id={`q-${question.id}`}
              className="ck-q__input"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              placeholder="0"
              value={value ?? ''}
              onChange={(e) => {
                const raw = e.target.value
                if (raw === '') return onChange('')
                const n = Math.max(0, Math.floor(Number(raw)))
                onChange(Number.isFinite(n) ? String(n) : '')
              }}
            />
            <span className="ck-q__per" aria-hidden="true">
              / mo
            </span>
          </div>
        </div>
      ) : (
        <div className="ck-options" role="radiogroup" aria-label={question.label}>
          {question.options.map((opt) => {
            const selected = value === opt.value
            return (
              <button
                key={String(opt.value)}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`ck-option${selected ? ' is-selected' : ''}`}
                onClick={() => onChange(opt.value)}
              >
                <span className="ck-option__dot" aria-hidden="true" />
                <span className="ck-option__label">{opt.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* currency helper only under the first numeric question */}
      {question.id === 'income' && (
        <p className="ck-q__currency-note">{c.currency.label}: {symbol}</p>
      )}
    </div>
  )
}
