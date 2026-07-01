import { useState } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { topicsContent } from './topicsContent'
import { markExplored } from '../lib/progress'
import {
  ArrowRight, Compass, Lightbulb, Check, Coins, Umbrella, Clock,
  GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale,
} from '../components/Icons'

const ICONS = { Coins, Umbrella, Clock, GraduationCap, Scroll, Receipt, TrendingUp, Heart, Scale }

function BeatCard({ ui, beat }) {
  if (beat.kind === 'myth') {
    return (
      <div className="tx-beat tx-beat--myth">
        <p className="tx-beat__label">{ui.beatLabels.myth}</p>
        <div className="tx-myth">
          <div className="tx-myth__row tx-myth__row--myth">
            <span className="tx-myth__tag">{ui.mythLabel}</span>
            <p>{beat.myth}</p>
          </div>
          <div className="tx-myth__row tx-myth__row--truth">
            <span className="tx-myth__tag">{ui.truthLabel}</span>
            <p>{beat.truth}</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="tx-beat">
      <p className="tx-beat__label">{ui.beatLabels[beat.kind]}</p>
      {beat.title && <h2 className="tx-beat__title display">{beat.title}</h2>}
      <p className="tx-beat__body">{beat.body}</p>
    </div>
  )
}

export default function TopicExplorer() {
  const { topicId } = useParams()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const data = topicsContent[lang]
  const topic = data.topics[topicId]
  const ui = data.ui
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  if (!topic) return <Navigate to="/" replace />

  const Icon = ICONS[topic.icon] || Compass
  const pages = ['intro', ...topic.beats.map((_, i) => `beat-${i}`), 'takeaway']
  const total = pages.length
  const current = pages[step]

  const go = (dir) => {
    setStep((s) => Math.min(total - 1, Math.max(0, s + dir)))
    window.scrollTo({ top: 0 })
  }

  const finish = () => {
    markExplored(topicId)
    setDone(true)
    window.scrollTo({ top: 0 })
  }

  if (done) {
    return (
      <main className="topic">
        <div className="topic__inner tx-done">
          <span className="tx-done__icon" aria-hidden="true">
            <Check size={30} />
          </span>
          <p className="tx-added">
            <Check size={14} /> {ui.addedNote}
          </p>
          <h1 className="display tx-done__title">{ui.doneTitle}</h1>
          <p className="tx-done__body">{ui.doneBody}</p>
          <div className="tx-done__actions">
            <Link to="/" className="btn btn--primary">
              {ui.backToHub}
            </Link>
            <Link to="/roadmap" className="btn btn--ghost">
              <Compass size={17} />
              {lang === 'ko' ? '로드맵 보기' : 'See your roadmap'}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="topic">
      <div className="topic__inner">
        {/* header */}
        <div className="tx-top">
          <Link to="/" className="tx-back">
            <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} />
            {ui.backToHub}
          </Link>
          <span className="tx-progress-count">
            {step + 1} {ui.of} {total}
          </span>
        </div>
        <div className="tx-dots" aria-hidden="true">
          {pages.map((p, i) => (
            <span key={p} className={`tx-dot${i <= step ? ' is-on' : ''}`} />
          ))}
        </div>

        {current === 'intro' && (
          <div className="tx-intro">
            <span className="tx-intro__icon" aria-hidden="true">
              <Icon size={28} />
            </span>
            <p className="eyebrow eyebrow--accent">{topic.title}</p>
            <h1 className="display tx-intro__title">{topic.tagline}</h1>
            <div className="tx-reframe">
              <div className="tx-reframe__row tx-reframe__row--from">
                <span className="tx-reframe__label">{ui.instead}</span>
                <p>{topic.reframe.from}</p>
              </div>
              <div className="tx-reframe__arrow" aria-hidden="true">
                <ArrowRight size={18} />
              </div>
              <div className="tx-reframe__row tx-reframe__row--to">
                <span className="tx-reframe__label">{ui.understand}</span>
                <p>{topic.reframe.to}</p>
              </div>
            </div>
          </div>
        )}

        {current && current.startsWith('beat-') && (
          <BeatCard ui={ui} beat={topic.beats[Number(current.split('-')[1])]} />
        )}

        {current === 'takeaway' && (
          <div className="tx-takeaway">
            <span className="tx-takeaway__icon" aria-hidden="true">
              <Lightbulb size={24} />
            </span>
            <p className="tx-beat__label">{ui.takeawayLabel}</p>
            <h2 className="display tx-takeaway__title">{topic.takeaway.title}</h2>
            <div className="tx-step">
              <span className="tx-step__label">{ui.stepLabel}</span>
              <p>{topic.takeaway.step}</p>
            </div>
          </div>
        )}

        {/* nav */}
        <div className="tx-nav">
          <button type="button" className="btn btn--ghost" onClick={() => (step === 0 ? navigate('/') : go(-1))}>
            {ui.prev}
          </button>
          {current === 'takeaway' ? (
            <button type="button" className="btn btn--primary" onClick={finish}>
              {ui.finish}
              <Check size={17} />
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={() => go(1)}>
              {step === 0 ? ui.start : ui.next}
              <ArrowRight size={17} />
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
