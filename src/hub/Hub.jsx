import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hubContent } from './hubContent'
import { topicsContent } from '../topics/topicsContent'
import { daysSinceCheckin } from '../lib/progress'
import { ArrowRight, Sun } from '../components/Icons'

function Chevron({ open }) {
  return (
    <svg className={`concern__chev${open ? ' is-open' : ''}`} width="20" height="20"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

/**
 * The Companion Hub. The Hero welcomes; then the front door becomes a quiet
 * question — "What would you like help with today?" — answered by a few
 * feelings in the visitor's own voice. Choose a feeling, and it opens to the
 * specific worries within. Recognition, not navigation. One small step at a time.
 */
/**
 * The first exhibit — a tiny experiment at the entrance. One guess, one reveal,
 * one quiet "huh, is that true about me?". Not a feature: a moment of discovery.
 */
function FirstExhibit({ data }) {
  const [chosen, setChosen] = useState(null)
  if (!data) return null
  const revealed = chosen !== null
  return (
    <section className="exhibit wrap" aria-label={data.label}>
      <div className="exhibit__inner">
        <p className="sign sign--amber exhibit__label">{data.label}</p>
        <p className="serif exhibit__prompt">{data.prompt}</p>
        <div className="exhibit__choices" role="group" aria-label={data.prompt}>
          {data.choices.map((label, i) => (
            <button
              key={i}
              type="button"
              className={`exhibit__choice${chosen === i ? ' is-chosen' : ''}`}
              aria-pressed={chosen === i}
              disabled={revealed}
              onClick={() => setChosen(i)}
            >
              {label}
            </button>
          ))}
        </div>
        {revealed && <p className="exhibit__reveal rise">{data.reveal}</p>}
      </div>
    </section>
  )
}

export default function Hub() {
  const { lang } = useLanguage()
  const h = hubContent[lang]
  const hero = h.hero
  const c = h.concerns
  const tc = topicsContent[lang]
  const [checkinDays] = useState(() => daysSinceCheckin())
  const [openDoor, setOpenDoor] = useState(null)
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
            <p className="hero__safe rise rise-3">{hero.safeNote}</p>
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

      {/* ===================== THE FIRST EXHIBIT — a tiny discovery ===================== */}
      <FirstExhibit data={h.exhibit} />

      {/* ============ CONCERNS — the question, answered in the visitor's own voice ============ */}
      <section className="concerns wrap" aria-labelledby="concerns-q">
        <header className="concerns__head">
          <h2 id="concerns-q" className="serif concerns__q">{c.question}</h2>
          <p className="concerns__lead">{c.lead}</p>
          <p className="sign concerns__hint">{c.hint}</p>
        </header>

        <ul className="ways">
          {c.doors.map((door, i) => {
            const open = openDoor === i
            return (
              <li key={i} className={`way${open ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="way__head"
                  aria-expanded={open}
                  onClick={() => setOpenDoor(open ? null : i)}
                >
                  <span className="way__text">
                    <span className="serif way__feeling">{door.feeling}</span>
                    <span className="way__reply">{door.reply}</span>
                  </span>
                  <Chevron open={open} />
                </button>

                {open && (
                  <ul className="worries">
                    {door.ids.map((id) => {
                      const t = tc.topics[id]
                      if (!t) return null
                      return (
                        <li key={id}>
                          <Link to={`/explore/${id}`} className="worry">
                            <span className="worry__text">
                              <span className="serif worry__voice">{t.title}</span>
                              <span className="worry__reply">{t.tagline}</span>
                            </span>
                            <ArrowRight size={17} className="worry__arrow" />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}

          {/* The gentle catch-all, for anyone who doesn't see their own thought */}
          <li className="way way--unsure">
            <Link to="/checkup" className="way__head way__head--link">
              <span className="way__text">
                <span className="serif way__feeling">{c.unsure.feeling}</span>
                <span className="way__reply">{c.unsure.reply}</span>
              </span>
              <span className="way__cta">{c.unsure.cta}<ArrowRight size={16} /></span>
            </Link>
          </li>
        </ul>
      </section>

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
