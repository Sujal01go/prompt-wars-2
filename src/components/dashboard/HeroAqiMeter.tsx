import React from 'react'
import {
  Download,
  AlertTriangle,
  Flame,
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  Sparkles,
} from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import { exportTelemetryToCsv } from '../../utils/exportUtils.ts'

export const HeroAqiMeter: React.FC = () => {
  const { telemetry, city, persona, setIsCopilotOpen, setIsExportModalOpen } = useAero()

  if (!telemetry) {
    return (
      <div className="telemetry-loading-card">
        <div className="spinner-large" />
        <p>Connecting to air telemetry stations for {city.name}...</p>
      </div>
    )
  }

  // Calculate circular gauge offset (0 to 500 max scale)
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const maxScale = 500
  const normalizedAqi = Math.min(500, Math.max(0, telemetry.aqi))
  // We use 75% of the circle arc (270 degrees)
  const arcLength = circumference * 0.75
  const strokeOffset = arcLength - (normalizedAqi / maxScale) * arcLength

  return (
    <section className="hero-meter-card" aria-label="Real-time Air Quality Status">
      <div className="hero-meter-grid">
        {/* Left: Animated Circular Gauge */}
        <div className="gauge-column">
          <div className="circular-gauge-wrapper">
            <svg
              className="gauge-svg"
              viewBox="0 0 220 220"
              role="img"
              aria-label={`Current US AQI is ${telemetry.aqi}, classified as ${telemetry.categoryLabel}`}
            >
              {/* Background Arc */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="gauge-bg-arc"
                strokeWidth="16"
                strokeDasharray={`${arcLength} ${circumference}`}
                transform="rotate(135 110 110)"
              />
              {/* Value Colored Arc */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="gauge-value-arc"
                stroke={telemetry.categoryColor}
                strokeWidth="16"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                transform="rotate(135 110 110)"
              />
            </svg>

            {/* Centered Numbers */}
            <div className="gauge-center-text">
              <span className="aqi-number" style={{ color: telemetry.categoryColor }}>
                {telemetry.aqi}
              </span>
              <span className="aqi-unit-label">US AQI</span>
              <span
                className="aqi-status-pill"
                style={{
                  backgroundColor: `${telemetry.categoryColor}25`,
                  color: telemetry.categoryColor,
                  border: `1px solid ${telemetry.categoryColor}50`,
                }}
              >
                {telemetry.category.toUpperCase().replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="gauge-scale-ticks">
            <span>0 Good</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>500+ Haz</span>
          </div>
        </div>

        {/* Center: Atmospheric Inversion & Dominant Pollutant */}
        <div className="summary-column">
          <div className="summary-header">
            <span className="station-badge">
              Station Telemetry • {city.name}
            </span>
            {telemetry.isSimulatedFallback && (
              <span className="offline-badge" title="High fidelity seasonal model">
                Local Baseline Mode
              </span>
            )}
          </div>

          <h2 className="summary-title" style={{ color: telemetry.categoryColor }}>
            {telemetry.categoryLabel}
          </h2>

          {/* Winter Inversion Stagnation Banner */}
          <div
            className={`inversion-banner inversion-${telemetry.inversionRisk}`}
          >
            <div className="inversion-icon-wrap">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="inversion-title">
                {telemetry.inversionRisk === 'extreme' || telemetry.inversionRisk === 'severe'
                  ? 'Severe Winter Smog Inversion Cap Active'
                  : 'Atmospheric Boundary Layer Status'}
              </h4>
              <p className="inversion-desc">
                Stagnation Index: <strong>{telemetry.stagnationIndex}/100</strong>. Cold ground-level air is trapped by a warm upper inversion layer, concentrating vehicular and industrial soot at lung level.
              </p>
            </div>
          </div>

          {/* Dominant Pollutant Highlight */}
          <div className="dominant-pollutant-box">
            <div className="dominant-info">
              <Flame size={18} className="text-rose-400" />
              <span>
                Dominant Toxicant: <strong>PM2.5 Fine Particulates</strong> (
                {telemetry.pm25} µg/m³)
              </span>
            </div>
            <span className="who-multiplier">
              {telemetry.pollutants.pm25?.whoExceedanceMultiple || 1}x WHO Safe Limit
            </span>
          </div>

          {/* Action Buttons */}
          <div className="hero-action-buttons">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="btn-primary-action"
            >
              <Sparkles size={16} />
              <span>View 24h Defense Protocol</span>
            </button>
            <button
              onClick={() => exportTelemetryToCsv(telemetry, city.name)}
              className="btn-secondary-action"
              title="Download full pollutant telemetry in CSV format"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="btn-tertiary-action"
            >
              <span>Ask AI About {persona.name} Risk</span>
            </button>
          </div>
        </div>

        {/* Right: Weather & Atmospheric Metrics */}
        <div className="weather-column">
          <h3 className="weather-column-title">Atmospheric Context</h3>

          <div className="weather-metric-tile">
            <div className="metric-icon-box text-cyan-400">
              <Thermometer size={18} />
            </div>
            <div className="metric-details">
              <span className="metric-label">Ambient Temperature</span>
              <span className="metric-value">{telemetry.temperature}°C</span>
              <span className="metric-sub">Cold surface air promotes inversion</span>
            </div>
          </div>

          <div className="weather-metric-tile">
            <div className="metric-icon-box text-blue-400">
              <Droplets size={18} />
            </div>
            <div className="metric-details">
              <span className="metric-label">Relative Humidity</span>
              <span className="metric-value">{telemetry.humidity}%</span>
              <span className="metric-sub">
                {telemetry.humidity > 70 ? 'High fog-droplet soot bonding' : 'Moderate ambient humidity'}
              </span>
            </div>
          </div>

          <div className="weather-metric-tile">
            <div className="metric-icon-box text-teal-400">
              <Wind size={18} />
            </div>
            <div className="metric-details">
              <span className="metric-label">Surface Wind Speed</span>
              <span className="metric-value">{telemetry.windSpeed} km/h</span>
              <span className="metric-sub">
                {telemetry.windSpeed < 5 ? 'Calm air • Near-zero horizontal dispersion' : 'Light breeze dispersing smog'}
              </span>
            </div>
          </div>

          <div className="weather-metric-tile">
            <div className="metric-icon-box text-purple-400">
              <Gauge size={18} />
            </div>
            <div className="metric-details">
              <span className="metric-label">European CAQI</span>
              <span className="metric-value">{telemetry.europeanAqi}</span>
              <span className="metric-sub">Common Air Quality Index</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
