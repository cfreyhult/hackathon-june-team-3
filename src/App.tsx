import { CloseProvider } from './context/CloseContext'

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
        <main className="p-6">
          <p className="text-gray-600">Dashboard components go here...</p>
        </main>
      </div>
    </CloseProvider>
  )
}
