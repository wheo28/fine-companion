import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hubContent } from './hubContent'
import { topicsContent } from '../topics/topicsContent'
import { getExplored, getCheckup, daysSinceCheckin } from '../lib/progress'
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
  const [checkinDays] = useState(() => daysSinceCheckin())

  const lesson = h.lessons[dayIndex(h.lessons.length)]
  const tip = h.tips[dayIndex(h.tips.length)]

  const exploredCount = tc.order.filter((id) => explored[id]).length
  const total = tc.order.length
  const hasProgress = hasCheckup || exploredCount > 0
  const checkedInRecently = checkinDays !== null && checkinDays < 25

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

        {/* Journey strip */}
        <section className="hub-journey" aria-label={h.journey.label}>
          <p className="hub-journey__label">{h.journey.label}</p>
          <div className="hub-journey__row">
            <div className="hub-journey__stat">
              <span className="hub-journey__num">
                {exploredCount}
                <span className="hub-journey__den"> / {total}</span>
              </span>
              <span className="hub-journey__cap">{h.journey.exploredOf}</span>
            </div>
            <div className="hub-journey__stat">
              <span className={`hub-journey__badge${hasCheckup ? ' is-done' : ''}`}>
                {hasCheckup ? <Check size={13} /> : null}
                {hasCheckup ? h.journey.checkupDone : h.journey.checkupPending}
              </span>
            </div>
            <Link to="/roadmap" className="hub-journey__road">
              <Compass size={15} />
              {hasProgress ? h.journey.roadmapGrowing : h.journey.roadmapEmpty}
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Daily strip */}
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
            <span className="hub-tag hub-tag--gold">{h.labels.goodNext}</span>
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
            <span className={`hub-tag${hasCheckup ? '' : ' hub-tag--gold'}`}>
              {hasCheckup ? h.labels.availableNow : h.labels.tryFirst}
            </span>
            <p className="hub-feature__title">{h.cards.checkup.title}</p>
            <p className="hub-feature__tagline">{h.cards.checkup.tagline}</p>
          </div>
          <span className="hub-feature__meta">
            {hasCheckup ? <Check size={16} /> : null}
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
                  <div className="hub-card__toprow">
                    <span className="hub-card__icon" aria-hidden="true">
                      <Icon size={22} />
                    </span>
                    <span className="hub-tag hub-tag--soft">{h.labels.twoMin}</span>
                  </div>
                  <p className="hub-card__title">{t.title}</p>
                  <p className="hub-card__tagline">{t.tagline}</p>
                  <div className="hub-card__foot">
                    {isDone ? (
                      <span className="hub-card__done">
                        <Check size={13} />
                        {h.exploredBadge}
                      </span>
                    ) : (
                      <span className="hub-card__minutes">{h.labels.availableNow}</span>
                    )}
                    <span className="hub-card__go">
                      {isDone ? '' : h.exploreCta}
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              )
            })}

            {h.comingSoon.map((cs) => (
              <div className="hub-card hub-card--soon" key={cs.title} aria-disabled="true">
                <div className="hub-card__toprow">
                  <span className="hub-card__icon" aria-hidden="true">
                    <Compass size={22} />
                  </span>
                  <span className="hub-tag">{h.labels.comingSoon}</span>
                </div>
                <p className="hub-card__title">{cs.title}</p>
                <p className="hub-card__tagline">{cs.tagline}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Companion tools */}
        <section aria-label={h.toolsLabel}>
          <p className="hub__section-label">{h.toolsLabel}</p>
          <div className="hub-tools">
            <Link to="/checkin" className="hub-tool hub-tool--checkin">
              <span className="hub-tool__icon" aria-hidden="true">
                <Sunrise size={22} />
              </span>
              <div>
                <p className="hub-tool__title">
                  {h.checkin.title}
                  <span className="hub-tag hub-tag--soft hub-tag--inline">
                    {checkedInRecently ? h.checkin.comeBackNote : h.labels.quick}
                  </span>
                </p>
                <p className="hub-tool__tagline">{h.checkin.tagline}</p>
              </div>
              <ArrowRight size={18} />
            </Link>
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
          <p className="hub__come-back">{h.journey.comeBack}</p>
        </section>
      </div>
    </main>
  )
}
