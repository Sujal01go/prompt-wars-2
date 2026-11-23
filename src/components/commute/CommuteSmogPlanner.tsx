import React, { useState } from 'react'
import {
  Navigation,
  Train,
  Car,
  Footprints,
  Bike,
  ShieldCheck,
  Leaf,
  ArrowRight,
} from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import { analyzeCommute } from '../../utils/commuteCalculator.ts'
import type { CommuteMode } from '../../types/index.ts'

export const CommuteSmogPlanner: React.FC = () => {
  const { telemetry } = useAero()
  const [distanceKm, setDistanceKm] = useState<number>(12)
  const [mode, setMode] = useState<CommuteMode>('two-wheeler')

  const outdoorPm25 = telemetry?.pm25 || 220
  const analysis = analyzeCommute(distanceKm, mode, outdoorPm25)

  const modesList: Array<{ id: CommuteMode; label: string; icon: React.ReactNode }> = [
    { id: 'walk', label: 'Walk', icon: <Footprints size={18} /> },
    { id: 'cycle', label: 'Bicycle / E-Bike', icon: <Bike size={18} /> },
    { id: 'two-wheeler', label: 'Two-Wheeler', icon: <Navigation size={18} /> },
    { id: 'auto-bus', label: 'Auto / Bus', icon: <Navigation size={18} /> },
    { id: 'metro-train', label: 'Metro Rail', icon: <Train size={18} /> },
    { id: 'car-ac', label: 'Private AC Car', icon: <Car size={18} /> },
  ]

  return (
    <div className="commute-planner-card" aria-label="Low-Emission Commute Smog Planner">
      <div className="commute-header">
        <div>
          <div className="flex items-center gap-2">
            <Train size={22} className="text-cyan-400" />
            <h3 className="commute-title">Low-Emission Commute & Exposure Optimizer</h3>
          </div>
          <p className="commute-subtitle">
            Calculate personal particulate inhalation, vehicular exhaust exposure, and carbon footprint across urban transit modalities
          </p>
        </div>

        <div className="commute-safety-score">
          <span className="score-label">Route Safety Score</span>
          <span
            className="score-val"
            style={{
              color:
                analysis.safetyScore >= 70
                  ? '#10b981'
                  : analysis.safetyScore >= 40
                  ? '#f59e0b'
                  : '#ef4444',
            }}
          >
            {analysis.safetyScore}/100
          </span>
        </div>
      </div>

      <div className="commute-grid">
        {/* Controls Column */}
        <div className="commute-controls-col">
          <h4 className="controls-heading">1. Select Commute Distance</h4>
          <div className="distance-slider-wrap">
            <div className="slider-header">
              <span>One-Way Trip Distance:</span>
              <strong className="text-cyan-400 text-lg">{distanceKm} km</strong>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="distance-range-slider"
            />
            <div className="slider-ticks">
              <span>1 km</span>
              <span>15 km</span>
              <span>30 km</span>
              <span>50 km</span>
            </div>
          </div>

          <h4 className="controls-heading mt-6">2. Select Transport Mode</h4>
          <div className="mode-selector-grid">
            {modesList.map((m) => {
              const isSelected = mode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`mode-btn ${isSelected ? 'mode-active' : ''}`}
                >
                  <span className="mode-icon">{m.icon}</span>
                  <span className="mode-name">{m.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Results & Exposure Column */}
        <div className="commute-results-col">
          <h4 className="controls-heading">Estimated Exposure & Emissions</h4>

          <div className="commute-metrics-row">
            <div className="commute-metric-card">
              <span className="commute-metric-label">Estimated Transit Time</span>
              <span className="commute-metric-val">{analysis.durationMinutes} min</span>
              <span className="commute-metric-sub">Average urban velocity</span>
            </div>

            <div className="commute-metric-card">
              <span className="commute-metric-label">PM2.5 Inhaled into Lungs</span>
              <span className="commute-metric-val text-rose-400">{analysis.inhaledPm25Ug} µg</span>
              <span className="commute-metric-sub">Effective inhaled mass</span>
            </div>

            <div className="commute-metric-card">
              <span className="commute-metric-label">Personal Trip CO₂</span>
              <span className="commute-metric-val text-amber-400">{analysis.personalCo2Kg} kg</span>
              <span className="commute-metric-sub">Direct vehicle emissions</span>
            </div>
          </div>

          {/* Clean Transit Comparison Banner (vs Metro) */}
          {mode !== 'metro-train' ? (
            <div className="metro-comparison-card">
              <div className="comparison-icon-wrap">
                <Leaf size={24} className="text-emerald-400" />
              </div>
              <div className="comparison-content">
                <h5 className="font-bold text-emerald-300 text-sm">
                  Cleaner Choice: Switch this {distanceKm}km trip to Metro Rail
                </h5>
                <p className="text-xs text-zinc-200 mt-1">
                  Air-conditioned metro cars feature continuous industrial particulate filtration:
                </p>
                <div className="comparison-pills-row">
                  <span className="comparison-pill text-emerald-400">
                    ↓ {analysis.metroComparison.inhaledReductionPct}% less PM2.5 inhaled
                  </span>
                  <span className="comparison-pill text-cyan-400">
                    ↓ {analysis.metroComparison.co2SavedKg} kg CO₂ saved
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="metro-comparison-card border-emerald-500/40 bg-emerald-500/10">
              <div className="comparison-icon-wrap">
                <ShieldCheck size={24} className="text-emerald-400" />
              </div>
              <div className="comparison-content">
                <h5 className="font-bold text-emerald-300 text-sm">
                  Optimal Urban Transit Mode Active!
                </h5>
                <p className="text-xs text-zinc-200 mt-1">
                  By taking the Metro Rail, you are inhaling ~78% less particulate soot than street cyclists or drivers and generating near-zero direct tailpipe emissions.
                </p>
              </div>
            </div>
          )}

          {/* Mode Recommendations */}
          <div className="mode-recommendations-box">
            <h5 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
              Route Safety Advisories for {analysis.modeLabel}:
            </h5>
            <ul className="space-y-1.5">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <ArrowRight size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
