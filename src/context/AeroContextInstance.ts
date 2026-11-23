import { createContext } from 'react'
import type {
  CityLocation,
  PersonaId,
  PersonaProfile,
  AirQualityTelemetry,
  HourlyForecastItem,
  EcoAction,
  CorsiRosenthalConfig,
  CorsiRosenthalResults,
  DailySmogRoutine,
  ToastMessage,
} from '../types/index.ts'

export type TabId = 'dashboard' | 'persona' | 'iaq' | 'commute' | 'impact'

export interface AeroContextType {
  city: CityLocation
  setCity: (city: CityLocation) => void
  persona: PersonaProfile
  setPersonaId: (id: PersonaId) => void
  telemetry: AirQualityTelemetry | null
  hourly: HourlyForecastItem[]
  loading: boolean
  error: string | null
  refreshTelemetry: () => Promise<void>
  apiKey: string
  setApiKey: (key: string) => void
  ecoActions: EcoAction[]
  toggleEcoAction: (id: string) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
  corsiConfig: CorsiRosenthalConfig
  updateCorsiConfig: (cfg: Partial<CorsiRosenthalConfig>) => void
  corsiResults: CorsiRosenthalResults
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  isCopilotOpen: boolean
  setIsCopilotOpen: (open: boolean) => void
  isApiKeyModalOpen: boolean
  setIsApiKeyModalOpen: (open: boolean) => void
  isCityModalOpen: boolean
  setIsCityModalOpen: (open: boolean) => void
  isExportModalOpen: boolean
  setIsExportModalOpen: (open: boolean) => void
  currentRoutine: DailySmogRoutine | null
  setCurrentRoutine: (r: DailySmogRoutine | null) => void
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

export const AeroContext = createContext<AeroContextType | null>(null)
