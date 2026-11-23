import React from 'react'
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  HeartPulse,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
} from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import { PERSONA_PROFILES } from '../../services/personaData.ts'
import type { PersonaId } from '../../types/index.ts'

export const PersonaShield: React.FC = () => {
  const { persona, setPersonaId, telemetry, setIsExportModalOpen } = useAero()

  const allPersonas = Object.values(PERSONA_PROFILES)

  // Dynamically adjust safe outdoor minutes based on live AQI
  const getDynamicOutdoorLimit = (baseMinutes: number): number => {
    if (!telemetry) return baseMinutes
    if (telemetry.aqi >= 300) return Math.min(10, Math.round(baseMinutes * 0.35))
    if (telemetry.aqi >= 200) return Math.min(20, Math.round(baseMinutes * 0.6))
    if (telemetry.aqi >= 150) return Math.round(baseMinutes * 0.8)
    return baseMinutes
  }

  const safeMinutes = getDynamicOutdoorLimit(persona.maxOutdoorMinutes)

  return (
    <div className="persona-shield-view" aria-label="Persona Vulnerability Shield">
      {/* Header Banner */}
      <div className="persona-hero-banner">
        <div className="banner-left">
          <div className="flex items-center gap-2">
            <ShieldAlert size={22} className="text-rose-400" />
            <h2 className="banner-title">Personalized Vulnerability & Health Shield</h2>
          </div>
          <p className="banner-desc">
            Airborne pollution affects physiology differently based on lung maturity, endothelial baseline, and ventilation volume. Select your household profile to adapt all clinical advisories.
          </p>
        </div>

        {telemetry && (
          <div className="banner-aqi-indicator">
            <span className="text-xs uppercase tracking-wider opacity-75">Live Context</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black" style={{ color: telemetry.categoryColor }}>
                AQI {telemetry.aqi}
              </span>
              <span className="text-sm text-zinc-300">({telemetry.categoryLabel})</span>
            </div>
          </div>
        )}
      </div>

      {/* Persona Selection Tabs */}
      <div className="persona-cards-selector" role="tablist" aria-label="Vulnerable Personas">
        {allPersonas.map((p) => {
          const isSelected = p.id === persona.id
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setPersonaId(p.id as PersonaId)}
              className={`persona-selector-btn ${isSelected ? 'selected' : ''}`}
              style={{
                borderColor: isSelected ? p.vulnerabilityColor : undefined,
              }}
            >
              <span className="btn-persona-icon">{p.icon}</span>
              <div className="btn-persona-texts">
                <span className="btn-persona-name">{p.name}</span>
                <span
                  className="btn-persona-vuln"
                  style={{ color: p.vulnerabilityColor }}
                >
                  {p.vulnerabilityLevel} Vulnerability
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Persona Deep-Dive Card */}
      <div className="active-persona-card">
        <div className="active-persona-header">
          <div className="flex items-center gap-4">
            <div
              className="persona-big-icon"
              style={{ backgroundColor: `${persona.vulnerabilityColor}20` }}
            >
              <span>{persona.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="active-persona-title">{persona.name}</h3>
                <span
                  className="vuln-tag"
                  style={{
                    backgroundColor: `${persona.vulnerabilityColor}25`,
                    color: persona.vulnerabilityColor,
                    borderColor: `${persona.vulnerabilityColor}60`,
                  }}
                >
                  {persona.vulnerabilityLevel} Risk
                </span>
              </div>
              <p className="active-persona-tagline">{persona.tagline}</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="btn-generate-routine"
            >
              <Sparkles size={16} />
              <span>24h Defense Schedule</span>
            </button>
          </div>
        </div>

        <p className="persona-description-paragraph">{persona.description}</p>

        {/* Highlight Metrics Strip */}
        <div className="persona-metrics-strip">
          <div className="strip-tile">
            <div className="strip-icon-box text-rose-400">
              <Clock size={18} />
            </div>
            <div>
              <span className="strip-label">Max Outdoor Tolerance</span>
              <span className="strip-value text-rose-400">{safeMinutes} min / day</span>
              <span className="strip-hint">Under current AQI of {telemetry?.aqi || 200}</span>
            </div>
          </div>

          <div className="strip-tile">
            <div className="strip-icon-box text-cyan-400">
              <Award size={18} />
            </div>
            <div>
              <span className="strip-label">Certified Barrier Mask</span>
              <span className="strip-value text-cyan-300">{persona.recommendedMask}</span>
              <span className="strip-hint">Cloth / surgical masks fail &gt;70%</span>
            </div>
          </div>

          <div className="strip-tile">
            <div className="strip-icon-box text-emerald-400">
              <HeartPulse size={18} />
            </div>
            <div>
              <span className="strip-label">Indoor Target AQI</span>
              <span className="strip-value text-emerald-400">&lt; {persona.hepaTargetAqi} AQI</span>
              <span className="strip-hint">Via continuous HEPA/C-R air cleaner</span>
            </div>
          </div>
        </div>

        {/* Clinical Risks & Medical Advisory */}
        <div className="persona-two-col-grid">
          <div className="sub-card clinical-risks-card">
            <div className="sub-card-header">
              <AlertTriangle size={17} className="text-rose-400" />
              <h4>Physiological & Clinical Risks</h4>
            </div>
            <ul className="risks-list">
              {persona.clinicalRisks.map((risk, idx) => (
                <li key={idx} className="risk-item">
                  <span className="bullet-dot" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>

            <div className="medication-alert-box">
              <HeartPulse size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-300">Clinical Protocol:</span>
                <p className="text-sm text-zinc-300 mt-0.5">{persona.medicationCheck}</p>
              </div>
            </div>
          </div>

          {/* Actionable Do's & Don'ts */}
          <div className="sub-card dos-donts-card">
            <div className="sub-card-header">
              <ShieldAlert size={17} className="text-cyan-400" />
              <h4>Tailored Daily Protocol</h4>
            </div>

            <div className="dos-donts-container">
              {/* DOs */}
              <div className="dos-block">
                <span className="dos-title">
                  <CheckCircle size={15} className="text-emerald-400" /> Recommended Actions
                </span>
                <ul className="protocol-list">
                  {persona.dos.map((item, idx) => (
                    <li key={idx} className="do-item">
                      <span className="check-icon">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONTs */}
              <div className="donts-block">
                <span className="donts-title">
                  <XCircle size={15} className="text-rose-400" /> Critical Restrictions
                </span>
                <ul className="protocol-list">
                  {persona.donts.map((item, idx) => (
                    <li key={idx} className="dont-item">
                      <span className="x-icon">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
