import React, { useState, useEffect, useCallback, useMemo } from 'react'
import confetti from 'canvas-confetti'
import { AeroContext, type AeroContextType, type TabId } from './AeroContextInstance.ts'
import type {
  CityLocation,
  PersonaId,
  PersonaProfile,
  AirQualityTelemetry,
  HourlyForecastItem,
  EcoAction,
  CorsiRosenthalConfig,
  DailySmogRoutine,
  ToastMessage,
} from '../types/index.ts'
import { PRESET_CITIES, fetchAirQualityData } from '../services/airQualityApi.ts'
import { PERSONA_PROFILES } from '../services/personaData.ts'
import { storageService } from '../services/storageService.ts'
import { calculateCorsiRosenthal } from '../utils/corsiRosenthal.ts'
import { generateOfflineHeuristicRoutine } from '../services/geminiService.ts'

interface AeroProviderProps {
  children: React.ReactNode
}

export const AeroProvider: React.FC<AeroProviderProps> = ({ children }) => {
  // 1. Initial State from Storage
  const savedCityId = storageService.getSavedCityId()
  const initialCity =
    PRESET_CITIES.find((c) => c.id === savedCityId) || PRESET_CITIES[0]

  const savedPersonaId = storageService.getSavedPersona()
  const initialPersona = PERSONA_PROFILES[savedPersonaId] || PERSONA_PROFILES.respiratory

  const [city, setCityState] = useState<CityLocation>(initialCity)
  const [persona, setPersonaState] = useState<PersonaProfile>(initialPersona)
  const [telemetry, setTelemetry] = useState<AirQualityTelemetry | null>(null)
  const [hourly, setHourly] = useState<HourlyForecastItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [apiKey, setApiKeyState] = useState<string>(() => storageService.getApiKey())
  const [ecoActions, setEcoActionsState] = useState<EcoAction[]>(() =>
    storageService.getEcoActions()
  )
  const [theme, setThemeState] = useState<'dark' | 'light'>(() =>
    storageService.getTheme()
  )
  const [corsiConfig, setCorsiConfigState] = useState<CorsiRosenthalConfig>(() =>
    storageService.getCrConfig()
  )

  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false)
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false)
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [currentRoutine, setCurrentRoutine] = useState<DailySmogRoutine | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  // Apply Theme to Document Element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    storageService.setTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  // Toast Helpers
  const addToast = useCallback((t: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const newToast: ToastMessage = { ...t, id }
    setToasts((prev) => [...prev.slice(-3), newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 4500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Telemetry Fetcher
  const refreshTelemetry = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAirQualityData(city)
      setTelemetry(data.telemetry)
      setHourly(data.hourly)

      // Auto synthesize fresh routine
      const autoRoutine = generateOfflineHeuristicRoutine(
        persona,
        data.telemetry,
        data.hourly,
        city.name
      )
      setCurrentRoutine(autoRoutine)
    } catch (err) {
      console.error('Failed to load air telemetry:', err)
      setError('Unable to load real-time telemetry. Falling back to local data.')
      addToast({
        type: 'warning',
        title: 'Network Notice',
        message: 'Using high-fidelity seasonal telemetry for ' + city.name,
      })
    } finally {
      setLoading(false)
    }
  }, [city, persona, addToast])

  // Fetch when city changes
  useEffect(() => {
    let ignore = false
    const runFetch = async () => {
      try {
        const data = await fetchAirQualityData(city)
        if (!ignore) {
          setTelemetry(data.telemetry)
          setHourly(data.hourly)
          const autoRoutine = generateOfflineHeuristicRoutine(
            persona,
            data.telemetry,
            data.hourly,
            city.name
          )
          setCurrentRoutine(autoRoutine)
          setLoading(false)
        }
      } catch {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    runFetch()
    return () => {
      ignore = true
    }
  }, [city, persona])

  // City Setter
  const setCity = useCallback(
    (newCity: CityLocation) => {
      setCityState(newCity)
      storageService.setSavedCityId(newCity.id)
      addToast({
        type: 'info',
        title: 'Location Updated',
        message: `Switched air monitoring station to ${newCity.name}, ${newCity.country}`,
      })
    },
    [addToast]
  )

  // Persona Setter
  const setPersonaId = useCallback(
    (id: PersonaId) => {
      const prof = PERSONA_PROFILES[id]
      if (prof) {
        setPersonaState(prof)
        storageService.setSavedPersona(id)
        if (telemetry) {
          const updated = generateOfflineHeuristicRoutine(
            prof,
            telemetry,
            hourly,
            city.name
          )
          setCurrentRoutine(updated)
        }
        addToast({
          type: 'success',
          title: 'Vulnerability Persona Active',
          message: `Shield activated for ${prof.name}`,
        })
      }
    },
    [telemetry, hourly, city.name, addToast]
  )

  // API Key Setter
  const setApiKey = useCallback(
    (key: string) => {
      setApiKeyState(key)
      storageService.setApiKey(key)
      addToast({
        type: key ? 'success' : 'info',
        title: key ? 'Gemini API Connected' : 'Offline Mode',
        message: key
          ? 'Live Google Gemini AI Engine activated!'
          : 'Switched back to local offline heuristic AI engine.',
      })
    },
    [addToast]
  )

  // Eco Action Toggler with Confetti
  const toggleEcoAction = useCallback(
    (id: string) => {
      setEcoActionsState((prev) => {
        const next = prev.map((item) => {
          if (item.id === id) {
            const nextCompleted = !item.completed
            if (nextCompleted) {
              try {
                confetti({
                  particleCount: 50,
                  spread: 60,
                  origin: { y: 0.8 },
                })
              } catch {
                // Ignore in headless / test environments
              }
              addToast({
                type: 'success',
                title: 'Smog Mitigation Logged',
                message: `Saved ${item.co2SavedKg}kg CO₂ and ${item.pmSavedGrams}g PM!`,
              })
            }
            return { ...item, completed: nextCompleted }
          }
          return item
        })
        storageService.setEcoActions(next)
        return next
      })
    },
    [addToast]
  )

  const addEcoAction = useCallback(
    (action: EcoAction) => {
      setEcoActionsState((prev) => {
        const next = [...prev, action]
        storageService.setEcoActions(next)
        return next
      })
      addToast({
        type: 'success',
        title: 'Action Added',
        message: 'Logged personal mitigation step with positive impact!',
      })
    },
    [addToast]
  )

  // Corsi-Rosenthal Config
  const updateCorsiConfig = useCallback(
    (cfg: Partial<CorsiRosenthalConfig>) => {
      setCorsiConfigState((prev) => {
        const next = { ...prev, ...cfg }
        storageService.setCrConfig(next)
        return next
      })
    },
    []
  )

  const corsiResults = useMemo(() => {
    return calculateCorsiRosenthal(corsiConfig)
  }, [corsiConfig])

  const contextValue: AeroContextType = {
    city,
    setCity,
    persona,
    setPersonaId,
    telemetry,
    hourly,
    loading,
    error,
    refreshTelemetry,
    apiKey,
    setApiKey,
    ecoActions,
    toggleEcoAction,
    addEcoAction,
    theme,
    toggleTheme,
    corsiConfig,
    updateCorsiConfig,
    corsiResults,
    activeTab,
    setActiveTab,
    isCopilotOpen,
    setIsCopilotOpen,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    isCityModalOpen,
    setIsCityModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    currentRoutine,
    setCurrentRoutine,
    toasts,
    addToast,
    removeToast,
  }

  return (
    <AeroContext.Provider value={contextValue}>{children}</AeroContext.Provider>
  )
}
