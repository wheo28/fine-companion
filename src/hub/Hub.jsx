import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hubContent } from './hubContent'
import { topicsContent } from '../topics/topicsContent'
import { getExplored, getCheckup, daysSinceCheckin } from '../lib/progress'
import {
  ArrowRight, Compass, Sun, Check, ShieldCheck, Lightbulb,
  Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale,
} from '../components/Icons'

const ICONS = { Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale }

function dayIndex(len) {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const doy = Math.floor((now - start) / 86400000)
  return ((doy % len) + len) % len
}

/**
 * The Companion Hub — the front door of a public educational companion.
 * The Hero greets warmly, offers one small step, and features today's
 * companion, today's lesson, and the ongoing journey — never a dashboard.
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

  // ---- Hero data (warm, gentle, one-small-step) ----
  const hour = new Date().getHours()
  const greeting = hour < 12 ? hero.greetings.morning : hour < 18 ? hero.greetings.afternoon : hero.greetings.evening

  const firstUnexplored = tc.order.find((id) => !explored[id])
  const companionId = firstUnexplored || tc.order[dayIndex(tc.order.length)]
  const companionTopic = tc.topics[companionId]
  const CompanionIcon = ICONS[companionTopic.icon] || Compass

  const lesson = h.lessons[dayIndex(h.lessons.length)]

  const exploredCount = tc.order.filter((id) => explored[id]).length
  const hasProgress = hasCheckup || exploredCount > 0
  const journeyTitle = hasProgress ? hero.journeyContinue : hero.journeyStart
  const journeyBody = hasProgress ? hero.journeyGrowing : hero.journeyEmpty
  const journeyCta = exploredCount > 0 ? `${exploredCount} ${hero.journeyExplored}` : hero.journeySeeHow

  return (
    <main className="hub">
      {/* ======================= HERO (top section) ======================= */}
      <section className="hero">
        <span className="hero__sun" aria-hidden="true" />
        <div className="hero__inner wrap">
          <div className="hero__masthead">
            <p className="sign sign--amber hero__greeting rise rise-1">{greeting}</p>
            <h1 className="serif hero__title rise rise-1">{h.exploreLabel}</h1>
            <p className="hero__reassure rise rise-2">{hero.reassure}</p>
            <div className="hero__begin rise rise-3">
              <Link to="/checkup" className="btn btn--primary btn--lg">{hero.begin}<ArrowRight size={18} /></Link>
              <span className="hero__begin-meta"><ShieldCheck size={15} />{hero.beginMeta}</span>
            </div>
          </div>

          <div className="hero__today rise rise-4">
            <p className="sign sign--tick hero__today-kicker">{hero.todayKicker}</p>
            <div className="hero__cards">
              {/* Today's Companion — one gentle thing worth a few minutes */}
              <Link to={`/explore/${companionId}`} className="feat feat--companion">
                <span className="sign feat__label">{hero.companionLabel}</span>
                <span className="feat__icon" aria-hidden="true"><CompanionIcon size={20} /></span>
                <h2 className="serif feat__title">{companionTopic.title}</h2>
                <p className="feat__body">{companionTopic.tagline}</p>
                <span className="feat__cta">
                  {hero.companionCta} · {companionTopic.minutes} {h.minutesLabel}
                  <ArrowRight size={16} />
                </span>
              </Link>

              {/* Today's Financial Lesson — a thought for today */}
              <Link to="/learning" className="feat feat--lesson">
                <span className="sign feat__label">{hero.lessonLabel}</span>
                <span className="feat__icon" aria-hidden="true"><Lightbulb size={20} /></span>
                <h2 className="serif feat__title">{lesson.title}</h2>
                <p className="feat__body">{lesson.body}</p>
                <span className="feat__cta">{hero.lessonCta}<ArrowRight size={16} /></span>
              </Link>

              {/* Continue my journey — the path so far */}
              <Link to="/roadmap" className="feat feat--journey">
                <span className="sign feat__label">{hero.journeyLabel}</span>
                <span className="feat__icon" aria-hidden="true"><Compass size={20} /></span>
                <h2 className="serif feat__title">{journeyTitle}</h2>
                <p className="feat__body">{journeyBody}</p>
                <span className="feat__cta">
                  {hasProgress && <span className="feat__count"><Check size={13} /> {journeyCta}</span>}
                  {!hasProgress && journeyCta}
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>
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
