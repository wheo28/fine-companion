import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { checkupContent } from './checkupContent'
import { formatCurrency } from './scoring'
import { ArrowRight, Compass, Sunrise, ShieldCheck, BookOpen } from '../components/Icons'

function Fields({ c, item }) {
  return (
    <div className="snap-fields">
      <div className="snap-field">
        <span className="snap-field__label">{c.whatLabel}</span>
        <p>{item.what}</p>
      </div>
      <div className="snap-field">
        <span className="snap-field__label">{c.whyLabel}</span>
        <p>{item.why}</p>
      </div>
      <div className="snap-field snap-field--step">
        <span className="snap-field__label">{c.stepLabel}</span>
        <p>{item.step}</p>
      </div>
    </div>
  )
}

function SnapCard({ title, headline, value, caption, meter, band, note, children }) {
  return (
    <article className="snap-card">
      <p className="snap-card__title">{title}</p>
      <h3 className="snap-card__headline">{headline}</h3>
      {value != null && (
        <p className="snap-card__value">
          {value}
          {caption && <span className="snap-card__caption">{caption}</span>}
        </p>
      )}
      {meter != null && (
        <div className="snap-meter" aria-hidden="true">
          <span className={`snap-meter__fill snap-meter__fill--${band}`} style={{ width: `${meter}%` }} />
        </div>
      )}
      {note && <p className="snap-card__note">{note}</p>}
      {children}
    </article>
  )
}

export default function Results({ result, onRestart }) {
  const { lang } = useLanguage()
  const c = checkupContent[lang].results
  const s = c.snapshots
  const currency = result.currency

  const cf = s.cashflow.states[result.cashflow.state]
  const em = s.emergency.states[result.emergency.state]
  const db = s.debt.states[result.debt.state]
  const ins = s.insurance.states[result.insurance.state]
  const ret = s.retirement.states[result.retirement.state]
  const st = s.stress.states[result.stress.band]
  const rk = s.risk.states[result.risk.band]

  const rm = c.roadmap
  const rmSteps = [
    { label: rm.horizons.today, body: rm.today[result.roadmap.today], icon: <Sunrise size={17} /> },
    { label: rm.horizons.next30, body: rm.next30[result.roadmap.next30], icon: <ArrowRight size={17} /> },
    { label: rm.horizons.habits, list: rm.habits, icon: <Compass size={17} /> },
    { label: rm.horizons.sixTwelve, body: rm.sixTwelve[result.roadmap.sixTwelve], icon: <ArrowRight size={17} /> },
  ]

  return (
    <div className="ck-results">
      <header className="ck-results__head">
        <p className="eyebrow eyebrow--accent">{c.eyebrow}</p>
        <h1 className="display ck-results__title">{c.title}</h1>
        <p className="ck-results__sub">{c.sub}</p>
      </header>

      <section className="snap-grid" aria-label={c.eyebrow}>
        <SnapCard
          title={s.cashflow.title}
          headline={cf.headline}
          value={formatCurrency(result.cashflow.leftover, currency)}
          caption={s.cashflow.perMonth}
        >
          <Fields c={c} item={cf} />
        </SnapCard>

        <SnapCard
          title={s.emergency.title}
          headline={em.headline}
          value={result.emergency.monthsDisplay}
          caption={s.emergency.unit}
        >
          <Fields c={c} item={em} />
        </SnapCard>

        <SnapCard
          title={s.debt.title}
          headline={db.headline}
          value={`${result.debt.ratioPct}%`}
          caption={s.debt.ofIncome}
        >
          <Fields c={c} item={db} />
        </SnapCard>

        <SnapCard title={s.insurance.title} headline={ins.headline}>
          <Fields c={c} item={ins} />
        </SnapCard>

        <SnapCard title={s.retirement.title} headline={ret.headline}>
          <Fields c={c} item={ret} />
        </SnapCard>

        <SnapCard
          title={s.stress.title}
          headline={st.headline}
          value={`${result.stress.score}`}
          caption={c.scoreOutOf}
          meter={result.stress.score}
          band={`stress-${result.stress.band}`}
        >
          <Fields c={c} item={st} />
        </SnapCard>

        <SnapCard
          title={s.risk.title}
          headline={rk.headline}
          value={`${result.risk.score}`}
          caption={c.scoreOutOf}
          meter={result.risk.score}
          band="risk"
          note={s.risk.note}
        >
          <Fields c={c} item={rk} />
        </SnapCard>
      </section>

      <section className="ck-roadmap" aria-label={rm.title}>
        <header className="ck-roadmap__head">
          <p className="eyebrow eyebrow--accent">
            <Compass size={15} />
            {rm.eyebrow}
          </p>
          <h2 className="display ck-roadmap__title">{rm.title}</h2>
          <p className="ck-results__sub">{rm.sub}</p>
        </header>

        <ol className="rmap">
          {rmSteps.map((step) => (
            <li className="rmap__step" key={step.label}>
              <span className="rmap__dot" aria-hidden="true">
                {step.icon}
              </span>
              <div className="rmap__body">
                <p className="rmap__h">{step.label}</p>
                {step.list ? (
                  <ul className="rmap__habits">
                    {step.list.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="rmap__text">{step.body}</p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="rmap__vision">
          <p className="rmap__vision-label">{rm.horizons.longterm}</p>
          <p className="rmap__vision-text">{rm.longterm[result.roadmap.longterm]}</p>
        </div>
      </section>

      <div className="ck-disclaimer">
        <ShieldCheck size={16} />
        <p>{c.disclaimer}</p>
      </div>

      <div className="ck-results__actions">
        <button type="button" className="btn btn--primary" onClick={onRestart}>
          {c.restart}
        </button>
        <Link to="/learning" className="btn btn--ghost">
          <BookOpen size={17} />
          {c.learn}
        </Link>
        <Link to="/" className="btn btn--ghost">
          {c.home}
        </Link>
      </div>
    </div>
  )
}
