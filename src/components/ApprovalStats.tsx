import { BarChart3, User, FileText } from 'lucide-react'
import { useClose } from '../context/CloseContext'
import type { TaskType } from '../types'

const taskTypeLabels: Record<TaskType, string> = {
  'supplier-invoice': 'Leverandorfaktura',
  'expense-claim': 'Reiseregning',
  'period-adjustment': 'Periodejustering',
  'project-invoice': 'Prosjektfaktura',
  accrual: 'Avsetning',
  'bank-reconciliation': 'Bankavstemming',
  'recurring-journal': 'Periodisk bokforing',
  intercompany: 'Konsernmellomværende',
}

function formatHours(hours: number): string {
  if (hours < 24) return `${hours}t`
  const days = Math.floor(hours / 24)
  const remaining = hours % 24
  return remaining > 0 ? `${days}d ${remaining}t` : `${days}d`
}

export default function ApprovalStats() {
  const { approvalTasks, taskTypeStats } = useClose()

  // Deduplicate approvers from current tasks
  const approverMap = new Map<string, (typeof approvalTasks)[0]['approver']>()
  for (const task of approvalTasks) {
    approverMap.set(task.approver.id, task.approver)
  }
  const uniqueApprovers = [...approverMap.values()].sort(
    (a, b) => b.avgApprovalTimeHours - a.avgApprovalTimeHours
  )

  // Sort task type stats by avg time descending
  const sortedStats = [...taskTypeStats].sort((a, b) => b.avgApprovalTimeHours - a.avgApprovalTimeHours)
  const maxAvgHours = Math.max(...sortedStats.map((s) => s.avgApprovalTimeHours))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Godkjenningsstatistikk
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Per-approver stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4" />
            Per godkjenner (siste 6 perioder)
          </h3>
          <div className="space-y-3">
            {uniqueApprovers.map((approver) => (
              <div key={approver.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{approver.name}</div>
                  <div className="text-xs text-gray-500">{approver.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">
                    Snitt: <span className="font-medium">{formatHours(approver.avgApprovalTimeHours)}</span>
                  </div>
                  <div className="text-xs text-gray-500">P90: {formatHours(approver.p90ApprovalTimeHours)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-task-type stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Per oppgavetype (siste 6 perioder)
          </h3>
          <div className="space-y-3">
            {sortedStats.map((stat) => {
              const onTimeRate = stat.totalTasks > 0 ? Math.round((stat.completedOnTime / stat.totalTasks) * 100) : 0
              const barWidth = maxAvgHours > 0 ? (stat.avgApprovalTimeHours / maxAvgHours) * 100 : 0
              return (
                <div key={stat.taskType}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900">{taskTypeLabels[stat.taskType]}</span>
                    <span className="text-gray-600 font-medium">{formatHours(stat.avgApprovalTimeHours)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right">{onTimeRate}% i tide</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
