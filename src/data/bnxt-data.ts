import type {
  Approver,
  ApprovalTask,
  CloseItem,
  CloseState,
  TaskTypeStats,
} from '../types'

// ── Real data from Business NXT (Demo Business NXT AS, company 4810168) ──

export interface IncomingAccountingDocument {
  incomingAccountingDocumentNo: number
  description: string
  documentDate: number // YYYYMMDD
  dueDate: number // YYYYMMDD
  supplierNo: number
  supplierName: string
  incomingAccountingDocumentStatusFlags: string[]
  incomingAccountingDocumentType: number
  incomingAccountingDocumentOrigin: number
  invoiceNo: string
  voucherNo: number
  createdDate: number
  changedDate: number
}

const DOC_TYPE_LABELS: Record<number, string> = {
  1: 'Faktura',
  2: 'Reiseregning',
  3: 'Betaling',
  4: 'Purring',
  5: 'Kvittering',
  6: 'Annet',
  7: 'Kreditnota',
  8: 'Lønn',
  9: 'Oppgjør',
}

const DOC_ORIGIN_LABELS: Record<number, string> = {
  1: 'AutoInvoice',
  2: 'Reiseregning',
  3: 'Dokumentsenter',
  4: 'Skanning',
  5: 'Lønn',
  6: 'Manuell',
  7: 'AutoCollect',
}

