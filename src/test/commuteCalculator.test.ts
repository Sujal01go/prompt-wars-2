import { describe, it, expect } from 'vitest'
import { analyzeCommute } from '../utils/commuteCalculator.ts'

describe('Commute Exposure & Emission Model', () => {
  const OUTDOOR_PM25 = 250 // Heavy winter smog

  it('proves Metro Rail dramatically minimizes inhaled PM2.5 compared to motorcycle or bicycle', () => {
    const bike = analyzeCommute(10, 'cycle', OUTDOOR_PM25)
    const twoWheeler = analyzeCommute(10, 'two-wheeler', OUTDOOR_PM25)
    const metro = analyzeCommute(10, 'metro-train', OUTDOOR_PM25)

    // Metro coach filtration yields far lower inhaled soot
    expect(metro.inhaledPm25Ug).toBeLessThan(bike.inhaledPm25Ug)
    expect(metro.inhaledPm25Ug).toBeLessThan(twoWheeler.inhaledPm25Ug)
    expect(metro.safetyScore).toBeGreaterThan(bike.safetyScore)
  })

  it('calculates carbon emissions savings for private car vs public transit', () => {
    const car = analyzeCommute(15, 'car-ac', OUTDOOR_PM25)
    const metro = analyzeCommute(15, 'metro-train', OUTDOOR_PM25)

    expect(car.personalCo2Kg).toBeGreaterThan(metro.personalCo2Kg)
    expect(car.metroComparison.co2SavedKg).toBeGreaterThan(1.0)
    expect(car.metroComparison.inhaledReductionPct).toBeGreaterThan(0)
  })

  it('provides actionable safety recommendations for selected transit mode', () => {
    const twoWheeler = analyzeCommute(8, 'two-wheeler', OUTDOOR_PM25)
    expect(twoWheeler.recommendations.some((r) => r.includes('mask') || r.includes('helmet') || r.includes('N95'))).toBe(true)
  })
})
