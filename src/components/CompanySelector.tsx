import { Building2, ChevronDown } from 'lucide-react'
import { useClose } from '../context/CloseContext'

export default function CompanySelector() {
  const { activeCompanyNo, availableCompanies, switchCompany } = useClose()

  const active = availableCompanies.find((c) => c.companyNo === activeCompanyNo)

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <Building2 className="w-4 h-4 text-gray-400" />
      <div className="relative">
        <select
          value={activeCompanyNo}
          onChange={(e) => switchCompany(Number(e.target.value))}
          className="appearance-none bg-transparent pr-6 pl-1 py-0.5 text-sm text-gray-700 font-medium border border-gray-200 rounded-md hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          {availableCompanies.map((c) => (
            <option key={c.companyNo} value={c.companyNo}>
              {c.name} ({c.companyNo})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>
      {active && (
        <span className="text-xs text-gray-400 hidden sm:inline">
          Tenant {active.tenantId}
        </span>
      )}
    </div>
  )
}
