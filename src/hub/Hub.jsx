import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hubContent } from './hubContent'
import { topicsContent } from '../topics/topicsContent'
import { getExplored, getCheckup, daysSinceCheckin } from '../lib/progress'
import {
  ArrowRight, Compass, BookOpen, Check, ShieldCheck,
  Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale,
} from '../components/Icons'

const ICONS = { Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale }

function dayIndex(len) {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const doy = Math.floor((now - start) / 86400000)
  return ((doy % len) + len) % len
}

export default function Hub() {
  const { lang } = useLanguage()
  const h = hubContent[lang]
  const tc = topicsContent[lang]
  const [explored] = useState(() => getExplored())
  const [hasCheckup] = useState(() => Boolean(getCheckup()))
  const [checkinDays] = useState(() => daysSinceCheckin())

  const lesson = h.lessons[dayIndex(h.lessons.length)]
  const tip = h.tips[dayIndex(h.tips.length)]

  const exploredCount = tc.order.filter((id) => explored[id]).length
  const total = tc.order.length
  const hasProgress = hasCheckup || exploredCount > 0
  const checkedInRecently = checkinDays !== null && checkinDays < 25

  const dateline = new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const firstUnexplored = tc.order.find((id) => !explored[id])
  let next
  if (!hasCheckup) {
    next = { ...h.next.checkup, to: '/checkup' }
  } else if (firstUnexplored) {
    const t = tc.topics[firstUnexplored]
    next = { ...h.next.explore, to: `/explore/${firstUnexplored}`, extra: t.title }
  } else {
    next = { ...h.next.learning, to: '/learning' }
  }

  return (
    <main className="hub">
      <div className="hub__inner">
        {/* ---- Masthead ---- */}
        <header className="mast">
          <div className="mast__kicker">
            <span className="mast__kicker-text">{h.eyebrow}</span>
            <span className="mast__kicker-rule" aria-hidden="true" />
            <span className="mast__dateline">{dateline}</span>
          </div>
          <h1 className="mast__title display">{h.title}</h1>
          <p className="mast__sub">{h.sub}</p>
          <p className="mast__trust">
            <ShieldCheck size={15} />
            {h.trust}
          </p>
        </header>

        {/* ---- Progress ribbon ---- */}
        <div className="ribbon">
          <span className="ribbon__stat">
            <b>{exploredCount}</b>
            <span className="ribbon__den">/{total}</span> {h.journey.exploredOf}
          </span>
          <span className="ribbon__dot" aria-hidden="true" />
          <span className="ribbon__stat">
            {hasCheckup ? (
              <>
                <Check size={13} /> {h.journey.checkupDone}
              </>
            ) : (
              h.journey.checkupPending
            )}
          </span>
          <Link to="/roadmap" className="ribbon__link">
            {hasProgress ? h.journey.roadmapGrowing : h.journey.roadmapEmpty}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ---- Lead: featured mission + editorial sidebar ---- */}
        <section className="lead">
          <Link to="/checkup" className="feature">
            <span className="feature__label">{hasCheckup ? h.labels.availableNow : h.labels.tryFirst}</span>
            <h2 className="feature__title display">{h.cards.checkup.title}</h2>
            <p className="feature__sub">{h.cards.checkup.tagline}</p>
            <span className="feature__cta">
              {hasCheckup ? h.labels.availableNow : h.startCta}
              <ArrowRight size={17} />
            </span>
            <span className="feature__mark" aria-hidden="true">
              <Compass size={132} />
            </span>
          </Link>

          <aside className="sidebar">
            <article className="brief">
              <p className="brief__label">{h.todaysLessonLabel}</p>
              <h3 className="brief__title">{lesson.title}</h3>
              <p className="brief__body">{lesson.body}</p>
            </article>
            <span className="brief__rule" aria-hidden="true" />
            <article className="brief brief--tip">
              <p className="brief__label">{h.todaysTipLabel}</p>
              <p className="brief__tip">{tip}</p>
            </article>
          </aside>
        </section>

        {/* ---- Recommended next step: gold editorial band ---- */}
        <Link to={next.to} className="nextband">
          <span className="nextband__label">{h.nextStepLabel}</span>
          <span className="nextband__body">
            <span className="nextband__title">
              {next.title}
              {next.extra ? <span className="nextband__extra"> · {next.extra}</span> : null}
            </span>
          </span>
          <span className="nextband__cta">
            {next.cta}
            <ArrowRight size={16} />
          </span>
        </Link>

        {/* ---- Topic index (editorial shelves) ---- */}
        <section className="shelf">
          <div className="sectionbreak">
            <span className="sectionbreak__label">{h.exploreLabel}</span>
            <span className="sectionbreak__rule" aria-hidden="true" />
          </div>

          <ol className="idx">
            {tc.order.map((id, i) => {
              const t = tc.topics[id]
              const Icon = ICONS[t.icon] || Compass
              const isDone = Boolean(explored[id])
              return (
                <li key={id}>
                  <Link to={`/explore/${id}`} className={`idx__row${isDone ? ' is-done' : ''}`}>
                    <span className="idx__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="idx__icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <span className="idx__text">
                      <span className="idx__title">{t.title}</span>
                      <span className="idx__tag">{t.tagline}</span>
                    </span>
                    <span className="idx__meta">
                      {isDone ? (
                        <span className="idx__done">
                          <Check size={13} /> {h.exploredBadge}
                        </span>
                      ) : (
                        <span className="idx__min">{t.minutes} {h.minutesLabel}</span>
                      )}
                      <ArrowRight size={16} />
                    </span>
                  </Link>
                </li>
              )
            })}

            {h.comingSoon.map((cs) => (
              <li key={cs.title}>
                <div className="idx__row idx__row--soon" aria-disabled="true">
                  <span className="idx__num" aria-hidden="true">
                    ··
                  </span>
                  <span className="idx__icon" aria-hidden="true">
                    <Compass size={18} />
                  </span>
                  <span className="idx__text">
                    <span className="idx__title">{cs.title}</span>
                    <span className="idx__tag">{cs.tagline}</span>
                  </span>
                  <span className="idx__meta">
                    <span className="idx__soon">{h.labels.comingSoon}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---- Quiet companion strip ---- */}
        <section className="shelf">
          <div className="sectionbreak">
            <span className="sectionbreak__label">{h.toolsLabel}</span>
            <span className="sectionbreak__rule" aria-hidden="true" />
          </div>

          <div className="strip">
            <Link to="/checkin" className="strip__col">
              <span className="strip__label">
                {checkedInRecently ? h.checkin.comeBackNote : h.labels.quick}
              </span>
              <span className="strip__title">{h.checkin.title}</span>
              <span className="strip__sub">{h.checkin.tagline}</span>
              <span className="strip__go">
                {h.checkin.cta} <ArrowRight size={14} />
              </span>
            </Link>
            <Link to="/roadmap" className="strip__col">
              <span className="strip__label">
                <Compass size={13} /> {hasProgress ? h.journey.roadmapGrowing : h.journey.roadmapEmpty}
              </span>
              <span className="strip__title">{h.cards.roadmap.title}</span>
              <span className="strip__sub">{h.cards.roadmap.tagline}</span>
              <span className="strip__go">
                {h.journey.seeRoadmap} <ArrowRight size={14} />
              </span>
            </Link>
            <Link to="/learning" className="strip__col">
              <span className="strip__label">
                <BookOpen size={13} /> {h.cards.learning.title}
              </span>
              <span className="strip__title">{h.cards.learning.title}</span>
              <span className="strip__sub">{h.cards.learning.tagline}</span>
              <span className="strip__go">
                {h.exploreCta} <ArrowRight size={14} />
              </span>
            </Link>
          </div>
          <p className="hub__come-back">{h.journey.comeBack}</p>
        </section>
      </div>
    </main>
  )
}
