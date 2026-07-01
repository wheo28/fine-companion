import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { learningContent } from './learningContent'
import { Lightbulb, NoEntry, Check, Compass, ArrowRight } from '../components/Icons'

const UI = {
  en: { guessPrompt: 'Before you read on — does this hold up?', yes: 'Sounds right', no: 'Not so sure', reveal: 'Reveal what most people miss' },
  ko: { guessPrompt: '읽기 전에 \u2014 이게 맞는 말일까요?', yes: '맞는 것 같아요', no: '글쎄요', reveal: '많은 사람이 놓치는 것 펼치기' },
}

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

/* A misconception the reader weighs in on before the truth is shown. */
function MythCard({ m, labels, ui }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <article className="lc-mistake">
      <div className="lc-mistake__myth">
        <span className="lc-tag lc-tag--myth">{labels.mythLabel}</span>
        <p>{m.myth}</p>
        {!revealed && (
          <>
            <span className="lc-tag lc-tag--myth" style={{ marginTop: 6 }}>{ui.guessPrompt}</span>
            <div className="lc-guess">
              <button type="button" className="lc-guess__btn" onClick={() => setRevealed(true)}>{ui.yes}</button>
              <button type="button" className="lc-guess__btn" onClick={() => setRevealed(true)}>{ui.no}</button>
            </div>
          </>
        )}
      </div>
      {revealed && (
        <div className="lc-mistake__truth lc-revealed">
          <span className="lc-tag lc-tag--truth">
            <Check size={12} /> {labels.truthLabel}
          </span>
          <p>{m.truth}</p>
        </div>
      )}
    </article>
  )
}

/* A fact kept behind a small act of curiosity. */
function DidCard({ text, num, revealLabel }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="lc-did">
      <span className="lc-did__num" aria-hidden="true">{String(num).padStart(2, '0')}</span>
      {open ? (
        <p className="lc-revealed">{text}</p>
      ) : (
        <button type="button" className="lc-reveal-btn" onClick={() => setOpen(true)}>
          <ArrowRight size={13} /> {revealLabel}
        </button>
      )}
    </article>
  )
}

export default function LearningCenter() {
  const { lang } = useLanguage()
  const c = learningContent[lang]
  const ui = UI[lang] || UI.en

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

        {/* Common misconceptions — weigh in, then see */}
        <section className="lc-section">
          <p className="lc__section-label">
            <NoEntry size={15} />
            {c.labels.mistakes}
          </p>
          <div className="lc-mistakes">
            {c.commonMistakes.map((m) => (
              <MythCard key={m.myth} m={m} labels={c.labels} ui={ui} />
            ))}
          </div>
        </section>

        {/* Did you know — reveal on curiosity */}
        <section className="lc-section">
          <p className="lc__section-label">
            <Lightbulb size={15} />
            {c.labels.didyou}
          </p>
          <div className="lc-didyou">
            {c.didYouKnow.map((d, i) => (
              <DidCard key={i} text={d} num={i + 1} revealLabel={ui.reveal} />
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
