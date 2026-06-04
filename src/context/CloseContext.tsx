import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CloseState, ReminderRecord } from '../types'
import { initialState } from '../data/bnxt-data'

interface CloseContextValue extends CloseState {
  sendReminder: (taskId: string, recipientId: string, recipientName: string) => { success: boolean; message: string }
  canSendReminder: (taskId: string, recipientId: string) => { allowed: boolean; nextEligible?: string }
  updateReadinessThreshold: (criticalPath: number, nonCritical: number) => void
}

const CloseContext = createContext<CloseContextValue | null>(null)

const REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours

export function CloseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CloseState>(initialState)

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
