import { AlertTriangle, Clock } from 'lucide-react'
import { useClose } from '../context/CloseContext'
import ReminderButton from './ReminderButton'

export default function ApprovalTaskList() {
  const { approvalTasks } = useClose()

  const sorted = [...approvalTasks].sort((a, b) => {
    // Overdue first, then by days outstanding descending
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1
    return b.daysOutstanding - a.daysOutstanding
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Ventende godkjenninger</h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">Oppgave</th>
              <th className="px-4 py-3 font-medium">Godkjenner</th>
              <th className="px-4 py-3 font-medium">Dager utestående</th>
              <th className="px-4 py-3 font-medium">Frist</th>
              <th className="px-4 py-3 font-medium">Handling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((task) => (
              <tr key={task.id} className={task.isOverdue ? 'bg-red-50' : ''}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {task.isOverdue && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                    <span className="text-gray-900">{task.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-gray-900">{task.approver.name}</div>
                    <div className="text-gray-500 text-xs">{task.approver.department}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className={task.isOverdue ? 'text-red-700 font-medium' : 'text-gray-700'}>
                      {task.daysOutstanding} dager
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(task.deadline).toLocaleDateString('nb-NO')}
                </td>
                <td className="px-4 py-3">
                  <ReminderButton
                    taskId={task.id}
                    recipientId={task.approver.id}
                    recipientName={task.approver.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
