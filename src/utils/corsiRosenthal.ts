import type {
  CorsiRosenthalConfig,
  CorsiRosenthalResults,
} from '../types/index.ts'

/**
 * Calculates Clean Air Delivery Rate (CADR), Air Changes Per Hour (ACH),
 * and particle clearance times based on Corsi-Rosenthal design principles.
 * References: UC Davis Air Quality Research Center & EPA Indoor Environments Division.
 */
export function calculateCorsiRosenthal(
  config: CorsiRosenthalConfig
): CorsiRosenthalResults {
  const roomAreaSqFt = Math.max(20, config.roomWidthFt * config.roomLengthFt)
  const roomVolumeCuFt = roomAreaSqFt * Math.max(6, config.roomHeightFt)

  // Fan flow rate baseline (typically 1000 - 1800 CFM free air flow)
  const fanRatedCfm = Math.max(300, config.fanCfm)

  // Filter surface area factor & pressure drop multiplier
  // 4-filter and 5-filter boxes dramatically reduce face velocity and filter resistance
  let filterSurfaceMultiplier = 0.55 // 1 filter (high resistance)
  if (config.filterCount === 2) filterSurfaceMultiplier = 0.72 // Wedge / V-bank
  else if (config.filterCount === 4) filterSurfaceMultiplier = 0.88 // Standard 4-box cube
  else if (config.filterCount === 5) filterSurfaceMultiplier = 0.94 // 5-filter cube with shroud

  // MERV-13 vs MERV-14 single-pass collection efficiency for submicron particles (0.3 - 1.0 um)
  const singlePassEfficiency = config.mervRating === 14 ? 0.82 : 0.75

  // Clean Air Delivery Rate: CADR = Q_airflow * E_singlepass
  const effectiveAirflowCfm = fanRatedCfm * filterSurfaceMultiplier
  const estimatedCadr = Math.round(effectiveAirflowCfm * singlePassEfficiency)

  // Air Changes Per Hour (ACH) = (CADR * 60) / Room Volume (cu ft)
  const achRaw = (estimatedCadr * 60) / roomVolumeCuFt
  const airChangesPerHour = Number(achRaw.toFixed(1))

  // Time to achieve 90% particle reduction in well-mixed room:
  // C(t) = C0 * exp(-ACH * t), 90% reduction occurs when exp(-ACH * t) = 0.10 => t = ln(10) / ACH hours
  // In minutes: (2.3026 / ACH) * 60
  const minutesTo90 =
    airChangesPerHour > 0
      ? Math.round((2.302585 / airChangesPerHour) * 60)
      : 999

  // DIY Material Cost Estimation
  // Box fan: ~$22, MERV-13 filters: ~$9-$11 each, Duct tape / shroud: ~$6
  const fanCost = 25
  const filterUnitCost = config.mervRating === 14 ? 14 : 9.5
  const tapeAndCardboardCost = 6
  const diyBuildCostUsd = Math.round(
    fanCost + config.filterCount * filterUnitCost + tapeAndCardboardCost
  )

  // Commercial equivalent cost for same CADR (e.g. 450-550 CADR HEPA units like Blueair / Coway Airmega cost $350 - $650)
  const commercialHePaCostUsd = Math.round(
    Math.max(180, (estimatedCadr / 100) * 85 + 75)
  )

  let rating: CorsiRosenthalResults['rating'] = 'Adequate'
  let verdict = ''

  if (airChangesPerHour >= 6.0) {
    rating = 'Superior'
    verdict = `Outstanding protection (${airChangesPerHour} ACH). Well above clinical and CDC wildfire/smog threshold. Room particles drop by 90% in only ${minutesTo90} minutes!`
  } else if (airChangesPerHour >= 4.0) {
    rating = 'Optimal'
    verdict = `Optimal clean air turnover (${airChangesPerHour} ACH). Meets CDC wildfire smoke mitigation standard for residential rooms.`
  } else if (airChangesPerHour >= 2.5) {
    rating = 'Adequate'
    verdict = `Adequate baseline filtration (${airChangesPerHour} ACH). Recommended to run continuously on High fan speed during winter smog spikes.`
  } else {
    rating = 'Underpowered'
    verdict = `Underpowered for this room volume (${airChangesPerHour} ACH). Consider adding a 2nd box fan unit or upgrading to a 4-filter cube configuration.`
  }

  return {
    roomVolumeCuFt,
    roomAreaSqFt,
    estimatedCadr,
    airChangesPerHour,
    timeTo90ReductionMinutes: minutesTo90,
    diyBuildCostUsd,
    commercialHePaCostUsd,
    rating,
    verdict,
  }
}
