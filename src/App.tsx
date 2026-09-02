import { useCallback, useState } from 'react'
import './App.css'
import { config } from './config'
import Cake from './components/Cake'
import Confetti from './components/Confetti'
import Hearts from './components/Hearts'
import Message from './components/Message'

function App() {
  const [burst, setBurst] = useState(0)

  const handleBlow = useCallback(() => {
    setBurst((b) => b + 1)
  }, [])

  return (
    <div className="app">
      <Hearts />
      <Confetti trigger={burst} />

      <main className="content">
        <h1 className="title">
          {config.title} <span className="name">{config.name}</span> 🎉
        </h1>
        <p className="subtitle">{config.subtitle}</p>

        <Cake onBlow={handleBlow} />

        <Message />
      </main>
    </div>
  )
}

export default App
