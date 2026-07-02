import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hubContent } from './hubContent'
import { topicsContent } from '../topics/topicsContent'
import { getExplored, getCheckup, daysSinceCheckin } from '../lib/progress'
import {
  ArrowRight, Compass, Sun, Check, ShieldCheck,
  Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale,
} from '../components/Icons'

const ICONS = { Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale }

/**
 * The Companion Hub — the front door of a public educational companion.
 * Not a dashboard: it says what this place is, asks "what would you like help
 * with today?", and opens onto clearly-named halls of human situations.
 */
export default function Hub() {
  const { lang } = useLanguage()
  const h = hubContent[lang]
  const tc = topicsContent[lang]
  const [explored] = useState(() => getExplored())
  const [checkinDays] = useState(() => daysSinceCheckin())
  const [hasCheckup] = useState(() => Boolean(getCheckup()))
  const checkedInRecently = checkinDays !== null && checkinDays < 25

  return (
    <main className="hub">
      {/* ---------- The foyer: what this place is, and the one human question ---------- */}
      <section className="foyer wrap">
        <p className="sign sign--amber foyer__eyebrow rise rise-1">{h.eyebrow}</p>
        <h1 className="serif foyer__question rise rise-1">{h.exploreLabel}</h1>
        <p className="foyer__invite rise rise-2">{h.sub}</p>
        <p className="foyer__promise rise rise-3">
          <span className="foyer__promise-mark" aria-hidden="true"><ShieldCheck size={15} /></span>
          {h.promiseShort}
        </p>
      </section>

      {/* ---------- A serene threshold — dawn over the reading room (pure signature) ---------- */}
      <div className="threshold rise rise-4" aria-hidden="true">
        <div className="threshold__sky">
          <span className="threshold__glow" />
          <span className="threshold__sun" />
        </div>
        <div className="threshold__line" />
      </div>

      {/* ---------- The halls: human situations, each a doorway (the heart) ---------- */}
      <section className="halls wrap">
        {h.shelves.map((shelf) => (
          <section className="hall" key={shelf.label}>
            <header className="hall__head">
              <h2 className="serif hall__name">{shelf.label}</h2>
              <p className="hall__intro">{shelf.intro}</p>
            </header>
            <ol className="doors">
              {shelf.ids.map((id) => {
                const t = tc.topics[id]
                if (!t) return null
                const Icon = ICONS[t.icon] || Compass
                const isDone = Boolean(explored[id])
                return (
                  <li key={id}>
                    <Link to={`/explore/${id}`} className="door">
                      <span className="door__icon" aria-hidden="true"><Icon size={20} /></span>
                      <span className="door__text">
                        <span className="door__title">{t.title}</span>
                        <span className="door__tag">{t.tagline}</span>
                      </span>
                      <span className="door__meta">
                        {isDone ? (
                          <span className="door__done"><Check size={13} /> {h.exploredBadge}</span>
                        ) : (
                          <span className="door__min">{t.minutes} {h.minutesLabel}</span>
                        )}
                        <ArrowRight size={17} className="door__arrow" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}

        <section className="hall hall--soon">
          <header className="hall__head">
            <h2 className="serif hall__name">{h.labels.comingSoon}</h2>
          </header>
          <ol className="doors">
            {h.comingSoon.map((cs) => (
              <li key={cs.title}>
                <div className="door door--soon" aria-disabled="true">
                  <span className="door__icon" aria-hidden="true"><Compass size={20} /></span>
                  <span className="door__text">
                    <span className="door__title">{cs.title}</span>
                    <span className="door__tag">{cs.tagline}</span>
                  </span>
                  <span className="door__meta">
                    <span className="door__soon">{h.labels.comingSoon}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </section>

      {/* ---------- A quiet doorway for anyone unsure where to begin ---------- */}
      {!hasCheckup && (
        <section className="wrap">
          <Link to="/checkup" className="foyer__door">
            <span className="foyer__door-body">
              <span className="sign sign--lake foyer__door-kicker">{h.door.kicker}</span>
              <span className="foyer__door-line">{h.door.line}</span>
            </span>
            <span className="foyer__door-cta">{h.door.cta}<ArrowRight size={17} /></span>
          </Link>
        </section>
      )}

      {/* ---------- The promise — a quiet closing inscription, and a way to return ---------- */}
      <section className="room inscription">
        <div className="wrap inscription__inner">
          <span className="inscription__sun" aria-hidden="true"><Sun size={26} /></span>
          <p className="serif inscription__text">{h.trust}</p>
          <Link to="/checkin" className="inscription__return">
            {checkedInRecently ? h.checkin.comeBackNote : h.strip.checkinNudge}
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}
