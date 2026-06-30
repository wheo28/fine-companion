import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import {
  ArrowRight,
  Compass,
  Sunrise,
  BookOpen,
  ShieldCheck,
  Check,
  NoEntry,
} from '../components/Icons'

/* Reveal-on-scroll: adds `is-in` when an element enters the viewport.
   Respects prefers-reduced-motion by revealing immediately. */
function useReveal() {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    // Safety net: never let content stay hidden if the observer misbehaves
    // (e.g. an edge case after a production navigation).
    const fallback = window.setTimeout(() => setShown(true), 1400)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            window.clearTimeout(fallback)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.16 }
    )
    observer.observe(node)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  return [ref, shown]
}

function Reveal({ children, className = '', as: Tag = 'div', ...rest }) {
  const [ref, shown] = useReveal()
  return (
    <Tag ref={ref} className={`reveal${shown ? ' is-in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

/* ----------------------------- Hero ----------------------------- */

function Horizon() {
  const { t } = useLanguage()
  const h = t.hero.horizon
  const stops = [
    { key: 'today', data: h.today, kind: 'near' },
    { key: 'month', data: h.month, kind: 'mid' },
    { key: 'year', data: h.year, kind: 'far' },
    { key: 'life', data: h.life, kind: 'horizon' },
  ]

  return (
    <figure className="horizon" aria-label={t.hero.horizonTitle}>
      <figcaption className="horizon__title">
        <Compass size={16} />
        <span>{t.hero.horizonTitle}</span>
      </figcaption>

      <div className="horizon__field">
        <span className="horizon__line" aria-hidden="true" />
        <ol className="horizon__stops">
          {stops.map((stop, i) => (
            <li
              key={stop.key}
              className={`horizon__stop horizon__stop--${stop.kind}`}
              style={{ '--i': i }}
            >
              <span className="horizon__node" aria-hidden="true" />
              <span className="horizon__label">{stop.data.label}</span>
              <span className="horizon__note">{stop.data.note}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="horizon__foot">{t.hero.horizonFoot}</p>
    </figure>
  )
}

function Hero() {
  const { t } = useLanguage()
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">{t.hero.eyebrow}</p>
          <h1 id="hero-heading" className="display hero__headline">
            {t.hero.headline}
          </h1>
          <p className="hero__sub">{t.hero.sub}</p>
          <div className="hero__actions">
            <Link to="/checkup" className="btn btn--primary">
              {t.hero.primary}
              <ArrowRight size={18} />
            </Link>
            <Link to="/learning" className="btn btn--ghost">
              {t.hero.secondary}
            </Link>
          </div>
        </div>
        <Horizon />
      </div>
    </section>
  )
}

/* --------------------------- Promise ---------------------------- */

function Promise() {
  const { t } = useLanguage()
  return (
    <section id="promise" className="section section--band promise">
      <div className="section__inner">
        <Reveal className="section__head">
          <p className="eyebrow eyebrow--accent">
            <ShieldCheck size={15} />
            {t.promise.eyebrow}
          </p>
          <h2 className="display section__title">{t.promise.heading}</h2>
          <p className="section__lede">{t.promise.sub}</p>
        </Reveal>

        <div className="promise__grid">
          <Reveal className="promise__card promise__card--never">
            <p className="promise__card-title">{t.promise.neverTitle}</p>
            <ul className="promise__list">
              {t.promise.never.map((item) => (
                <li key={item}>
                  <span className="promise__icon promise__icon--no" aria-hidden="true">
                    <NoEntry size={15} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="promise__card promise__card--always">
            <p className="promise__card-title">{t.promise.alwaysTitle}</p>
            <ul className="promise__list">
              {t.promise.always.map((item) => (
                <li key={item}>
                  <span className="promise__icon promise__icon--yes" aria-hidden="true">
                    <Check size={15} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- Pillars --------------------------- */

function Pillars() {
  const { t } = useLanguage()
  return (
    <section className="section pillars">
      <div className="section__inner">
        <Reveal className="section__head section__head--left">
          <p className="eyebrow">{t.pillars.eyebrow}</p>
          <h2 className="display section__title">{t.pillars.heading}</h2>
        </Reveal>
        <div className="pillars__grid">
          {t.pillars.items.map((item) => (
            <Reveal key={item.k} className="pillar">
              <span className="pillar__k">{item.k}</span>
              <h3 className="pillar__title">{item.title}</h3>
              <p className="pillar__body">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------- Experiences ------------------------- */

function Experiences() {
  const { t } = useLanguage()
  const x = t.experiences
  const cards = [
    { ...x.roadmap, to: '/roadmap', icon: <Compass size={22} />, feature: true },
    { ...x.checkup, to: '/checkup', icon: <Sunrise size={22} /> },
    { ...x.learning, to: '/learning', icon: <BookOpen size={22} /> },
  ]
  return (
    <section id="how" className="section section--band experiences">
      <div className="section__inner">
        <Reveal className="section__head section__head--left">
          <p className="eyebrow eyebrow--accent">{x.eyebrow}</p>
          <h2 className="display section__title">{x.heading}</h2>
        </Reveal>
        <div className="experiences__grid">
          {cards.map((card) => (
            <Reveal
              key={card.to}
              className={`xcard${card.feature ? ' xcard--feature' : ''}`}
            >
              <div className="xcard__top">
                <span className="xcard__icon" aria-hidden="true">
                  {card.icon}
                </span>
                <span className="xcard__tag">{card.tag}</span>
              </div>
              <h3 className="xcard__title">{card.title}</h3>
              <p className="xcard__body">{card.body}</p>
              <Link to={card.to} className="xcard__cta">
                {card.cta}
                <ArrowRight size={16} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- Companion -------------------------- */

function Companion() {
  const { t } = useLanguage()
  return (
    <section className="section companion">
      <div className="section__inner companion__inner">
        <Reveal className="companion__head">
          <p className="eyebrow">{t.companion.eyebrow}</p>
          <h2 className="display section__title">{t.companion.heading}</h2>
          <p className="section__lede">{t.companion.sub}</p>
        </Reveal>
        <ol className="companion__list">
          {t.companion.questions.map((q, i) => (
            <Reveal as="li" key={q} className="companion__q">
              <span className="companion__q-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="companion__q-text">{q}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* --------------------------- Educator --------------------------- */

function Educator() {
  const { t } = useLanguage()
  return (
    <section className="section educator">
      <div className="section__inner">
        <Reveal as="figure" className="educator__quote">
          <blockquote className="display">{t.educator.quote}</blockquote>
          <figcaption>{t.educator.attribution}</figcaption>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------ CTA ----------------------------- */

function FinalCta() {
  const { t } = useLanguage()
  return (
    <section className="section cta">
      <div className="section__inner">
        <Reveal className="cta__card">
          <span className="cta__mark" aria-hidden="true">
            <Sunrise size={28} />
          </span>
          <h2 className="display cta__title">{t.cta.heading}</h2>
          <p className="cta__sub">{t.cta.sub}</p>
          <Link to="/checkup" className="btn btn--primary btn--lg">
            {t.cta.button}
            <ArrowRight size={18} />
          </Link>
          <p className="cta__reassure">{t.cta.reassure}</p>
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------- Page ----------------------------- */

export default function Landing() {
  return (
    <main className="landing">
      <Hero />
      <Promise />
      <Pillars />
      <Experiences />
      <Companion />
      <Educator />
      <FinalCta />
    </main>
  )
}
