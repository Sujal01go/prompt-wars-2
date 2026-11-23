import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as airApi from '../services/airQualityApi.ts'
import { AeroProvider } from '../context/AeroContext.tsx'
import { HeroAqiMeter } from '../components/dashboard/HeroAqiMeter.tsx'
import { calculateAqiFromPm25, getAqiCategory, buildPollutantMap } from '../utils/aqiCalculators.ts'

describe('HeroAqiMeter Component', () => {
  beforeEach(() => {
    const aqi = calculateAqiFromPm25(250)
    const cat = getAqiCategory(aqi)
    vi.spyOn(airApi, 'fetchAirQualityData').mockResolvedValue({
      telemetry: {
        aqi,
        europeanAqi: 75,
        category: cat.category,
        categoryLabel: cat.label,
        categoryColor: cat.color,
        dominantPollutant: 'pm25',
        pm25: 250,
        pm10: 380,
        no2: 65,
        so2: 25,
        o3: 45,
        co: 3.5,
        dust: 50,
        ammonia: 10,
        pollutants: buildPollutantMap({
          pm25: 250,
          pm10: 380,
          no2: 65,
          so2: 25,
          o3: 45,
          co: 3.5,
        }),
        temperature: 15,
        humidity: 75,
        windSpeed: 4,
        stagnationIndex: 80,
        inversionRisk: 'extreme',
        timestamp: new Date().toISOString(),
      },
      hourly: [],
    })
  })

  it('renders circular gauge and atmospheric telemetry once loaded', async () => {
    render(
      <AeroProvider>
        <HeroAqiMeter />
      </AeroProvider>
    )

    const aqiUnit = await screen.findByText(/US AQI/i)
    expect(aqiUnit).toBeInTheDocument()

    const contextHeader = await screen.findByText(/Atmospheric Context/i)
    expect(contextHeader).toBeInTheDocument()
  })
})
