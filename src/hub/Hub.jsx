import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hubContent } from './hubContent'
import { topicsContent } from '../topics/topicsContent'
import { getExplored, getCheckup, daysSinceCheckin } from '../lib/progress'
import {
  ArrowRight, Compass, Sun, Check,
  Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale,
} from '../components/Icons'

const ICONS = { Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale }

/**
 * The Companion Hub. The Hero is the emotional front door — a warm welcome
 * in a human voice, one gentle invitation, and a dawn that lets the journey
 * be felt. Everything below (the halls, the doorway, the promise) is unchanged.
 */
export default function Hub() {
  const { lang } = useLanguage()
  const h = hubContent[lang]
  const hero = h.hero
  const tc = topicsContent[lang]
  const [explored] = useState(() => getExplored())
  const [checkinDays] = useState(() => daysSinceCheckin())
  const [hasCheckup] = useState(() => Boolean(getCheckup()))
  const checkedInRecently = checkinDays !== null && checkinDays < 25

  return (
    <main className="hub">
      {/* ========================= HERO — the emotional front door ========================= */}
      <section className="hero">
        <div className="hero__inner wrap">
          <div className="hero__welcome">
            <p className="sign sign--amber hero__kicker rise rise-1">{hero.welcome}</p>
            <h1 className="serif hero__headline rise rise-1">{hero.headline}</h1>
            <p className="hero__body rise rise-2">{hero.body}</p>
            <div className="hero__act rise rise-3">
              <Link to="/checkup" className="hero__cta">
                {hero.begin}<ArrowRight size={19} />
              </Link>
              <p className="hero__safe">{hero.safeNote}</p>
            </div>
          </div>

          {/* A dawn over a gentle path of small steps — the journey, felt, not explained */}
          <div className="hero__scene rise rise-2" aria-hidden="true">
            <svg className="hero__art" viewBox="0 0 460 360" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
              <defs>
                <radialGradient id="fineSun" cx="50%" cy="42%" r="62%">
                  <stop offset="0%" stopColor="#f0d69b" />
                  <stop offset="64%" stopColor="#d29a3e" />
                  <stop offset="100%" stopColor="#b1741f" />
                </radialGradient>
                <radialGradient id="fineHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e6c689" stopOpacity="0.55" />
                  <stop offset="70%" stopColor="#e6c689" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* warm halo */}
              <circle cx="300" cy="214" r="170" fill="url(#fineHalo)" />

              {/* soft rays */}
              <g stroke="#c1802c" strokeWidth="3" strokeLinecap="round" opacity="0.42">
                <line x1="300" y1="104" x2="300" y2="72" />
                <line x1="232" y1="120" x2="214" y2="94" />
                <line x1="368" y1="120" x2="386" y2="94" />
                <line x1="190" y1="176" x2="160" y2="162" />
                <line x1="410" y1="176" x2="440" y2="162" />
              </g>

              {/* the sun, rising over the path */}
              <circle cx="300" cy="214" r="70" fill="url(#fineSun)" />

              {/* a gentle path of small steps toward the light */}
              <path
                d="M40 316 C 120 314, 168 300, 214 280 S 288 244, 300 216"
                stroke="#9c6417" strokeWidth="2.4" strokeLinecap="round"
                strokeDasharray="0.5 13" opacity="0.75"
              />
              <g fill="#efe7d6" stroke="#9c6417" strokeWidth="2.2">
                <circle cx="66" cy="314" r="6.5" />
                <circle cx="150" cy="298" r="6.5" />
                <circle cx="226" cy="272" r="6.5" />
              </g>
            </svg>
          </div>
        </div>
      </section>

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
