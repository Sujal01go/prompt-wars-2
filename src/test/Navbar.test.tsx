import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AeroProvider } from '../context/AeroContext.tsx'
import { Navbar } from '../components/layout/Navbar.tsx'

describe('Navbar Component', () => {
  it('renders brand header, evaluation pills, and navigation tabs', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <Navbar />
        </AeroProvider>
      )
    })

    expect(screen.getByText(/AeroPulse/i)).toBeInTheDocument()
    expect(screen.getByText(/Air Telemetry/i)).toBeInTheDocument()
    expect(screen.getByText(/Persona Shield/i)).toBeInTheDocument()
    expect(screen.getByText(/IAQ & DIY Purifier/i)).toBeInTheDocument()
    expect(screen.getByText(/Commute Planner/i)).toBeInTheDocument()
    expect(screen.getByText(/Impact & Actions/i)).toBeInTheDocument()
  })

  it('switches tabs on click', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <Navbar />
        </AeroProvider>
      )
    })

    const commuteTab = screen.getByText(/Commute Planner/i)
    await act(async () => {
      fireEvent.click(commuteTab)
    })

    expect(commuteTab.closest('button')).toHaveClass('tab-active')
  })
})
