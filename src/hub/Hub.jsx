import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hubContent } from './hubContent'
import { topicsContent } from '../topics/topicsContent'
import { getExplored, getCheckup } from '../lib/progress'
import {
  ArrowRight, Compass, Sunrise, BookOpen, Lightbulb, Check, ShieldCheck,
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

  const lesson = h.lessons[dayIndex(h.lessons.length)]
  const tip = h.tips[dayIndex(h.tips.length)]

  // Recommended next step
  const firstUnexplored = tc.order.find((id) => !explored[id])
  let next
  if (!hasCheckup) {
    next = { ...h.next.checkup, to: '/checkup', icon: <Sunrise size={18} /> }
  } else if (firstUnexplored) {
    const t = tc.topics[firstUnexplored]
    next = { ...h.next.explore, to: `/explore/${firstUnexplored}`, icon: <ArrowRight size={18} />, extra: t.title }
  } else {
    next = { ...h.next.learning, to: '/learning', icon: <BookOpen size={18} /> }
  }

  return (
    <main className="hub">
      <div className="hub__inner">
        {/* Intro */}
        <header className="hub__head">
          <p className="eyebrow eyebrow--accent">{h.eyebrow}</p>
          <h1 className="display hub__title">{h.title}</h1>
          <p className="hub__sub">{h.sub}</p>
          <p className="hub__trust">
            <ShieldCheck size={15} />
            {h.trust}
          </p>
        </header>

        {/* Daily strip: lesson + tip + next step */}
        <section className="hub__daily" aria-label={h.todaysLessonLabel}>
          <article className="hub-daily hub-daily--lesson">
            <p className="hub-daily__label">
              <Lightbulb size={14} />
              {h.todaysLessonLabel}
            </p>
            <h2 className="hub-daily__title">{lesson.title}</h2>
            <p className="hub-daily__body">{lesson.body}</p>
          </article>

          <article className="hub-daily hub-daily--tip">
            <p className="hub-daily__label">
              <Sunrise size={14} />
              {h.todaysTipLabel}
            </p>
            <p className="hub-daily__tip">{tip}</p>
          </article>

          <Link to={next.to} className="hub-daily hub-daily--next">
            <p className="hub-daily__label">
              <Compass size={14} />
              {h.nextStepLabel}
            </p>
            <h2 className="hub-daily__title">{next.title}</h2>
            <p className="hub-daily__body">{next.body}</p>
            <span className="hub-daily__cta">
              {next.cta}
              {next.extra ? ` · ${next.extra}` : ''}
              <ArrowRight size={16} />
            </span>
          </Link>
        </section>

        {/* Featured: Checkup */}
        <Link to="/checkup" className="hub-feature">
          <span className="hub-feature__icon" aria-hidden="true">
            <Sunrise size={26} />
          </span>
          <div className="hub-feature__text">
            <p className="hub-feature__title">{h.cards.checkup.title}</p>
            <p className="hub-feature__tagline">{h.cards.checkup.tagline}</p>
          </div>
          <span className="hub-feature__meta">
            {getCheckup() ? <Check size={16} /> : null}
            <span className="hub-card__minutes">
              {h.cards.checkup.minutes} {h.minutesLabel}
            </span>
            <ArrowRight size={18} />
          </span>
        </Link>

        {/* Topic grid */}
        <section aria-label={h.exploreLabel}>
          <p className="hub__section-label">{h.exploreLabel}</p>
          <div className="hub-grid">
            {tc.order.map((id) => {
              const t = tc.topics[id]
              const Icon = ICONS[t.icon] || Compass
              const isDone = Boolean(explored[id])
              return (
                <Link to={`/explore/${id}`} key={id} className={`hub-card${isDone ? ' is-explored' : ''}`}>
                  <span className="hub-card__icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <p className="hub-card__title">{t.title}</p>
                  <p className="hub-card__tagline">{t.tagline}</p>
                  <div className="hub-card__foot">
                    {isDone ? (
                      <span className="hub-card__done">
                        <Check size={13} />
                        {h.exploredBadge}
                      </span>
                    ) : (
                      <span className="hub-card__minutes">
                        {t.minutes} {h.minutesLabel}
                      </span>
                    )}
                    <span className="hub-card__go">
                      {isDone ? '' : h.exploreCta}
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Companion tools */}
        <section aria-label={h.toolsLabel}>
          <p className="hub__section-label">{h.toolsLabel}</p>
          <div className="hub-tools">
            <Link to="/roadmap" className="hub-tool">
              <span className="hub-tool__icon" aria-hidden="true">
                <Compass size={22} />
              </span>
              <div>
                <p className="hub-tool__title">{h.cards.roadmap.title}</p>
                <p className="hub-tool__tagline">{h.cards.roadmap.tagline}</p>
              </div>
              <ArrowRight size={18} />
            </Link>
            <Link to="/learning" className="hub-tool">
              <span className="hub-tool__icon" aria-hidden="true">
                <BookOpen size={22} />
              </span>
              <div>
                <p className="hub-tool__title">{h.cards.learning.title}</p>
                <p className="hub-tool__tagline">{h.cards.learning.tagline}</p>
              </div>
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
