import { describe, it, expect } from 'vitest'
import { PRESET_CITIES } from '../services/airQualityApi.ts'
import { PERSONA_PROFILES } from '../services/personaData.ts'

describe('AeroPulse Smoke Tests', () => {
  it('should initialize preset cities with valid coordinates and smog hotspot flags', () => {
    expect(PRESET_CITIES.length).toBeGreaterThanOrEqual(8)
    const delhi = PRESET_CITIES.find((c) => c.id === 'delhi')
    expect(delhi).toBeDefined()
    expect(delhi?.isSmogHotspot).toBe(true)
    expect(delhi?.lat).toBeCloseTo(28.6139, 2)
  })

  it('should load all 6 clinical vulnerable personas with required guidance', () => {
    const keys = Object.keys(PERSONA_PROFILES)
    expect(keys).toHaveLength(6)
    expect(keys).toContain('children')
    expect(keys).toContain('elderly')
    expect(keys).toContain('athlete')
    expect(keys).toContain('respiratory')
    expect(keys).toContain('pregnant')
    expect(keys).toContain('commuter')

    for (const key of keys) {
      const p = PERSONA_PROFILES[key as keyof typeof PERSONA_PROFILES]
      expect(p.name).toBeTruthy()
      expect(p.clinicalRisks.length).toBeGreaterThan(0)
      expect(p.dos.length).toBeGreaterThan(0)
      expect(p.donts.length).toBeGreaterThan(0)
      expect(p.recommendedMask).toBeTruthy()
    }
  })
})
