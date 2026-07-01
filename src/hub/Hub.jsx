import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { hubContent } from './hubContent'
import { topicsContent } from '../topics/topicsContent'
import { learningContent } from '../learning/learningContent'
import { getExplored, getCheckup, daysSinceCheckin } from '../lib/progress'
import {
  ArrowRight, Compass, Sunrise, BookOpen, Check, ShieldCheck,
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
  const insightTitles = learningContent[lang].behavioralInsights.slice(0, 3).map((it) => it.title)

  const exploredCount = tc.order.filter((id) => explored[id]).length
  const total = tc.order.length
  const hasProgress = hasCheckup || exploredCount > 0
  const checkedInRecently = checkinDays !== null && checkinDays < 25

  const dateline = new Date().toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  // Today's Companion — one adaptive mission
  const firstUnexplored = tc.order.find((id) => !explored[id])
  let companion
  if (!hasCheckup) {
    companion = { ...h.next.checkup, to: '/checkup', Icon: Sunrise }
  } else if (firstUnexplored) {
    const t = tc.topics[firstUnexplored]
    companion = { ...h.next.explore, to: `/explore/${firstUnexplored}`, extra: t.title, Icon: ICONS[t.icon] || Compass }
  } else {
    companion = { ...h.next.learning, to: '/learning', Icon: BookOpen }
  }
  const CompanionIcon = companion.Icon

  let running = 0

  return (
    <main className="hub">
      <div className="hub__inner">
        {/* ---------- Masthead ---------- */}
        <header className="mh">
          <div className="mh__top">
            <span className="mh__kicker">{h.eyebrow}</span>
            <span className="mh__date">{dateline}</span>
          </div>
          <span className="mh__doublerule" aria-hidden="true" />
          <h1 className="mh__title display">{h.title}</h1>
          <p className="mh__sub">{h.sub}</p>
        </header>

        {/* ---------- Today's Companion ---------- */}
        <section className="tc">
          <Link to={companion.to} className="tc__feature">
            <span className="tc__label">{h.companionLabel}</span>
            <h2 className="tc__title display">{companion.title}</h2>
            <p className="tc__lead">{companion.body}</p>
            <span className="tc__cta">
              {companion.cta}
              {companion.extra ? <span className="tc__extra"> · {companion.extra}</span> : null}
              <ArrowRight size={18} />
            </span>
            <span className="tc__art" aria-hidden="true">
              <CompanionIcon size={116} />
            </span>
          </Link>

          <aside className="tc__aside">
            <div className="note">
              <p className="note__kicker">{h.todaysLessonLabel}</p>
              <h3 className="note__title">{lesson.title}</h3>
              <p className="note__body">{lesson.body}</p>
            </div>
            <span className="note__rule" aria-hidden="true" />
            <div className="note">
              <p className="note__kicker">{h.todaysTipLabel}</p>
              <p className="note__tip">{tip}</p>
            </div>
          </aside>
        </section>

        {/* ---------- Roadmap progress strip (ongoing process) ---------- */}
        <Link to="/roadmap" className="rstrip">
          <div className="rstrip__intro">
            <p className="rstrip__kicker">{h.journey.label}</p>
            <p className="rstrip__line">{hasProgress ? h.journey.roadmapGrowing : h.journey.roadmapEmpty}</p>
            <p className="rstrip__ongoing">{h.strip.ongoing}</p>
          </div>

          <ol className="horizons" aria-hidden="true">
            {h.strip.horizonsMini.map((label, i) => (
              <li className={`horizons__node${i === 0 ? ' is-now' : ''}`} key={label}>
                <span className="horizons__dot" />
                <span className="horizons__label">{label}</span>
              </li>
            ))}
          </ol>

          <div className="rstrip__meta">
            <span className="rstrip__stat">
              <b>{exploredCount}</b>
              <span className="rstrip__den">/{total}</span> {h.journey.exploredOf}
            </span>
            <span className="rstrip__stat">
              {hasCheckup ? (
                <>
                  <Check size={13} /> {h.journey.checkupDone}
                </>
              ) : (
                h.journey.checkupPending
              )}
            </span>
            <span className="rstrip__go">
              {h.journey.seeRoadmap}
              <ArrowRight size={15} />
            </span>
          </div>
        </Link>

        {/* ---------- Curated topic shelves ---------- */}
        <section className="shelves">
          <div className="sectionbreak">
            <span className="sectionbreak__label">{h.exploreLabel}</span>
            <span className="sectionbreak__orn" aria-hidden="true">◆</span>
            <span className="sectionbreak__rule" aria-hidden="true" />
          </div>
          <p className="shelves__intro">{h.exploreIntro}</p>

          {h.shelves.map((shelf) => (
            <div className="shelf" key={shelf.label}>
              <div className="shelf__head">
                <h3 className="shelf__title display">{shelf.label}</h3>
                <p className="shelf__intro">{shelf.intro}</p>
              </div>
              <ol className="idx">
                {shelf.ids.map((id) => {
                  const t = tc.topics[id]
                  if (!t) return null
                  running += 1
                  const Icon = ICONS[t.icon] || Compass
                  const isDone = Boolean(explored[id])
                  return (
                    <li key={id}>
                      <Link to={`/explore/${id}`} className={`idx__row${isDone ? ' is-done' : ''}`}>
                        <span className="idx__num" aria-hidden="true">
                          {String(running).padStart(2, '0')}
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
              </ol>
            </div>
          ))}

          {/* Coming soon — a quiet closing shelf */}
          <div className="shelf shelf--soon">
            <div className="shelf__head">
              <h3 className="shelf__title display">{h.labels.comingSoon}</h3>
            </div>
            <ol className="idx">
              {h.comingSoon.map((cs) => (
                <li key={cs.title}>
                  <div className="idx__row idx__row--soon" aria-disabled="true">
                    <span className="idx__num" aria-hidden="true">··</span>
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
          </div>
        </section>

        {/* ---------- Learning teaser ---------- */}
        <Link to="/learning" className="teaser">
          <div className="teaser__left">
            <span className="teaser__kicker">{h.learningTeaser.label}</span>
            <h3 className="teaser__title display">{h.learningTeaser.title}</h3>
            <p className="teaser__body">{h.learningTeaser.body}</p>
            <span className="teaser__cta">
              {h.learningTeaser.cta}
              <ArrowRight size={16} />
            </span>
          </div>
          <ul className="teaser__list">
            {insightTitles.map((t, i) => (
              <li key={i}>
                <span className="teaser__num">{String(i + 1).padStart(2, '0')}</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Link>

        {/* ---------- Quiet trust coda ---------- */}
        <footer className="coda">
          <span className="coda__orn" aria-hidden="true">◆</span>
          <p className="coda__trust">
            <ShieldCheck size={15} />
            {h.trust}
          </p>
          <Link to="/checkin" className="coda__checkin">
            {checkedInRecently ? h.checkin.comeBackNote : h.strip.checkinNudge}
            <ArrowRight size={14} />
          </Link>
        </footer>
      </div>
    </main>
  )
}
