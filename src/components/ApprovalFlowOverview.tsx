import { useState } from 'react'
import { useClose } from '../context/CloseContext'
import type { ApprovalTask, ApprovalFlowStep, ApprovalTaskStatus } from '../types'
import {
  CheckCircle, Clock, XCircle, AlertTriangle, ChevronDown, ChevronRight,
  ArrowRight, Users, Mail, MessageSquare,
} from 'lucide-react'
import ReminderButton from './ReminderButton'

const STATUS_LABELS: Record<ApprovalTaskStatus, string> = {
  sent: 'Sendt',
  waiting: 'Venter på godkjenning',
  approved: 'Godkjent',
  rejected: 'Avvist',
  cancelled: 'Kansellert',
  error: 'Feil',
  'in-flow': 'I godkjenningsflyt',
}

const STATUS_COLORS: Record<ApprovalTaskStatus, string> = {
  sent: 'bg-blue-100 text-blue-700',
  waiting: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
  error: 'bg-red-100 text-red-700',
  'in-flow': 'bg-indigo-100 text-indigo-700',
}

function ApproverInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span className="text-[10px] font-bold text-white">{initials}</span>
  )
}

function CompactStepDot({ step }: { step: ApprovalFlowStep }) {
  if (step.status === 'approved') {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0" title={`${step.approvers[0]?.name} — Godkjent`}>
        <CheckCircle className="w-3.5 h-3.5 text-white" />
      </div>
    )
  }
  if (step.status === 'active') {
    return (
      <div className="w-6 h-6 rounded-full bg-amber-400 ring-2 ring-amber-200 ring-offset-1 flex items-center justify-center shrink-0 animate-pulse" title={`${step.approvers[0]?.name} — Venter`}>
        <ApproverInitials name={step.approvers[0]?.name ?? '?'} />
      </div>
    )
  }
  if (step.status === 'rejected') {
    return (
      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shrink-0" title={`${step.approvers[0]?.name} — Avvist`}>
        <XCircle className="w-3.5 h-3.5 text-white" />
      </div>
    )
  }
  return (
    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0" title={`${step.approvers[0]?.name} — Venter i kø`}>
      <ApproverInitials name={step.approvers[0]?.name ?? '?'} />
    </div>
  )
}

