import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { CloseState, CompanyInfo, ReminderRecord } from '../types'
import { fetchCompanies, fetchCompanyData } from '../data/fetcher'

interface CloseContextValue extends CloseState {
  activeCompanyNo: number
  availableCompanies: CompanyInfo[]
  isLoading: boolean
  isRefreshing: boolean
  switchCompany: (companyNo: number) => void
  refreshData: () => Promise<void>
  sendReminder: (taskId: string, recipientId: string, recipientName: string) => { success: boolean; message: string }
  canSendReminder: (taskId: string, recipientId: string) => { allowed: boolean; nextEligible?: string }
  updateReadinessThreshold: (criticalPath: number, nonCritical: number) => void
}

const CloseContext = createContext<CloseContextValue | null>(null)

const REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000

const DEFAULT_COMPANY_NO = 4810168

const EMPTY_STATE: CloseState = {
  periodLabel: '',
  companyName: '',
  closeDeadline: '',
  items: [],
  approvalTasks: [],
  reminders: [],
  readinessConfig: { criticalPathThreshold: 100, nonCriticalThreshold: 80 },
  supplierBalances: [],
  openSupplierSummary: { totalEntries: 0, totalOutstanding: 0, overdueEntries: 0, overdueAmount: 0, supplierCount: 0 },
  lastSyncedAt: '',
}

export function CloseProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<CompanyInfo[]>([])
  const [activeCompanyNo, setActiveCompanyNo] = useState<number>(DEFAULT_COMPANY_NO)
  const [state, setState] = useState<CloseState>(EMPTY_STATE)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadCompanyData = useCallback(async (companyNo: number) => {
    const { state: newState } = await fetchCompanyData(companyNo)
    setState((prev) => ({
      ...newState,
      reminders: prev.reminders,
    }))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function init() {
      setIsLoading(true)
      try {
        const companyList = await fetchCompanies()
        if (cancelled) return
        setCompanies(companyList)
        await loadCompanyData(DEFAULT_COMPANY_NO)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    init()
    return () => { cancelled = true }
  }, [loadCompanyData])

  const switchCompany = useCallback(async (companyNo: number) => {
    setActiveCompanyNo(companyNo)
    setIsLoading(true)
    try {
      await loadCompanyData(companyNo)
    } finally {
      setIsLoading(false)
    }
  }, [loadCompanyData])

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await loadCompanyData(activeCompanyNo)
    } finally {
      setIsRefreshing(false)
    }
  }, [activeCompanyNo, loadCompanyData])

  const canSendReminder = useCallback(
    (taskId: string, recipientId: string): { allowed: boolean; nextEligible?: string } => {
      const lastReminder = state.reminders
        .filter((r) => r.taskId === taskId && r.recipientId === recipientId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

      if (!lastReminder) return { allowed: true }

      const lastSent = new Date(lastReminder.timestamp).getTime()
      const now = Date.now()
      const elapsed = now - lastSent

      if (elapsed < REMINDER_COOLDOWN_MS) {
        const nextEligible = new Date(lastSent + REMINDER_COOLDOWN_MS).toLocaleString('nb-NO')
        return { allowed: false, nextEligible }
      }

      return { allowed: true }
    },
    [state.reminders]
  )

  const sendReminder = useCallback(
    (taskId: string, recipientId: string, recipientName: string): { success: boolean; message: string } => {
      const check = canSendReminder(taskId, recipientId)
      if (!check.allowed) {
        return {
          success: false,
          message: `Påminnelse kan ikke sendes for tidlig. Neste tidspunkt: ${check.nextEligible}`,
        }
      }

      const newReminder: ReminderRecord = {
        id: `rem-${Date.now()}`,
        taskId,
        senderId: 'user-1',
        senderName: 'Maria Solberg',
        recipientId,
        recipientName,
        timestamp: new Date().toISOString(),
        channel: 'both',
      }

      setState((prev) => ({
        ...prev,
        reminders: [...prev.reminders, newReminder],
      }))

      return { success: true, message: `Påminnelse sendt til ${recipientName}` }
    },
    [canSendReminder]
  )

  const updateReadinessThreshold = useCallback((criticalPath: number, nonCritical: number) => {
    setState((prev) => ({
      ...prev,
      readinessConfig: {
        criticalPathThreshold: criticalPath,
        nonCriticalThreshold: nonCritical,
      },
    }))
  }, [])

  return (
    <CloseContext.Provider
      value={{
        ...state,
        activeCompanyNo,
        availableCompanies: companies,
        isLoading,
        isRefreshing,
        switchCompany,
        refreshData,
        sendReminder,
        canSendReminder,
        updateReadinessThreshold,
      }}
    >
      {children}
    </CloseContext.Provider>
  )
}

export function useClose() {
  const ctx = useContext(CloseContext)
  if (!ctx) throw new Error('useClose must be used within CloseProvider')
  return ctx
}
