import { describe, it, expect } from 'vitest'
import { formatTimeHour, formatDateReadable, identifyGoldenWindow } from '../utils/dateUtils.ts'
import type { HourlyForecastItem } from '../types/index.ts'

describe('dateUtils', () => {
  it('formats 24-hour integers into readable 12-hour strings', () => {
    expect(formatTimeHour(0)).toBe('12:00 AM')
    expect(formatTimeHour(9)).toBe('9:00 AM')
    expect(formatTimeHour(12)).toBe('12:00 PM')
    expect(formatTimeHour(15)).toBe('3:00 PM')
    expect(formatTimeHour(23)).toBe('11:00 PM')
  })

  it('formats ISO timestamps reliably', () => {
    const formatted = formatDateReadable('2026-11-23T14:30:00Z')
    expect(formatted).toBeDefined()
    expect(typeof formatted).toBe('string')
  })

  it('identifies the lowest AQI daylight window as the golden ventilation period', () => {
    const mockHourly: HourlyForecastItem[] = [
      { hour: 8, timeString: '8:00 AM', aqi: 310, pm25: 260, pm10: 380, tempC: 14, humidity: 80, inversionRisk: 'Severe', recommendedAction: 'Stay indoors' },
      { hour: 12, timeString: '12:00 PM', aqi: 180, pm25: 110, pm10: 200, tempC: 22, humidity: 55, inversionRisk: 'Moderate', recommendedAction: 'Ventilate' },
      { hour: 14, timeString: '2:00 PM', aqi: 130, pm25: 75, pm10: 140, tempC: 24, humidity: 48, inversionRisk: 'Low', recommendedAction: 'Ventilate' },
      { hour: 18, timeString: '6:00 PM', aqi: 290, pm25: 240, pm10: 350, tempC: 18, humidity: 70, inversionRisk: 'Severe', recommendedAction: 'Close windows' },
    ]

    const goldenWindow = identifyGoldenWindow(mockHourly)
    expect(goldenWindow).toContain('2:00 PM')
  })

  it('provides default fallback window when hourly data is empty', () => {
    expect(identifyGoldenWindow([])).toBe('1:00 PM - 3:00 PM')
  })
})
