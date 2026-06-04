import { ExternalLink } from 'lucide-react'
import { useClose } from '../context/CloseContext'
import type { CloseItem, ClosePhase } from '../types'
import StatusBadge from './StatusBadge'
import PhaseSection, { phaseOrder } from './PhaseSection'

function sortByCriticality(items: CloseItem[]): CloseItem[] {
  const statusPriority: Record<string, number> = { overdue: 0, blocked: 1, open: 2, complete: 3 }
  return [...items].sort((a, b) => {
    // Critical path items first
    if (a.isCriticalPath !== b.isCriticalPath) return a.isCriticalPath ? -1 : 1
    // Then by status severity
    return (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99)
  })
}

export default function CloseProgressOverview() {
  const { items } = useClose()

  const itemsByPhase = phaseOrder.reduce(
    (acc, phase) => {
      acc[phase] = sortByCriticality(items.filter((i) => i.phase === phase))
      return acc
    },
    {} as Record<ClosePhase, CloseItem[]>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Fremdrift periodeavslutning</h2>
      {phaseOrder.map((phase) => {
        const phaseItems = itemsByPhase[phase]
        const completedCount = phaseItems.filter((i) => i.status === 'complete').length
        return (
          <PhaseSection key={phase} phase={phase} completedCount={completedCount} totalCount={phaseItems.length}>
            <ul className="divide-y divide-gray-100">
              {phaseItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.isCriticalPath && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-red-500" title="Kritisk vei" />
                    )}
                    {!item.isCriticalPath && <span className="shrink-0 w-2 h-2" />}
                    <span className="text-sm text-gray-900 truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={item.status} />
                    <a
                      href={item.sourceLink}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Åpne i kildemodul"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </PhaseSection>
        )
      })}
    </div>
  )
}
