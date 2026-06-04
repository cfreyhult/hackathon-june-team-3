import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ClosePhase } from '../types'

const phaseLabels: Record<ClosePhase, string> = {
  'pre-close': 'Forperiodeavslutning',
  'close-run': 'Avslutningskjoring',
  'variance-signoff': 'Avvik og signering',
}

const phaseOrder: ClosePhase[] = ['pre-close', 'close-run', 'variance-signoff']

interface PhaseSectionProps {
  phase: ClosePhase
  completedCount: number
  totalCount: number
  children: React.ReactNode
}

export default function PhaseSection({ phase, completedCount, totalCount, children }: PhaseSectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          <h3 className="font-medium text-gray-900">{phaseLabels[phase]}</h3>
          <span className="text-sm text-gray-500">
            {completedCount}/{totalCount} fullfort
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">{progress}%</span>
        </div>
      </button>
      {isOpen && <div className="border-t border-gray-100">{children}</div>}
    </div>
  )
}

export { phaseOrder, phaseLabels }
