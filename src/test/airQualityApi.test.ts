import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchAirQualityData, PRESET_CITIES } from '../services/airQualityApi.ts'

describe('airQualityApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes preset high-smog urban centers', () => {
    expect(PRESET_CITIES.length).toBeGreaterThan(5)
    const delhi = PRESET_CITIES.find((c) => c.id === 'delhi')
    expect(delhi).toBeDefined()
    expect(delhi?.isSmogHotspot).toBe(true)
  })

  it('returns valid telemetry and hourly arrays when API succeeds', async () => {
    const mockAqiData = {
      current: {
        pm2_5: 180,
        pm10: 250,
        nitrogen_dioxide: 45,
        sulphur_dioxide: 18,
        ozone: 30,
        carbon_monoxide: 1200,
        dust: 30,
        ammonia: 8,
        us_aqi: 230,
      },
      hourly: {
        time: ['2026-11-23T12:00', '2026-11-23T13:00'],
        pm2_5: [170, 160],
        us_aqi: [220, 210],
      },
    }

    const mockWeatherData = {
      current: {
        temperature_2m: 18,
        relative_humidity_2m: 65,
        wind_speed_10m: 4,
      },
    }

    vi.spyOn(globalThis, 'fetch').mockImplementation((url: any) => {
      if (url.toString().includes('air-quality')) {
        return Promise.resolve(new Response(JSON.stringify(mockAqiData), { status: 200 }))
      }
      return Promise.resolve(new Response(JSON.stringify(mockWeatherData), { status: 200 }))
    })

    const city = PRESET_CITIES[0]
    const data = await fetchAirQualityData(city)

    expect(data.telemetry).toBeDefined()
    expect(data.telemetry.pm25).toBe(180)
    expect(data.telemetry.aqi).toBeGreaterThan(0)
    expect(data.hourly.length).toBeGreaterThan(0)
  })

  it('gracefully falls back to high-fidelity seasonal data on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network timeout'))

    const testCity = {
      id: 'test-city',
      name: 'Test Urban Hub',
      stateOrRegion: 'Metro',
      country: 'Testing',
      lat: 25.0,
      lon: 75.0,
      isSmogHotspot: true,
      notes: 'Testing station',
    }

    const data = await fetchAirQualityData(testCity)
    expect(data.telemetry).toBeDefined()
    expect(data.telemetry.isSimulatedFallback).toBe(true)
    expect(data.hourly.length).toBe(24)
  })
})
