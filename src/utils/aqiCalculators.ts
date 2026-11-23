import type {
  AqiCategory,
  InversionRisk,
  HealthImpactMetrics,
  PollutantDetail,
} from '../types/index.ts'

/**
 * US EPA Breakpoints for PM2.5 (ug/m3 -> AQI)
 */
const PM25_BREAKPOINTS = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
  { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
]

/**
 * Calculates US AQI given PM2.5 concentration in ug/m3.
 */
export function calculateAqiFromPm25(pm25: number): number {
  const conc = Math.max(0, pm25)
  if (conc > 500.4) {
    return Math.min(500, Math.round(500 + (conc - 500.4) * 0.2))
  }

  for (const bp of PM25_BREAKPOINTS) {
    if (conc >= bp.cLow && conc <= bp.cHigh) {
      const aqi =
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (conc - bp.cLow) + bp.iLow
      return Math.round(aqi)
    }
  }

  return 500
}

/**
 * Returns Category descriptor from AQI
 */
export function getAqiCategory(aqi: number): {
  category: AqiCategory
  label: string
  color: string
  bgColor: string
  borderColor: string
} {
  if (aqi <= 50) {
    return {
      category: 'good',
      label: 'Good (Air is Clean)',
      color: '#10b981', // green
      bgColor: 'rgba(16, 185, 129, 0.12)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
    }
  }
  if (aqi <= 100) {
    return {
      category: 'moderate',
      label: 'Moderate (Acceptable)',
      color: '#f59e0b', // amber
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
    }
  }
  if (aqi <= 150) {
    return {
      category: 'unhealthy-sensitive',
      label: 'Unhealthy for Sensitive Groups',
      color: '#f97316', // orange
      bgColor: 'rgba(249, 115, 22, 0.12)',
      borderColor: 'rgba(249, 115, 22, 0.3)',
    }
  }
  if (aqi <= 200) {
    return {
      category: 'unhealthy',
      label: 'Unhealthy (General Public)',
      color: '#ef4444', // red
      bgColor: 'rgba(239, 68, 68, 0.14)',
      borderColor: 'rgba(239, 68, 68, 0.35)',
    }
  }
  if (aqi <= 300) {
    return {
      category: 'very-unhealthy',
      label: 'Very Unhealthy (Health Alert)',
      color: '#a855f7', // purple
      bgColor: 'rgba(168, 85, 247, 0.15)',
      borderColor: 'rgba(168, 85, 247, 0.35)',
    }
  }
  return {
    category: 'hazardous',
    label: 'Hazardous (Emergency Warning)',
    color: '#881337', // maroon / deep crimson
    bgColor: 'rgba(136, 19, 55, 0.2)',
    borderColor: 'rgba(225, 29, 72, 0.45)',
  }
}

/**
 * Berkeley Earth Cigarette Equivalence
 * Rule of thumb: 1 cigarette per day is roughly equivalent to 22 ug/m3 PM2.5 over 24 hours.
 * If exposure hours < 24, scales by hours / 24.
 */
export function calculateCigaretteEquivalent(
  pm25: number,
  hoursOutdoor = 24
): number {
  if (pm25 <= 0) return 0
  const dailyTotal = pm25 / 22.0
  const adjusted = dailyTotal * (Math.min(24, Math.max(0.5, hoursOutdoor)) / 24.0)
  return Number(adjusted.toFixed(1))
}

/**
 * Calculates mass of PM2.5 inhaled into deep bronchial and alveolar airways (ug)
 * Normal resting ventilation: ~0.5 m3/hr.
 * Active walking: ~1.2 m3/hr.
 * Heavy exertion: ~3.0 m3/hr.
 */
export function calculateInhaledParticulate(
  pm25: number,
  hours: number,
  ventilationRateM3PerHr = 0.8
): number {
  const intake = pm25 * hours * ventilationRateM3PerHr
  return Math.round(intake)
}

/**
 * WHO 2021 Guideline for 24-hour PM2.5 is 15 ug/m3.
 */
