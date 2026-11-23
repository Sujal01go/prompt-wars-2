import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as airApi from '../services/airQualityApi.ts'
import { AeroProvider } from '../context/AeroContext.tsx'
import { HealthImpactCard } from '../components/impact/HealthImpactCard.tsx'
import { calculateAqiFromPm25, getAqiCategory, buildPollutantMap } from '../utils/aqiCalculators.ts'

describe('HealthImpactCard Component', () => {
  beforeEach(() => {
    const aqi = calculateAqiFromPm25(220)
    const cat = getAqiCategory(aqi)
    vi.spyOn(airApi, 'fetchAirQualityData').mockResolvedValue({
      telemetry: {
        aqi,
        europeanAqi: 70,
        category: cat.category,
        categoryLabel: cat.label,
        categoryColor: cat.color,
        dominantPollutant: 'pm25',
        pm25: 220,
        pm10: 340,
        no2: 60,
        so2: 20,
        o3: 40,
        co: 3.0,
        dust: 40,
        ammonia: 8,
        pollutants: buildPollutantMap({
          pm25: 220,
          pm10: 340,
          no2: 60,
          so2: 20,
          o3: 40,
          co: 3.0,
        }),
        temperature: 16,
        humidity: 70,
        windSpeed: 5,
        stagnationIndex: 75,
        inversionRisk: 'severe',
        timestamp: new Date().toISOString(),
      },
      hourly: [],
    })
  })

  it('renders Berkeley Earth cigarette equivalence and lung particulate metrics', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <HealthImpactCard />
        </AeroProvider>
      )
    })

    expect(screen.getByText(/Biological Health Impact & Toxic Inhalation/i)).toBeInTheDocument()
    expect(screen.getByText(/Daily Cigarette Equivalent/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Inhaled PM2.5 Mass/i)).toBeInTheDocument()
    expect(screen.getByText(/WHO 2021 Threshold/i)).toBeInTheDocument()
  })

  it('updates cigarette calculation when outdoor hours slider changes', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <HealthImpactCard />
        </AeroProvider>
      )
    })

    const slider = screen.getByRole('slider')
    await act(async () => {
      fireEvent.change(slider, { target: { value: '12' } })
    })

    expect(screen.getByText(/12 hours/i)).toBeInTheDocument()
  })
})
