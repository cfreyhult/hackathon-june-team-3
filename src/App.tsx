import { CloseProvider, useClose } from './context/CloseContext'
import ReadinessIndicator from './components/ReadinessIndicator'
import CloseProgressOverview from './components/CloseProgressOverview'
import ApprovalFlowOverview from './components/ApprovalFlowOverview'
import SupplierOverview from './components/SupplierOverview'
import CompanySelector from './components/CompanySelector'
import { Calendar, Zap, RefreshCw, Loader2 } from 'lucide-react'

function Dashboard() {
  const { periodLabel, closeDeadline, lastSyncedAt, isLoading, isRefreshing, refreshData } = useClose()
  const daysLeft = closeDeadline
    ? Math.ceil((new Date(closeDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0
  const deadlineStr = closeDeadline
    ? new Date(closeDeadline).toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''
  const syncedStr = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString('nb-NO', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Period Closing Control Central
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <CompanySelector />
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {periodLabel}
              </span>
              {syncedStr && (
                <span className="flex items-center gap-1 text-emerald-600">
                  <Zap className="w-3.5 h-3.5" />
                  Synkronisert {syncedStr}
                </span>
              )}
              <button
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last inn data på nytt fra JSON-filer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Oppdaterer...' : 'Oppdater'}
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Frist for periodeavslutning</div>
            <div className="text-lg font-semibold text-gray-900">{deadlineStr}</div>
            {daysLeft > 0 ? (
              <div className="text-xs text-orange-600">{daysLeft} dager gjenstår</div>
            ) : closeDeadline ? (
              <div className="text-xs text-red-600 font-medium">Fristen er passert!</div>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-500">Laster data fra Business NXT...</span>
          </div>
        ) : (
          <>
            <ReadinessIndicator />
            <ApprovalFlowOverview />
            <CloseProgressOverview />
            <SupplierOverview />
          </>
        )}
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