function CompactChain({ steps }: { steps: ApprovalFlowStep[] }) {
  return (
    <div className="flex items-center gap-0.5">
      {steps.map((step, i) => (
        <div key={step.stepId} className="flex items-center gap-0.5">
          <CompactStepDot step={step} />
          {i < steps.length - 1 && (
            <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
          )}
        </div>
      ))}
    </div>
  )
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('nb-NO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function daysWaiting(since: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(since).getTime()) / (1000 * 60 * 60 * 24)))
}

function DetailedStep({ step, isLast, taskCreatedDate }: { step: ApprovalFlowStep; isLast: boolean; taskCreatedDate: string }) {
  const approver = step.approvers[0]
  const name = approver?.name ?? 'Ukjent'
  const email = approver?.email ?? ''

  const lineColor = step.status === 'approved' ? 'bg-green-300'
    : step.status === 'active' ? 'bg-amber-300'
    : step.status === 'rejected' ? 'bg-red-300'
    : 'bg-gray-200'

  const dotBg = step.status === 'approved' ? 'bg-green-500'
    : step.status === 'active' ? 'bg-amber-400 ring-4 ring-amber-100'
    : step.status === 'rejected' ? 'bg-red-500'
    : 'bg-gray-300'

  const statusLabel = step.status === 'approved' ? 'Godkjent'
    : step.status === 'active' ? 'Venter på godkjenning'
    : step.status === 'rejected' ? 'Avvist'
    : 'Neste i kø'

  const stepTypeLabel = step.stepType === 'and' ? 'Alle må godkjenne' : 'Én godkjenning holder'

  return (
    <div className="flex gap-3">
      {/* Timeline track */}
      <div className="flex flex-col items-center w-8 shrink-0">
        <div className={`w-4 h-4 rounded-full ${dotBg} flex items-center justify-center shrink-0 z-10`}>
          {step.status === 'approved' && <CheckCircle className="w-3 h-3 text-white" />}
          {step.status === 'rejected' && <XCircle className="w-3 h-3 text-white" />}
          {step.status === 'active' && <Clock className="w-2.5 h-2.5 text-white" />}
        </div>
        {!isLast && <div className={`w-0.5 flex-1 ${lineColor} mt-0.5`} />}
      </div>

      {/* Step content */}
      <div className={`pb-5 flex-1 min-w-0 ${isLast ? '' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                step.status === 'approved' ? 'bg-green-100 text-green-700'
                : step.status === 'active' ? 'bg-amber-100 text-amber-700'
                : step.status === 'rejected' ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-500'
              }`}>
                {statusLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {email}
              </span>
              <span className="text-gray-300">·</span>
              <span>Steg {step.stepId} · {stepTypeLabel}</span>
            </div>
          </div>
        </div>

        {step.completedAt && (
          <div className="mt-1.5 text-xs text-gray-500">
            {step.status === 'approved' ? 'Godkjent' : 'Avvist'} {formatTimestamp(step.completedAt)}
          </div>
        )}

        {step.status === 'active' && (
          <div className="mt-1.5 text-xs text-amber-600 font-medium">
            Venter — {daysWaiting(taskCreatedDate)} dager siden oppgaven ble opprettet
          </div>
        )}

        {step.comment && (
          <div className="mt-2 flex items-start gap-1.5 text-xs bg-red-50 border border-red-100 rounded-md px-2.5 py-1.5 text-red-700">
            <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{step.comment}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function TaskCard({ task, isOpen, onToggle }: { task: ApprovalTask; isOpen: boolean; onToggle: () => void }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()
  const isActive = task.status === 'waiting' || task.status === 'in-flow' || task.status === 'sent'
  const isMultiStep = task.steps.length > 1

  const formatNOK = (amount: number) =>
    new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(amount)

  return (
    <div className={`bg-white rounded-lg border transition-shadow ${
      isOverdue && isActive ? 'border-red-200' : isOpen ? 'border-blue-200 shadow-sm' : 'border-gray-200'
    }`}>
      {/* Collapsed header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50/50 transition-colors rounded-lg"
      >
        <div className="shrink-0 text-gray-400">
          {isOpen
            ? <ChevronDown className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />}
        </div>

        {/* Compact chain dots */}
        <div className="shrink-0">
          <CompactChain steps={task.steps} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900 truncate">
            {task.supplierName}
          </span>
          <span className="text-xs text-gray-500 shrink-0">
            {task.invoiceNo}
          </span>
          <span className="text-xs font-medium text-gray-700 shrink-0">
            {formatNOK(task.amount)}
          </span>
          {isMultiStep && (
            <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-600">
              {task.steps.length} steg
            </span>
          )}
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 shrink-0">
          {task.currentApprover && isActive && (
            <span className="text-xs text-gray-500 hidden md:inline">
              Venter på <span className="font-medium text-gray-700">{task.currentApprover.name}</span>
            </span>
          )}
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
          {isOverdue && isActive && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </button>

      {/* Expanded detail panel */}
      {isOpen && (
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex gap-8">
            {/* Left: invoice details */}
            <div className="shrink-0 w-48 space-y-2 text-xs">
              <div>
                <div className="text-gray-400 uppercase tracking-wider text-[10px]">Leverandør</div>
                <div className="text-gray-900 font-medium">{task.supplierName}</div>
                <div className="text-gray-500">#{task.supplierNo}</div>
              </div>
              <div>
                <div className="text-gray-400 uppercase tracking-wider text-[10px]">Faktura</div>
                <div className="text-gray-900 font-medium">{task.invoiceNo}</div>
                <div className="text-gray-900 font-semibold">{formatNOK(task.amount)}</div>
              </div>
              <div>
                <div className="text-gray-400 uppercase tracking-wider text-[10px]">Forfall</div>
                <div className={isOverdue && isActive ? 'text-red-600 font-medium' : 'text-gray-900'}>
                  {new Date(task.dueDate).toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div>
                <div className="text-gray-400 uppercase tracking-wider text-[10px]">Flyt</div>
                <div className="text-gray-900">{task.flowName}</div>
              </div>
              <div>
                <div className="text-gray-400 uppercase tracking-wider text-[10px]">Opprettet</div>
                <div className="text-gray-700">{new Date(task.createdDate).toLocaleDateString('nb-NO')}</div>
              </div>
              {task.currentApprover && isActive && (
                <div className="pt-2">
                  <ReminderButton
                    taskId={`at-${task.taskNo}`}
                    recipientId={task.currentApprover.email}
                    recipientName={task.currentApprover.name}
                  />
                </div>
              )}
            </div>

            {/* Right: vertical approval timeline */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-3">
                Godkjenningskjede — {task.steps.length} {task.steps.length === 1 ? 'steg' : 'steg'}
              </div>
              {task.steps.map((step, i) => (
                <DetailedStep
                  key={step.stepId}
                  step={step}
                  isLast={i === task.steps.length - 1}
                  taskCreatedDate={task.createdDate}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type FilterStatus = 'all' | 'active' | 'approved' | 'rejected' | 'error'

export default function ApprovalFlowOverview() {
  const { approvalTasks } = useClose()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [openTaskNo, setOpenTaskNo] = useState<number | null>(null)

  if (approvalTasks.length === 0) return null

  const activeTasks = approvalTasks.filter((t) => t.status === 'waiting' || t.status === 'in-flow' || t.status === 'sent')
  const approvedTasks = approvalTasks.filter((t) => t.status === 'approved')
  const rejectedTasks = approvalTasks.filter((t) => t.status === 'rejected')
  const errorTasks = approvalTasks.filter((t) => t.status === 'error')

  const filtered = filter === 'all' ? approvalTasks
    : filter === 'active' ? activeTasks
    : filter === 'approved' ? approvedTasks
    : filter === 'rejected' ? rejectedTasks
    : errorTasks

  const sorted = [...filtered].sort((a, b) => {
    const statusPriority: Record<ApprovalTaskStatus, number> = {
      error: 0, rejected: 1, 'in-flow': 2, waiting: 2, sent: 2, approved: 3, cancelled: 4,
    }
    const pa = statusPriority[a.status] ?? 5
    const pb = statusPriority[b.status] ?? 5
    if (pa !== pb) return pa - pb
    return b.amount - a.amount
  })

  const multiStepCount = approvalTasks.filter((t) => t.steps.length > 1).length

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Godkjenningsflyt
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-lg border p-3 text-left transition-colors ${filter === 'all' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
        >
          <div className="text-2xl font-bold text-gray-900">{approvalTasks.length}</div>
          <div className="text-xs text-gray-500">Totalt</div>
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`rounded-lg border p-3 text-left transition-colors ${filter === 'active' ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
        >
          <div className="text-2xl font-bold text-amber-600">{activeTasks.length}</div>
          <div className="text-xs text-gray-500">Venter</div>
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`rounded-lg border p-3 text-left transition-colors ${filter === 'approved' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
        >
          <div className="text-2xl font-bold text-green-600">{approvedTasks.length}</div>
          <div className="text-xs text-gray-500">Godkjent</div>
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`rounded-lg border p-3 text-left transition-colors ${filter === 'rejected' ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
        >
          <div className="text-2xl font-bold text-red-600">{rejectedTasks.length}</div>
          <div className="text-xs text-gray-500">Avvist</div>
        </button>
        <button
          onClick={() => setFilter('error')}
          className={`rounded-lg border p-3 text-left transition-colors ${filter === 'error' ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
        >
          <div className="text-2xl font-bold text-red-600">{errorTasks.length}</div>
          <div className="text-xs text-gray-500">Feil</div>
        </button>
      </div>

      {multiStepCount > 0 && (
        <div className="text-xs text-gray-500">
          {multiStepCount} av {approvalTasks.length} oppgaver har flerstegs godkjenningsflyt — klikk for å se godkjenningskjeden
        </div>
      )}

      <div className="space-y-2">
        {sorted.map((task) => (
          <TaskCard
            key={task.taskNo}
            task={task}
            isOpen={openTaskNo === task.taskNo}
            onToggle={() => setOpenTaskNo(openTaskNo === task.taskNo ? null : task.taskNo)}
          />
        ))}
      </div>
    </section>
  )
}
