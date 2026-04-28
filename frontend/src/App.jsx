import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const PERSONAS = {
  anshuman: {
    key: 'anshuman',
    name: 'Anshuman Singh',
    subtitle: 'Execution-first guidance, systems thinking, and ownership.',
    quickQuestions: [
      'How can I balance DSA prep and project building in college?',
      'What does a high-agency engineer mindset look like daily?',
      'How should I recover from repeated interview rejections?',
    ],
  },
  abhimanyu: {
    key: 'abhimanyu',
    name: 'Abhimanyu Saxena',
    subtitle: 'Structured learning, practical depth, and career compounding.',
    quickQuestions: [
      'What should my first 90-day roadmap look like for data careers?',
      'How do I pick projects that improve both skills and resume?',
      'How can I stay consistent when motivation drops?',
    ],
  },
  kshitij: {
    key: 'kshitij',
    name: 'Kshitij Mishra',
    subtitle: 'Communication clarity, discipline, and placement readiness.',
    quickQuestions: [
      'How do I improve interview communication under pressure?',
      'What are the most important daily habits for placements?',
      'How should I prepare if I feel behind my peers?',
    ],
  },
}

function EmptyState({ persona, onSuggestionClick }) {
  return (
    <div className="empty-state">
      <h2>{persona.name} Persona Chat</h2>
      <p>{persona.subtitle}</p>
      <div className="chips">
        {persona.quickQuestions.map((question) => (
          <button
            key={question}
            type="button"
            className="chip"
            onClick={() => onSuggestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [activePersonaKey, setActivePersonaKey] = useState('anshuman')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  const activePersona = useMemo(() => PERSONAS[activePersonaKey], [activePersonaKey])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const onSwitchPersona = (personaKey) => {
    if (personaKey === activePersonaKey) return
    setActivePersonaKey(personaKey)
    setMessages([])
    setError('')
    setInput('')
  }

  const sendMessage = async (text) => {
    const userText = text.trim()
    if (!userText || isLoading) return

    const nextMessages = [...messages, { role: 'user', content: userText }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsLoading(true)

    try {
      const API_BASE = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: activePersona.key,
          messages: nextMessages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to fetch response right now. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    await sendMessage(input)
  }

  return (
    <main className="app-shell">
      <header className="top-header">
        <div className="brand">
          <div className="brand-badge">PB</div>
          <div>
            <h1>Persona-Based AI Chatbot</h1>
            <p>Prompt Engineering Assignment</p>
          </div>
        </div>
        <div className="status">Active Persona: {activePersona.name}</div>
      </header>

      <div className="workspace">
        <aside className="persona-panel">
          <p className="persona-panel-label">Switch Persona</p>
          <nav className="persona-switcher" aria-label="Persona switcher">
            {Object.values(PERSONAS).map((persona) => (
              <button
                key={persona.key}
                type="button"
                className={`persona-btn ${activePersonaKey === persona.key ? 'active' : ''}`}
                onClick={() => onSwitchPersona(persona.key)}
              >
                <span className="persona-name">{persona.name}</span>
                <span className="persona-subtitle">{persona.subtitle}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="chat-panel">
          <div className="chat-header">
            <h2>{activePersona.name}</h2>
            <p>{activePersona.subtitle}</p>
          </div>

          <div className="messages" aria-live="polite">
            {messages.length === 0 ? (
              <EmptyState persona={activePersona} onSuggestionClick={sendMessage} />
            ) : (
              messages.map((message, idx) => (
                <div
                  key={`${message.role}-${idx}`}
                  className={`bubble ${message.role === 'user' ? 'user' : 'assistant'}`}
                >
                  <span className="role">{message.role === 'user' ? 'You' : activePersona.name}</span>
                  <p>{message.content}</p>
                </div>
              ))
            )}
            {isLoading && (
              <div className="typing-indicator" role="status" aria-label="AI is typing">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && <p className="error-banner">{error}</p>}

          <form className="composer" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={`Ask ${activePersona.name} something...`}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? 'Thinking...' : 'Send'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

export default App
