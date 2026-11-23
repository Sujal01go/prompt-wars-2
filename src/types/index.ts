export type AqiCategory =
  | 'good'
  | 'moderate'
  | 'unhealthy-sensitive'
  | 'unhealthy'
  | 'very-unhealthy'
  | 'hazardous'

export type InversionRisk = 'low' | 'moderate' | 'severe' | 'extreme'

export interface PollutantDetail {
  code: string
  name: string
  value: number
  unit: string
  whoStandard: number
  whoExceedanceMultiple: number
  status: 'good' | 'moderate' | 'unhealthy' | 'hazardous'
  description: string
  healthRisk: string
  source: string
}

export interface AirQualityTelemetry {
  aqi: number
  europeanAqi: number
  category: AqiCategory
  categoryLabel: string
  categoryColor: string
  dominantPollutant: 'pm25' | 'pm10' | 'no2' | 'o3' | 'so2' | 'co'
  pm25: number
  pm10: number
  no2: number
  so2: number
  o3: number
  co: number
  dust: number
  ammonia: number
  pollutants: Record<string, PollutantDetail>
  temperature: number
  humidity: number
  windSpeed: number
  stagnationIndex: number // 0-100 where higher means trapping smog
  inversionRisk: InversionRisk
  timestamp: string
  isSimulatedFallback?: boolean
}

export interface HourlyForecastItem {
  time: string
  hour: number
  aqi: number
  pm25: number
  category: AqiCategory
  temperature: number
  isGoldenWindow: boolean // Best time to briefly ventilate / run errand
  isSmogPeak: boolean // Morning/night inversion peak
  guidance: string
}

export type PersonaId =
  | 'children'
  | 'elderly'
  | 'athlete'
  | 'respiratory'
  | 'pregnant'
  | 'commuter'

export interface PersonaProfile {
  id: PersonaId
  name: string
  tagline: string
  icon: string
  vulnerabilityLevel: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Critical'
  vulnerabilityColor: string
  description: string
  clinicalRisks: string[]
  recommendedMask: string
  maxOutdoorMinutes: number
  dos: string[]
  donts: string[]
  medicationCheck: string
  hepaTargetAqi: number
}

export interface HealthImpactMetrics {
  cigaretteEquivalent: number
  inhaledParticulateUg: number
  whoExceedanceMultiple: number
  cardioRiskMultiplier: number
  respiratoryInflammationScore: number // 1 to 10
  cleanAirDeficitHours: number
}

export interface EcoAction {
  id: string
  title: string
  category: 'transport' | 'household' | 'waste' | 'energy'
  co2SavedKg: number
  pmSavedGrams: number
  description: string
  impactLevel: 'Medium' | 'High' | 'Very High'
  completed: boolean
}

export interface CorsiRosenthalConfig {
  roomWidthFt: number
  roomLengthFt: number
  roomHeightFt: number
  fanCfm: number
  filterCount: 1 | 2 | 4 | 5
  mervRating: 13 | 14
}

export interface CorsiRosenthalResults {
  roomVolumeCuFt: number
  roomAreaSqFt: number
  estimatedCadr: number // Clean Air Delivery Rate (CFM)
  airChangesPerHour: number // ACH
  timeTo90ReductionMinutes: number
  diyBuildCostUsd: number
  commercialHePaCostUsd: number
  rating: 'Superior' | 'Optimal' | 'Adequate' | 'Underpowered'
  verdict: string
}

export type CommuteMode =
  | 'walk'
  | 'cycle'
  | 'two-wheeler'
  | 'auto-bus'
  | 'metro-train'
  | 'car-ac'

export interface CommuteAnalysis {
  distanceKm: number
  mode: CommuteMode
  modeLabel: string
  durationMinutes: number
  inhaledPm25Ug: number
  personalCo2Kg: number
  personalPmGrams: number
  ventilationFactor: number
  metroComparison: {
    inhaledReductionPct: number
    co2SavedKg: number
  }
  safetyScore: number // 0-100
  recommendations: string[]
}

export interface CityLocation {
  id: string
  name: string
  stateOrRegion: string
  country: string
  lat: number
  lon: number
  isSmogHotspot?: boolean
  notes?: string
}

export interface DailySmogRoutineStep {
  time: string
  period: 'Morning' | 'Midday' | 'Afternoon' | 'Evening' | 'Night'
  title: string
  locationType: 'indoor' | 'outdoor' | 'transit'
  maskRequired: boolean
  action: string
  guidance: string
}

export interface DailySmogRoutine {
  title: string
  date: string
  personaName: string
  city: string
  predictedAvgAqi: number
  goldenVentilationWindow: string
  steps: DailySmogRoutineStep[]
  iaqChecklist: string[]
  dietaryAntioxidants: string[]
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  suggestions?: string[]
  routineData?: DailySmogRoutine
}

export interface ToastMessage {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
}
