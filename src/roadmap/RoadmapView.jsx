import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { checkupContent } from '../checkup/checkupContent'
import { computeResults } from '../checkup/scoring'
import { roadmapContent } from './roadmapContent'
import { Sunrise, ArrowRight, Compass, Spark, Flag, Lightbulb, BookOpen } from '../components/Icons'

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
        <p>
          <span className="rj-learn__label">{rc.learnLabel}</span>
          {rec.learn}
        </p>
      </div>
    </div>
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

export default function RoadmapView() {
  const { lang } = useLanguage()
  const rc = roadmapContent[lang]
  const base = checkupContent[lang].results.roadmap
  const [saved] = useState(() => readSaved())

  if (!saved) return <EmptyState rc={rc} />

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
      recs: [{ ...base.today[result.roadmap.today], learn: rc.learn.today[result.roadmap.today] }],
    },
    {
      key: 'next30',
      label: rc.horizons.next30.label,
      lead: rc.horizons.next30.lead,
      icon: <ArrowRight size={16} />,
      recs: [{ ...base.next30[result.roadmap.next30], learn: rc.learn.next30[result.roadmap.next30] }],
    },
    {
      key: 'habits',
      label: rc.horizons.habits.label,
      lead: rc.horizons.habits.lead,
      icon: <Compass size={16} />,
      recs: base.habits.map((hb, i) => ({ ...hb, learn: rc.habitsLearn[i] })),
    },
    {
      key: 'sixTwelve',
      label: rc.horizons.sixTwelve.label,
      lead: rc.horizons.sixTwelve.lead,
      icon: <Spark size={16} />,
      recs: [{ ...base.sixTwelve[result.roadmap.sixTwelve], learn: rc.learn.sixTwelve[result.roadmap.sixTwelve] }],
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
                  <p>
                    <span className="rj-learn__label">{rc.learnLabel}</span>
                    {rc.vision.learn}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ol>

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
