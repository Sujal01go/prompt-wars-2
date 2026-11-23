import React, { useState } from 'react'
import {
  Wind,
  CheckCircle2,
  XCircle,
  Sun,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import { identifyGoldenWindow } from '../../utils/dateUtils.ts'

interface NasaPlant {
  name: string
  botanicalName: string
  efficiency: string
  targetVoc: string
  placement: string
  nightOxygen: boolean
  tip: string
}

const NASA_PLANTS: NasaPlant[] = [
  {
    name: 'Snake Plant (Mother-in-Law’s Tongue)',
    botanicalName: 'Sansevieria trifasciata',
    efficiency: 'Exceptional (5/5)',
    targetVoc: 'Benzene, Formaldehyde, Trichloroethylene, Xylene',
    placement: 'Bedroom (Ideal near headboard)',
    nightOxygen: true,
    tip: 'One of the few plants that performs Crassulacean Acid Metabolism (CAM), converting CO2 into clean oxygen during the night while you sleep.',
  },
  {
    name: 'Areca Palm (Chrysalidocarpus)',
    botanicalName: 'Dypsis lutescens',
    efficiency: 'Superior (5/5)',
    targetVoc: 'Toluene, Acetone, Xylene, Formaldehyde',
    placement: 'Living Room / Main Corridor',
    nightOxygen: false,
    tip: 'Acts as a natural room humidifier, releasing ~1 liter of pure clean water vapor per day, which naturally weighs down suspended indoor PM2.5.',
  },
  {
    name: 'Peace Lily',
    botanicalName: 'Spathiphyllum',
    efficiency: 'High (4.5/5)',
    targetVoc: 'Ammonia, Benzene, Trichloroethylene, Mold Spores',
    placement: 'Bathrooms & Hallways (Indirect light)',
    nightOxygen: false,
    tip: 'NASA study demonstrated a 60% reduction in airborne mold spores and microbial VOCs.',
  },
  {
    name: 'Spider Plant',
    botanicalName: 'Chlorophytum comosum',
    efficiency: 'High (4/5)',
    targetVoc: 'Carbon Monoxide (CO), Formaldehyde, Ethylbenzene',
    placement: 'Kitchen & Children’s Rooms (Pet-safe)',
    nightOxygen: false,
    tip: 'Extremely resilient; filters up to 95% of toxic carbon monoxide and formaldehyde in test chambers within 24 hours.',
  },
]

export const WindowVentilationGuide: React.FC = () => {
  const { telemetry, hourly } = useAero()
  const [selectedPlant, setSelectedPlant] = useState<NasaPlant | null>(NASA_PLANTS[0])

  const goldenWindow = identifyGoldenWindow(hourly)
  const isSevere = telemetry ? telemetry.aqi >= 200 : true

  return (
    <div className="iaq-guides-view" aria-label="Indoor Air Quality Guidance">
      {/* 1. Smart Window Ventilation Schedule */}
      <div className="ventilation-guide-card">
        <div className="guide-card-header">
          <div className="flex items-center gap-2">
            <Wind size={20} className="text-cyan-400" />
            <h3 className="guide-title">Smart Window Ventilation & Purge Schedule</h3>
          </div>
          <span className="golden-window-pill">
            <Sun size={14} className="text-amber-400" />
            Golden Window: {goldenWindow}
          </span>
        </div>

        <div className="ventilation-rules-grid">
          <div className={`rule-box ${isSevere ? 'border-rose-500/40 bg-rose-500/10' : 'border-emerald-500/40 bg-emerald-500/10'}`}>
            <div className="rule-header">
              {isSevere ? (
                <XCircle className="text-rose-400" size={20} />
              ) : (
                <CheckCircle2 className="text-emerald-400" size={20} />
              )}
              <h4 className="font-bold text-base">
                {isSevere ? 'Hermetic Seal Required (Most of Day)' : 'Standard Ventilation Permitted'}
              </h4>
            </div>
            <p className="text-sm text-zinc-300 mt-2">
              Outdoor PM2.5 is currently elevated ({telemetry?.pm25 || 250} µg/m³). Keep all exterior windows and patio doors firmly shut. Use draft excluders or moist towels along exterior door gaps.
            </p>
          </div>

          <div className="rule-box border-amber-500/40 bg-amber-500/10">
            <div className="rule-header">
              <Sun className="text-amber-400" size={20} />
              <h4 className="font-bold text-base">The "15-Minute Midday Purge" Protocol</h4>
            </div>
            <p className="text-sm text-zinc-300 mt-2">
              Between <strong>{goldenWindow}</strong>, when solar radiation warms the surface and temporarily lifts the inversion cap, open two opposing windows for exactly <strong>10 to 15 minutes</strong> to purge accumulated indoor CO2, then re-seal and run air cleaners on High.
            </p>
          </div>
        </div>
      </div>

      {/* 2. NASA Clean Air Bio-Filter Plants Hub */}
      <div className="nasa-plants-card">
        <div className="plants-header">
          <div>
            <span className="badge-nasa">NASA Clean Air Study Reference</span>
            <h3 className="guide-title mt-1">Indoor Air Bio-Filter Botanical Allies</h3>
            <p className="text-xs text-zinc-400">
              NASA demonstrated that specific plant root-microbiome ecologies absorb volatile organic compounds (VOCs) and regulate humidity.
            </p>
          </div>
        </div>

        <div className="plants-tabs-grid">
          {NASA_PLANTS.map((plant) => {
            const isSelected = selectedPlant?.name === plant.name
            return (
              <button
                key={plant.name}
                type="button"
                onClick={() => setSelectedPlant(plant)}
                className={`plant-tab-btn ${isSelected ? 'plant-selected' : ''}`}
              >
                <span className="plant-name">{plant.name}</span>
                <span className="plant-botanical">{plant.botanicalName}</span>
                <span className="plant-eff-badge">{plant.efficiency}</span>
              </button>
            )
          })}
        </div>

        {selectedPlant && (
          <div className="selected-plant-details">
            <div className="plant-details-grid">
              <div className="detail-item">
                <span className="detail-label">Target Toxicants & VOCs</span>
                <span className="detail-val text-amber-300">{selectedPlant.targetVoc}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Optimal Room Placement</span>
                <span className="detail-val text-cyan-300">{selectedPlant.placement}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Nighttime CAM Oxygen Release</span>
                <span className={`detail-val ${selectedPlant.nightOxygen ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                  {selectedPlant.nightOxygen ? '✓ Yes (Absorbs CO2 at night)' : 'Daytime only'}
                </span>
              </div>
            </div>
            <div className="plant-tip-box">
              <span className="text-xs font-semibold text-emerald-400">Botanical Impact:</span>
              <p className="text-sm text-zinc-200 mt-1">{selectedPlant.tip}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Mask Barrier & Pressure Seal Test Guide */}
      <div className="mask-guide-card">
        <div className="guide-card-header">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-emerald-400" />
            <h3 className="guide-title">Respirator Efficacy Matrix & DIY Seal Check</h3>
          </div>
        </div>

        <div className="mask-table-wrapper">
          <table className="mask-comparison-table">
            <thead>
              <tr>
                <th>Mask Standard</th>
                <th>PM2.5 Filtration Efficiency</th>
                <th>Inward Facial Leakage</th>
                <th>Winter Smog Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-recommended">
                <td>
                  <strong>NIOSH N95 / FFP2 / FFP3</strong>
                </td>
                <td className="text-emerald-400 font-bold">&gt; 95% – 99%</td>
                <td className="text-emerald-400 font-bold">&lt; 8% (Snug Headstraps)</td>
                <td>
                  <span className="pill-badge pill-gold">Gold Standard for Smog</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>KF94 / KN95 (Ear-loop)</strong>
                </td>
                <td className="text-cyan-400 font-bold">~ 94% – 95%</td>
                <td className="text-amber-400 font-bold">~ 12% – 18% (Check ear fit)</td>
                <td>
                  <span className="pill-badge pill-good">Good with tight ear toggles</span>
                </td>
              </tr>
              <tr className="row-insufficient">
                <td>
                  <strong>Surgical / Blue Paper Mask</strong>
                </td>
                <td className="text-rose-400 font-bold">~ 30% – 45%</td>
                <td className="text-rose-400 font-bold">&gt; 65% (Gaps around cheeks)</td>
                <td>
                  <span className="pill-badge pill-poor">Insufficient for PM2.5</span>
                </td>
              </tr>
              <tr className="row-insufficient">
                <td>
                  <strong>Cloth Scarf / Bandana</strong>
                </td>
                <td className="text-rose-400 font-bold">&lt; 15%</td>
                <td className="text-rose-400 font-bold">&gt; 85%</td>
                <td>
                  <span className="pill-badge pill-danger">Zero particulate defense</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* The 10-Second Negative Pressure Seal Test */}
        <div className="seal-test-box">
          <HelpCircle size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-cyan-300 text-sm">
              How to perform the 10-Second Negative Pressure Seal Check:
            </h5>
            <ol className="text-xs text-zinc-300 mt-1 list-decimal list-inside space-y-1">
              <li>Place respirator cups firmly over nose and mouth; pinch the metallic nose bridge with both index fingers.</li>
              <li>Cup both hands gently over the front of the mask without displacing it.</li>
              <li>Inhale sharply: the mask body should slightly collapse inward towards your face.</li>
              <li>If air leaks along your nose bridge or cheeks, re-tighten straps and re-contour the nose wire until no leaks are felt.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
