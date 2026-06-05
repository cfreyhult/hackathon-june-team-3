import type { CompanyInfo, CloseState, ApprovalTask } from '../types'
import type { IncomingAccountingDocument, RawSupplierBalance } from './bnxt-data'
import { buildCloseStateFromRawData } from './bnxt-data'

interface CompanyDataPayload {
  companyNo: number
  companyName: string
  tenantId: number
  periodLabel: string
  closeDeadline: string
  fetchedAt: string
  documents: IncomingAccountingDocument[]
  supplierBalances: RawSupplierBalance[]
  approvalTasks: ApprovalTask[]
}

export async function fetchCompanies(): Promise<CompanyInfo[]> {
  const res = await fetch('/data/companies.json')
  if (!res.ok) throw new Error(`Failed to fetch companies: ${res.status}`)
  return res.json()
}

export async function fetchCompanyData(companyNo: number): Promise<{ state: CloseState; fetchedAt: string }> {
  const res = await fetch(`/data/${companyNo}.json`)
  if (!res.ok) throw new Error(`Failed to fetch company ${companyNo}: ${res.status}`)
  const payload: CompanyDataPayload = await res.json()

  const state = buildCloseStateFromRawData({
    companyName: payload.companyName,
    periodLabel: payload.periodLabel,
    closeDeadline: payload.closeDeadline,
    documents: payload.documents,
    supplierBalances: payload.supplierBalances,
    approvalTasks: payload.approvalTasks || [],
  })

  state.lastSyncedAt = payload.fetchedAt

  return { state, fetchedAt: payload.fetchedAt }
}
