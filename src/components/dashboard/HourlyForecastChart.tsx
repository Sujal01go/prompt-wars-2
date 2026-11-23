import React, { useState } from 'react'
import { Clock, Sun, AlertOctagon, Info } from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import type { HourlyForecastItem } from '../../types/index.ts'

export const HourlyForecastChart: React.FC = () => {
  const { hourly } = useAero()
  const [selectedHour, setSelectedHour] = useState<HourlyForecastItem | null>(null)

  if (!hourly || hourly.length === 0) return null

  const activeHour = selectedHour || hourly[0]

  // Find max AQI in forecast to scale bars
  const maxForecastAqi = Math.max(...hourly.map((h) => h.aqi), 300)

  const getBarColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981'
    if (aqi <= 100) return '#f59e0b'
    if (aqi <= 150) return '#f97316'
    if (aqi <= 200) return '#ef4444'
    if (aqi <= 300) return '#a855f7'
    return '#881337'
  }

  return (
    <section className="hourly-forecast-section" aria-label="24-Hour Smog Forecast & Ventilation Windows">
      <div className="section-header-row">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-cyan-400" />
            <h3 className="section-title">24-Hour Atmospheric Forecast & Safe Windows</h3>
          </div>
          <p className="section-subtitle">
            Hourly predicted particulate density shaped by diurnal solar heating and night-time surface temperature inversions
          </p>
        </div>

        {/* Legend */}
        <div className="forecast-legend">
          <div className="legend-item">
            <span className="legend-badge golden-badge">
              <Sun size={12} /> Golden Window
            </span>
          </div>
          <div className="legend-item">
            <span className="legend-badge peak-badge">
              <AlertOctagon size={12} /> Smog Peak
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Bar Visualization Container */}
      <div className="hourly-bars-scroll">
        <div className="hourly-bars-track">
          {hourly.map((item, index) => {
            const heightPercent = Math.max(12, Math.min(100, (item.aqi / maxForecastAqi) * 100))
            const isSelected = activeHour?.time === item.time
            const barColor = getBarColor(item.aqi)

            return (
              <div
                key={`${item.time}-${index}`}
                onClick={() => setSelectedHour(item)}
                className={`hourly-bar-col ${isSelected ? 'bar-selected' : ''}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedHour(item)
                  }
                }}
                aria-label={`Time: ${item.time}, AQI: ${item.aqi}, PM2.5: ${item.pm25} ug/m3`}
              >
                {/* Special Window Indicators */}
                <div className="window-indicator-slot">
                  {item.isGoldenWindow && (
                    <span className="indicator-pill golden" title="Optimal Ventilation Window">
                      <Sun size={10} />
                    </span>
                  )}
                  {item.isSmogPeak && (
                    <span className="indicator-pill peak" title="Inversion Smog Peak">
                      ⚠️
                    </span>
                  )}
                </div>

                {/* AQI text on top of bar */}
                <span className="bar-aqi-value">{item.aqi}</span>

                {/* The Bar */}
                <div className="bar-visual-container">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>

                {/* Hour label */}
                <span className="bar-time-label">{item.time}</span>
                <span className="bar-pm-label">{item.pm25}µg</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Hour Insight Card */}
      {activeHour && (
        <div className="selected-hour-card">
          <div className="hour-card-header">
            <div className="hour-time-badge">
              <Clock size={16} />
              <span>{activeHour.time} Forecast Detail</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hour-aqi-badge" style={{ backgroundColor: getBarColor(activeHour.aqi) }}>
                AQI {activeHour.aqi} ({activeHour.category.toUpperCase()})
              </span>
              <span className="hour-pm-badge">
                PM2.5: {activeHour.pm25} µg/m³
              </span>
            </div>
          </div>

          <div className="hour-card-body">
            <div className="hour-guidance-box">
              <Info size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <p className="hour-guidance-text">
                {activeHour.guidance}
              </p>
            </div>
            {activeHour.isGoldenWindow && (
              <div className="golden-alert-box">
                <Sun size={16} className="text-amber-400" />
                <span>
                  <strong>Golden Window Advantage:</strong> Ground surface heating lifts stagnant particulate layer. Optimal window for 10-15 min cross-ventilation or essential outdoors.
                </span>
              </div>
            )}
            {activeHour.isSmogPeak && (
              <div className="peak-alert-box">
                <AlertOctagon size={16} className="text-rose-400" />
                <span>
                  <strong>High Stagnation Warning:</strong> Night/morning cold air inversion trap active. Keep all windows sealed, turn air cleaners to high speed, avoid outdoor movement.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
