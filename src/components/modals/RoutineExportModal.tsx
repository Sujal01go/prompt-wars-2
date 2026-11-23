import React from 'react'
import {
  Download,
  Printer,
  Copy,
  Sun,
  Clock,
  Heart,
  CheckSquare,
} from 'lucide-react'
import { Modal } from '../common/Modal.tsx'
import { useAero } from '../../hooks/useAero.ts'
import { formatRoutineMarkdown, downloadTextFile } from '../../utils/exportUtils.ts'

export const RoutineExportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    currentRoutine,
    persona,
    telemetry,
    city,
    addToast,
  } = useAero()

  if (!currentRoutine || !telemetry) return null

  const handleDownloadMd = () => {
    const md = formatRoutineMarkdown(currentRoutine, persona, telemetry)
    const filename = `AeroPulse-Routine-${persona.id}-${city.name.replace(/\s+/g, '_')}.md`
    downloadTextFile(filename, md)
    addToast({
      type: 'success',
      title: 'Routine Exported',
      message: `Downloaded ${filename} successfully.`,
    })
  }

  const handleCopyClipboard = async () => {
    try {
      const md = formatRoutineMarkdown(currentRoutine, persona, telemetry)
      await navigator.clipboard.writeText(md)
      addToast({
        type: 'success',
        title: 'Copied to Clipboard',
        message: 'Smog defense routine copied as formatted Markdown.',
      })
    } catch {
      addToast({
        type: 'warning',
        title: 'Copy Failed',
        message: 'Please download the file directly.',
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal
      isOpen={isExportModalOpen}
      onClose={() => setIsExportModalOpen(false)}
      title="24-Hour Smog Defense Protocol"
      subtitle={`Tailored for ${persona.name} in ${city.name}`}
      maxWidth="max-w-4xl"
    >
      <div className="routine-modal-content">
        {/* Top Control Bar */}
        <div className="routine-actions-bar">
          <div className="flex items-center gap-2">
            <span className="routine-badge-golden">
              <Sun size={14} className="text-amber-400" />
              Golden Window: {currentRoutine.goldenVentilationWindow}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyClipboard}
              className="btn-routine-action"
              title="Copy markdown text to clipboard"
            >
              <Copy size={15} />
              <span>Copy</span>
            </button>
            <button
              onClick={handleDownloadMd}
              className="btn-routine-action"
              title="Download markdown document"
            >
              <Download size={15} />
              <span>Download .md</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-routine-action btn-print"
              title="Print or save as PDF"
            >
              <Printer size={15} />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Routine Paper Card */}
        <div className="printable-routine-sheet">
          {/* Sheet Header */}
          <div className="sheet-header">
            <div>
              <span className="sheet-watermark">AeroPulse AI Smog Protocol</span>
              <h3 className="sheet-title">{currentRoutine.title}</h3>
              <p className="sheet-meta">
                {currentRoutine.date} • {currentRoutine.city} • Target: <strong>{persona.name}</strong> ({persona.vulnerabilityLevel} Vulnerability)
              </p>
            </div>
            <div className="sheet-aqi-box">
              <span className="sheet-aqi-num" style={{ color: telemetry.categoryColor }}>
                AQI {telemetry.aqi}
              </span>
              <span className="sheet-aqi-cat">{telemetry.categoryLabel}</span>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="sheet-timeline-section">
            <h4 className="sheet-section-title">
              <Clock size={16} /> Hour-by-Hour Smog Mitigation Schedule
            </h4>

            <div className="sheet-steps-list">
              {currentRoutine.steps.map((step, idx) => (
                <div key={idx} className="sheet-step-item">
                  <div className="step-time-badge">
                    <span className="time-val">{step.time}</span>
                    <span className="period-val">{step.period}</span>
                  </div>

                  <div className="step-content-card">
                    <div className="step-header-row">
                      <h5 className="step-title">{step.title}</h5>
                      <span className={`mask-req-badge ${step.maskRequired ? 'mask-needed' : 'mask-none'}`}>
                        {step.maskRequired ? '😷 N95 Mask Required' : 'Indoor Safe'}
                      </span>
                    </div>
                    <p className="step-action-text">{step.action}</p>
                    <p className="step-guidance-text">
                      <strong>Guidance:</strong> {step.guidance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IAQ Checklist & Nutrition Grid */}
          <div className="sheet-two-col mt-6">
            <div className="sheet-col">
              <h4 className="sheet-section-title">
                <CheckSquare size={16} /> Indoor Air Quality (IAQ) Checklist
              </h4>
              <ul className="sheet-checklist">
                {currentRoutine.iaqChecklist.map((item, idx) => (
                  <li key={idx} className="checklist-item">
                    <span className="checkbox-box">☐</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sheet-col">
              <h4 className="sheet-section-title">
                <Heart size={16} /> Dietary Antioxidant Support
              </h4>
              <ul className="sheet-checklist">
                {currentRoutine.dietaryAntioxidants.map((item, idx) => (
                  <li key={idx} className="checklist-item">
                    <span className="bullet-leaf">🍃</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
