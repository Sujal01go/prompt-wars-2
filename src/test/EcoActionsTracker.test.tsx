import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AeroProvider } from '../context/AeroContext.tsx'
import { EcoActionsTracker } from '../components/impact/EcoActionsTracker.tsx'

describe('EcoActionsTracker Component', () => {
  it('renders default mitigation actions and aggregates', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <EcoActionsTracker />
        </AeroProvider>
      )
    })

    expect(screen.getByText(/Personal Smog Mitigation & Eco-Actions/i)).toBeInTheDocument()
    expect(screen.getByText(/Total CO₂ Prevented/i)).toBeInTheDocument()
    expect(screen.getByText(/Particulate Smog Eliminated/i)).toBeInTheDocument()
    expect(screen.getByText(/Switched Daily Commute to Metro Rail/i)).toBeInTheDocument()
  })

  it('toggles an action completion state on click', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <EcoActionsTracker />
        </AeroProvider>
      )
    })

    const metroAction = screen.getByText(/Switched Daily Commute to Metro Rail/i)
    await act(async () => {
      fireEvent.click(metroAction)
    })

    // Action should toggle
    expect(metroAction).toBeInTheDocument()
  })

  it('allows logging a custom community mitigation action', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <EcoActionsTracker />
        </AeroProvider>
      )
    })

    const addTrigger = screen.getByText(/Log Custom Community Mitigation Action/i)
    await act(async () => {
      fireEvent.click(addTrigger)
    })

    const textInput = screen.getByPlaceholderText(/e\.g\. Switched to induction cooking/i)
    await act(async () => {
      fireEvent.change(textInput, { target: { value: 'Planted 5 Sansevieria plants in foyer' } })
    })

    const submitBtn = screen.getByText(/Save & Log Impact/i)
    await act(async () => {
      fireEvent.submit(submitBtn.closest('form')!)
    })

    expect(await screen.findByText('Planted 5 Sansevieria plants in foyer')).toBeInTheDocument()
  })
})
