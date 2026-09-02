import { useMemo } from 'react'

interface Heart {
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

function makeHearts(count: number): Heart[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    size: Math.random() * 30 + 15,
    duration: Math.random() * 14 + 10,
    delay: Math.random() * 12,
    opacity: Math.random() * 0.6 + 0.2,
  }))
}

export default function Hearts() {
  const list = useMemo(() => makeHearts(22), [])

  return (
    <div className="hearts" aria-hidden="true">
      {list.map((h, i) => (
        <span
          key={i}
          className="heart"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        >
          💖
        </span>
      ))}
    </div>
  )
}
