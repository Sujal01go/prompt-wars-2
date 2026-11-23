import React, { useState } from 'react'
import { Sparkles, ExternalLink, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { Modal } from '../common/Modal.tsx'
import { useAero } from '../../hooks/useAero.ts'
import { maskApiKey } from '../../utils/security.ts'

export const ApiKeyModal: React.FC = () => {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, apiKey, setApiKey } = useAero()
  const [inputKey, setInputKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setApiKey(inputKey.trim())
    setIsApiKeyModalOpen(false)
  }

  const handleClear = () => {
    setInputKey('')
    setApiKey('')
    setIsApiKeyModalOpen(false)
  }

  return (
    <Modal
      isOpen={isApiKeyModalOpen}
      onClose={() => setIsApiKeyModalOpen(false)}
      title="Google Gemini AI Engine Configuration"
      subtitle="Connect Google AI Studio or use the offline heuristic engine"
    >
      <form onSubmit={handleSave} className="api-key-form">
        <div className="engine-choice-card">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Sparkles size={16} />
            <span>Dual-Engine Intelligence</span>
          </div>
          <p className="text-xs text-zinc-300 mt-1">
            AeroPulse AI includes a <strong>Built-in Offline Heuristic Engine</strong> that functions 100% locally with zero configuration. You can also provide a free Google AI Studio API Key to unlock live streaming intelligence with <strong>Gemini 2.5 Flash</strong>.
          </p>
        </div>

        <div className="form-group mt-4">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="gemini-key" className="text-xs font-semibold text-zinc-300">
              Google Gemini API Key
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Get Free Key (Google AI Studio)</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="relative">
            <input
              id="gemini-key"
              type={showKey ? 'text' : 'password'}
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="text-input font-mono pr-10"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-200"
              aria-label={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {apiKey && (
            <p className="text-xs text-emerald-400 mt-1">
              Currently connected: <span className="font-mono">{maskApiKey(apiKey)}</span>
            </p>
          )}
        </div>

        <div className="security-notice-box mt-3">
          <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
          <p className="text-xs text-zinc-400">
            <strong>Security Guarantee:</strong> Your key is stored solely in your browser's private local storage with Base64 obfuscation and sent directly to Google's official Generative Language API endpoint. No keys or telemetry are ever logged by third-party servers.
          </p>
        </div>

        <div className="modal-actions-row mt-6">
          {apiKey && (
            <button
              type="button"
              onClick={handleClear}
              className="btn-danger-outline"
            >
              Switch to Offline Engine
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(false)}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save & Activate
          </button>
        </div>
      </form>
    </Modal>
  )
}
