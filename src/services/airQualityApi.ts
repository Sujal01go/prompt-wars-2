import type {
  AirQualityTelemetry,
  HourlyForecastItem,
  CityLocation,
} from '../types/index.ts'
import {
  calculateAqiFromPm25,
  getAqiCategory,
  calculateInversionRisk,
  buildPollutantMap,
} from '../utils/aqiCalculators.ts'

export const PRESET_CITIES: CityLocation[] = [
  {
    id: 'delhi',
    name: 'New Delhi',
    stateOrRegion: 'National Capital Region',
    country: 'India',
    lat: 28.6139,
    lon: 77.209,
    isSmogHotspot: true,
    notes: 'Severe winter thermal inversion & agricultural stubble haze epicenter',
  },
  {
    id: 'lahore',
    name: 'Lahore',
    stateOrRegion: 'Punjab',
    country: 'Pakistan',
    lat: 31.5204,
    lon: 74.3587,
    isSmogHotspot: true,
    notes: 'Winter anti-cyclonic smog trap with high industrial and vehicular density',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    lat: 19.076,
    lon: 72.8777,
    isSmogHotspot: true,
    notes: 'Coastal dust entrapment and construction suspended particulate',
  },
  {
    id: 'beijing',
    name: 'Beijing',
    stateOrRegion: 'Jingjinji',
    country: 'China',
    lat: 39.9042,
    lon: 116.4074,
    isSmogHotspot: true,
    notes: 'Surrounded by mountain ranges causing classic thermal inversion pooling',
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    stateOrRegion: 'Central',
    country: 'Thailand',
    lat: 13.7563,
    lon: 100.5018,
    isSmogHotspot: true,
    notes: 'Seasonal agricultural haze and calm microclimate stagnation',
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    stateOrRegion: 'Java',
    country: 'Indonesia',
    lat: -6.2088,
    lon: 106.8456,
    isSmogHotspot: true,
    notes: 'Intense metropolitan traffic congestion and coal power plume influence',
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    stateOrRegion: 'California',
    country: 'United States',
    lat: 34.0522,
    lon: -118.2437,
    notes: 'South Coast basin prone to marine inversion layer and photochemical ozone',
  },
  {
    id: 'london',
    name: 'London',
    stateOrRegion: 'Greater London',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    notes: 'Low emission zone (ULEZ) reference urban air baseline',
  },
]

interface CacheEntry {
  data: {
    telemetry: AirQualityTelemetry
    hourly: HourlyForecastItem[]
  }
  timestamp: number
}

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes cache
const memoryCache = new Map<string, CacheEntry>()

/**
 * Generates realistic fallback telemetry for offline or network-failure cases.
 */
