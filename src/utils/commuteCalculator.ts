import type { CommuteMode, CommuteAnalysis } from '../types/index.ts'

interface ModeParameters {
  label: string
  speedKmH: number
  ventilationRateM3Hr: number // Respiratory rate
  cabinFiltrationFactor: number // Multiplier on outdoor PM2.5 (1.0 = full exposure, 0.2 = 80% filtered)
  co2GramsPerKm: number
  pmGramsPerKm: number // Personal vehicle emission contribution
}

const COMMUTE_MODES: Record<CommuteMode, ModeParameters> = {
  walk: {
    label: 'Walking (Pedestrian)',
    speedKmH: 4.5,
    ventilationRateM3Hr: 1.6,
    cabinFiltrationFactor: 1.0,
    co2GramsPerKm: 0,
    pmGramsPerKm: 0,
  },
  cycle: {
    label: 'Bicycle / E-Bike',
    speedKmH: 15.0,
    ventilationRateM3Hr: 2.8, // Heavy lung ventilation
    cabinFiltrationFactor: 1.0,
    co2GramsPerKm: 0,
    pmGramsPerKm: 0,
  },
  'two-wheeler': {
    label: 'Motorcycle / Scooter',
    speedKmH: 28.0,
    ventilationRateM3Hr: 1.2,
    cabinFiltrationFactor: 1.15, // Direct exposure to tailpipes in stop-and-go traffic
    co2GramsPerKm: 45,
    pmGramsPerKm: 0.08,
  },
  'auto-bus': {
    label: 'Auto-Rickshaw / Non-AC Bus',
    speedKmH: 20.0,
    ventilationRateM3Hr: 0.9,
    cabinFiltrationFactor: 0.95,
    co2GramsPerKm: 55,
    pmGramsPerKm: 0.05,
  },
  'metro-train': {
    label: 'Metro Rail / Filtered Electric Train',
    speedKmH: 35.0,
    ventilationRateM3Hr: 0.6,
    cabinFiltrationFactor: 0.22, // Sealed cars with industrial air conditioning filters
    co2GramsPerKm: 12,
    pmGramsPerKm: 0.002,
  },
  'car-ac': {
    label: 'Private Car (AC Cabin Recirculation)',
    speedKmH: 26.0,
    ventilationRateM3Hr: 0.55,
    cabinFiltrationFactor: 0.35, // Cabin filter + recirc
    co2GramsPerKm: 165,
    pmGramsPerKm: 0.12,
  },
}

export function analyzeCommute(
  distanceKm: number,
  mode: CommuteMode,
  outdoorPm25: number
): CommuteAnalysis {
  const dist = Math.max(0.5, distanceKm)
  const params = COMMUTE_MODES[mode]

  const durationHours = dist / params.speedKmH
  const durationMinutes = Math.round(durationHours * 60)

  // Inhaled particulate: (outdoorPm25 * filtrationFactor) * (ventilationRate * durationHours)
  const effectiveAirPm25 = outdoorPm25 * params.cabinFiltrationFactor
  const inhaledPm25Ug = Math.round(
    effectiveAirPm25 * (params.ventilationRateM3Hr * durationHours)
  )

  // Emissions generated
  const personalCo2Kg = Number(
    ((params.co2GramsPerKm * dist) / 1000).toFixed(2)
  )
  const personalPmGrams = Number(
    (params.pmGramsPerKm * dist).toFixed(3)
  )

  // Compare with Metro (the benchmark clean urban transit)
  const metroParams = COMMUTE_MODES['metro-train']
  const metroDurationHours = dist / metroParams.speedKmH
  const metroInhaledUg = Math.round(
    outdoorPm25 *
      metroParams.cabinFiltrationFactor *
      (metroParams.ventilationRateM3Hr * metroDurationHours)
  )
  const metroCo2Kg = (metroParams.co2GramsPerKm * dist) / 1000

  const inhaledReductionPct =
    inhaledPm25Ug > 0
      ? Math.max(
          0,
          Math.min(
            95,
            Math.round(((inhaledPm25Ug - metroInhaledUg) / inhaledPm25Ug) * 100)
          )
        )
      : 0

  const co2SavedKg = Number(Math.max(0, personalCo2Kg - metroCo2Kg).toFixed(2))

  // Safety score out of 100 (lower inhalation = higher score)
  let safetyScore = 100 - Math.min(90, Math.round(inhaledPm25Ug / 3.5))
  if (safetyScore < 10) safetyScore = 10

  const recommendations: string[] = []
  if (mode === 'cycle' || mode === 'walk') {
    recommendations.push(
      'Deep breathing during exercise pulls particles deep into alveoli. Always wear an N95/FFP2 mask with a tight nose clip.'
    )
    if (outdoorPm25 > 150) {
      recommendations.push(
        'Hazardous smog advisory: Switch this trip to Metro Rail or reschedule outside rush hours.'
      )
    }
  } else if (mode === 'two-wheeler') {
    recommendations.push(
      'Two-wheeler riders sit right in the vehicular diesel tailpipe stream. Use a certified valveless N95 mask under your full-face helmet.'
    )
    recommendations.push(
      'Avoid idling behind heavy trucks or outdated diesel buses at traffic intersections.'
    )
  } else if (mode === 'car-ac') {
    recommendations.push(
      'Turn Air-Conditioner mode strictly to "Air Recirculation" to prevent pulling smog directly through exterior vents.'
    )
    recommendations.push(
      'Consider carpooling or switching to Metro to avoid adding 165g of CO2 and toxic exhaust to neighborhood air.'
    )
  } else if (mode === 'metro-train') {
    recommendations.push(
      'Best urban choice: Metro coaches feature continuous HVAC filtration, reducing pollutant exposure by up to ~78%.'
    )
  }

  return {
    distanceKm: dist,
    mode,
    modeLabel: params.label,
    durationMinutes,
    inhaledPm25Ug,
    personalCo2Kg,
    personalPmGrams,
    ventilationFactor: params.ventilationRateM3Hr,
    metroComparison: {
      inhaledReductionPct,
      co2SavedKg,
    },
    safetyScore,
    recommendations,
  }
}
