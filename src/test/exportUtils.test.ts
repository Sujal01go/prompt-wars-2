import { describe, it, expect, vi } from 'vitest'
import { formatRoutineMarkdown, exportTelemetryToCsv, downloadTextFile } from '../utils/exportUtils.ts'
import type { DailySmogRoutine, AirQualityTelemetry, PersonaProfile } from '../types/index.ts'

describe('exportUtils', () => {
  const mockPersona: PersonaProfile = {
    id: 'respiratory',
    name: 'Asthma & Respiratory Patient',
    badge: 'High Risk',
    vulnerabilityLevel: 'High',
    avatar: '🫁',
    tagline: 'Bronchial sensitivity shield',
    focusAdvice: 'Maintain peak expiratory flow triggers log',
    keyRisks: ['Airway inflammation', 'Bronchospasms'],
    maxSafeAqi: 75,
    maskRecommendedAtAqi: 80,
    dietaryTips: ['Turmeric curcumin', 'Warm herbal infusions'],
    indoorPurifierAcheTarget: 4.5,
  }

  const mockTelemetry: AirQualityTelemetry = {
    city: 'New Delhi',
    aqi: 320,
    categoryLabel: 'Hazardous',
    colorHex: '#7e0023',
    summary: 'Severe ground inversion trap',
    dominantPollutant: 'pm25',
    pm25: 280,
    pm10: 420,
    no2: 85,
    so2: 45,
    o3: 30,
    co: 2.8,
    temperature: 15,
    humidity: 78,
    windSpeed: 3.5,
    stagnationIndex: 88,
    inversionRisk: 'Severe',
    timestamp: '2026-11-23T08:00:00Z',
    pollutants: {},
  }

  const mockRoutine: DailySmogRoutine = {
    id: 'routine-1',
    date: '2026-11-23',
    city: 'New Delhi',
    personaId: 'respiratory',
    steps: [
      {
        time: '07:00 AM',
        period: 'morning',
        locationType: 'indoor',
        action: 'Seal windows and engage HEPA',
        guidance: 'Morning thermal inversion traps vehicular exhaust',
        maskRequired: false,
        title: 'Morning Smog Defense',
      },
    ],
    goldenVentilationWindow: '1:00 PM - 3:00 PM',
    iaqChecklist: ['Ensure HEPA seals', 'Check filter pressure'],
    dietaryAntioxidants: ['Ginger tea', 'Vitamin C'],
  }

  it('formats comprehensive markdown reports with persona and telemetry', () => {
    const md = formatRoutineMarkdown(mockRoutine, mockPersona, mockTelemetry)
    expect(md).toContain('AeroPulse AI — Daily Smog Defense Protocol')
    expect(md).toContain('Asthma & Respiratory Patient')
    expect(md).toContain('Hazardous')
    expect(md).toContain('1:00 PM - 3:00 PM')
    expect(md).toContain('Seal windows and engage HEPA')
  })

  it('generates CSV content and triggers simulated browser download', () => {
    const mockClick = vi.fn()
    const mockAppend = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any)
    const mockRemove = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any)

    // Mock HTMLAnchorElement click
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(mockClick)

    exportTelemetryToCsv(mockTelemetry, 'New Delhi')
    expect(mockClick).toHaveBeenCalled()

    mockAppend.mockRestore()
    mockRemove.mockRestore()
  })

  it('triggers text file download with custom mime types', () => {
    const mockClick = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(mockClick)

    downloadTextFile('sample.md', '# Sample Test', 'text/markdown')
    expect(mockClick).toHaveBeenCalled()
  })
})
