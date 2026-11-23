import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
} from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import { askGeminiAssistant } from '../../services/geminiService.ts'
import { sanitizeHtml } from '../../utils/security.ts'
import type { ChatMessage } from '../../types/index.ts'

export const SmogCopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    city,
    persona,
    telemetry,
    hourly,
    apiKey,
    setCurrentRoutine,
    setIsExportModalOpen,
  } = useAero()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am **AeroPulse Smog Defense Copilot**, powered by Google Gemini and real-time atmospheric telemetry.

I am actively tracking air conditions for **${city.name}** (Current AQI: **${
        telemetry?.aqi || 250
      }**) and tailored for **${persona.name}**.

How can I assist your family with smog defense, indoor filtration, or safe routines today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCopilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isCopilotOpen])

  if (!isCopilotOpen) return null

  const quickPrompts = [
    `Create a 24h winter smog routine for ${persona.name}`,
    'How do I build a DIY Corsi-Rosenthal box under $50?',
    'What is the safest hour for outdoor movement today?',
    'How do I seal my room during severe night inversion?',
  ]

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || loading || !telemetry) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await askGeminiAssistant(
        query,
        apiKey,
        persona,
        telemetry,
        hourly,
        city.name
      )

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        routineData: response.routine,
      }

      setMessages((prev) => [...prev, assistantMsg])

      if (response.routine) {
        setCurrentRoutine(response.routine)
      }
    } catch (err) {
      console.error('Chatbot error:', err)
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered an issue processing your inquiry. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  // Convert basic markdown to safe HTML for message display
  const renderFormattedText = (rawMarkdown: string) => {
    // Quick regex markdown parser
    let html = rawMarkdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-cyan-300 mt-2 mb-1">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-cyan-200 mt-2 mb-1">$1</h2>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // List items
      .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')

    return { __html: sanitizeHtml(html) }
  }

  return (
    <aside
      className="copilot-drawer-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCopilotOpen(false)
      }}
      aria-label="Smog Copilot Chat"
    >
      <div className="copilot-drawer-panel">
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="flex items-center gap-3">
            <div className="drawer-bot-icon">
              <Bot size={20} className="text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="drawer-title">AeroPulse AI Copilot</h3>
                <span className={`engine-badge ${apiKey ? 'badge-live' : 'badge-offline'}`}>
                  {apiKey ? 'Gemini 2.5 Flash' : 'Offline Heuristic'}
                </span>
              </div>
              <p className="drawer-subtitle">
                Context: {city.name} • AQI {telemetry?.aqi || '—'} • {persona.name}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            className="drawer-close-btn"
            aria-label="Close Smog AI assistant"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="drawer-messages-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-row ${msg.sender === 'user' ? 'row-user' : 'row-ai'}`}
            >
              <div className="bubble-avatar">
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div className="bubble-content-wrap">
                <div
                  className="bubble-text"
                  dangerouslySetInnerHTML={renderFormattedText(msg.text)}
                />

                {/* If message injected a routine */}
                {msg.routineData && (
                  <div className="routine-injection-banner">
                    <Sparkles size={16} className="text-amber-400" />
                    <div className="flex-1">
                      <span className="font-semibold text-xs text-amber-300">
                        {msg.routineData.title} Generated
                      </span>
                      <p className="text-xs text-zinc-300">
                        Hour-by-hour schedule ready for {msg.routineData.personaName}.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsExportModalOpen(true)}
                      className="btn-view-routine"
                    >
                      View & Export
                    </button>
                  </div>
                )}

                <span className="bubble-timestamp">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-row row-ai">
              <div className="bubble-avatar">
                <Bot size={16} />
              </div>
              <div className="bubble-content-wrap">
                <div className="typing-indicator">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="text-xs text-zinc-400 ml-2">Synthesizing clinical advice...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="quick-suggestions-bar">
          <span className="quick-label">
            <Lightbulb size={12} className="text-amber-400" /> Quick Inquiries:
          </span>
          <div className="suggestions-scroll">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                disabled={loading}
                className="suggestion-chip"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="drawer-input-area">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="input-form"
          >
            <input
              type="text"
              placeholder={`Ask about ${city.name} smog, filtration, masks, or routines...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="chat-text-input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="chat-send-btn"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