export const incomingDocuments: IncomingAccountingDocument[] = [
  {
    incomingAccountingDocumentNo: 13,
    description: 'Demo BNXT  AS',
    documentDate: 20260131,
    dueDate: 20260215,
    supplierNo: 52002,
    supplierName: 'Demo Regnskapsbyrå AS',
    incomingAccountingDocumentStatusFlags: ['ErrorInProcessing', 'BankInformationDifference'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000418',
    voucherNo: 0,
    createdDate: 20260226,
    changedDate: 20260226,
  },
  {
    incomingAccountingDocumentNo: 12,
    description: 'Demo BNXT  AS',
    documentDate: 20251020,
    dueDate: 20251104,
    supplierNo: 52002,
    supplierName: 'Demo Regnskapsbyrå AS',
    incomingAccountingDocumentStatusFlags: ['ErrorInProcessing', 'BankInformationDifference'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000262',
    voucherNo: 0,
    createdDate: 20260114,
    changedDate: 20260114,
  },
  {
    incomingAccountingDocumentNo: 10,
    description: 'Demoklient 1 AS',
    documentDate: 20250321,
    dueDate: 20250405,
    supplierNo: 52001,
    supplierName: 'Demoklient 1 AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000195',
    voucherNo: 0,
    createdDate: 20250321,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 11,
    description: 'Demoklient 1 AS',
    documentDate: 20250321,
    dueDate: 20250405,
    supplierNo: 52001,
    supplierName: 'Demoklient 1 AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000196',
    voucherNo: 0,
    createdDate: 20250321,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 9,
    description: 'Demo BNXT  AS',
    documentDate: 20250131,
    dueDate: 20250215,
    supplierNo: 52002,
    supplierName: 'Demo Regnskapsbyrå AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000176',
    voucherNo: 0,
    createdDate: 20250131,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 7,
    description: 'Demo Byrå AS',
    documentDate: 20231130,
    dueDate: 20231215,
    supplierNo: 52002,
    supplierName: 'Demo Regnskapsbyrå AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000172',
    voucherNo: 0,
    createdDate: 20231130,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 6,
    description: 'Demo Byrå AS',
    documentDate: 20231025,
    dueDate: 20231109,
    supplierNo: 52002,
    supplierName: 'Demo Regnskapsbyrå AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000171',
    voucherNo: 0,
    createdDate: 20231025,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 5,
    description: 'Demo Regnskapskontor AS',
    documentDate: 20230913,
    dueDate: 20230928,
    supplierNo: 52003,
    supplierName: 'Demo Business NXT DK A/S',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000180',
    voucherNo: 0,
    createdDate: 20230913,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 4,
    description: 'Demo Byrå AS',
    documentDate: 20230906,
    dueDate: 20230921,
    supplierNo: 52002,
    supplierName: 'Demo Regnskapsbyrå AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000170',
    voucherNo: 0,
    createdDate: 20230906,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 8,
    description: 'Demo Byrå AS',
    documentDate: 20230906,
    dueDate: 20230921,
    supplierNo: 52002,
    supplierName: 'Demo Regnskapsbyrå AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 4,
    invoiceNo: '200008',
    voucherNo: 0,
    createdDate: 20240829,
    changedDate: 20251210,
  },
  {
    incomingAccountingDocumentNo: 3,
    description: 'Demo Amedia AS',
    documentDate: 20230818,
    dueDate: 20230902,
    supplierNo: 52001,
    supplierName: 'Demoklient 1 AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000188',
    voucherNo: 0,
    createdDate: 20230818,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 1,
    description: 'Demo Amedia AS',
    documentDate: 20230807,
    dueDate: 20230822,
    supplierNo: 52001,
    supplierName: 'Demoklient 1 AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000176',
    voucherNo: 0,
    createdDate: 20230807,
    changedDate: 20250805,
  },
  {
    incomingAccountingDocumentNo: 2,
    description: 'Demo Amedia AS',
    documentDate: 20230807,
    dueDate: 20230822,
    supplierNo: 52001,
    supplierName: 'Demoklient 1 AS',
    incomingAccountingDocumentStatusFlags: ['SentToAccounting'],
    incomingAccountingDocumentType: 1,
    incomingAccountingDocumentOrigin: 1,
    invoiceNo: '1000180',
    voucherNo: 0,
    createdDate: 20230807,
    changedDate: 20250805,
  },
]

// ── Transform Business NXT data → CloseState ──

function formatBnxtDate(yyyymmdd: number): string {
  const s = String(yyyymmdd)
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

function docHasError(doc: IncomingAccountingDocument): boolean {
  return doc.incomingAccountingDocumentStatusFlags.some(
    (f) => f === 'ErrorInProcessing' || f === 'DuplicateDocument' || f === 'MultipleSupplierMatches'
  )
}

function docIsProcessed(doc: IncomingAccountingDocument): boolean {
  return doc.incomingAccountingDocumentStatusFlags.includes('SentToAccounting')
}

function docStatusFlags(doc: IncomingAccountingDocument): string {
  return doc.incomingAccountingDocumentStatusFlags
    .map((f) => {
      const labels: Record<string, string> = {
        SentForOrderMatch: 'Sendt til ordrematch',
        SentToAccounting: 'Sendt til regnskap',
        StatusSentToOrigin: 'Sendt tilbake',
        ErrorInProcessing: 'Feil i behandling',
        SentForReInvoicing: 'Viderefakturering',
        NothingToProcess: 'Ingenting å behandle',
        MultipleSupplierMatches: 'Flere leverandørtreff',
        BankInformationDifference: 'Avvik i bankinfo',
        BankInformationUpdated: 'Bankinfo oppdatert',
        MatchInBankInformationOnly: 'Match kun på bankinfo',
        DuplicateDocument: 'Duplikat',
        OutsideToleranceLevel: 'Utenfor toleranse',
      }
      return labels[f] || f
    })
    .join(', ')
}

function buildCloseItems(): CloseItem[] {
  const items: CloseItem[] = []

  for (const doc of incomingDocuments) {
    const hasError = docHasError(doc)
    const isProcessed = docIsProcessed(doc)
    const isOverdue = hasError && doc.dueDate < 20260604
    const typeLabel = DOC_TYPE_LABELS[doc.incomingAccountingDocumentType] || 'Dokument'
    const originLabel = DOC_ORIGIN_LABELS[doc.incomingAccountingDocumentOrigin] || ''
    const statusDetail = docStatusFlags(doc)

    let status: CloseItem['status']
    if (hasError) {
      status = isOverdue ? 'overdue' : 'blocked'
    } else if (isProcessed) {
      status = 'complete'
    } else {
      status = 'open'
    }

    items.push({
      id: `iad-${doc.incomingAccountingDocumentNo}`,
      title: `${typeLabel} #${doc.invoiceNo} — ${doc.supplierName}`,
      phase: 'pre-close',
      status,
      isCriticalPath: hasError,
      taskType: 'supplier-invoice',
      sourceLink: `#/incoming-documents/${doc.incomingAccountingDocumentNo}`,
      sourceModule: 'accounting',
      approvalTaskId: hasError ? `at-iad-${doc.incomingAccountingDocumentNo}` : undefined,
      bnxtDocumentNo: doc.incomingAccountingDocumentNo,
      bnxtStatusFlags: statusDetail,
      bnxtOrigin: originLabel,
    } as CloseItem)
  }

  // Structural close items not driven by incoming documents
  items.push(
    {
      id: 'item-bank-rec',
      title: 'Bankavstemming mai 2026',
      phase: 'pre-close',
      status: 'open',
      isCriticalPath: true,
      taskType: 'bank-reconciliation',
      sourceLink: '#/accounting/bank-reconciliation',
      sourceModule: 'accounting',
    },
    {
      id: 'item-interco',
      title: 'Konsernmellomværende avstemming',
      phase: 'pre-close',
      status: 'open',
      isCriticalPath: false,
      taskType: 'intercompany',
      sourceLink: '#/accounting/intercompany',
      sourceModule: 'accounting',
    },
    {
      id: 'item-recurring',
      title: 'Periodiske bokføringer — mai',
      phase: 'close-run',
      status: 'complete',
      isCriticalPath: true,
      taskType: 'recurring-journal',
      sourceLink: '#/accounting/recurring-journals',
      sourceModule: 'accounting',
    },
    {
      id: 'item-accrual',
      title: 'Avsetninger mai 2026',
      phase: 'close-run',
      status: 'open',
      isCriticalPath: true,
      taskType: 'accrual',
      sourceLink: '#/accounting/accruals',
      sourceModule: 'accounting',
    },
    {
      id: 'item-variance',
      title: 'Avviksgjennomgang — hovedbok',
      phase: 'variance-signoff',
      status: 'blocked',
      isCriticalPath: true,
      taskType: 'period-adjustment',
      sourceLink: '#/accounting/variance-review',
      sourceModule: 'accounting',
    },
    {
      id: 'item-signoff',
      title: 'Kontroller-signering',
      phase: 'variance-signoff',
      status: 'open',
      isCriticalPath: true,
      taskType: 'period-adjustment',
      sourceLink: '#/accounting/signoff',
      sourceModule: 'accounting',
    }
  )

  return items
}

function buildApprovalTasks(items: CloseItem[]): ApprovalTask[] {
  const tasks: ApprovalTask[] = []

  const errorDocs = incomingDocuments.filter(docHasError)
  for (const doc of errorDocs) {
    const item = items.find((i) => i.id === `iad-${doc.incomingAccountingDocumentNo}`)
    if (!item) continue

    const daysOutstanding = Math.floor(
      (Date.now() - new Date(formatBnxtDate(doc.changedDate)).getTime()) / (1000 * 60 * 60 * 24)
    )

    tasks.push({
      id: `at-iad-${doc.incomingAccountingDocumentNo}`,
      closeItemId: item.id,
      taskType: 'supplier-invoice',
      title: `Løs feil: ${DOC_TYPE_LABELS[doc.incomingAccountingDocumentType] || 'Dokument'} #${doc.invoiceNo} — ${doc.supplierName}`,
      approver: {
        id: `apr-sup-${doc.supplierNo}`,
        name: 'Regnskapsavdeling',
        email: 'regnskap@demo-bnxt.no',
        department: 'Økonomi',
        avgApprovalTimeHours: 24,
        p90ApprovalTimeHours: 48,
      },
      createdDate: formatBnxtDate(doc.createdDate),
      daysOutstanding,
      isOverdue: doc.dueDate < 20260604,
      deadline: formatBnxtDate(doc.dueDate),
    })
  }

  return tasks
}

function buildTaskTypeStats(): TaskTypeStats[] {
  const totalDocs = incomingDocuments.length
  const errorDocs = incomingDocuments.filter(docHasError).length
  const processedDocs = incomingDocuments.filter(docIsProcessed).length

  return [
    {
      taskType: 'supplier-invoice',
      avgApprovalTimeHours: 22,
      totalTasks: totalDocs,
      completedOnTime: processedDocs,
    },
    { taskType: 'bank-reconciliation', avgApprovalTimeHours: 4, totalTasks: 6, completedOnTime: 5 },
    { taskType: 'recurring-journal', avgApprovalTimeHours: 2, totalTasks: 6, completedOnTime: 6 },
    { taskType: 'accrual', avgApprovalTimeHours: 10, totalTasks: 8, completedOnTime: 6 },
    { taskType: 'intercompany', avgApprovalTimeHours: 28, totalTasks: 4, completedOnTime: 3 },
    { taskType: 'period-adjustment', avgApprovalTimeHours: 8, totalTasks: 12, completedOnTime: 11 },
  ]
}

const items = buildCloseItems()
const approvalTasks = buildApprovalTasks(items)
const taskTypeStats = buildTaskTypeStats()

export const initialState: CloseState = {
  periodLabel: 'Mai 2026',
  companyName: 'Demo Business NXT AS',
  closeDeadline: '2026-06-10',
  items,
  approvalTasks,
  reminders: [],
  taskTypeStats,
  readinessConfig: {
    criticalPathThreshold: 100,
    nonCriticalThreshold: 80,
  },
}
