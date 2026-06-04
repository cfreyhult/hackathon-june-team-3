import { useState } from 'react'
import { ShieldCheck, Settings } from 'lucide-react'
import { useClose } from '../context/CloseContext'

export default function ReadinessIndicator() {
  const { items, readinessConfig, updateReadinessThreshold } = useClose()
  const [showConfig, setShowConfig] = useState(false)
  const [editCritical, setEditCritical] = useState(readinessConfig.criticalPathThreshold)
  const [editNonCritical, setEditNonCritical] = useState(readinessConfig.nonCriticalThreshold)

  const criticalItems = items.filter((i) => i.isCriticalPath)
  const criticalComplete = criticalItems.filter((i) => i.status === 'complete').length
  const criticalPercent = criticalItems.length > 0 ? Math.round((criticalComplete / criticalItems.length) * 100) : 100

  const nonCriticalItems = items.filter((i) => !i.isCriticalPath)
  const nonCriticalComplete = nonCriticalItems.filter((i) => i.status === 'complete').length
  const nonCriticalPercent = nonCriticalItems.length > 0 ? Math.round((nonCriticalComplete / nonCriticalItems.length) * 100) : 100

  const criticalReady = criticalPercent >= readinessConfig.criticalPathThreshold
  const nonCriticalReady = nonCriticalPercent >= readinessConfig.nonCriticalThreshold
  const overallReady = criticalReady && nonCriticalReady

  const indicatorColor = overallReady ? 'bg-green-500' : criticalReady ? 'bg-yellow-400' : 'bg-red-500'
  const indicatorBg = overallReady ? 'bg-green-50 border-green-200' : criticalReady ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
  const statusText = overallReady
    ? 'Klar for periodeavslutning'
    : `${criticalPercent}% av kritiske oppgaver fullfort — ${readinessConfig.criticalPathThreshold}% krevet for å fortsette.`

  const handleSave = () => {
    updateReadinessThreshold(editCritical, editNonCritical)
    setShowConfig(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Beredskapsindikator
        </h2>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Konfigurer terskel"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className={`rounded-lg border p-4 ${indicatorBg}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-4 h-4 rounded-full ${indicatorColor}`} />
          <span className="font-medium text-gray-900">{statusText}</span>
        </div>

        {/* Critical path progress */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Kritisk vei</span>
            <span className="font-medium text-gray-900">
              {criticalComplete}/{criticalItems.length} ({criticalPercent}%)
            </span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${criticalReady ? 'bg-green-500' : 'bg-red-400'}`}
              style={{ width: `${criticalPercent}%` }}
            />
          </div>
        </div>

        {/* Non-critical progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Ikke-kritiske oppgaver</span>
            <span className="font-medium text-gray-900">
              {nonCriticalComplete}/{nonCriticalItems.length} ({nonCriticalPercent}%)
            </span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${nonCriticalReady ? 'bg-green-500' : 'bg-yellow-400'}`}
              style={{ width: `${nonCriticalPercent}%` }}
            />
          </div>
        </div>
      </div>

      {showConfig && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Konfigurer terskelverdier</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-gray-600">Kritisk vei minstekrav (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={editCritical}
                onChange={(e) => setEditCritical(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-600">Ikke-kritisk minstekrav (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={editNonCritical}
                onChange={(e) => setEditNonCritical(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              />
            </label>
          </div>
          <button
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Lagre
          </button>
        </div>
      )}
    </div>
  )
}
