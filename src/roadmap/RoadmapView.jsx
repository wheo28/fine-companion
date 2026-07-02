import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { checkupContent } from '../checkup/checkupContent'
import { computeResults } from '../checkup/scoring'
import { roadmapContent } from './roadmapContent'
import { topicsContent } from '../topics/topicsContent'
import { getExplored } from '../lib/progress'
import {
  Sun, ArrowRight, Compass, Lightbulb, BookOpen, Clock,
  Coins, Umbrella, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale,
} from '../components/Icons'

const TOPIC_ICONS = { Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale }
const STORAGE_KEY = 'fine-companion.checkup.v1'

function readSaved() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.answers) return parsed
  } catch { /* ignore */ }
  return null
}

function formatDate(ts, lang) {
  if (!ts) return null
  try { return new Date(ts).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
  catch { return null }
}

function Rec({ rc, rec }) {
  return (
    <div className="trailrec">
      <p className="trailrec__action">{rec.action}</p>
      <p className="trailrec__beat"><span className="trailrec__beat-label">{rc.whyLabel}</span>{rec.why}</p>
      <div className="trailrec__learn">
        <Lightbulb size={16} aria-hidden="true" />
        <p><span className="trailrec__learn-label">{rc.learnLabel}</span>{rec.learn}</p>
      </div>
      {rec.revisit && (
        <p className="trailrec__revisit">
          <Clock size={13} /><span className="trailrec__revisit-label">{rc.revisitLabel}</span>{rec.revisit}
        </p>
      )}
    </div>
  )
}

function ExploredSection({ rc, items }) {
  if (!items.length) return null
  const ex = rc.explored
  return (
    <section className="explored" aria-label={ex.label}>
      <div className="explored__head">
        <p className="sign explored__label"><Lightbulb size={15} />{ex.label}</p>
        <p className="explored__sub">{ex.sub}</p>
      </div>
      <div className="explored__grid">
        {items.map((t) => {
          const Icon = TOPIC_ICONS[t.icon] || Compass
          return (
            <Link to={`/explore/${t.id}`} className="excard" key={t.id}>
              <p className="excard__topic"><span className="excard__icon" aria-hidden="true"><Icon size={16} /></span>{t.title}</p>
              <p className="excard__title">{t.takeaway.title}</p>
              <div className="excard__step">
                <span className="excard__step-label">{ex.stepLabel}</span>
                <p>{t.takeaway.step}</p>
              </div>
            </Link>
          )
        })}
      </div>
      <Link to="/" className="explored__more">{ex.exploreMore}<ArrowRight size={15} /></Link>
    </section>
  )
}

function EmptyState({ rc }) {
  return (
    <main className="page page__reading">
      <div className="rm-empty rise rise-1">
        <span className="rm-empty__sun" aria-hidden="true"><Sun size={30} /></span>
        <p className="sign sign--amber">{rc.empty.eyebrow}</p>
        <h1 className="serif rm-empty__title">{rc.empty.title}</h1>
        <p className="rm-empty__body">{rc.empty.body}</p>
        <Link to="/checkup" className="btn btn--primary btn--lg" style={{ marginTop: '1.6rem' }}>{rc.empty.cta}<ArrowRight size={18} /></Link>
      </div>
    </main>
  )
}

function ExploredOnly({ rc, items }) {
  const ex = rc.explored
  return (
    <main className="page page__reading">
      <header className="rm-head rise rise-1">
        <p className="sign sign--amber">{ex.onlyEyebrow}</p>
        <h1 className="serif rm-head__title">{ex.onlyTitle}</h1>
        <p className="rm-head__intro">{ex.onlyBody}</p>
        <Link to="/checkup" className="btn btn--primary" style={{ marginTop: '1.4rem' }}>{ex.onlyCta}<ArrowRight size={17} /></Link>
      </header>
      <ExploredSection rc={rc} items={items} />
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

  const exploredItems = tc.order.filter((id) => exploredMap[id]).map((id) => ({ id, ...tc.topics[id] }))

  if (!saved) {
    if (exploredItems.length) return <ExploredOnly rc={rc} items={exploredItems} />
    return <EmptyState rc={rc} />
  }

  const result = computeResults(saved.answers)
  const n = result.narrative
  const h = rc.header
  const dateStr = formatDate(saved.ts, lang)

  const stations = [
    { key: 'today', label: rc.horizons.today.label, lead: rc.horizons.today.lead,
      recs: [{ ...base.today[result.roadmap.today], learn: rc.learn.today[result.roadmap.today], revisit: rc.revisit.today }] },
    { key: 'next30', label: rc.horizons.next30.label, lead: rc.horizons.next30.lead,
      recs: [{ ...base.next30[result.roadmap.next30], learn: rc.learn.next30[result.roadmap.next30], revisit: rc.revisit.next30 }] },
    { key: 'habits', label: rc.horizons.habits.label, lead: rc.horizons.habits.lead,
      recs: base.habits.map((hb, i) => ({ ...hb, learn: rc.habitsLearn[i], revisit: rc.revisit.habits })) },
    { key: 'sixTwelve', label: rc.horizons.sixTwelve.label, lead: rc.horizons.sixTwelve.lead,
      recs: [{ ...base.sixTwelve[result.roadmap.sixTwelve], learn: rc.learn.sixTwelve[result.roadmap.sixTwelve], revisit: rc.revisit.sixTwelve }] },
  ]

  const chips = [
    { label: h.chips.focus, value: h.focusLabel[n.priority] },
    { label: h.chips.emergency, value: `${result.emergency.monthsDisplay} ${h.months}` },
    { label: h.chips.cashflow, value: h.cashflowStates[result.cashflow.state] },
    { label: h.chips.stress, value: h.stressBands[result.stress.band] },
  ]

  return (
    <main className="page page__reading">
      <header className="rm-head rise rise-1">
        <p className="sign sign--amber">{h.eyebrow}</p>
        <h1 className="serif rm-head__title">{h.title}</h1>
        <p className="rm-head__intro">{h.intros[n.tone]}</p>
        <p className="rm-head__focus">{h.focusLinePrefix}<strong>{h.focusLabel[n.priority]}</strong>{h.focusLineSuffix}</p>

        <div className="rm-recap">
          <p className="rm-recap__label">{h.recapLabel}{dateStr ? ` · ${h.based} ${dateStr}` : ''}</p>
          <div className="rm-chips">
            {chips.map((chip) => (
              <span className="rm-chip" key={chip.label}>
                <span className="rm-chip__k">{chip.label}</span>
                <span className="rm-chip__v">{chip.value}</span>
              </span>
            ))}
          </div>
          <p className="rm-ongoing"><Compass size={14} />{h.ongoing}</p>
        </div>
      </header>

      <div className="trail">
        {stations.map((st) => (
          <div className="trailstation" key={st.key}>
            <span className="trailstation__dot" aria-hidden="true"><Sun size={15} /></span>
            <p className="trailstation__label">{st.label}</p>
            <p className="trailstation__lead">{st.lead}</p>
            {st.recs.map((rec, i) => (<Rec key={i} rc={rc} rec={rec} />))}
          </div>
        ))}

        <div className="trailstation">
          <span className="trailstation__dot" aria-hidden="true"><Sun size={15} /></span>
          <p className="trailstation__label">{rc.horizons.fiveYear.label}</p>
          <div className="vision room">
            <p className="sign vision__label">{rc.horizons.fiveYear.label}</p>
            <p className="vision__lead">{rc.horizons.fiveYear.lead}</p>
            <p className="serif vision__text">{rc.vision[result.roadmap.longterm]}</p>
            <div className="vision__learn">
              <Lightbulb size={16} aria-hidden="true" />
              <p><span className="vision__learn-label">{rc.learnLabel}</span>{rc.vision.learn}</p>
            </div>
          </div>
        </div>
      </div>

      <ExploredSection rc={rc} items={exploredItems} />

      <div className="rx-actions">
        <Link to="/checkup" className="btn btn--primary">{rc.actions.retake}</Link>
        <Link to="/learning" className="btn btn--ghost"><BookOpen size={17} />{rc.actions.learn}</Link>
        <Link to="/" className="btn btn--ghost">{rc.actions.home}</Link>
      </div>
    </main>
  )
}
