import { useContext } from 'react'
import { AeroContext, type AeroContextType } from '../context/AeroContextInstance.ts'

export function useAero(): AeroContextType {
  const ctx = useContext(AeroContext)
  if (!ctx) {
    throw new Error('useAero must be used within an AeroProvider')
  }
  return ctx
}
