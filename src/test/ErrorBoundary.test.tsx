import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ErrorBoundary } from '../components/common/ErrorBoundary.tsx'

const ThrowErrorComponent: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test intentional rendering failure')
  }
  return <div>Healthy Component Content</div>
}

describe('ErrorBoundary Component', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Healthy Component Content')).toBeInTheDocument()
  })

  it('catches runtime errors and renders accessible fallback UI', () => {
    // Suppress console.error in test output for intentional error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/Application Encountered an Issue/i)).toBeInTheDocument()
    expect(screen.getByText(/Test intentional rendering failure/i)).toBeInTheDocument()
    expect(screen.getByText(/Reload AeroPulse AI/i)).toBeInTheDocument()

    spy.mockRestore()
  })
})
