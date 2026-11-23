import { describe, it, expect } from 'vitest'
import {
  generateOfflineHeuristicRoutine,
  generateOfflineHeuristicAnswer,
} from '../services/geminiService.ts'
import { PERSONA_PROFILES } from '../services/personaData.ts'
import type { AirQualityTelemetry, HourlyForecastItem } from '../types/index.ts'

const mockTelemetry: AirQualityTelemetry = {
  aqi: 285,
  europeanAqi: 85,
  category: 'very-unhealthy',
  categoryLabel: 'Very Unhealthy (Health Alert)',
  categoryColor: '#a855f7',
  dominantPollutant: 'pm25',
  pm25: 235.4,
  pm10: 380.0,
  no2: 85.0,
  so2: 32.0,
  o3: 65.0,
  co: 5.2,
  dust: 120.0,
  ammonia: 14.0,
  pollutants: {},
  temperature: 13,
  humidity: 82,
  windSpeed: 3.2,
  stagnationIndex: 85,
  inversionRisk: 'extreme',
  timestamp: new Date().toISOString(),
}

const mockHourly: HourlyForecastItem[] = [
  {
    time: '13:00',
    hour: 13,
    aqi: 180,
    pm25: 110,
    category: 'unhealthy',
    temperature: 18,
    isGoldenWindow: true,
    isSmogPeak: false,
    guidance: 'Golden Window',
  },
]

describe('Dual-Engine GenAI Service Tests', () => {
  it('synthesizes structured 24h smog routine with hour-by-hour steps offline', () => {
    const persona = PERSONA_PROFILES.children
    const routine = generateOfflineHeuristicRoutine(persona, mockTelemetry, mockHourly, 'New Delhi')

    expect(routine.title).toContain('Children')
    expect(routine.steps.length).toBeGreaterThanOrEqual(5)
    expect(routine.iaqChecklist.length).toBeGreaterThanOrEqual(3)
    expect(routine.dietaryAntioxidants.length).toBeGreaterThanOrEqual(3)
    expect(routine.goldenVentilationWindow).toBeTruthy()
  })

  it('answers purifier inquiries with Corsi-Rosenthal specifications', () => {
    const persona = PERSONA_PROFILES.respiratory
    const res = generateOfflineHeuristicAnswer(
      'How to build a Corsi-Rosenthal box purifier?',
      persona,
      mockTelemetry,
      mockHourly,
      'New Delhi'
    )

    expect(res.source).toBe('offline-heuristic')
    expect(res.text).toContain('Corsi-Rosenthal')
    expect(res.text).toContain('MERV-13')
    expect(res.text).toContain('Cardboard Shroud')
  })

  it('answers exercise questions with clinical minute-ventilation guidance', () => {
    const persona = PERSONA_PROFILES.athlete
    const res = generateOfflineHeuristicAnswer(
      'Can I go for an outdoor run today?',
      persona,
      mockTelemetry,
      mockHourly,
      'New Delhi'
    )

    expect(res.text).toContain('CANCELLED')
    expect(res.text).toContain('minute ventilation')
  })
})
