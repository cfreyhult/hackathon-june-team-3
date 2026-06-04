export type ClosePhase = 'pre-close' | 'close-run' | 'variance-signoff'

export type ItemStatus = 'complete' | 'open' | 'blocked' | 'overdue'

export type TaskType =
  | 'supplier-invoice'
  | 'expense-claim'
  | 'period-adjustment'
  | 'project-invoice'
  | 'accrual'
  | 'bank-reconciliation'
  | 'recurring-journal'
  | 'intercompany'

export interface CloseItem {
  id: string
  title: string
  phase: ClosePhase
  status: ItemStatus
  isCriticalPath: boolean
  taskType: TaskType
  /** Deep link URL to source module */
  sourceLink: string
  /** Module the item belongs to */
  sourceModule: 'approval' | 'accounting' | 'project-financial-management'
  /** Optional: linked approval task ID */
  approvalTaskId?: string
}

export interface Approver {
  id: string
  name: string
  email: string
  department: string
  /** Average approval time in hours (historical, last 6 periods) */
  avgApprovalTimeHours: number
  /** P90 approval time in hours */
  p90ApprovalTimeHours: number
}

export interface ApprovalTask {
  id: string
  closeItemId: string
  taskType: TaskType
  title: string
  approver: Approver
  createdDate: string // ISO date
  daysOutstanding: number
  isOverdue: boolean
  /** Close deadline for this task */
  deadline: string // ISO date
}

export interface ReminderRecord {
  id: string
  taskId: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  timestamp: string // ISO datetime
  channel: 'email' | 'in-app' | 'both'
}

export interface TaskTypeStats {
  taskType: TaskType
  avgApprovalTimeHours: number
  totalTasks: number
  completedOnTime: number
}

export interface ReadinessConfig {
  /** Minimum % of critical-path tasks that must be complete */
  criticalPathThreshold: number
  /** Minimum % of non-critical tasks for full green */
  nonCriticalThreshold: number
}

export interface CloseState {
  periodLabel: string
  companyName: string
  closeDeadline: string // ISO date
  items: CloseItem[]
  approvalTasks: ApprovalTask[]
  reminders: ReminderRecord[]
  taskTypeStats: TaskTypeStats[]
  readinessConfig: ReadinessConfig
}
