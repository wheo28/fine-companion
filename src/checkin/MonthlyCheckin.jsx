import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { checkinContent } from './checkinContent'
import { markCheckin } from '../lib/progress'
import { ArrowRight, Compass, Check, Sunrise } from '../components/Icons'

export default function MonthlyCheckin() {
  const { lang } = useLanguage()
  const c = checkinContent[lang]
  const [selected, setSelected] = useState([])
  const [done, setDone] = useState(false)

  const toggle = (id) => {
    setSelected((prev) => {
      if (id === 'none') return prev.includes('none') ? [] : ['none']
      const next = prev.filter((x) => x !== 'none')
      return next.includes(id) ? next.filter((x) => x !== id) : [...next, id]
    })
  }

  const finish = () => {
    markCheckin(selected)
    setDone(true)
    window.scrollTo({ top: 0 })
  }

  const changed = selected.length > 0 && !selected.includes('none')

  if (done) {
    return (
      <main className="checkin">
        <div className="checkin__inner tx-done">
          <span className="tx-done__icon" aria-hidden="true">
            <Check size={30} />
          </span>
          <p className="tx-added">
            <Check size={14} /> {c.savedNote}
          </p>
          <h1 className="display tx-done__title">{changed ? c.changedTitle : c.steadyTitle}</h1>
          <p className="tx-done__body">{changed ? c.changedBody : c.steadyBody}</p>
          <div className="tx-done__actions">
            {changed ? (
              <Link to="/checkup" className="btn btn--primary">
                {c.revisitCheckup}
              </Link>
            ) : null}
            <Link to="/roadmap" className="btn btn--ghost">
              <Compass size={17} />
              {c.seeRoadmap}
            </Link>
            <Link to="/" className="btn btn--ghost">
              {c.backToHub}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="checkin">
      <div className="checkin__inner">
        <header className="checkin__head">
          <span className="checkin__icon" aria-hidden="true">
            <Sunrise size={26} />
          </span>
          <p className="eyebrow eyebrow--accent">{c.eyebrow}</p>
          <h1 className="display checkin__title">{c.title}</h1>
          <p className="checkin__sub">{c.sub}</p>
        </header>

        <section className="checkin__body">
          <p className="checkin__prompt">{c.prompt}</p>
          <p className="checkin__hint">{c.changesHint}</p>
          <div className="checkin__options">
            {c.changes.map((ch) => {
              const on = selected.includes(ch.id)
              return (
                <button
                  type="button"
                  key={ch.id}
                  className={`checkin-opt${on ? ' is-on' : ''}`}
                  aria-pressed={on}
                  onClick={() => toggle(ch.id)}
                >
                  <span className="checkin-opt__box" aria-hidden="true">
                    {on ? <Check size={14} /> : null}
                  </span>
                  {ch.label}
                </button>
              )
            })}
          </div>
        </section>

        <div className="checkin__actions">
          <Link to="/" className="btn btn--ghost">
            {c.backToHub}
          </Link>
          <button type="button" className="btn btn--primary" onClick={finish}>
            {c.finish}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </main>
  )
}
