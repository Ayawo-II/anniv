import { useState } from 'react'

const FLAME_COLORS = ['#ffd166', '#ff9f1c', '#ff6b35', '#ef476f']

export default function Cake({ onBlow }: { onBlow: () => void }) {
  const [lit, setLit] = useState(true)

  const handle = () => {
    if (lit) {
      setLit(false)
      onBlow()
    }
  }

  return (
    <div className="cake" onClick={handle} role="button" aria-label="Souffler les bougies">
      <p className="cake-hint">{lit ? 'Clique pour souffler les bougies 🎂' : 'Bravo, ton vœu est lancé ✨'}</p>
      {lit && (
        <div className="flames">
          {FLAME_COLORS.map((c, i) => (
            <span key={i} className="flame" style={{ background: c, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}
      <div className="candles">
        {FLAME_COLORS.map((_, i) => (
          <span key={i} className="candle" />
        ))}
      </div>
      <div className="cake-top" />
      <div className="cake-mid" />
      <div className="cake-bottom" />
    </div>
  )
}
