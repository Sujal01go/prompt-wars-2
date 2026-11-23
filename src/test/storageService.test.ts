import { describe, it, expect, beforeEach } from 'vitest'
import { storageService, DEFAULT_ECO_ACTIONS } from '../services/storageService.ts'
import type { CorsiRosenthalConfig } from '../types/index.ts'

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('gets default city and saves new city ID', () => {
    expect(storageService.getSavedCityId()).toBe('delhi')
    storageService.setSavedCityId('beijing')
    expect(storageService.getSavedCityId()).toBe('beijing')
  })

  it('validates persona identifiers and falls back to respiratory', () => {
    expect(storageService.getSavedPersona()).toBe('respiratory')
    storageService.setSavedPersona('athlete')
    expect(storageService.getSavedPersona()).toBe('athlete')

    // Invalid persona fallback
    localStorage.setItem('aeropulse_persona_v1', 'invalid_persona')
    expect(storageService.getSavedPersona()).toBe('respiratory')
  })

  it('stores and retrieves obfuscated API keys', () => {
    expect(storageService.getApiKey()).toBe('')
    storageService.setApiKey('AIzaSyTestApiKey123')
    expect(storageService.getApiKey()).toBe('AIzaSyTestApiKey123')
  })

  it('loads default eco actions and persists modifications', () => {
    const actions = storageService.getEcoActions()
    expect(actions.length).toBe(DEFAULT_ECO_ACTIONS.length)

    const modified = [...actions, {
      id: 'custom-action',
      title: 'Planted urban trees',
      category: 'household' as const,
      co2SavedKg: 10,
      pmSavedGrams: 50,
      description: 'Urban greening',
      impactLevel: 'High' as const,
      completed: true,
    }]

    storageService.setEcoActions(modified)
    const reloaded = storageService.getEcoActions()
    expect(reloaded.length).toBe(DEFAULT_ECO_ACTIONS.length + 1)
  })

  it('manages theme preferences', () => {
    expect(storageService.getTheme()).toBe('dark')
    storageService.setTheme('light')
    expect(storageService.getTheme()).toBe('light')
  })

  it('manages Corsi-Rosenthal box builder configurations', () => {
    const config = storageService.getCrConfig()
    expect(config.roomWidthFt).toBeDefined()
    expect(config.filterCount).toBe(4)

    const updatedConfig: CorsiRosenthalConfig = {
      ...config,
      roomWidthFt: 25,
      filterCount: 5,
    }

    storageService.setCrConfig(updatedConfig)
    const saved = storageService.getCrConfig()
    expect(saved.roomWidthFt).toBe(25)
    expect(saved.filterCount).toBe(5)
  })
})
