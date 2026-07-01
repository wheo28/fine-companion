import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { learningContent } from './learningContent'
import { Lightbulb, NoEntry, Check, Compass, ArrowRight } from '../components/Icons'

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`lc-faq__item${open ? ' is-open' : ''}`}>
      <button type="button" className="lc-faq__q" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{item.q}</span>
        <span className="lc-faq__mark" aria-hidden="true">{open ? '\u2212' : '+'}</span>
      </button>
      {open && <p className="lc-faq__a">{item.a}</p>}
    </div>
  )
}

export default function LearningCenter() {
  const { lang } = useLanguage()
  const c = learningContent[lang]

  return (
    <main className="learning-center">
      <div className="lc__inner">
        <header className="lc__head">
          <p className="eyebrow eyebrow--accent">{c.eyebrow}</p>
          <h1 className="display lc__title">{c.title}</h1>
          <p className="lc__sub">{c.sub}</p>
        </header>

        {/* Behavioral insights */}
        <section className="lc-section">
          <p className="lc__section-label">
            <Lightbulb size={15} />
            {c.labels.insights}
          </p>
          <div className="lc-insights">
            {c.behavioralInsights.map((it) => (
              <article className="lc-insight" key={it.title}>
                <h2 className="lc-insight__title">{it.title}</h2>
                <p className="lc-insight__body">{it.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Common misconceptions */}
        <section className="lc-section">
          <p className="lc__section-label">
            <NoEntry size={15} />
            {c.labels.mistakes}
          </p>
          <div className="lc-mistakes">
            {c.commonMistakes.map((m) => (
              <article className="lc-mistake" key={m.myth}>
                <div className="lc-mistake__myth">
                  <span className="lc-tag lc-tag--myth">{c.labels.mythLabel}</span>
                  <p>{m.myth}</p>
                </div>
                <div className="lc-mistake__truth">
                  <span className="lc-tag lc-tag--truth">
                    <Check size={12} /> {c.labels.truthLabel}
                  </span>
                  <p>{m.truth}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Did you know */}
        <section className="lc-section">
          <p className="lc__section-label">
            <Lightbulb size={15} />
            {c.labels.didyou}
          </p>
          <div className="lc-didyou">
            {c.didYouKnow.map((d, i) => (
              <article className="lc-did" key={i}>
                <span className="lc-did__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="lc-section">
          <p className="lc__section-label">{c.labels.faq}</p>
          <div className="lc-faq">
            {c.faq.map((f) => (
              <FaqItem item={f} key={f.q} />
            ))}
          </div>
        </section>

        <div className="lc-foot">
          <Link to="/" className="btn btn--ghost">
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            {lang === 'ko' ? '허브로 돌아가기' : 'Back to the Hub'}
          </Link>
          <Link to="/roadmap" className="btn btn--primary">
            <Compass size={17} />
            {lang === 'ko' ? '내 로드맵 보기' : 'See your roadmap'}
          </Link>
        </div>
      </div>
    </main>
  )
}
