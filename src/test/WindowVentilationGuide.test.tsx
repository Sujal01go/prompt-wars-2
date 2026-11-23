import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AeroProvider } from '../context/AeroContext.tsx'
import { WindowVentilationGuide } from '../components/iaq/WindowVentilationGuide.tsx'

describe('WindowVentilationGuide Component', () => {
  it('renders smart ventilation advice, NASA plants guide, and mask efficacy table', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <WindowVentilationGuide />
        </AeroProvider>
      )
    })

    expect(screen.getByText(/Smart Window Ventilation & Purge Schedule/i)).toBeInTheDocument()
    expect(screen.getByText(/NASA Clean Air Study Reference/i)).toBeInTheDocument()
    expect(screen.getByText(/Indoor Air Bio-Filter Botanical Allies/i)).toBeInTheDocument()
    expect(screen.getByText(/Respirator Efficacy Matrix & DIY Seal Check/i)).toBeInTheDocument()
  })

  it('switches botanical details when a plant card is clicked', async () => {
    await act(async () => {
      render(
        <AeroProvider>
          <WindowVentilationGuide />
        </AeroProvider>
      )
    })

    const arecaBtn = screen.getByText(/Areca Palm/i)
    await act(async () => {
      fireEvent.click(arecaBtn)
    })

    expect(await screen.findByText(/Dypsis lutescens/i)).toBeInTheDocument()
  })
})
