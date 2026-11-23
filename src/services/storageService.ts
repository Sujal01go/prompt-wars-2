import type { PersonaId, CorsiRosenthalConfig, EcoAction } from '../types/index.ts'
import { obfuscateKey, deobfuscateKey } from '../utils/security.ts'

const STORAGE_KEYS = {
  CITY: 'aeropulse_city_v1',
  PERSONA: 'aeropulse_persona_v1',
  API_KEY: 'aeropulse_gemini_key_v1',
  ECO_ACTIONS: 'aeropulse_eco_actions_v1',
  THEME: 'aeropulse_theme_v1',
  CR_CONFIG: 'aeropulse_cr_config_v1',
} as const

export const DEFAULT_ECO_ACTIONS: EcoAction[] = [
  {
    id: 'eco-metro',
    title: 'Switched Daily Commute to Metro Rail',
    category: 'transport',
    co2SavedKg: 2.8,
    pmSavedGrams: 3.5,
    description: 'Avoided solo private car trip by taking electric mass transit.',
    impactLevel: 'Very High',
    completed: true,
  },
  {
    id: 'eco-no-burn',
    title: 'Zero Waste/Leaf Burning in Neighborhood',
    category: 'waste',
    co2SavedKg: 5.4,
    pmSavedGrams: 85.0,
    description: 'Composted garden sweepings instead of open smoldering burn.',
    impactLevel: 'Very High',
    completed: true,
  },
  {
    id: 'eco-cr-box',
    title: 'Built DIY Corsi-Rosenthal Box Air Purifier',
    category: 'household',
    co2SavedKg: 1.2,
    pmSavedGrams: 45.0,
    description: 'Operating high-CADR low-energy filtration in central living space.',
    impactLevel: 'High',
    completed: false,
  },
  {
    id: 'eco-carpool',
    title: 'Shared Carpool / Consolidated Errands',
    category: 'transport',
    co2SavedKg: 1.9,
    pmSavedGrams: 2.1,
    description: 'Merged 3 separate short driving trips into 1 during off-peak hours.',
    impactLevel: 'Medium',
    completed: false,
  },
  {
    id: 'eco-incense',
    title: 'Switched to Flameless / Smokeless Indoor Rituals',
    category: 'household',
    co2SavedKg: 0.3,
    pmSavedGrams: 18.0,
    description: 'Eliminated indoor incense sticks and charcoal dhoop burning.',
    impactLevel: 'High',
    completed: false,
  },
]

export const storageService = {
  getSavedCityId(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.CITY) || 'delhi'
    } catch {
      return 'delhi'
    }
  },

  setSavedCityId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CITY, id)
    } catch (e) {
      console.warn('Storage save error', e)
    }
  },

  getSavedPersona(): PersonaId {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PERSONA) as PersonaId
      const valid: PersonaId[] = [
        'children',
        'elderly',
        'athlete',
        'respiratory',
        'pregnant',
        'commuter',
      ]
      return valid.includes(p) ? p : 'respiratory'
    } catch {
      return 'respiratory'
    }
  },

  setSavedPersona(p: PersonaId): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONA, p)
    } catch (e) {
      console.warn('Storage save error', e)
    }
  },

  getApiKey(): string {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.API_KEY)
      return raw ? deobfuscateKey(raw) : ''
    } catch {
      return ''
    }
  },

  setApiKey(key: string): void {
    try {
      if (!key) {
        localStorage.removeItem(STORAGE_KEYS.API_KEY)
      } else {
        localStorage.setItem(STORAGE_KEYS.API_KEY, obfuscateKey(key))
      }
    } catch (e) {
      console.warn('Storage save error', e)
    }
  },

  getEcoActions(): EcoAction[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ECO_ACTIONS)
      if (!raw) return DEFAULT_ECO_ACTIONS
      return JSON.parse(raw)
    } catch {
      return DEFAULT_ECO_ACTIONS
    }
  },

  setEcoActions(actions: EcoAction[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ECO_ACTIONS, JSON.stringify(actions))
    } catch (e) {
      console.warn('Storage save error', e)
    }
  },

  getTheme(): 'dark' | 'light' {
    try {
      const t = localStorage.getItem(STORAGE_KEYS.THEME)
      return t === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  },

  setTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme)
    } catch (e) {
      console.warn('Storage save error', e)
    }
  },

  getCrConfig(): CorsiRosenthalConfig {
    const fallback: CorsiRosenthalConfig = {
      roomWidthFt: 15,
      roomLengthFt: 16,
      roomHeightFt: 9,
      fanCfm: 1400,
      filterCount: 4,
      mervRating: 13,
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CR_CONFIG)
      return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
    } catch {
      return fallback
    }
  },

  setCrConfig(cfg: CorsiRosenthalConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CR_CONFIG, JSON.stringify(cfg))
    } catch (e) {
      console.warn('Storage save error', e)
    }
  },
}
