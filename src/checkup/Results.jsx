import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { checkupContent } from './checkupContent'
import { formatCurrency } from './scoring'
import { ArrowRight, Compass, Sunrise, ShieldCheck, BookOpen, Check, Spark } from '../components/Icons'

/* ----- Detailed snapshot pieces (shown in the optional breakdown) ----- */

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

function DetailedBreakdown({ c, result }) {
  const s = c.snapshots
  const currency = result.currency
  const cf = s.cashflow.states[result.cashflow.state]
  const em = s.emergency.states[result.emergency.state]
  const db = s.debt.states[result.debt.state]
  const ins = s.insurance.states[result.insurance.state]
  const ret = s.retirement.states[result.retirement.state]
  const st = s.stress.states[result.stress.band]
  const rk = s.risk.states[result.risk.band]

  return (
    <div className="snap-grid">
      <SnapCard title={s.cashflow.title} headline={cf.headline} value={formatCurrency(result.cashflow.leftover, currency)} caption={s.cashflow.perMonth}>
        <Fields c={c} item={cf} />
      </SnapCard>
      <SnapCard title={s.emergency.title} headline={em.headline} value={result.emergency.monthsDisplay} caption={s.emergency.unit}>
        <Fields c={c} item={em} />
      </SnapCard>
      <SnapCard title={s.debt.title} headline={db.headline} value={`${result.debt.ratioPct}%`} caption={s.debt.ofIncome}>
        <Fields c={c} item={db} />
      </SnapCard>
      <SnapCard title={s.insurance.title} headline={ins.headline}>
        <Fields c={c} item={ins} />
      </SnapCard>
      <SnapCard title={s.retirement.title} headline={ret.headline}>
        <Fields c={c} item={ret} />
      </SnapCard>
      <SnapCard title={s.stress.title} headline={st.headline} value={`${result.stress.score}`} caption={c.scoreOutOf} meter={result.stress.score} band={`stress-${result.stress.band}`}>
        <Fields c={c} item={st} />
      </SnapCard>
      <SnapCard title={s.risk.title} headline={rk.headline} value={`${result.risk.score}`} caption={c.scoreOutOf} meter={result.risk.score} band="risk" note={s.risk.note}>
        <Fields c={c} item={rk} />
      </SnapCard>
    </div>
  )
}

/* ------------------------- Roadmap item ------------------------- */

function RoadmapItem({ rm, item }) {
  return (
    <div className="rmap-item">
      <p className="rmap-item__action">{item.action}</p>
      <div className="rmap-item__beats">
        <p className="rmap-item__beat">
          <span className="rmap-item__beat-label">{rm.whyLabel}</span>
          {item.why}
        </p>
        <p className="rmap-item__beat rmap-item__beat--supports">
          <span className="rmap-item__beat-label">{rm.supportsLabel}</span>
          {item.supports}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------ Page ---------------------------- */

export default function Results({ result, onRestart }) {
  const { lang } = useLanguage()
  const c = checkupContent[lang].results
  const story = c.story
  const rm = c.roadmap
  const n = result.narrative
  const [showDetails, setShowDetails] = useState(false)

  const priority = story.priorityCopy[n.priority]

  const rmSteps = [
    { label: rm.horizons.today, item: rm.today[result.roadmap.today], icon: <Sunrise size={16} /> },
    { label: rm.horizons.next30, item: rm.next30[result.roadmap.next30], icon: <ArrowRight size={16} /> },
    { label: rm.horizons.habits, habits: rm.habits, icon: <Compass size={16} /> },
    { label: rm.horizons.sixTwelve, item: rm.sixTwelve[result.roadmap.sixTwelve], icon: <ArrowRight size={16} /> },
  ]

  return (
    <div className="ck-results">
      {/* 1 — Thank you */}
      <header className="rx-open">
        <span className="rx-open__icon" aria-hidden="true">
          <Sunrise size={30} />
        </span>
        <p className="eyebrow eyebrow--accent">{story.thanksEyebrow}</p>
        <h1 className="display rx-open__title">{story.thanksTitle}</h1>
        <p className="rx-open__body">{story.thanksBody}</p>
      </header>

      {/* 2 — Where you are today */}
      <section className="rx-today" aria-label={story.todayLabel}>
        <p className="rx-label">{story.todayLabel}</p>
        <p className="rx-today__summary display">{story.todaySummaries[n.tone]}</p>
      </section>

      {/* 3 — Strengths */}
      <section className="rx-strengths" aria-label={story.strengthsLabel}>
        <p className="rx-label">{story.strengthsLabel}</p>
        <p className="rx-intro">{story.strengthsIntro}</p>
        <ul className="rx-strength-list">
          {n.strengths.map((key) => (
            <li className="rx-strength" key={key}>
              <span className="rx-strength__icon" aria-hidden="true">
                <Check size={16} />
              </span>
              <span>{story.strengthCopy[key]}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 + 5 — One priority + what it means */}
      <section className="rx-priority" aria-label={story.priorityLabel}>
        <p className="rx-label rx-label--on-dark">{story.priorityLabel}</p>
        <p className="rx-intro rx-intro--on-dark">{story.priorityIntro}</p>
        <div className="rx-priority__card">
          <span className="rx-priority__icon" aria-hidden="true">
            <Spark size={22} />
          </span>
          <h2 className="display rx-priority__title">{priority.title}</h2>
          <p className="rx-priority__means">{priority.means}</p>
        </div>
      </section>

      {/* How areas connect + why a fresh look matters */}
      <section className="rx-connect" aria-label={story.connectLabel}>
        <div className="rx-connect__item">
          <p className="rx-label">{story.connectLabel}</p>
          <p className="rx-connect__body">{story.connectBody}</p>
        </div>
        <div className="rx-connect__item">
          <p className="rx-label">{story.revisitLabel}</p>
          <p className="rx-connect__body">{story.revisitBody}</p>
        </div>
      </section>

      {/* Optional detailed breakdown (progressive disclosure) */}
      <section className="rx-details">
        <button
          type="button"
          className="rx-details__toggle"
          aria-expanded={showDetails}
          onClick={() => setShowDetails((v) => !v)}
        >
          {showDetails ? story.detailsHide : story.detailsShow}
          <ArrowRight size={16} className={showDetails ? 'rx-chev rx-chev--up' : 'rx-chev'} />
        </button>
        {showDetails && (
          <div className="rx-details__body">
            <p className="rx-intro">{story.detailsIntro}</p>
            <DetailedBreakdown c={c} result={result} />
          </div>
        )}
      </section>

      {/* Roadmap */}
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
                {step.habits ? (
                  <div className="rmap__habits">
                    {step.habits.map((h, i) => (
                      <RoadmapItem key={i} rm={rm} item={h} />
                    ))}
                  </div>
                ) : (
                  <RoadmapItem rm={rm} item={step.item} />
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
