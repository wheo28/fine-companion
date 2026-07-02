import { useState } from 'react'
import { Sun } from './Icons'

/**
 * "The question" — a small daily prediction. The reader chooses before the
 * idea is revealed; the reveal teaches regardless of the choice, never scolds.
 * Renders the inner content of the forest "ask" room; the Hub provides the room.
 */
export default function Predict({ data, kicker, revealLabel }) {
  const [chosen, setChosen] = useState(null)
  if (!data) return null
  const revealed = chosen !== null

  return (
    <>
      <p className="sign sign--on-forest ask__kicker">{kicker}</p>
      <h2 className="serif ask__q">{data.question}</h2>

      <div className="ask__opts" role="group" aria-label={kicker}>
        {data.options.map((opt) => {
          const isChosen = chosen === opt.key
          const isAnswer = revealed && opt.key === data.answer
          const cls = ['ask__opt', isChosen ? 'is-chosen' : '', isAnswer ? 'is-answer' : '']
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={opt.key}
              type="button"
              className={cls}
              disabled={revealed}
              aria-pressed={isChosen}
              onClick={() => setChosen(opt.key)}
            >
              <span className="ask__opt-key" aria-hidden="true">{opt.key}</span>
              <span>{opt.label}</span>
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="ask__reveal">
          <span className="ask__reveal-mark" aria-hidden="true"><Sun size={20} /></span>
          <div>
            <span className="ask__reveal-label">{revealLabel}</span>
            <p dangerouslySetInnerHTML={{ __html: data.insight }} />
          </div>
        </div>
      )}
    </>
  )
}
