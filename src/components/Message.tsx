import { config } from '../config'

export default function Message() {
  return (
    <div className="message-card">
      {config.message.map((line, i) => (
        <p key={i} className="message-line">
          {line}
        </p>
      ))}
      <p className="message-signature">— {config.signature}</p>
    </div>
  )
}
