import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { checkupContent } from '../checkup/checkupContent'
import { computeResults } from '../checkup/scoring'
import { roadmapContent } from './roadmapContent'
import { topicsContent } from '../topics/topicsContent'
import { getExplored } from '../lib/progress'
import {
  Sunrise, ArrowRight, Compass, Spark, Flag, Lightbulb, BookOpen, Check,
  Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale,
} from '../components/Icons'

const TOPIC_ICONS = { Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale }

const STORAGE_KEY = 'fine-companion.checkup.v1'

function readSaved() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.answers) return parsed
  } catch {
    /* ignore */
  }
  return null
}

function formatDate(ts, lang) {
  if (!ts) return null
  try {
    return new Date(ts).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return null
  }
}

/* One recommendation: what to do / why it matters / a learn moment */
function Rec({ rc, rec }) {
  return (
    <div className="rj-rec">
      <p className="rj-rec__action">{rec.action}</p>
      <p className="rj-rec__why">
        <span className="rj-rec__why-label">{rc.whyLabel}</span>
        {rec.why}
      </p>
      <div className="rj-learn">
        <span className="rj-learn__icon" aria-hidden="true">
          <Lightbulb size={16} />
        </span>
        <div className="rj-learn__body">
          <p>
            <span className="rj-learn__label">{rc.learnLabel}</span>
            {rec.learn}
          </p>
        </div>
      </div>
      {rec.revisit && (
        <p className="rj-revisit">
          <Clock size={13} />
          <span className="rj-revisit__label">{rc.revisitLabel}</span>
          {rec.revisit}
        </p>
      )}
    </div>
  )
}

function ExploredSection({ rc, items }) {
  if (!items.length) return null
  const ex = rc.explored
  return (
    <section className="rj-explored" aria-label={ex.label}>
      <div className="rj-explored__head">
        <p className="rj-explored__label">
          <Lightbulb size={15} />
          {ex.label}
        </p>
        <p className="rj-explored__sub">{ex.sub}</p>
      </div>
      <div className="rj-explored__grid">
        {items.map((t) => {
          const Icon = TOPIC_ICONS[t.icon] || Compass
          return (
            <Link to={`/explore/${t.id}`} className="rj-ex-card" key={t.id}>
              <p className="rj-ex-card__topic">
                <span className="rj-ex-card__icon" aria-hidden="true">
                  <Icon size={17} />
                </span>
                {t.title}
              </p>
              <p className="rj-ex-card__title">{t.takeaway.title}</p>
              <div className="rj-ex-card__step">
                <span className="rj-ex-card__step-label">{ex.stepLabel}</span>
                <p>{t.takeaway.step}</p>
              </div>
            </Link>
          )
        })}
      </div>
      <Link to="/" className="rj-explored__more">
        {ex.exploreMore}
        <ArrowRight size={15} />
      </Link>
    </section>
  )
}

function EmptyState({ rc }) {
  return (
    <main className="roadmap">
      <div className="roadmap__inner rj-empty">
        <span className="rj-empty__icon" aria-hidden="true">
          <Compass size={30} />
        </span>
        <p className="eyebrow eyebrow--accent">{rc.empty.eyebrow}</p>
        <h1 className="display rj-empty__title">{rc.empty.title}</h1>
        <p className="rj-empty__body">{rc.empty.body}</p>
        <Link to="/checkup" className="btn btn--primary btn--lg">
          {rc.empty.cta}
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  )
}

/* Roadmap built only from explored topics (no checkup yet). */
function ExploredOnly({ rc, items }) {
  const ex = rc.explored
  return (
    <main className="roadmap">
      <div className="roadmap__inner">
        <header className="rj-head">
          <p className="eyebrow eyebrow--accent">
            <Compass size={15} />
            {ex.onlyEyebrow}
          </p>
          <h1 className="display rj-head__title">{ex.onlyTitle}</h1>
          <p className="rj-head__intro">{ex.onlyBody}</p>
          <Link to="/checkup" className="btn btn--primary" style={{ marginTop: '18px' }}>
            {ex.onlyCta}
            <ArrowRight size={17} />
          </Link>
        </header>
        <ExploredSection rc={rc} items={items} />
      </div>
    </main>
  )
}

