import { CloseProvider } from './context/CloseContext'
import CloseProgressOverview from './components/CloseProgressOverview'

export default function App() {
  return (
    <CloseProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Period Closing Control Central
          </h1>
          <p className="text-sm text-gray-500">Januar 2026 — Norsk Industri AS</p>
        </header>
        <main className="max-w-5xl mx-auto p-6 space-y-8">
          <CloseProgressOverview />
        </main>
      </div>
    </CloseProvider>
  )
}
