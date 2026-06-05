export interface CompanyInfo {
  companyNo: number
  name: string
  tenantId: number
}

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
  sourceLink: string
  sourceModule: 'approval' | 'accounting' | 'project-financial-management'
  approvalTaskId?: string
  bnxtDocumentNo?: number
  bnxtStatusFlags?: string
  bnxtOrigin?: string
}

export interface ApprovalFlowApprover {
  email: string
  name: string
}

export type ApprovalStepStatus = 'pending' | 'active' | 'approved' | 'rejected'

export interface ApprovalFlowStep {
  stepId: number
  stepType: 'and' | 'or'
  approvers: ApprovalFlowApprover[]
  status: ApprovalStepStatus
  completedAt?: string
  comment?: string
}

export type ApprovalTaskStatus =
  | 'sent'
  | 'waiting'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'error'
  | 'in-flow'

export interface ApprovalTask {
  taskNo: number
  description: string
  status: ApprovalTaskStatus
  supplierNo: number
  supplierName: string
  invoiceNo: string
  amount: number
  dueDate: string
  createdDate: string
  flowName: string
  steps: ApprovalFlowStep[]
  currentStepId: number | null
  currentApprover: ApprovalFlowApprover | null
}

export interface ReminderRecord {
  id: string
  taskId: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  timestamp: string
  channel: 'email' | 'in-app' | 'both'
}

export interface ReadinessConfig {
  criticalPathThreshold: number
  nonCriticalThreshold: number
}

export interface SupplierBalance {
  supplierNo: number
  name: string
  outstandingAmount: number
  numberOfOpenEntries: number
  oldestDueDate: string
  isOverdue: boolean
}

export interface OpenSupplierEntrySummary {
  totalEntries: number
  totalOutstanding: number
  overdueEntries: number
  overdueAmount: number
  supplierCount: number
}

export interface CloseState {
  periodLabel: string
  companyName: string
  closeDeadline: string
  items: CloseItem[]
  approvalTasks: ApprovalTask[]
  reminders: ReminderRecord[]
  readinessConfig: ReadinessConfig
  supplierBalances: SupplierBalance[]
  openSupplierSummary: OpenSupplierEntrySummary
  lastSyncedAt: string
}
