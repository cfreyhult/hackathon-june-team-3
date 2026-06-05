import type {
  ApprovalTask,
  CloseItem,
  CloseState,
  SupplierBalance,
  OpenSupplierEntrySummary,
} from '../types'

export interface IncomingAccountingDocument {
  incomingAccountingDocumentNo: number
  description: string
  documentDate: number
  dueDate: number
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

export interface RawSupplierBalance {
  supplierNo: number
  name: string
  outstandingAmount: number
  numberOfOpenEntries: number
  oldestDueDate: number
}

export const DOC_TYPE_LABELS: Record<number, string> = {
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

export const DOC_ORIGIN_LABELS: Record<number, string> = {
  1: 'AutoInvoice',
  2: 'Reiseregning',
  3: 'Dokumentsenter',
  4: 'Skanning',
  5: 'Lønn',
  6: 'Manuell',
  7: 'AutoCollect',
}

const TODAY_YYYYMMDD = 20260605

export function formatBnxtDate(yyyymmdd: number): string {
  const s = String(yyyymmdd)
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
}

export function docHasError(doc: IncomingAccountingDocument): boolean {
  return doc.incomingAccountingDocumentStatusFlags.some(
    (f) => f === 'ErrorInProcessing' || f === 'DuplicateDocument' || f === 'MultipleSupplierMatches'
  )
}

export function docIsProcessed(doc: IncomingAccountingDocument): boolean {
  return doc.incomingAccountingDocumentStatusFlags.includes('SentToAccounting')
}

export function docStatusFlags(doc: IncomingAccountingDocument): string {
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

export function buildCloseItems(
  docs: IncomingAccountingDocument[],
  supplierBalances: RawSupplierBalance[],
): CloseItem[] {
  const items: CloseItem[] = []

  for (const doc of docs) {
    const hasError = docHasError(doc)
    const isProcessed = docIsProcessed(doc)
    const isOverdue = hasError && doc.dueDate < TODAY_YYYYMMDD
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
      bnxtDocumentNo: doc.incomingAccountingDocumentNo,
      bnxtStatusFlags: statusDetail,
      bnxtOrigin: originLabel,
    } as CloseItem)
  }

  const hasOverdueAP = supplierBalances.some((s) => s.outstandingAmount < 0 && s.oldestDueDate < TODAY_YYYYMMDD)

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
      id: 'item-ap-review',
      title: `Leverandørreskontro — ${supplierBalances.filter((s) => s.outstandingAmount < 0).length} leverandører med utestående`,
      phase: 'pre-close',
      status: hasOverdueAP ? 'blocked' : 'open',
      isCriticalPath: true,
      taskType: 'supplier-invoice',
      sourceLink: '#/accounting/supplier-ledger',
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

export function buildSupplierBalances(raw: RawSupplierBalance[]): SupplierBalance[] {
  return raw
    .filter((s) => s.outstandingAmount !== 0)
    .map((s) => ({
      supplierNo: s.supplierNo,
      name: s.name,
      outstandingAmount: s.outstandingAmount,
      numberOfOpenEntries: s.numberOfOpenEntries,
      oldestDueDate: formatBnxtDate(s.oldestDueDate),
      isOverdue: s.oldestDueDate < TODAY_YYYYMMDD,
    }))
    .sort((a, b) => a.outstandingAmount - b.outstandingAmount)
}

export function buildOpenSupplierSummary(raw: RawSupplierBalance[]): OpenSupplierEntrySummary {
  const withBalance = raw.filter((s) => s.outstandingAmount < 0)
  const overdue = withBalance.filter((s) => s.oldestDueDate < TODAY_YYYYMMDD)

  return {
    totalEntries: withBalance.reduce((sum, s) => sum + s.numberOfOpenEntries, 0),
    totalOutstanding: withBalance.reduce((sum, s) => sum + Math.abs(s.outstandingAmount), 0),
    overdueEntries: overdue.reduce((sum, s) => sum + s.numberOfOpenEntries, 0),
    overdueAmount: overdue.reduce((sum, s) => sum + Math.abs(s.outstandingAmount), 0),
    supplierCount: withBalance.length,
  }
}

export function buildCloseStateFromRawData(opts: {
  companyName: string
  periodLabel: string
  closeDeadline: string
  documents: IncomingAccountingDocument[]
  supplierBalances: RawSupplierBalance[]
  approvalTasks: ApprovalTask[]
}): CloseState {
  const items = buildCloseItems(opts.documents, opts.supplierBalances)
  const supplierBals = buildSupplierBalances(opts.supplierBalances)
  const openSupplierSummary = buildOpenSupplierSummary(opts.supplierBalances)

  return {
    periodLabel: opts.periodLabel,
    companyName: opts.companyName,
    closeDeadline: opts.closeDeadline,
    items,
    approvalTasks: opts.approvalTasks,
    reminders: [],
    readinessConfig: {
      criticalPathThreshold: 100,
      nonCriticalThreshold: 80,
    },
    supplierBalances: supplierBals,
    openSupplierSummary,
    lastSyncedAt: '2026-06-05T12:00:00Z',
  }
}
