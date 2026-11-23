import React, { useState } from 'react'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'

export const PollutantGrid: React.FC = () => {
  const { telemetry } = useAero()
  const [expandedCode, setExpandedCode] = useState<string | null>(null)

  if (!telemetry || !telemetry.pollutants) return null

  const pollutants = Object.values(telemetry.pollutants)

  const toggleExpand = (code: string) => {
    setExpandedCode((prev) => (prev === code ? null : code))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hazardous':
        return <span className="badge-pollutant-hazardous">Hazardous</span>
      case 'unhealthy':
        return <span className="badge-pollutant-unhealthy">Unhealthy</span>
      case 'moderate':
        return <span className="badge-pollutant-moderate">Moderate</span>
      default:
        return <span className="badge-pollutant-good">Good</span>
    }
  }

  return (
    <section className="pollutant-grid-section" aria-label="Multi-Pollutant Telemetry">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">Multi-Pollutant Telemetry Analysis</h3>
          <p className="section-subtitle">
            Measured concentrations against World Health Organization (WHO 2021) safe 24-hour limits
          </p>
        </div>
        <div className="who-standard-note">
          <Info size={14} className="text-cyan-400" />
          <span>WHO PM2.5 Guideline = 15 µg/m³</span>
        </div>
      </div>

      <div className="pollutants-cards-grid">
        {pollutants.map((p) => {
          const isExpanded = expandedCode === p.code
          return (
            <div
              key={p.code}
              className={`pollutant-card card-${p.status}`}
              onClick={() => toggleExpand(p.code)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleExpand(p.code)
                }
              }}
              aria-expanded={isExpanded}
            >
              <div className="pollutant-card-header">
                <div className="pollutant-name-wrap">
                  <span className="pollutant-code">{p.code}</span>
                  <span className="pollutant-fullname">{p.name}</span>
                </div>
                {getStatusBadge(p.status)}
              </div>

              <div className="pollutant-value-row">
                <span className="pollutant-numeric-val">{p.value}</span>
                <span className="pollutant-unit-val">{p.unit}</span>
              </div>

              <div className="pollutant-standard-bar">
                <div className="standard-info">
                  <span>WHO Standard: {p.whoStandard} {p.unit}</span>
                  <span className="multiplier-text">
                    {p.whoExceedanceMultiple > 1 ? (
                      <strong>{p.whoExceedanceMultiple}x WHO Limit</strong>
                    ) : (
                      'Within WHO Limit'
                    )}
                  </span>
                </div>
                {/* Visual Progress relative to standard */}
                <div className="exceedance-bar-bg">
                  <div
                    className="exceedance-bar-fill"
                    style={{
                      width: `${Math.min(100, (p.value / (p.whoStandard * 3)) * 100)}%`,
                      backgroundColor:
                        p.status === 'hazardous'
                          ? '#881337'
                          : p.status === 'unhealthy'
                          ? '#ef4444'
                          : p.status === 'moderate'
                          ? '#f59e0b'
                          : '#10b981',
                    }}
                  />
                </div>
              </div>

              <p className="pollutant-short-desc">{p.description}</p>

              {/* Expand/Collapse Accordion Details */}
              <div className="expand-trigger">
                <span>{isExpanded ? 'Hide clinical risk details' : 'View health risks & sources'}</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {isExpanded && (
                <div className="pollutant-expanded-details" onClick={(e) => e.stopPropagation()}>
                  <div className="detail-row">
                    <span className="detail-tag">Clinical Risk:</span>
                    <p className="detail-content text-rose-300">{p.healthRisk}</p>
                  </div>
                  <div className="detail-row">
                    <span className="detail-tag">Primary Emission Source:</span>
                    <p className="detail-content text-zinc-300">{p.source}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
