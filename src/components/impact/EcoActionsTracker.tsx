import React, { useState } from 'react'
import {
  CheckCircle2,
  Circle,
  Leaf,
  Plus,
} from 'lucide-react'
import { useAero } from '../../hooks/useAero.ts'
import type { EcoAction } from '../../types/index.ts'

export const EcoActionsTracker: React.FC = () => {
  const { ecoActions, toggleEcoAction, addEcoAction } = useAero()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCo2, setNewCo2] = useState(1.5)
  const [newPm, setNewPm] = useState(10)

  // Compute completed totals
  const completedActions = ecoActions.filter((a) => a.completed)
  const totalCo2SavedKg = completedActions.reduce(
    (sum, a) => sum + a.co2SavedKg,
    0
  )
  const totalPmSavedGrams = completedActions.reduce(
    (sum, a) => sum + a.pmSavedGrams,
    0
  )

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newAction: EcoAction = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: 'household',
      co2SavedKg: Number(newCo2) || 1.0,
      pmSavedGrams: Number(newPm) || 5.0,
      description: 'Community custom emission mitigation action.',
      impactLevel: 'Medium',
      completed: true,
    }

    addEcoAction(newAction)
    setNewTitle('')
    setShowAddForm(false)
  }

  return (
    <div className="eco-actions-card" aria-label="Personal Smog Mitigation Tracker">
      <div className="eco-header-row">
        <div>
          <div className="flex items-center gap-2">
            <Leaf size={22} className="text-emerald-400" />
            <h3 className="eco-title">Personal Smog Mitigation & Eco-Actions</h3>
          </div>
          <p className="eco-subtitle">
            Urban air quality improves when individuals and communities eliminate local emissions. Track your personal contributions to cleaner breathable skies.
          </p>
        </div>

        {/* Aggregate Counters */}
        <div className="eco-aggregate-pills">
          <div className="aggregate-pill pill-co2">
            <span className="pill-label">Total CO₂ Prevented</span>
            <span className="pill-number">{totalCo2SavedKg.toFixed(1)} kg</span>
          </div>
          <div className="aggregate-pill pill-pm">
            <span className="pill-label">Particulate Smog Eliminated</span>
            <span className="pill-number">{totalPmSavedGrams.toFixed(1)} g</span>
          </div>
        </div>
      </div>

      {/* Actions Checklist */}
      <div className="actions-list">
        {ecoActions.map((action) => (
          <div
            key={action.id}
            onClick={() => toggleEcoAction(action.id)}
            className={`action-item-row ${action.completed ? 'action-completed' : ''}`}
            role="checkbox"
            aria-checked={action.completed}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleEcoAction(action.id)
              }
            }}
          >
            <div className="action-checkbox-wrap">
              {action.completed ? (
                <CheckCircle2 size={22} className="text-emerald-400" />
              ) : (
                <Circle size={22} className="text-zinc-500" />
              )}
            </div>

            <div className="action-text-content">
              <div className="flex items-center gap-2">
                <span className="action-title">{action.title}</span>
                <span className={`impact-badge badge-${action.impactLevel.toLowerCase().replace(' ', '-')}`}>
                  {action.impactLevel} Impact
                </span>
              </div>
              <p className="action-desc">{action.description}</p>
            </div>

            <div className="action-savings-pills">
              <span className="savings-pill text-emerald-400">
                -{action.co2SavedKg} kg CO₂
              </span>
              <span className="savings-pill text-cyan-400">
                -{action.pmSavedGrams} g PM
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Action Row */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="btn-add-action-trigger"
        >
          <Plus size={16} />
          <span>Log Custom Community Mitigation Action</span>
        </button>
      ) : (
        <form onSubmit={handleCreateAction} className="add-action-form">
          <h4 className="text-sm font-semibold text-zinc-200">
            Log New Smog Mitigation Effort
          </h4>
          <div className="form-row mt-2">
            <input
              type="text"
              placeholder="e.g. Switched to induction cooking, planted 2 snake plants..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-input"
              required
            />
          </div>
          <div className="flex gap-4 mt-2">
            <div className="flex-1">
              <label className="text-xs text-zinc-400">CO₂ Avoided (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={newCo2}
                onChange={(e) => setNewCo2(Number(e.target.value))}
                className="number-input mt-1"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-400">PM Avoided (grams)</label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={newPm}
                onChange={(e) => setNewPm(Number(e.target.value))}
                className="number-input mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save & Log Impact
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
