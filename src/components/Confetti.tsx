import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  vr: number
  color: string
  size: number
  shape: 'rect' | 'circle'
}

const COLORS = ['#ff6b9d', '#ffb3c1', '#ffd166', '#06d6a0', '#118ab2', '#ff8fab', '#ffc300', '#f72585']

export default function Confetti({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const canvasRefCurrent = useRef<HTMLCanvasElement | null>(null)

  const spawn = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const count = 120
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 5 + 2,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      })
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let running = true

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const ps = particlesRef.current
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02
        p.rotation += p.vr

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()

        if (p.y > canvas.height + 20) {
          ps.splice(i, 1)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    canvasRefCurrent.current = canvas

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    if (trigger > 0) {
      spawn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return <canvas ref={canvasRef} className="confetti-canvas" />
}
