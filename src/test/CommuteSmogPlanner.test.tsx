import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AeroProvider } from '../context/AeroContext.tsx'
import { CommuteSmogPlanner } from '../components/commute/CommuteSmogPlanner.tsx'

describe('CommuteSmogPlanner Component', () => {
  it('renders transport mode options and default trip analysis', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <CommuteSmogPlanner />
        </AeroProvider>
      )
    })

    expect(screen.getByText(/Low-Emission Commute & Exposure Optimizer/i)).toBeInTheDocument()
    expect(screen.getByText(/Route Safety Score/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Metro Rail/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/Private AC Car/i)).toBeInTheDocument()
  })

  it('switches commute modes and updates particulate exposure metrics', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <CommuteSmogPlanner />
        </AeroProvider>
      )
    })

    const metroBtn = screen.getByRole('button', { name: /Metro Rail/i })
    await act(async () => {
      fireEvent.click(metroBtn)
    })

    expect(await screen.findByText(/Optimal Urban Transit Mode Active!/i)).toBeInTheDocument()
  })
})
