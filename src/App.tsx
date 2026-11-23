import React from 'react'
import { Navbar } from './components/layout/Navbar.tsx'
import { Footer } from './components/layout/Footer.tsx'
import { HeroAqiMeter } from './components/dashboard/HeroAqiMeter.tsx'
import { PollutantGrid } from './components/dashboard/PollutantGrid.tsx'
import { HourlyForecastChart } from './components/dashboard/HourlyForecastChart.tsx'
import { PersonaShield } from './components/persona/PersonaShield.tsx'
import { CorsiRosenthalSimulator } from './components/iaq/CorsiRosenthalSimulator.tsx'
import { WindowVentilationGuide } from './components/iaq/WindowVentilationGuide.tsx'
import { CommuteSmogPlanner } from './components/commute/CommuteSmogPlanner.tsx'
import { HealthImpactCard } from './components/impact/HealthImpactCard.tsx'
import { EcoActionsTracker } from './components/impact/EcoActionsTracker.tsx'
import { SmogCopilotDrawer } from './components/assistant/SmogCopilotDrawer.tsx'
import { ToastContainer } from './components/common/Toast.tsx'
import { ApiKeyModal } from './components/modals/ApiKeyModal.tsx'
import { CitySelectorModal } from './components/modals/CitySelectorModal.tsx'
import { RoutineExportModal } from './components/modals/RoutineExportModal.tsx'
import { useAero } from './hooks/useAero.ts'

export const App: React.FC = () => {
  const { activeTab } = useAero()

  return (
    <div className="app-layout">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Landmark with Skip-Link Anchor */}
      <main id="main-content" className="app-main" tabIndex={-1}>
        <div className="app-content-container">
          {activeTab === 'dashboard' && (
            <div
              id="panel-dashboard"
              role="tabpanel"
              aria-labelledby="tab-dashboard"
              className="tab-panel-fade"
            >
              <HeroAqiMeter />
              <HourlyForecastChart />
              <PollutantGrid />
            </div>
          )}

          {activeTab === 'persona' && (
            <div
              id="panel-persona"
              role="tabpanel"
              aria-labelledby="tab-persona"
              className="tab-panel-fade"
            >
              <PersonaShield />
            </div>
          )}

          {activeTab === 'iaq' && (
            <div
              id="panel-iaq"
              role="tabpanel"
              aria-labelledby="tab-iaq"
              className="tab-panel-fade space-y-8"
            >
              <CorsiRosenthalSimulator />
              <WindowVentilationGuide />
            </div>
          )}

          {activeTab === 'commute' && (
            <div
              id="panel-commute"
              role="tabpanel"
              aria-labelledby="tab-commute"
              className="tab-panel-fade"
            >
              <CommuteSmogPlanner />
            </div>
          )}

          {activeTab === 'impact' && (
            <div
              id="panel-impact"
              role="tabpanel"
              aria-labelledby="tab-impact"
              className="tab-panel-fade space-y-8"
            >
              <HealthImpactCard />
              <EcoActionsTracker />
            </div>
          )}
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Copilot Chat Assistant Drawer */}
      <SmogCopilotDrawer />

      {/* Modals & Micro-Notifications */}
      <ApiKeyModal />
      <CitySelectorModal />
      <RoutineExportModal />
      <ToastContainer />
    </div>
  )
}
export default App