export const WHO_PM25_24HR_STANDARD = 15

export function calculateWhoExceedance(pm25: number): number {
  const multiple = pm25 / WHO_PM25_24HR_STANDARD
  return Number(multiple.toFixed(1))
}

/**
 * Atmospheric Stagnation & Winter Smog Inversion Index (0-100)
 * Low wind (< 8 km/h), high humidity (> 65%), and cooler temp promote cold air pooling and smog trapping.
 */
export function calculateInversionRisk(
  temperature: number,
  humidity: number,
  windSpeed: number
): {
  stagnationIndex: number
  inversionRisk: InversionRisk
  description: string
} {
  let score = 50

  // Wind speed factor (strong wind disperses smog; calm air locks it)
  if (windSpeed < 5) score += 30
  else if (windSpeed < 10) score += 15
  else if (windSpeed > 20) score -= 30
  else if (windSpeed > 15) score -= 15

  // Humidity factor (fog droplets condense with soot/SO2 forming toxic acidic smog)
  if (humidity > 80) score += 20
  else if (humidity > 65) score += 10
  else if (humidity < 40) score -= 10

  // Winter temperature factor (cold surface air below warm inversion cap)
  if (temperature < 15 && temperature > 3) score += 10

  const stagnationIndex = Math.min(100, Math.max(5, score))

  let inversionRisk: InversionRisk = 'low'
  let description = 'Atmospheric mixing active; low smog trapping risk.'

  if (stagnationIndex >= 80) {
    inversionRisk = 'extreme'
    description =
      'Severe thermal inversion layer cap active: airborne pollutants trapped close to ground level with near-zero dispersion.'
  } else if (stagnationIndex >= 65) {
    inversionRisk = 'severe'
    description =
      'Significant winter boundary layer stagnation. Fine particulates accumulating rapidly.'
  } else if (stagnationIndex >= 45) {
    inversionRisk = 'moderate'
    description =
      'Moderate air stagnation; slow horizontal dispersion of vehicular and industrial emissions.'
  }

  return {
    stagnationIndex,
    inversionRisk,
    description,
  }
}

/**
 * Calculates complete Health Impact Metrics
 */
export function computeHealthImpactMetrics(
  pm25: number,
  outdoorHours = 6
): HealthImpactMetrics {
  const cigaretteEquivalent = calculateCigaretteEquivalent(pm25, outdoorHours)
  const inhaledParticulateUg = calculateInhaledParticulate(pm25, outdoorHours)
  const whoExceedanceMultiple = calculateWhoExceedance(pm25)

  // Cardio risk multiplier: elevated relative risk for acute ischemic events
  const cardioMultiplier = Number((1.0 + (pm25 / 100) * 0.28).toFixed(2))

  // Respiratory inflammation index (scale 1 to 10)
  const lungScore = Math.min(
    10,
    Math.max(1, Math.round(1 + (pm25 / 250) * 8.5))
  )

  const cleanAirDeficitHours = Math.round(outdoorHours * (pm25 > 35 ? 1.4 : 0.5))

  return {
    cigaretteEquivalent,
    inhaledParticulateUg,
    whoExceedanceMultiple,
    cardioRiskMultiplier: cardioMultiplier,
    respiratoryInflammationScore: lungScore,
    cleanAirDeficitHours,
  }
}

/**
 * Builds standard pollutant card details
 */
