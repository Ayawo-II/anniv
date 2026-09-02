import { useMemo, useState } from 'react'
import { config } from '../config'
import Confetti from './Confetti'

const PIN_LENGTH = 4
const MAX_ATTEMPTS = 15
const SPARKLE_COUNT = 24
const STORAGE_KEY = 'chest_attempts'

function makeSparkles() {
  return Array.from({ length: SPARKLE_COUNT }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: Math.random() * 2 + 1.6,
  }))
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadState(): { date: string; attempts: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as { date: string; attempts: number }
      if (parsed.date === today()) return parsed
    }
  } catch {
    /* ignore */
  }
  return { date: today(), attempts: 0 }
}

export default function Chest({ onBack }: { onBack: () => void }) {
  const [pin, setPin] = useState('')
  const [opened, setOpened] = useState(false)
  const [error, setError] = useState(false)
  const [burst, setBurst] = useState(0)
  const [attemptsLeft, setAttemptsLeft] = useState(() => MAX_ATTEMPTS - loadState().attempts)

  const sparkles = useMemo(() => (opened ? makeSparkles() : []), [opened])

  const locked = attemptsLeft <= 0

  const consumeAttempt = () => {
    const state = loadState()
    const newAttempts = state.attempts + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today(), attempts: newAttempts }))
    setAttemptsLeft(MAX_ATTEMPTS - newAttempts)
    return newAttempts
  }

  const tryPin = (value: string) => {
    if (locked) return
    if (value.length !== PIN_LENGTH) return

    if (value === config.chest.password) {
      setOpened(true)
      setBurst((b) => b + 1)
      setError(false)
      return
    }

    const used = consumeAttempt()
    setError(true)
    setPin('')
    if (MAX_ATTEMPTS - used <= 0) {
      setError(false)
    }
  }

  const handleDigit = (d: string) => {
    setError(false)
    setPin((prev) => {
      if (prev.length >= PIN_LENGTH) return prev
      const next = prev + d
      if (next.length === PIN_LENGTH) {
        setTimeout(() => tryPin(next), 150)
      }
      return next
    })
  }

  const handleClear = () => {
    setPin('')
    setError(false)
  }

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1))
    setError(false)
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

  return (
    <div className="chest-page">
      <Confetti trigger={burst} />

      {!opened && (
        <button className="back-btn" onClick={onBack}>
          ← {config.chest.back}
        </button>
      )}

      <h1 className="chest-title">{config.chest.label}</h1>

      {!opened && <p className="chest-guess">{config.chest.guessPrompt}</p>}

      <div className="chest-stage">
        {opened &&
          sparkles.map((s, i) => (
            <span
              key={i}
              className="sparkle"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
              aria-hidden="true"
            />
          ))}

        {opened && (
          <div className="beams">
            <span className="beam" />
            <span className="beam" />
            <span className="beam" />
            <span className="beam" />
          </div>
        )}

        <div className={`chest ${opened ? 'chest-open' : ''}`}>
          <div className="chest-lid" />
          <div className="chest-body" />
          <div className="chest-lock">🔒</div>
        </div>

        {opened && (
          <div className="chest-reveal rise-from-chest">
            <p>{config.chest.open}</p>
          </div>
        )}
      </div>

      {!opened && (
        <>
          {locked ? (
            <div className="chest-reveal plain">
              <p>Tu as utilisé toutes tes tentatives pour aujourd’hui. Reviens demain 😉</p>
            </div>
          ) : (
            <>
              <div className="pin-dots">
                {Array.from({ length: PIN_LENGTH }, (_, i) => (
                  <span key={i} className={`pin-dot ${i < pin.length ? 'pin-dot-filled' : ''}`} />
                ))}
              </div>
              {error && <p className="chest-error">Hmm… ce n’est pas le bon code. Essaie encore 😉</p>}

              <div className="pinpad">
                {keys.map((k, i) => {
                  if (k === '') {
                    return <span key={i} className="pin-key pin-key-empty" />
                  }
                  if (k === 'del') {
                    return (
                      <button key={i} className="pin-key pin-key-action" onClick={handleDelete}>
                        ⌫
                      </button>
                    )
                  }
                  return (
                    <button key={i} className="pin-key" onClick={() => handleDigit(k)}>
                      {k}
                    </button>
                  )
                })}
              </div>

              <button className="chest-clear" onClick={handleClear}>
                Effacer
              </button>

              <p className="chest-attempts">
                {attemptsLeft} tentative{attemptsLeft > 1 ? 's' : ''} restante{attemptsLeft > 1 ? 's' : ''} aujourd’hui
              </p>
            </>
          )}
        </>
      )}
    </div>
  )
}
