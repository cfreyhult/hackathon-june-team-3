import { CloseProvider, useClose } from './context/CloseContext'
import ReadinessIndicator from './components/ReadinessIndicator'
import CloseProgressOverview from './components/CloseProgressOverview'
import ApprovalTaskList from './components/ApprovalTaskList'
import ApprovalStats from './components/ApprovalStats'
import { Calendar, Building2 } from 'lucide-react'

function Dashboard() {
  const { periodLabel, companyName, closeDeadline } = useClose()
  const daysLeft = Math.ceil(
    (new Date(closeDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const deadlineStr = new Date(closeDeadline).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Period Closing Control Central
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {companyName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {periodLabel}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Frist for periodeavslutning</div>
            <div className="text-lg font-semibold text-gray-900">{deadlineStr}</div>
            {daysLeft > 0 ? (
              <div className="text-xs text-orange-600">{daysLeft} dager gjenstår</div>
            ) : (
              <div className="text-xs text-red-600 font-medium">Fristen er passert!</div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <ReadinessIndicator />
        <CloseProgressOverview />
        <ApprovalTaskList />
        <ApprovalStats />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
          Business NXT — Period Closing Control Central — Hackathon Demo
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <CloseProvider>
      <Dashboard />
    </CloseProvider>
  )
}
