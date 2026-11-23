import React, { useState } from 'react'
import {
  Cigarette,
  HeartPulse,
  AlertOctagon,
  Info,
} from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import { computeHealthImpactMetrics } from '../../utils/aqiCalculators.ts'

export const HealthImpactCard: React.FC = () => {
  const { telemetry, city } = useAero()
  const [outdoorHours, setOutdoorHours] = useState<number>(6)

  const pm25 = telemetry?.pm25 || 250
  const metrics = computeHealthImpactMetrics(pm25, outdoorHours)

  return (
    <div className="health-impact-card" aria-label="Health Impact & Cigarette Equivalent Analysis">
      <div className="impact-header-row">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse size={22} className="text-rose-400" />
            <h3 className="impact-title">Biological Health Impact & Toxic Inhalation</h3>
          </div>
          <p className="impact-subtitle">
            Quantifying alveolar particulate deposition and cardiovascular strain based on the Berkeley Earth air pollution equivalence model
          </p>
        </div>

        {/* Outdoor Hours Slider */}
        <div className="hours-slider-box">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">Daily Outdoor Exposure:</span>
            <strong className="text-cyan-400">{outdoorHours} hours</strong>
          </div>
          <input
            type="range"
            min="1"
            max="16"
            step="1"
            value={outdoorHours}
            onChange={(e) => setOutdoorHours(Number(e.target.value))}
            className="hours-slider"
          />
        </div>
      </div>

      <div className="impact-metrics-grid">
        {/* 1. Berkeley Earth Cigarette Meter */}
        <div className="impact-metric-box metric-cigarette">
          <div className="metric-box-header">
            <div className="metric-icon-wrap text-amber-400">
              <Cigarette size={22} />
            </div>
            <span className="box-badge">Berkeley Earth Model</span>
          </div>

          <div className="metric-body">
            <span className="metric-sublabel">Daily Cigarette Equivalent</span>
            <div className="flex items-baseline gap-2">
              <span className="metric-giant-number text-amber-400">
                ~{metrics.cigaretteEquivalent}
              </span>
              <span className="text-sm text-zinc-300">cigarettes / day</span>
            </div>
            <p className="metric-footnote">
              Inhaling {outdoorHours}h of {city.name}'s ambient air ({pm25} µg/m³ PM2.5) transfers equivalent toxic combustion byproduct mass into your alveolar capillaries as smoking {metrics.cigaretteEquivalent} cigarettes.
            </p>
          </div>
        </div>

        {/* 2. Inhaled Particulate Mass */}
        <div className="impact-metric-box metric-particulate">
          <div className="metric-box-header">
            <div className="metric-icon-wrap text-rose-400">
              <AlertOctagon size={22} />
            </div>
            <span className="box-badge">Deep Lung Intake</span>
          </div>

          <div className="metric-body">
            <span className="metric-sublabel">Total Inhaled PM2.5 Mass</span>
            <div className="flex items-baseline gap-2">
              <span className="metric-giant-number text-rose-400">
                {metrics.inhaledParticulateUg.toLocaleString()}
              </span>
              <span className="text-sm text-zinc-300">micrograms (µg)</span>
            </div>
            <p className="metric-footnote">
              Estimated fine soot mass retained in respiratory bronchioles and bloodstream at average adult ventilation rates.
            </p>
          </div>
        </div>

        {/* 3. Cardiovascular & Inflammatory Strain */}
        <div className="impact-metric-box metric-cardio">
          <div className="metric-box-header">
            <div className="metric-icon-wrap text-red-400">
              <HeartPulse size={22} />
            </div>
            <span className="box-badge">Vascular Endothelial Risk</span>
          </div>

          <div className="metric-body">
            <span className="metric-sublabel">Acute Cardio Event Multiplier</span>
            <div className="flex items-baseline gap-2">
              <span className="metric-giant-number text-red-400">
                {metrics.cardioRiskMultiplier}x
              </span>
              <span className="text-sm text-zinc-300">baseline vascular load</span>
            </div>
            <p className="metric-footnote">
              High particulate spikes stimulate systemic oxidative cytokines, causing rapid arterial vasoconstriction and elevated platelet aggregation.
            </p>
          </div>
        </div>

        {/* 4. WHO Guideline Exceedance */}
        <div className="impact-metric-box metric-who">
          <div className="metric-box-header">
            <div className="metric-icon-wrap text-purple-400">
              <Info size={22} />
            </div>
            <span className="box-badge">WHO 2021 Threshold</span>
          </div>

          <div className="metric-body">
            <span className="metric-sublabel">WHO Limit Multiplier</span>
            <div className="flex items-baseline gap-2">
              <span className="metric-giant-number text-purple-400">
                {metrics.whoExceedanceMultiple}x
              </span>
              <span className="text-sm text-zinc-300">above safety target</span>
            </div>
            <p className="metric-footnote">
              WHO recommends a maximum 24-hour PM2.5 limit of 15 µg/m³. {city.name}'s air currently exceeds this critical health threshold by {metrics.whoExceedanceMultiple} times.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