export function buildPollutantMap(raw: {
  pm25: number
  pm10: number
  no2: number
  so2: number
  o3: number
  co: number
  dust?: number
}): Record<string, PollutantDetail> {
  const pm25Val = Number(raw.pm25.toFixed(1))
  const pm10Val = Number(raw.pm10.toFixed(1))
  const no2Val = Number(raw.no2.toFixed(1))
  const so2Val = Number(raw.so2.toFixed(1))
  const o3Val = Number(raw.o3.toFixed(1))
  const coVal = Number(raw.co.toFixed(1))

  return {
    pm25: {
      code: 'PM2.5',
      name: 'Fine Particulate Matter',
      value: pm25Val,
      unit: 'µg/m³',
      whoStandard: 15,
      whoExceedanceMultiple: calculateWhoExceedance(pm25Val),
      status: pm25Val > 150 ? 'hazardous' : pm25Val > 55 ? 'unhealthy' : pm25Val > 35 ? 'moderate' : 'good',
      description: 'Particles <2.5 micrometers in diameter. Penetrates deep into alveoli and bloodstream.',
      healthRisk: 'Cardiovascular disease, systemic inflammation, chronic obstructive pulmonary disease (COPD).',
      source: 'Vehicle combustion, stubble burning, coal-fired power plants, industrial boilers.',
    },
    pm10: {
      code: 'PM10',
      name: 'Coarse Inhalable Dust',
      value: pm10Val,
      unit: 'µg/m³',
      whoStandard: 45,
      whoExceedanceMultiple: Number((pm10Val / 45).toFixed(1)),
      status: pm10Val > 250 ? 'hazardous' : pm10Val > 150 ? 'unhealthy' : pm10Val > 50 ? 'moderate' : 'good',
      description: 'Inhalable dust, pollen, and debris under 10 micrometers.',
      healthRisk: 'Upper respiratory irritation, sinus congestion, exacerbation of allergic bronchitis.',
      source: 'Road dust, construction sites, unpaved surfaces, windblown soil.',
    },
    no2: {
      code: 'NO₂',
      name: 'Nitrogen Dioxide',
      value: no2Val,
      unit: 'µg/m³',
      whoStandard: 25,
      whoExceedanceMultiple: Number((no2Val / 25).toFixed(1)),
      status: no2Val > 100 ? 'unhealthy' : no2Val > 50 ? 'moderate' : 'good',
      description: 'Toxic reddish-brown gas formed during high-temperature fuel combustion.',
      healthRisk: 'Airway hyper-responsiveness, asthma attacks, reduced immune resistance to lung infections.',
      source: 'Diesel engines, internal combustion cars, gas thermal power generation.',
    },
    o3: {
      code: 'O₃',
      name: 'Ground-Level Ozone',
      value: o3Val,
      unit: 'µg/m³',
      whoStandard: 100,
      whoExceedanceMultiple: Number((o3Val / 100).toFixed(1)),
      status: o3Val > 180 ? 'hazardous' : o3Val > 120 ? 'unhealthy' : o3Val > 80 ? 'moderate' : 'good',
      description: 'Secondary photochemical pollutant formed by sunlight reacting with NOx and VOCs.',
      healthRisk: 'Sharp chest pain, lung tissue scarring, reduced vital lung capacity in outdoor athletes.',
      source: 'Sunlight photochemical reaction on automotive exhaust on sunny days.',
    },
    so2: {
      code: 'SO₂',
      name: 'Sulfur Dioxide',
      value: so2Val,
      unit: 'µg/m³',
      whoStandard: 40,
      whoExceedanceMultiple: Number((so2Val / 40).toFixed(1)),
      status: so2Val > 120 ? 'hazardous' : so2Val > 50 ? 'unhealthy' : 'good',
      description: 'Pungent acidic gas that turns into airborne sulfate aerosol and acid smog.',
      healthRisk: 'Reflex bronchoconstriction within minutes of inhalation, eye and throat burning.',
      source: 'Coal burning, petroleum refineries, heavy sulfur oil fuels.',
    },
    co: {
      code: 'CO',
      name: 'Carbon Monoxide',
      value: coVal,
      unit: 'mg/m³',
      whoStandard: 4,
      whoExceedanceMultiple: Number((coVal / 4).toFixed(1)),
      status: coVal > 15 ? 'hazardous' : coVal > 9 ? 'unhealthy' : 'good',
      description: 'Colorless, odorless gas that binds tightly to hemoglobin, blocking oxygen delivery.',
      healthRisk: 'Headache, dizziness, oxygen deprivation, angina triggers in cardiac patients.',
      source: 'Incomplete combustion in congested traffic bottlenecks and unvented heaters.',
    },
  }
}
