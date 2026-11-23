import type { HourlyForecastItem } from '../types/index.ts'

export function formatTimeHour(hour24: number): string {
  const h = hour24 % 24
  const period = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 === 0 ? 12 : h % 12
  return `${displayHour}:00 ${period}`
}

export function formatDateReadable(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

/**
 * Finds the consecutive lowest-AQI block (typically 12 PM - 3 PM)
 */
export function identifyGoldenWindow(hourly: HourlyForecastItem[]): string {
  if (!hourly || hourly.length === 0) return '1:00 PM - 3:00 PM'

  // Look for daylight hours (11:00 to 16:00) when inversion layer has lifted
  const daylightHours = hourly.filter((h) => h.hour >= 11 && h.hour <= 16)
  if (daylightHours.length === 0) return '1:00 PM - 3:00 PM'

  let minHour = daylightHours[0]
  for (const h of daylightHours) {
    if (h.aqi < minHour.aqi) {
      minHour = h
    }
  }

  const startHour = minHour.hour
  const endHour = (startHour + 2) % 24
  return `${formatTimeHour(startHour)} - ${formatTimeHour(endHour)}`
}