function generateRealisticFallback(city: CityLocation): {
  telemetry: AirQualityTelemetry
  hourly: HourlyForecastItem[]
} {
  // Realistic base values depending on city profile
  const isHotspot = !!city.isSmogHotspot
  const basePm25 = isHotspot ? (city.id === 'delhi' ? 295 : city.id === 'lahore' ? 320 : 185) : 32
  const basePm10 = basePm25 * 1.65
  const baseNo2 = isHotspot ? 78 : 28
  const baseSo2 = isHotspot ? 24 : 8
  const baseO3 = isHotspot ? 62 : 45
  const baseCo = isHotspot ? 4.8 : 0.8
  const temp = isHotspot ? 14 : 18
  const humidity = isHotspot ? 78 : 62
  const wind = isHotspot ? 3.5 : 12

  const aqi = calculateAqiFromPm25(basePm25)
  const cat = getAqiCategory(aqi)
  const inversion = calculateInversionRisk(temp, humidity, wind)

  const pollutants = buildPollutantMap({
    pm25: basePm25,
    pm10: basePm10,
    no2: baseNo2,
    so2: baseSo2,
    o3: baseO3,
    co: baseCo,
    dust: basePm10 * 0.4,
  })

  const telemetry: AirQualityTelemetry = {
    aqi,
    europeanAqi: Math.min(100, Math.round(basePm25 * 0.45)),
    category: cat.category,
    categoryLabel: cat.label,
    categoryColor: cat.color,
    dominantPollutant: 'pm25',
    pm25: basePm25,
    pm10: Math.round(basePm10),
    no2: baseNo2,
    so2: baseSo2,
    o3: baseO3,
    co: baseCo,
    dust: Math.round(basePm10 * 0.4),
    ammonia: 12,
    pollutants,
    temperature: temp,
    humidity,
    windSpeed: wind,
    stagnationIndex: inversion.stagnationIndex,
    inversionRisk: inversion.inversionRisk,
    timestamp: new Date().toISOString(),
    isSimulatedFallback: true,
  }

  // Generate 24-hr hourly profile
  const hourly: HourlyForecastItem[] = []
  const currentHour = new Date().getHours()

  for (let i = 0; i < 24; i++) {
    const h = (currentHour + i) % 24
    // Night/early morning (23 to 08) has peak inversion
    const isPeak = h >= 22 || h <= 9
    // Midday (12 to 16) has best vertical air mixing
    const isGolden = h >= 12 && h <= 15
    const variance = isPeak ? 1.3 : isGolden ? 0.65 : 0.95
    const hourPm25 = Math.round(basePm25 * variance)
    const hourAqi = calculateAqiFromPm25(hourPm25)
    const hourCat = getAqiCategory(hourAqi)

    hourly.push({
      time: `${h.toString().padStart(2, '0')}:00`,
      hour: h,
      aqi: hourAqi,
      pm25: hourPm25,
      category: hourCat.category,
      temperature: Math.round(temp + (isGolden ? 6 : -3)),
      isGoldenWindow: isGolden,
      isSmogPeak: isPeak,
      guidance: isGolden
        ? 'Golden Window: Inversion cap weakened. Best brief ventilation window.'
        : isPeak
        ? 'Smog Peak: Thermal inversion holding trapped pollutants. Stay indoors with air cleaners.'
        : 'Moderate dispersion. Minimize prolonged outdoor exertion.',
    })
  }

  return { telemetry, hourly }
}

/**
 * Fetches Live Air Quality & Weather Telemetry from Open-Meteo Free APIs
 */
