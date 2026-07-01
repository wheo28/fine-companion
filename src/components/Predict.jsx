import { useState } from 'react'
import { Lightbulb } from './Icons'

/**
 * A single "predict, then learn" moment. The reader chooses before the idea
 * is revealed; the reveal teaches regardless of the choice, never scolds it.
 * Fully client-side and deterministic. `data` is one prompt from predictContent.
 */
export default function Predict({ data, kicker, revealLabel }) {
  const [chosen, setChosen] = useState(null)
  if (!data) return null
  const revealed = chosen !== null

  return (
    <section className="predict" aria-label={kicker}>
      <p className="predict__kicker">
        <Lightbulb size={15} />
        {kicker}
      </p>
      <h2 className="predict__q display">{data.question}</h2>

      <div className="predict__opts" role="group">
        {data.options.map((opt) => {
          const isChosen = chosen === opt.key
          const isAnswer = revealed && opt.key === data.answer
          const cls = [
            'predict__opt',
            isChosen ? 'is-chosen' : '',
            isAnswer ? 'is-answer' : '',
          ]
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
              <span className="predict__opt-key" aria-hidden="true">
                {opt.key}
              </span>
              <span>{opt.label}</span>
            </button>
          )
        })}
      </div>

      {revealed && (
        <div className="predict__reveal">
          <span className="predict__reveal-mark" aria-hidden="true">
            <Lightbulb size={18} />
          </span>
          <div>
            <span className="predict__reveal-label">{revealLabel}</span>
            <p dangerouslySetInnerHTML={{ __html: data.insight }} />
          </div>
        </div>
      )}
    </section>
  )
}
