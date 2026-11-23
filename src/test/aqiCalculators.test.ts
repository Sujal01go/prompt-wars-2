import { describe, it, expect } from 'vitest'
import {
  calculateAqiFromPm25,
  getAqiCategory,
  calculateCigaretteEquivalent,
  calculateInhaledParticulate,
  calculateWhoExceedance,
  calculateInversionRisk,
  computeHealthImpactMetrics,
} from '../utils/aqiCalculators.ts'

describe('Air Quality & Exposure Mathematical Models', () => {
  it('correctly maps PM2.5 to US EPA AQI breakpoints', () => {
    // 0 to 12.0 => Good (0-50)
    expect(calculateAqiFromPm25(6.0)).toBe(25)
    expect(calculateAqiFromPm25(12.0)).toBe(50)

    // 12.1 to 35.4 => Moderate (51-100)
    expect(calculateAqiFromPm25(25.0)).toBeGreaterThanOrEqual(51)
    expect(calculateAqiFromPm25(35.4)).toBe(100)

    // 55.5 to 150.4 => Unhealthy (151-200)
    expect(calculateAqiFromPm25(100.0)).toBeGreaterThan(150)

    // >250.5 => Hazardous (301-500)
    expect(calculateAqiFromPm25(300.0)).toBeGreaterThanOrEqual(301)
  })

  it('categorizes AQI correctly into health tiers', () => {
    expect(getAqiCategory(35).category).toBe('good')
    expect(getAqiCategory(85).category).toBe('moderate')
    expect(getAqiCategory(135).category).toBe('unhealthy-sensitive')
    expect(getAqiCategory(185).category).toBe('unhealthy')
    expect(getAqiCategory(260).category).toBe('very-unhealthy')
    expect(getAqiCategory(380).category).toBe('hazardous')
  })

  it('calculates Berkeley Earth cigarette equivalent accurately', () => {
    // 22 ug/m3 PM2.5 over 24h = ~1 cigarette
    const oneCig = calculateCigaretteEquivalent(22, 24)
    expect(oneCig).toBeCloseTo(1.0, 1)

    // 220 ug/m3 PM2.5 over 24h = ~10 cigarettes
    const tenCigs = calculateCigaretteEquivalent(220, 24)
    expect(tenCigs).toBeCloseTo(10.0, 1)

    // 220 ug/m3 PM2.5 for 12h = ~5 cigarettes
    const halfDay = calculateCigaretteEquivalent(220, 12)
    expect(halfDay).toBeCloseTo(5.0, 1)
  })

  it('computes inhaled particulate mass in micrograms', () => {
    // 100 ug/m3 * 2 hours * 0.8 m3/hr = 160 ug
    const intake = calculateInhaledParticulate(100, 2, 0.8)
    expect(intake).toBe(160)
  })

  it('computes WHO 2021 exceedance multiple (15 ug/m3 standard)', () => {
    expect(calculateWhoExceedance(15)).toBe(1.0)
    expect(calculateWhoExceedance(150)).toBe(10.0)
    expect(calculateWhoExceedance(300)).toBe(20.0)
  })

  it('identifies thermal inversion stagnation risk based on weather', () => {
    // Winter stagnation: low wind (<5 km/h), high humidity (>80%), cold temp
    const highRisk = calculateInversionRisk(10, 85, 3)
    expect(highRisk.stagnationIndex).toBeGreaterThanOrEqual(65)
    expect(['severe', 'extreme']).toContain(highRisk.inversionRisk)

    // Active dispersion: high wind (>20 km/h), low humidity
    const lowRisk = calculateInversionRisk(22, 35, 25)
    expect(lowRisk.inversionRisk).toBe('low')
  })

  it('assembles complete health impact metrics', () => {
    const metrics = computeHealthImpactMetrics(200, 8)
    expect(metrics.cigaretteEquivalent).toBeGreaterThan(0)
    expect(metrics.inhaledParticulateUg).toBeGreaterThan(0)
    expect(metrics.whoExceedanceMultiple).toBeCloseTo(13.3, 1)
    expect(metrics.cardioRiskMultiplier).toBeGreaterThan(1.0)
    expect(metrics.respiratoryInflammationScore).toBeGreaterThanOrEqual(1)
  })
})
