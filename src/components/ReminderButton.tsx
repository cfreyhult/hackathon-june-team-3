import { useState } from 'react'
import { Bell, BellOff, CheckCircle, History } from 'lucide-react'
import { useClose } from '../context/CloseContext'

interface ReminderButtonProps {
  taskId: string
  recipientId: string
  recipientName: string
}

export default function ReminderButton({ taskId, recipientId, recipientName }: ReminderButtonProps) {
  const { sendReminder, canSendReminder, reminders } = useClose()
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const { allowed, nextEligible } = canSendReminder(taskId, recipientId)
  const taskReminders = reminders.filter((r) => r.taskId === taskId)

  const handleSend = () => {
    const result = sendReminder(taskId, recipientId, recipientName)
    setFeedback(result)
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="relative flex items-center gap-1">
      {allowed ? (
        <button
          onClick={handleSend}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          Send påminnelse
        </button>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 cursor-not-allowed"
          title={`Neste tidspunkt: ${nextEligible}`}
        >
          <BellOff className="w-3.5 h-3.5" />
          Sendt
        </button>
      )}

      {taskReminders.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
          title="Vis påminnelseshistorikk"
        >
          <History className="w-3.5 h-3.5" />
          {taskReminders.length}
        </button>
      )}

      {feedback && (
        <span
          className={`absolute -top-8 left-0 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap ${
            feedback.success ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
          }`}
        >
          {feedback.success && <CheckCircle className="w-3 h-3 inline mr-1" />}
          {feedback.message}
        </span>
      )}

      {showHistory && (
        <div className="absolute top-full right-0 mt-1 z-10 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Påminnelseshistorikk</h4>
          <ul className="space-y-2">
            {taskReminders.map((r) => (
              <li key={r.id} className="text-xs text-gray-600">
                <span className="font-medium">{r.senderName}</span> sendte til{' '}
                <span className="font-medium">{r.recipientName}</span>
                <br />
                <span className="text-gray-400">
                  {new Date(r.timestamp).toLocaleString('nb-NO')} — {r.channel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