export async function fetchAirQualityData(
  city: CityLocation
): Promise<{ telemetry: AirQualityTelemetry; hourly: HourlyForecastItem[] }> {
  const cacheKey = `${city.lat.toFixed(2)}_${city.lon.toFixed(2)}`
  const cached = memoryCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6500)

    // Open-Meteo Air Quality & Weather APIs
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,ammonia,european_aqi,us_aqi&hourly=pm2_5,us_aqi&forecast_days=2`
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`

    const [aqiRes, weatherRes] = await Promise.all([
      fetch(aqiUrl, { signal: controller.signal }),
      fetch(weatherUrl, { signal: controller.signal }),
    ])

    clearTimeout(timeoutId)

    if (!aqiRes.ok || !weatherRes.ok) {
      throw new Error('Telemetry API responded with non-200')
    }

    const aqiJson = await aqiRes.json()
    const weatherJson = await weatherRes.json()

    const curAqi = aqiJson.current || {}
    const curWeather = weatherJson.current || {}

    const pm25 = curAqi.pm2_5 != null ? Number(curAqi.pm2_5) : 45
    const pm10 = curAqi.pm10 != null ? Number(curAqi.pm10) : pm25 * 1.5
    const no2 = curAqi.nitrogen_dioxide != null ? Number(curAqi.nitrogen_dioxide) : 25
    const so2 = curAqi.sulphur_dioxide != null ? Number(curAqi.sulphur_dioxide) : 10
    const o3 = curAqi.ozone != null ? Number(curAqi.ozone) : 40
    const co = curAqi.carbon_monoxide != null ? Number(curAqi.carbon_monoxide) / 1000 : 1.2
    const dust = curAqi.dust != null ? Number(curAqi.dust) : 15
    const ammonia = curAqi.ammonia != null ? Number(curAqi.ammonia) : 5

    const temp = curWeather.temperature_2m != null ? Number(curWeather.temperature_2m) : 20
    const humidity = curWeather.relative_humidity_2m != null ? Number(curWeather.relative_humidity_2m) : 60
    const windSpeed = curWeather.wind_speed_10m != null ? Number(curWeather.wind_speed_10m) : 8

    // Calculate US AQI from PM2.5 or use returned us_aqi
    const computedAqi = curAqi.us_aqi != null && curAqi.us_aqi > 0
      ? Math.round(curAqi.us_aqi)
      : calculateAqiFromPm25(pm25)

    const cat = getAqiCategory(computedAqi)
    const inversion = calculateInversionRisk(temp, humidity, windSpeed)

    const pollutants = buildPollutantMap({
      pm25,
      pm10,
      no2,
      so2,
      o3,
      co,
      dust,
    })

    const telemetry: AirQualityTelemetry = {
      aqi: computedAqi,
      europeanAqi: curAqi.european_aqi != null ? Math.round(curAqi.european_aqi) : Math.min(100, Math.round(pm25 * 0.4)),
      category: cat.category,
      categoryLabel: cat.label,
      categoryColor: cat.color,
      dominantPollutant: 'pm25',
      pm25: Number(pm25.toFixed(1)),
      pm10: Number(pm10.toFixed(1)),
      no2: Number(no2.toFixed(1)),
      so2: Number(so2.toFixed(1)),
      o3: Number(o3.toFixed(1)),
      co: Number(co.toFixed(1)),
      dust: Number(dust.toFixed(1)),
      ammonia: Number(ammonia.toFixed(1)),
      pollutants,
      temperature: Math.round(temp),
      humidity: Math.round(humidity),
      windSpeed: Number(windSpeed.toFixed(1)),
      stagnationIndex: inversion.stagnationIndex,
      inversionRisk: inversion.inversionRisk,
      timestamp: new Date().toISOString(),
      isSimulatedFallback: false,
    }

    // Process hourly series (next 24 hours)
    const hourly: HourlyForecastItem[] = []
    const hourlyTimes: string[] = aqiJson.hourly?.time || []
    const hourlyPm25: number[] = aqiJson.hourly?.pm2_5 || []
    const hourlyAqi: number[] = aqiJson.hourly?.us_aqi || []

    const nowIso = new Date().toISOString()
    let startIndex = hourlyTimes.findIndex((t) => t >= nowIso.slice(0, 13))
    if (startIndex < 0) startIndex = 0

    const sliceTimes = hourlyTimes.slice(startIndex, startIndex + 24)

    // Identify minimum PM2.5 between 11:00 and 16:00 for golden window
    let lowestDaylightIndex = -1
    let minDaylightPm = 999999

    for (let i = 0; i < sliceTimes.length; i++) {
      const idx = startIndex + i
      const d = new Date(sliceTimes[i])
      const h = d.getHours()
      const p = hourlyPm25[idx] != null ? hourlyPm25[idx] : pm25
      if (h >= 11 && h <= 16 && p < minDaylightPm) {
        minDaylightPm = p
        lowestDaylightIndex = i
      }
    }

    for (let i = 0; i < sliceTimes.length; i++) {
      const idx = startIndex + i
      const timeStr = sliceTimes[i]
      const d = new Date(timeStr)
      const h = d.getHours()
      const p = hourlyPm25[idx] != null ? Number(hourlyPm25[idx]) : pm25
      const calculatedHourAqi = hourlyAqi[idx] != null && hourlyAqi[idx] > 0
        ? Math.round(hourlyAqi[idx])
        : calculateAqiFromPm25(p)
      const hourCat = getAqiCategory(calculatedHourAqi)
      const isPeak = h >= 22 || h <= 9
      const isGolden = i === lowestDaylightIndex || (lowestDaylightIndex >= 0 && Math.abs(i - lowestDaylightIndex) <= 1 && h >= 12 && h <= 15)

      hourly.push({
        time: `${h.toString().padStart(2, '0')}:00`,
        hour: h,
        aqi: calculatedHourAqi,
        pm25: Number(p.toFixed(1)),
        category: hourCat.category,
        temperature: Math.round(temp + (h >= 12 && h <= 16 ? 4 : -3)),
        isGoldenWindow: isGolden,
        isSmogPeak: isPeak,
        guidance: isGolden
          ? 'Golden Window: Optimal brief air exchange & outdoor errands.'
          : isPeak
          ? 'Thermal Inversion Peak: Fine particles concentrated at breathing zone.'
          : 'Normal caution advised.',
      })
    }

    const result = { telemetry, hourly }
    memoryCache.set(cacheKey, { data: result, timestamp: Date.now() })
    return result
  } catch (err) {
    console.warn('Live telemetry fetch encountered error, using high-fidelity fallback', err)
    return generateRealisticFallback(city)
  }
}
