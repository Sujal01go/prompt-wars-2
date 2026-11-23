import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as airApi from '../services/airQualityApi.ts'
import { AeroProvider } from '../context/AeroContext.tsx'
import { PersonaShield } from '../components/persona/PersonaShield.tsx'
import { calculateAqiFromPm25, getAqiCategory, buildPollutantMap } from '../utils/aqiCalculators.ts'

describe('PersonaShield Component', () => {
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

  it('renders all 6 persona tabs and displays active persona guidance', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <PersonaShield />
        </AeroProvider>
      )
    })

    // Check presence of persona tabs
    expect(await screen.findByText(/Infants & Children/i)).toBeInTheDocument()
    expect(screen.getByText(/Seniors & Heart Patients/i)).toBeInTheDocument()
    expect(screen.getByText(/Runners & Outdoor Athletes/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Asthma & Allergy Patients/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Expectant Mothers/i)).toBeInTheDocument()
    expect(screen.getByText(/Daily Commuters/i)).toBeInTheDocument()
  })

  it('switches persona details when a tab is clicked', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <PersonaShield />
        </AeroProvider>
      )
    })

    const childBtn = await screen.findByText(/Infants & Children/i)
    await act(async () => {
      fireEvent.click(childBtn)
    })

    // Should update active view
    expect(await screen.findByText(/Pediatric Airway Shield/i)).toBeInTheDocument()
  })
})
