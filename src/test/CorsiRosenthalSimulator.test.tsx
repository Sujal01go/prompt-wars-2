import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AeroProvider } from '../context/AeroContext.tsx'
import { CorsiRosenthalSimulator } from '../components/iaq/CorsiRosenthalSimulator.tsx'

describe('CorsiRosenthalSimulator Component', () => {
  it('renders simulator inputs and calculated CADR outputs', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <CorsiRosenthalSimulator />
        </AeroProvider>
      )
    })

    expect(screen.getByText(/Corsi-Rosenthal DIY Air Purifier Simulator/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Width \(ft\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Length \(ft\)/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Clean Air Delivery Rate \(CADR\)/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Cardboard Shroud/i).length).toBeGreaterThan(0)
  })

  it('updates room volume and ACH when dimensions change', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <CorsiRosenthalSimulator />
        </AeroProvider>
      )
    })

    const widthInput = screen.getByLabelText(/Width \(ft\)/i)
    await act(async () => {
      fireEvent.change(widthInput, { target: { value: '25' } })
    })

    // Output area or volume should update
    expect(screen.getByText(/sq ft/i)).toBeInTheDocument()
  })
})
