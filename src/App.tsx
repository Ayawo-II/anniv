import { useCallback, useState } from 'react'
import './App.css'
import { config } from './config'
import Cake from './components/Cake'
import Chest from './components/Chest'
import Confetti from './components/Confetti'
import Hearts from './components/Hearts'
import Message from './components/Message'

type Page = 'home' | 'chest'

function Home({ onOpenChest }: { onOpenChest: () => void }) {
  const [burst, setBurst] = useState(0)
  const [blew, setBlew] = useState(false)

  const handleBlow = useCallback(() => {
    setBlew(true)
    setBurst((b) => b + 1)
  }, [])

  return (
    <main className="content">
      <Confetti trigger={burst} />
      <h1 className="title">
        {config.title} <span className="name">{config.name}</span> 🎉
      </h1>
      <p className="subtitle">{config.subtitle}</p>

      <Cake onBlow={handleBlow} />

      <Message />

      <button
        className={`chest-link ${blew ? '' : 'chest-link-locked'}`}
        onClick={onOpenChest}
        disabled={!blew}
        title={blew ? config.chest.hint : 'Souffle d’abord les bougies 🎂'}
      >
        🗝️ {config.chest.label}
      </button>
    </main>
  )
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [curtain, setCurtain] = useState(false)

  const navigate = useCallback((next: Page) => {
    if (curtain) return
    setCurtain(true)
    window.setTimeout(() => {
      setPage(next)
      window.setTimeout(() => setCurtain(false), 60)
    }, 480)
  }, [curtain])

  return (
    <div className="app">
      <Hearts />

      <div className={`curtain ${curtain ? 'curtain-open' : ''}`}>
        <span className="curtain-panel curtain-left" />
        <span className="curtain-panel curtain-right" />
      </div>

      <div key={page} className="page-enter">
        {page === 'home' && <Home onOpenChest={() => navigate('chest')} />}
        {page === 'chest' && <Chest onBack={() => navigate('home')} />}
      </div>
    </div>
  )
}

export default App
