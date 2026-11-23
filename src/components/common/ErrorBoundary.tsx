import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Enterprise-grade React Error Boundary component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs error metrics, and displays a graceful accessible recovery interface.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error caught by AeroPulse ErrorBoundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="error-boundary-root"
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            className="error-boundary-card"
            style={{
              maxWidth: '540px',
              backgroundColor: '#162032',
              border: '1px solid #334155',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginBottom: '0.5rem',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Application Encountered an Issue
            </h2>

            <p
              style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                lineHeight: 1.5,
                marginBottom: '1.5rem',
              }}
            >
              AeroPulse AI intercepted an unexpected state error. Your saved data, telemetry logs, and preferences remain safe in local storage.
            </p>

            {this.state.error && (
              <pre
                style={{
                  backgroundColor: '#0a0f1d',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#fca5a5',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '1.5rem',
                  fontFamily: 'monospace',
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              <RefreshCw size={16} />
              <span>Reload AeroPulse AI</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
