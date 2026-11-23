import React from 'react'
import {
  Wrench,
  Zap,
  DollarSign,
  Clock,
  Layers,
  Lightbulb,
} from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'

export const CorsiRosenthalSimulator: React.FC = () => {
  const { corsiConfig, updateCorsiConfig, corsiResults } = useAero()

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCorsiConfig({ roomWidthFt: Number(e.target.value) || 10 })
  }

  const handleLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCorsiConfig({ roomLengthFt: Number(e.target.value) || 10 })
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCorsiConfig({ roomHeightFt: Number(e.target.value) || 8 })
  }

  const handleFanCfmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCorsiConfig({ fanCfm: Number(e.target.value) })
  }

  const handleFilterCount = (count: 1 | 2 | 4 | 5) => {
    updateCorsiConfig({ filterCount: count })
  }

  const handleMerv = (merv: 13 | 14) => {
    updateCorsiConfig({ mervRating: merv })
  }

  return (
    <div className="cr-simulator-card" aria-label="Corsi-Rosenthal Box Simulator">
      <div className="cr-header-row">
        <div>
          <div className="flex items-center gap-2">
            <Wrench size={22} className="text-amber-400" />
            <h3 className="cr-title">Corsi-Rosenthal DIY Air Purifier Simulator</h3>
          </div>
          <p className="cr-subtitle">
            Calculate real Clean Air Delivery Rate (CADR), room Air Changes Per Hour (ACH), and filtration physics based on UC Davis Air Quality Research Center benchmarks
          </p>
        </div>

        <div className="cr-rating-badge rating-superior">
          <span className="rating-tag">Rating: {corsiResults.rating}</span>
          <span className="rating-ach">{corsiResults.airChangesPerHour} ACH</span>
        </div>
      </div>

      <div className="cr-calculator-grid">
        {/* Left Inputs Column */}
        <div className="cr-inputs-col">
          <h4 className="input-group-title">1. Room Dimensions & Target Space</h4>

          <div className="inputs-3col">
            <div className="form-input-group">
              <label htmlFor="cr-width">Width (ft)</label>
              <input
                id="cr-width"
                type="number"
                min="6"
                max="60"
                value={corsiConfig.roomWidthFt}
                onChange={handleWidthChange}
                className="number-input"
              />
            </div>
            <div className="form-input-group">
              <label htmlFor="cr-length">Length (ft)</label>
              <input
                id="cr-length"
                type="number"
                min="6"
                max="60"
                value={corsiConfig.roomLengthFt}
                onChange={handleLengthChange}
                className="number-input"
              />
            </div>
            <div className="form-input-group">
              <label htmlFor="cr-height">Ceiling (ft)</label>
              <input
                id="cr-height"
                type="number"
                min="7"
                max="20"
                value={corsiConfig.roomHeightFt}
                onChange={handleHeightChange}
                className="number-input"
              />
            </div>
          </div>

          <div className="room-meta-pill">
            <span>Area: <strong>{corsiResults.roomAreaSqFt} sq ft</strong></span>
            <span>•</span>
            <span>Volume: <strong>{corsiResults.roomVolumeCuFt.toLocaleString()} cu ft</strong></span>
          </div>

          {/* Fan & Filter Config */}
          <h4 className="input-group-title mt-6">2. Fan & Filter Configuration</h4>

          <div className="form-input-group">
            <label htmlFor="cr-fan">Fan Airflow Baseline (Free CFM)</label>
            <select
              id="cr-fan"
              value={corsiConfig.fanCfm}
              onChange={handleFanCfmChange}
              className="select-input"
            >
              <option value={1000}>Standard 20" Box Fan - Low Speed (~1,000 CFM)</option>
              <option value={1400}>Standard 20" Box Fan - Medium Speed (~1,400 CFM)</option>
              <option value={1800}>Standard 20" Box Fan - High Speed (~1,800 CFM)</option>
              <option value={2200}>Industrial High-Velocity 20" Fan (~2,200 CFM)</option>
            </select>
          </div>

          <div className="form-input-group">
            <label>Filter Configuration Style</label>
            <div className="filter-count-buttons">
              <button
                type="button"
                onClick={() => handleFilterCount(1)}
                className={`filter-btn ${corsiConfig.filterCount === 1 ? 'active' : ''}`}
              >
                1 Filter (Direct Back)
              </button>
              <button
                type="button"
                onClick={() => handleFilterCount(2)}
                className={`filter-btn ${corsiConfig.filterCount === 2 ? 'active' : ''}`}
              >
                2 Filters (V-Wedge)
              </button>
              <button
                type="button"
                onClick={() => handleFilterCount(4)}
                className={`filter-btn ${corsiConfig.filterCount === 4 ? 'active' : ''}`}
              >
                4 Filters (Comparetto Cube)
              </button>
              <button
                type="button"
                onClick={() => handleFilterCount(5)}
                className={`filter-btn ${corsiConfig.filterCount === 5 ? 'active' : ''}`}
              >
                5 Filters (Cube + Bottom)
              </button>
            </div>
          </div>

          <div className="form-input-group">
            <label>Filter Efficiency Standard</label>
            <div className="filter-count-buttons">
              <button
                type="button"
                onClick={() => handleMerv(13)}
                className={`filter-btn ${corsiConfig.mervRating === 13 ? 'active' : ''}`}
              >
                MERV-13 (Captures &gt;75% PM2.5 • Lower Resistance)
              </button>
              <button
                type="button"
                onClick={() => handleMerv(14)}
                className={`filter-btn ${corsiConfig.mervRating === 14 ? 'active' : ''}`}
              >
                MERV-14 (Captures &gt;82% PM2.5 • Ultra-Clean)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output & Economics Column */}
        <div className="cr-output-col">
          <h4 className="output-group-title">Engineered Filtration Output</h4>

          <div className="cr-metrics-grid">
            <div className="cr-metric-card highlight-metric">
              <Zap className="metric-icon text-amber-400" size={20} />
              <span className="metric-title">Clean Air Delivery Rate (CADR)</span>
              <span className="metric-big-val">{corsiResults.estimatedCadr} CFM</span>
              <span className="metric-note">Equivalent to commercial $500 air purifiers</span>
            </div>

            <div className="cr-metric-card">
              <Layers className="metric-icon text-emerald-400" size={20} />
              <span className="metric-title">Air Changes Per Hour (ACH)</span>
              <span className="metric-big-val text-emerald-400">{corsiResults.airChangesPerHour} ACH</span>
              <span className="metric-note">Target: &ge; 4.0 ACH for winter smog</span>
            </div>

            <div className="cr-metric-card">
              <Clock className="metric-icon text-cyan-400" size={20} />
              <span className="metric-title">Time to 90% Smoke Clearance</span>
              <span className="metric-big-val text-cyan-400">{corsiResults.timeTo90ReductionMinutes} min</span>
              <span className="metric-note">Rapid particulate decay speed</span>
            </div>

            <div className="cr-metric-card">
              <DollarSign className="metric-icon text-purple-400" size={20} />
              <span className="metric-title">DIY vs Commercial Cost</span>
              <div className="cost-comparison-row">
                <span className="cost-diy">${corsiResults.diyBuildCostUsd} DIY</span>
                <span className="cost-vs">vs</span>
                <span className="cost-comm">${corsiResults.commercialHePaCostUsd} Store</span>
              </div>
              <span className="metric-note text-emerald-400 font-semibold">
                Saves ~${corsiResults.commercialHePaCostUsd - corsiResults.diyBuildCostUsd} per room!
              </span>
            </div>
          </div>

          <div className="cr-verdict-box">
            <span className="font-semibold text-amber-300">Engineering Verdict:</span>
            <p className="text-sm text-zinc-300 mt-1">{corsiResults.verdict}</p>
          </div>

          {/* The Famous Cardboard Shroud Tip */}
          <div className="shroud-tip-box">
            <Lightbulb size={20} className="text-amber-400 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-amber-300 text-sm">
                Pro-Tip: The "Cardboard Shroud" Secret
              </h5>
              <p className="text-xs text-zinc-300 mt-0.5">
                Box fans suffer from corner vortex back-draft. Cut a donut-shaped cardboard shroud covering the outer 1.5 inches of the fan face. This stops reverse airflow and increases your real CADR by up to <strong>25-30%</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
