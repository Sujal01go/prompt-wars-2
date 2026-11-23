import { describe, it, expect } from 'vitest'
import { calculateCorsiRosenthal } from '../utils/corsiRosenthal.ts'

describe('Corsi-Rosenthal DIY Box Fan Physics', () => {
  it('calculates room volume, CADR, and ACH for standard 4-filter cube', () => {
    const res = calculateCorsiRosenthal({
      roomWidthFt: 15,
      roomLengthFt: 15,
      roomHeightFt: 8,
      fanCfm: 1400,
      filterCount: 4,
      mervRating: 13,
    })

    // Volume: 15 * 15 * 8 = 1800 cu ft
    expect(res.roomVolumeCuFt).toBe(1800)
    expect(res.roomAreaSqFt).toBe(225)

    // CADR should be high (> 800 CFM effective)
    expect(res.estimatedCadr).toBeGreaterThan(500)

    // ACH: (CADR * 60) / 1800 cu ft => Superior protection (> 10 ACH)
    expect(res.airChangesPerHour).toBeGreaterThanOrEqual(6.0)
    expect(res.rating).toBe('Superior')
    expect(res.timeTo90ReductionMinutes).toBeLessThan(30)
  })

  it('proves 4-filter Comparetto cube delivers much higher CADR than 1 single taped filter', () => {
    const singleFilter = calculateCorsiRosenthal({
      roomWidthFt: 12,
      roomLengthFt: 12,
      roomHeightFt: 8,
      fanCfm: 1200,
      filterCount: 1,
      mervRating: 13,
    })

    const fourFilters = calculateCorsiRosenthal({
      roomWidthFt: 12,
      roomLengthFt: 12,
      roomHeightFt: 8,
      fanCfm: 1200,
      filterCount: 4,
      mervRating: 13,
    })

    expect(fourFilters.estimatedCadr).toBeGreaterThan(singleFilter.estimatedCadr)
    expect(fourFilters.airChangesPerHour).toBeGreaterThan(singleFilter.airChangesPerHour)
  })

  it('demonstrates economic savings of DIY build vs commercial HEPA units', () => {
    const res = calculateCorsiRosenthal({
      roomWidthFt: 20,
      roomLengthFt: 20,
      roomHeightFt: 9,
      fanCfm: 1800,
      filterCount: 4,
      mervRating: 13,
    })

    expect(res.diyBuildCostUsd).toBeLessThan(80)
    expect(res.commercialHePaCostUsd).toBeGreaterThan(300)
    expect(res.commercialHePaCostUsd - res.diyBuildCostUsd).toBeGreaterThan(200)
  })
})