export default function RoadmapView() {
  const { lang } = useLanguage()
  const rc = roadmapContent[lang]
  const base = checkupContent[lang].results.roadmap
  const tc = topicsContent[lang]
  const [saved] = useState(() => readSaved())
  const [exploredMap] = useState(() => getExplored())

  const exploredItems = tc.order
    .filter((id) => exploredMap[id])
    .map((id) => ({ id, ...tc.topics[id] }))

  if (!saved) {
    if (exploredItems.length) return <ExploredOnly rc={rc} items={exploredItems} />
    return <EmptyState rc={rc} />
  }

  const result = computeResults(saved.answers)
  const n = result.narrative
  const h = rc.header
  const dateStr = formatDate(saved.ts, lang)

  const stations = [
    {
      key: 'today',
      label: rc.horizons.today.label,
      lead: rc.horizons.today.lead,
      icon: <Sunrise size={16} />,
      recs: [
        {
          ...base.today[result.roadmap.today],
          learn: rc.learn.today[result.roadmap.today],
          revisit: rc.revisit.today,
        },
      ],
    },
    {
      key: 'next30',
      label: rc.horizons.next30.label,
      lead: rc.horizons.next30.lead,
      icon: <ArrowRight size={16} />,
      recs: [
        {
          ...base.next30[result.roadmap.next30],
          learn: rc.learn.next30[result.roadmap.next30],
          revisit: rc.revisit.next30,
        },
      ],
    },
    {
      key: 'habits',
      label: rc.horizons.habits.label,
      lead: rc.horizons.habits.lead,
      icon: <Compass size={16} />,
      recs: base.habits.map((hb, i) => ({ ...hb, learn: rc.habitsLearn[i], revisit: rc.revisit.habits })),
    },
    {
      key: 'sixTwelve',
      label: rc.horizons.sixTwelve.label,
      lead: rc.horizons.sixTwelve.lead,
      icon: <Spark size={16} />,
      recs: [
        {
          ...base.sixTwelve[result.roadmap.sixTwelve],
          learn: rc.learn.sixTwelve[result.roadmap.sixTwelve],
          revisit: rc.revisit.sixTwelve,
        },
      ],
    },
  ]

  const chips = [
    { label: h.chips.focus, value: h.focusLabel[n.priority] },
    { label: h.chips.emergency, value: `${result.emergency.monthsDisplay} ${h.months}` },
    { label: h.chips.cashflow, value: h.cashflowStates[result.cashflow.state] },
    { label: h.chips.stress, value: h.stressBands[result.stress.band] },
  ]

  return (
    <main className="roadmap">
      <div className="roadmap__inner">
        {/* Personalized header — connects back to the assessment */}
        <header className="rj-head">
          <p className="eyebrow eyebrow--accent">
            <Compass size={15} />
            {h.eyebrow}
          </p>
          <h1 className="display rj-head__title">{h.title}</h1>
          <p className="rj-head__intro">{h.intros[n.tone]}</p>
          <p className="rj-head__focus">
            {h.focusLinePrefix}
            <strong>{h.focusLabel[n.priority]}</strong>
            {h.focusLineSuffix}
          </p>

          <div className="rj-recap">
            <p className="rj-recap__label">
              {h.recapLabel}
              {dateStr ? ` · ${h.based} ${dateStr}` : ''}
            </p>
            <div className="rj-recap__chips">
              {chips.map((chip) => (
                <span className="rj-chip" key={chip.label}>
                  <span className="rj-chip__k">{chip.label}</span>
                  <span className="rj-chip__v">{chip.value}</span>
                </span>
              ))}
            </div>
            <p className="rj-ongoing">
              <Compass size={14} />
              {h.ongoing}
            </p>
          </div>
        </header>

        {/* The living journey */}
        <ol className="rj">
          {stations.map((st) => (
            <li className="rj__station" key={st.key}>
              <span className="rj__dot" aria-hidden="true">
                {st.icon}
              </span>
              <div className="rj__body">
                <p className="rj__label">{st.label}</p>
                <p className="rj__lead">{st.lead}</p>
                <div className="rj__recs">
                  {st.recs.map((rec, i) => (
                    <Rec key={i} rc={rc} rec={rec} />
                  ))}
                </div>
              </div>
            </li>
          ))}

          {/* Long-term vision (5+ years) */}
          <li className="rj__station rj__station--vision">
            <span className="rj__dot rj__dot--vision" aria-hidden="true">
              <Flag size={16} />
            </span>
            <div className="rj__body">
              <p className="rj__label">{rc.horizons.fiveYear.label}</p>
              <p className="rj__lead">{rc.horizons.fiveYear.lead}</p>
              <div className="rj-vision">
                <p className="rj-vision__text">{rc.vision[result.roadmap.longterm]}</p>
                <div className="rj-learn rj-learn--on-dark">
                  <span className="rj-learn__icon" aria-hidden="true">
                    <Lightbulb size={16} />
                  </span>
                  <div className="rj-learn__body">
                    <p>
                      <span className="rj-learn__label">{rc.learnLabel}</span>
                      {rc.vision.learn}
                    </p>
                  </div>
                </div>
                <p className="rj-revisit rj-revisit--on-dark">
                  <Clock size={13} />
                  <span className="rj-revisit__label">{rc.revisitLabel}</span>
                  {rc.revisit.vision}
                </p>
              </div>
            </div>
          </li>
        </ol>

        <ExploredSection rc={rc} items={exploredItems} />

        <div className="rj-actions">
          <Link to="/checkup" className="btn btn--primary">
            {rc.actions.retake}
          </Link>
          <Link to="/learning" className="btn btn--ghost">
            <BookOpen size={17} />
            {rc.actions.learn}
          </Link>
          <Link to="/" className="btn btn--ghost">
            {rc.actions.home}
          </Link>
        </div>
      </div>
    </main>
  )
}
