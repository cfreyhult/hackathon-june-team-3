import { useState } from 'react'
import { useClose } from '../context/CloseContext'
import { AlertTriangle, TrendingDown, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

export default function SupplierOverview() {
  const { supplierBalances, openSupplierSummary } = useClose()
  const [expanded, setExpanded] = useState(false)

  const formatNOK = (amount: number) =>
    new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(amount)

  const overdueSuppliers = supplierBalances.filter((s) => s.isOverdue)
  const displayList = expanded ? supplierBalances : supplierBalances.slice(0, 5)

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Leverandørreskontro — Åpne poster
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Leverandører</div>
          <div className="text-2xl font-bold text-gray-900">{openSupplierSummary.supplierCount}</div>
          <div className="text-xs text-gray-400">{openSupplierSummary.totalEntries} åpne poster</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500">Totalt utestående</div>
          <div className="text-2xl font-bold text-gray-900">{formatNOK(openSupplierSummary.totalOutstanding)}</div>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="text-sm text-red-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Forfalt
          </div>
          <div className="text-2xl font-bold text-red-700">{formatNOK(openSupplierSummary.overdueAmount)}</div>
          <div className="text-xs text-red-400">{openSupplierSummary.overdueEntries} poster forfalt</div>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-4">
          <div className="text-sm text-orange-600 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            Risiko
          </div>
          <div className="text-2xl font-bold text-orange-700">{overdueSuppliers.length}</div>
          <div className="text-xs text-orange-400">leverandører med forfalte poster</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3">Leverandør</th>
              <th className="px-4 py-3 text-right">Utestående (NOK)</th>
              <th className="px-4 py-3 text-center">Åpne poster</th>
              <th className="px-4 py-3">Eldste forfall</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayList.map((supplier) => {
              const daysOverdue = supplier.isOverdue
                ? Math.floor((Date.now() - new Date(supplier.oldestDueDate).getTime()) / (1000 * 60 * 60 * 24))
                : 0

              return (
                <tr key={supplier.supplierNo} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a
                      href={`#/suppliers/${supplier.supplierNo}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {supplier.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="text-xs text-gray-400">#{supplier.supplierNo}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium">
                    {formatNOK(Math.abs(supplier.outstandingAmount))}
                  </td>
                  <td className="px-4 py-3 text-center">{supplier.numberOfOpenEntries}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(supplier.oldestDueDate).toLocaleDateString('nb-NO')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {supplier.isOverdue ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        {daysOverdue}d forfalt
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {supplierBalances.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1 border-t border-gray-100"
          >
            {expanded ? (
              <>Vis færre <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Vis alle {supplierBalances.length} leverandører <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        )}
      </div>
    </section>
  )
}
