# Period Closing Control Central — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a locally-runnable single-page dashboard that lets accountants/controllers see period-close progress, outstanding approvals, send reminders, view approval statistics, and gauge close readiness — all with realistic mock data.

**Architecture:** Vite + React + TypeScript SPA. All state lives in React context (no backend). Mock data simulates a Norwegian MLE company mid-close for January 2026. Components are split by PRD feature area. Tailwind CSS for styling.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS 4, Lucide React (icons)

---

## File Structure

```
src/
  main.tsx                    — React entry point, renders App
  App.tsx                     — Layout shell: header, sidebar nav, main content area
  index.css                   — Tailwind directives + any global styles

  data/
    mock-data.ts              — All mock data: close items, approval tasks, approvers, reminders, stats, threshold config

  types/
    index.ts                  — All TypeScript types/interfaces

  context/
    CloseContext.tsx           — React context holding all state + actions (send reminder, update threshold)

  components/
    CloseProgressOverview.tsx  — FR-1/FR-2: Phase-grouped item list, sorted by criticality
    ApprovalTaskList.tsx       — FR-4/FR-5: Outstanding approval tasks with overdue highlighting
    ReminderButton.tsx         — FR-6/FR-7/FR-8: Send reminder button with spam prevention + history popover
    ApprovalStats.tsx          — FR-9/FR-10: Per-approver and per-task-type statistics
    ReadinessIndicator.tsx     — FR-11/FR-12: Visual gauge + threshold config
    PhaseSection.tsx           — Reusable collapsible phase group (Pre-close / Close run / Variance)
    StatusBadge.tsx            — Reusable status pill (complete/open/blocked/overdue)

index.html                    — Vite HTML entry
package.json                  — Dependencies and scripts
tsconfig.json                 — TypeScript config
vite.config.ts                — Vite config
tailwind.config.ts            — Tailwind config (if needed beyond v4 defaults)
.gitignore                    — Node ignores
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `.gitignore`

- [ ] **Step 1: Initialize project with Vite**

```bash
cd /Users/sondresonsteby/Documents/GitHub/hackathon-june-team-3
npm create vite@latest . -- --template react-ts
```

If prompted about existing files, choose to proceed (the PRD markdown won't conflict).

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D tailwindcss @tailwindcss/vite lucide-react
```

- [ ] **Step 3: Configure Tailwind via Vite plugin**

Replace `vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Replace `src/index.css` with:

```css
@import "tailwindcss";
```

- [ ] **Step 4: Replace App.tsx with shell layout**

Replace `src/App.tsx` with:

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Period Closing Control Central
        </h1>
        <p className="text-sm text-gray-500">January 2026 — Norsk Industri AS</p>
      </header>
      <main className="p-6">
        <p className="text-gray-600">Dashboard loading...</p>
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Clean up Vite boilerplate**

Delete these files if they exist:
- `src/App.css`
- `src/assets/react.svg`
- `public/vite.svg`

Update `src/main.tsx` to remove any App.css import. Should look like:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Browser opens to `http://localhost:5173` showing "Period Closing Control Central" header with "Dashboard loading..." text. Tailwind styles applied (gray background, white header).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + Tailwind project"
```

---

## Task 2: Types and Mock Data

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/mock-data.ts`

- [ ] **Step 1: Define all TypeScript types**

Create `src/types/index.ts`:

```ts
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
```

- [ ] **Step 2: Create mock data**

Create `src/data/mock-data.ts`:

```ts
import type {
  Approver,
  ApprovalTask,
  CloseItem,
  CloseState,
  ReminderRecord,
  TaskTypeStats,
} from '../types'

const approvers: Approver[] = [
  {
    id: 'apr-1',
    name: 'Erik Hansen',
    email: 'erik.hansen@norskindustri.no',
    department: 'Innkjop',
    avgApprovalTimeHours: 18,
    p90ApprovalTimeHours: 36,
  },
  {
    id: 'apr-2',
    name: 'Ingrid Larsen',
    email: 'ingrid.larsen@norskindustri.no',
    department: 'Okonomi',
    avgApprovalTimeHours: 6,
    p90ApprovalTimeHours: 12,
  },
  {
    id: 'apr-3',
    name: 'Bjorn Nilsen',
    email: 'bjorn.nilsen@norskindustri.no',
    department: 'Prosjekt',
    avgApprovalTimeHours: 48,
    p90ApprovalTimeHours: 72,
  },
  {
    id: 'apr-4',
    name: 'Kari Johansen',
    email: 'kari.johansen@norskindustri.no',
    department: 'Salg',
    avgApprovalTimeHours: 12,
    p90ApprovalTimeHours: 24,
  },
  {
    id: 'apr-5',
    name: 'Anders Berg',
    email: 'anders.berg@norskindustri.no',
    department: 'Ledelse',
    avgApprovalTimeHours: 32,
    p90ApprovalTimeHours: 56,
  },
]

const items: CloseItem[] = [
  // === PRE-CLOSE ===
  {
    id: 'item-1',
    title: 'Leverandorfakturaer godkjenning — 3 gjenstående',
    phase: 'pre-close',
    status: 'overdue',
    isCriticalPath: true,
    taskType: 'supplier-invoice',
    sourceLink: '#/approval/supplier-invoices',
    sourceModule: 'approval',
    approvalTaskId: 'at-1',
  },
  {
    id: 'item-2',
    title: 'Reiseregninger — 5 venter på godkjenning',
    phase: 'pre-close',
    status: 'open',
    isCriticalPath: false,
    taskType: 'expense-claim',
    sourceLink: '#/approval/expense-claims',
    sourceModule: 'approval',
    approvalTaskId: 'at-2',
  },
  {
    id: 'item-3',
    title: 'Bankavstemming desember',
    phase: 'pre-close',
    status: 'complete',
    isCriticalPath: true,
    taskType: 'bank-reconciliation',
    sourceLink: '#/accounting/bank-reconciliation',
    sourceModule: 'accounting',
  },
  {
    id: 'item-4',
    title: 'Prosjektfaktura milepæl Q4',
    phase: 'pre-close',
    status: 'blocked',
    isCriticalPath: true,
    taskType: 'project-invoice',
    sourceLink: '#/project/invoices/q4',
    sourceModule: 'project-financial-management',
    approvalTaskId: 'at-3',
  },
  {
    id: 'item-5',
    title: 'Konsernmellomværende avstemming',
    phase: 'pre-close',
    status: 'open',
    isCriticalPath: false,
    taskType: 'intercompany',
    sourceLink: '#/accounting/intercompany',
    sourceModule: 'accounting',
  },
  // === CLOSE RUN ===
  {
    id: 'item-6',
    title: 'Periodiske bokforinger — januar',
    phase: 'close-run',
    status: 'complete',
    isCriticalPath: true,
    taskType: 'recurring-journal',
    sourceLink: '#/accounting/recurring-journals',
    sourceModule: 'accounting',
  },
  {
    id: 'item-7',
    title: 'AI-genererte avsetninger',
    phase: 'close-run',
    status: 'open',
    isCriticalPath: true,
    taskType: 'accrual',
    sourceLink: '#/accounting/accruals',
    sourceModule: 'accounting',
    approvalTaskId: 'at-4',
  },
  {
    id: 'item-8',
    title: 'Periodejusteringer — 2 venter',
    phase: 'close-run',
    status: 'open',
    isCriticalPath: false,
    taskType: 'period-adjustment',
    sourceLink: '#/approval/period-adjustments',
    sourceModule: 'approval',
    approvalTaskId: 'at-5',
  },
  // === VARIANCE & SIGN-OFF ===
  {
    id: 'item-9',
    title: 'Avviksgjennomgang — hovedbok',
    phase: 'variance-signoff',
    status: 'blocked',
    isCriticalPath: true,
    taskType: 'period-adjustment',
    sourceLink: '#/accounting/variance-review',
    sourceModule: 'accounting',
  },
  {
    id: 'item-10',
    title: 'Kontroller-signering',
    phase: 'variance-signoff',
    status: 'open',
    isCriticalPath: true,
    taskType: 'period-adjustment',
    sourceLink: '#/accounting/signoff',
    sourceModule: 'accounting',
  },
  {
    id: 'item-11',
    title: 'Prosjektavslutning rapport',
    phase: 'variance-signoff',
    status: 'open',
    isCriticalPath: false,
    taskType: 'project-invoice',
    sourceLink: '#/project/close-report',
    sourceModule: 'project-financial-management',
  },
]

const approvalTasks: ApprovalTask[] = [
  {
    id: 'at-1',
    closeItemId: 'item-1',
    taskType: 'supplier-invoice',
    title: 'Godkjenn leverandorfaktura #2024-1892 — Maskindeler AS',
    approver: approvers[0], // Erik Hansen
    createdDate: '2026-01-22',
    daysOutstanding: 10,
    isOverdue: true,
    deadline: '2026-01-28',
  },
  {
    id: 'at-1b',
    closeItemId: 'item-1',
    taskType: 'supplier-invoice',
    title: 'Godkjenn leverandorfaktura #2024-1905 — Kontorutstyr AS',
    approver: approvers[0], // Erik Hansen
    createdDate: '2026-01-24',
    daysOutstanding: 8,
    isOverdue: true,
    deadline: '2026-01-28',
  },
  {
    id: 'at-1c',
    closeItemId: 'item-1',
    taskType: 'supplier-invoice',
    title: 'Godkjenn leverandorfaktura #2024-1910 — Logistikk Nord',
    approver: approvers[4], // Anders Berg
    createdDate: '2026-01-25',
    daysOutstanding: 7,
    isOverdue: true,
    deadline: '2026-01-28',
  },
  {
    id: 'at-2',
    closeItemId: 'item-2',
    taskType: 'expense-claim',
    title: 'Reiseregning — Kari Johansen, kundebesok Bergen',
    approver: approvers[1], // Ingrid Larsen
    createdDate: '2026-01-26',
    daysOutstanding: 6,
    isOverdue: false,
    deadline: '2026-02-03',
  },
  {
    id: 'at-2b',
    closeItemId: 'item-2',
    taskType: 'expense-claim',
    title: 'Reiseregning — Anders Berg, konferanse Oslo',
    approver: approvers[1], // Ingrid Larsen
    createdDate: '2026-01-27',
    daysOutstanding: 5,
    isOverdue: false,
    deadline: '2026-02-03',
  },
  {
    id: 'at-3',
    closeItemId: 'item-4',
    taskType: 'project-invoice',
    title: 'Prosjektfaktura milepæl 3 — Havneutbygging Tromso',
    approver: approvers[2], // Bjorn Nilsen
    createdDate: '2026-01-20',
    daysOutstanding: 12,
    isOverdue: true,
    deadline: '2026-01-28',
  },
  {
    id: 'at-4',
    closeItemId: 'item-7',
    taskType: 'accrual',
    title: 'Godkjenn AI-avsetning — husleie januar',
    approver: approvers[1], // Ingrid Larsen
    createdDate: '2026-01-29',
    daysOutstanding: 3,
    isOverdue: false,
    deadline: '2026-02-03',
  },
  {
    id: 'at-5',
    closeItemId: 'item-8',
    taskType: 'period-adjustment',
    title: 'Periodejustering — forsikringskostnad Q1',
    approver: approvers[3], // Kari Johansen
    createdDate: '2026-01-28',
    daysOutstanding: 4,
    isOverdue: false,
    deadline: '2026-02-03',
  },
]

const existingReminders: ReminderRecord[] = [
  {
    id: 'rem-1',
    taskId: 'at-1',
    senderId: 'user-1',
    senderName: 'Maria Solberg',
    recipientId: 'apr-1',
    recipientName: 'Erik Hansen',
    timestamp: '2026-01-29T09:15:00Z',
    channel: 'both',
  },
  {
    id: 'rem-2',
    taskId: 'at-3',
    senderId: 'user-1',
    senderName: 'Maria Solberg',
    recipientId: 'apr-3',
    recipientName: 'Bjorn Nilsen',
    timestamp: '2026-01-28T14:30:00Z',
    channel: 'both',
  },
]

const taskTypeStats: TaskTypeStats[] = [
  { taskType: 'supplier-invoice', avgApprovalTimeHours: 22, totalTasks: 45, completedOnTime: 38 },
  { taskType: 'expense-claim', avgApprovalTimeHours: 14, totalTasks: 32, completedOnTime: 29 },
  { taskType: 'period-adjustment', avgApprovalTimeHours: 8, totalTasks: 18, completedOnTime: 17 },
  { taskType: 'project-invoice', avgApprovalTimeHours: 42, totalTasks: 12, completedOnTime: 7 },
  { taskType: 'accrual', avgApprovalTimeHours: 10, totalTasks: 24, completedOnTime: 22 },
  { taskType: 'bank-reconciliation', avgApprovalTimeHours: 4, totalTasks: 6, completedOnTime: 6 },
  { taskType: 'recurring-journal', avgApprovalTimeHours: 2, totalTasks: 6, completedOnTime: 6 },
  { taskType: 'intercompany', avgApprovalTimeHours: 28, totalTasks: 8, completedOnTime: 5 },
]

export const initialState: CloseState = {
  periodLabel: 'Januar 2026',
  companyName: 'Norsk Industri AS',
  closeDeadline: '2026-02-03',
  items,
  approvalTasks,
  reminders: existingReminders,
  taskTypeStats,
  readinessConfig: {
    criticalPathThreshold: 100,
    nonCriticalThreshold: 80,
  },
}
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/data/mock-data.ts
git commit -m "feat: add TypeScript types and mock data for close hub"
```

---

## Task 3: State Management (CloseContext)

**Files:**
- Create: `src/context/CloseContext.tsx`

- [ ] **Step 1: Create the context provider**

Create `src/context/CloseContext.tsx`:

```tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CloseState, ReminderRecord } from '../types'
import { initialState } from '../data/mock-data'

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
```

- [ ] **Step 2: Wire provider into App**

Update `src/App.tsx`:

```tsx
import { CloseProvider } from './context/CloseContext'

export default function App() {
  return (
    <CloseProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Period Closing Control Central
          </h1>
          <p className="text-sm text-gray-500">Januar 2026 — Norsk Industri AS</p>
        </header>
        <main className="p-6">
          <p className="text-gray-600">Dashboard components go here...</p>
        </main>
      </div>
    </CloseProvider>
  )
}
```

- [ ] **Step 3: Verify it compiles and renders**

```bash
npx tsc --noEmit
```

Check dev server still runs without errors.

- [ ] **Step 4: Commit**

```bash
git add src/context/CloseContext.tsx src/App.tsx
git commit -m "feat: add CloseContext state management with reminder logic"
```

---

## Task 4: StatusBadge and PhaseSection Components

**Files:**
- Create: `src/components/StatusBadge.tsx`
- Create: `src/components/PhaseSection.tsx`

- [ ] **Step 1: Create StatusBadge**

Create `src/components/StatusBadge.tsx`:

```tsx
import type { ItemStatus } from '../types'

const config: Record<ItemStatus, { label: string; className: string }> = {
  complete: { label: 'Fullfort', className: 'bg-green-100 text-green-800' },
  open: { label: 'Åpen', className: 'bg-blue-100 text-blue-800' },
  blocked: { label: 'Blokkert', className: 'bg-red-100 text-red-800' },
  overdue: { label: 'Forfalt', className: 'bg-orange-100 text-orange-800' },
}

export default function StatusBadge({ status }: { status: ItemStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
```

- [ ] **Step 2: Create PhaseSection**

Create `src/components/PhaseSection.tsx`:

```tsx
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ClosePhase } from '../types'

const phaseLabels: Record<ClosePhase, string> = {
  'pre-close': 'Forperiodeavslutning',
  'close-run': 'Avslutningskjoring',
  'variance-signoff': 'Avvik og signering',
}

const phaseOrder: ClosePhase[] = ['pre-close', 'close-run', 'variance-signoff']

interface PhaseSectionProps {
  phase: ClosePhase
  completedCount: number
  totalCount: number
  children: React.ReactNode
}

export default function PhaseSection({ phase, completedCount, totalCount, children }: PhaseSectionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
          <h3 className="font-medium text-gray-900">{phaseLabels[phase]}</h3>
          <span className="text-sm text-gray-500">
            {completedCount}/{totalCount} fullfort
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">{progress}%</span>
        </div>
      </button>
      {isOpen && <div className="border-t border-gray-100">{children}</div>}
    </div>
  )
}

export { phaseOrder, phaseLabels }
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/StatusBadge.tsx src/components/PhaseSection.tsx
git commit -m "feat: add StatusBadge and PhaseSection reusable components"
```

---

## Task 5: Close Progress Overview (FR-1, FR-2)

**Files:**
- Create: `src/components/CloseProgressOverview.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create CloseProgressOverview**

Create `src/components/CloseProgressOverview.tsx`:

```tsx
import { ExternalLink } from 'lucide-react'
import { useClose } from '../context/CloseContext'
import type { CloseItem, ClosePhase } from '../types'
import StatusBadge from './StatusBadge'
import PhaseSection, { phaseOrder } from './PhaseSection'

function sortByCriticality(items: CloseItem[]): CloseItem[] {
  const statusPriority: Record<string, number> = { overdue: 0, blocked: 1, open: 2, complete: 3 }
  return [...items].sort((a, b) => {
    // Critical path items first
    if (a.isCriticalPath !== b.isCriticalPath) return a.isCriticalPath ? -1 : 1
    // Then by status severity
    return (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99)
  })
}

export default function CloseProgressOverview() {
  const { items } = useClose()

  const itemsByPhase = phaseOrder.reduce(
    (acc, phase) => {
      acc[phase] = sortByCriticality(items.filter((i) => i.phase === phase))
      return acc
    },
    {} as Record<ClosePhase, CloseItem[]>
  )

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Fremdrift periodeavslutning</h2>
      {phaseOrder.map((phase) => {
        const phaseItems = itemsByPhase[phase]
        const completedCount = phaseItems.filter((i) => i.status === 'complete').length
        return (
          <PhaseSection key={phase} phase={phase} completedCount={completedCount} totalCount={phaseItems.length}>
            <ul className="divide-y divide-gray-100">
              {phaseItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.isCriticalPath && (
                      <span className="shrink-0 w-2 h-2 rounded-full bg-red-500" title="Kritisk vei" />
                    )}
                    {!item.isCriticalPath && <span className="shrink-0 w-2 h-2" />}
                    <span className="text-sm text-gray-900 truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={item.status} />
                    <a
                      href={item.sourceLink}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Åpne i kildemodul"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </PhaseSection>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Add to App layout**

Update `src/App.tsx`:

```tsx
import { CloseProvider } from './context/CloseContext'
import CloseProgressOverview from './components/CloseProgressOverview'

export default function App() {
  return (
    <CloseProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Period Closing Control Central
          </h1>
          <p className="text-sm text-gray-500">Januar 2026 — Norsk Industri AS</p>
        </header>
        <main className="max-w-5xl mx-auto p-6 space-y-8">
          <CloseProgressOverview />
        </main>
      </div>
    </CloseProvider>
  )
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Expected: Three collapsible phase sections, each with items sorted by criticality. Red dots on critical-path items. Status badges. External link icons.

- [ ] **Step 4: Commit**

```bash
git add src/components/CloseProgressOverview.tsx src/App.tsx
git commit -m "feat: add close progress overview with phase grouping and criticality sort"
```

---

## Task 6: Approval Task List (FR-4, FR-5)

**Files:**
- Create: `src/components/ApprovalTaskList.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ApprovalTaskList**

Create `src/components/ApprovalTaskList.tsx`:

```tsx
import { AlertTriangle, Clock } from 'lucide-react'
import { useClose } from '../context/CloseContext'
import ReminderButton from './ReminderButton'

export default function ApprovalTaskList() {
  const { approvalTasks } = useClose()

  const sorted = [...approvalTasks].sort((a, b) => {
    // Overdue first, then by days outstanding descending
    if (a.isOverdue !== b.isOverdue) return a.isOverdue ? -1 : 1
    return b.daysOutstanding - a.daysOutstanding
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Ventende godkjenninger</h2>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-3 font-medium">Oppgave</th>
              <th className="px-4 py-3 font-medium">Godkjenner</th>
              <th className="px-4 py-3 font-medium">Dager utestående</th>
              <th className="px-4 py-3 font-medium">Frist</th>
              <th className="px-4 py-3 font-medium">Handling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((task) => (
              <tr key={task.id} className={task.isOverdue ? 'bg-red-50' : ''}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {task.isOverdue && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                    <span className="text-gray-900">{task.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-gray-900">{task.approver.name}</div>
                    <div className="text-gray-500 text-xs">{task.approver.department}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className={task.isOverdue ? 'text-red-700 font-medium' : 'text-gray-700'}>
                      {task.daysOutstanding} dager
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(task.deadline).toLocaleDateString('nb-NO')}
                </td>
                <td className="px-4 py-3">
                  <ReminderButton
                    taskId={task.id}
                    recipientId={task.approver.id}
                    recipientName={task.approver.name}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add to App layout**

Update `src/App.tsx` — add the import and component after `<CloseProgressOverview />`:

```tsx
import ApprovalTaskList from './components/ApprovalTaskList'
```

In the `<main>` body, after `<CloseProgressOverview />`:

```tsx
<ApprovalTaskList />
```

- [ ] **Step 3: Note** — This depends on ReminderButton (Task 7). These two tasks should be implemented together. Verify after Task 7 is done.

- [ ] **Step 4: Commit (after Task 7)**

```bash
git add src/components/ApprovalTaskList.tsx src/App.tsx
git commit -m "feat: add approval task list with overdue highlighting"
```

---

## Task 7: Reminder Button with Spam Prevention (FR-6, FR-7, FR-8)

**Files:**
- Create: `src/components/ReminderButton.tsx`

- [ ] **Step 1: Create ReminderButton**

Create `src/components/ReminderButton.tsx`:

```tsx
import { useState } from 'react'
import { Bell, BellOff, CheckCircle, History } from 'lucide-react'
import { useClose } from '../context/CloseContext'

interface ReminderButtonProps {
  taskId: string
  recipientId: string
  recipientName: string
}

export default function ReminderButton({ taskId, recipientId, recipientName }: ReminderButtonProps) {
  const { sendReminder, canSendReminder, reminders } = useClose()
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const { allowed, nextEligible } = canSendReminder(taskId, recipientId)
  const taskReminders = reminders.filter((r) => r.taskId === taskId)

  const handleSend = () => {
    const result = sendReminder(taskId, recipientId, recipientName)
    setFeedback(result)
    setTimeout(() => setFeedback(null), 3000)
  }

  return (
    <div className="relative flex items-center gap-1">
      {allowed ? (
        <button
          onClick={handleSend}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          Send påminnelse
        </button>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 cursor-not-allowed"
          title={`Neste tidspunkt: ${nextEligible}`}
        >
          <BellOff className="w-3.5 h-3.5" />
          Sendt
        </button>
      )}

      {taskReminders.length > 0 && (
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
          title="Vis påminnelseshistorikk"
        >
          <History className="w-3.5 h-3.5" />
          {taskReminders.length}
        </button>
      )}

      {feedback && (
        <span
          className={`absolute -top-8 left-0 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap ${
            feedback.success ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
          }`}
        >
          {feedback.success && <CheckCircle className="w-3 h-3 inline mr-1" />}
          {feedback.message}
        </span>
      )}

      {showHistory && (
        <div className="absolute top-full right-0 mt-1 z-10 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Påminnelseshistorikk</h4>
          <ul className="space-y-2">
            {taskReminders.map((r) => (
              <li key={r.id} className="text-xs text-gray-600">
                <span className="font-medium">{r.senderName}</span> sendte til{' '}
                <span className="font-medium">{r.recipientName}</span>
                <br />
                <span className="text-gray-400">
                  {new Date(r.timestamp).toLocaleString('nb-NO')} — {r.channel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Expected: Approval task table visible. "Send påminnelse" buttons on each row. Tasks with existing reminders show a history count. Clicking "Send påminnelse" shows green feedback, button changes to disabled "Sendt". Clicking the history icon shows reminder log popover.

- [ ] **Step 3: Commit**

```bash
git add src/components/ReminderButton.tsx src/components/ApprovalTaskList.tsx src/App.tsx
git commit -m "feat: add reminder button with spam prevention and history popover"
```

---

## Task 8: Approval Behaviour Statistics (FR-9, FR-10)

**Files:**
- Create: `src/components/ApprovalStats.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ApprovalStats**

Create `src/components/ApprovalStats.tsx`:

```tsx
import { BarChart3, User, FileText } from 'lucide-react'
import { useClose } from '../context/CloseContext'
import type { TaskType } from '../types'

const taskTypeLabels: Record<TaskType, string> = {
  'supplier-invoice': 'Leverandorfaktura',
  'expense-claim': 'Reiseregning',
  'period-adjustment': 'Periodejustering',
  'project-invoice': 'Prosjektfaktura',
  accrual: 'Avsetning',
  'bank-reconciliation': 'Bankavstemming',
  'recurring-journal': 'Periodisk bokforing',
  intercompany: 'Konsernmellomværende',
}

function formatHours(hours: number): string {
  if (hours < 24) return `${hours}t`
  const days = Math.floor(hours / 24)
  const remaining = hours % 24
  return remaining > 0 ? `${days}d ${remaining}t` : `${days}d`
}

export default function ApprovalStats() {
  const { approvalTasks, taskTypeStats } = useClose()

  // Deduplicate approvers from current tasks
  const approverMap = new Map<string, (typeof approvalTasks)[0]['approver']>()
  for (const task of approvalTasks) {
    approverMap.set(task.approver.id, task.approver)
  }
  const uniqueApprovers = [...approverMap.values()].sort(
    (a, b) => b.avgApprovalTimeHours - a.avgApprovalTimeHours
  )

  // Sort task type stats by avg time descending
  const sortedStats = [...taskTypeStats].sort((a, b) => b.avgApprovalTimeHours - a.avgApprovalTimeHours)
  const maxAvgHours = Math.max(...sortedStats.map((s) => s.avgApprovalTimeHours))

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Godkjenningsstatistikk
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Per-approver stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4" />
            Per godkjenner (siste 6 perioder)
          </h3>
          <div className="space-y-3">
            {uniqueApprovers.map((approver) => (
              <div key={approver.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{approver.name}</div>
                  <div className="text-xs text-gray-500">{approver.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-900">
                    Snitt: <span className="font-medium">{formatHours(approver.avgApprovalTimeHours)}</span>
                  </div>
                  <div className="text-xs text-gray-500">P90: {formatHours(approver.p90ApprovalTimeHours)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per-task-type stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Per oppgavetype (siste 6 perioder)
          </h3>
          <div className="space-y-3">
            {sortedStats.map((stat) => {
              const onTimeRate = stat.totalTasks > 0 ? Math.round((stat.completedOnTime / stat.totalTasks) * 100) : 0
              const barWidth = maxAvgHours > 0 ? (stat.avgApprovalTimeHours / maxAvgHours) * 100 : 0
              return (
                <div key={stat.taskType}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900">{taskTypeLabels[stat.taskType]}</span>
                    <span className="text-gray-600 font-medium">{formatHours(stat.avgApprovalTimeHours)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right">{onTimeRate}% i tide</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add to App layout**

Add import to `src/App.tsx`:

```tsx
import ApprovalStats from './components/ApprovalStats'
```

Add `<ApprovalStats />` after `<ApprovalTaskList />` in the `<main>` body.

- [ ] **Step 3: Verify in browser**

Expected: Two-column grid. Left: per-approver stats sorted by slowest first. Right: per-task-type stats with bar chart and on-time percentage.

- [ ] **Step 4: Commit**

```bash
git add src/components/ApprovalStats.tsx src/App.tsx
git commit -m "feat: add approval behaviour statistics dashboard"
```

---

## Task 9: Readiness Indicator (FR-11, FR-12)

**Files:**
- Create: `src/components/ReadinessIndicator.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ReadinessIndicator**

Create `src/components/ReadinessIndicator.tsx`:

```tsx
import { useState } from 'react'
import { ShieldCheck, Settings } from 'lucide-react'
import { useClose } from '../context/CloseContext'

export default function ReadinessIndicator() {
  const { items, readinessConfig, updateReadinessThreshold } = useClose()
  const [showConfig, setShowConfig] = useState(false)
  const [editCritical, setEditCritical] = useState(readinessConfig.criticalPathThreshold)
  const [editNonCritical, setEditNonCritical] = useState(readinessConfig.nonCriticalThreshold)

  const criticalItems = items.filter((i) => i.isCriticalPath)
  const criticalComplete = criticalItems.filter((i) => i.status === 'complete').length
  const criticalPercent = criticalItems.length > 0 ? Math.round((criticalComplete / criticalItems.length) * 100) : 100

  const nonCriticalItems = items.filter((i) => !i.isCriticalPath)
  const nonCriticalComplete = nonCriticalItems.filter((i) => i.status === 'complete').length
  const nonCriticalPercent = nonCriticalItems.length > 0 ? Math.round((nonCriticalComplete / nonCriticalItems.length) * 100) : 100

  const criticalReady = criticalPercent >= readinessConfig.criticalPathThreshold
  const nonCriticalReady = nonCriticalPercent >= readinessConfig.nonCriticalThreshold
  const overallReady = criticalReady && nonCriticalReady

  const indicatorColor = overallReady ? 'bg-green-500' : criticalReady ? 'bg-yellow-400' : 'bg-red-500'
  const indicatorBg = overallReady ? 'bg-green-50 border-green-200' : criticalReady ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
  const statusText = overallReady
    ? 'Klar for periodeavslutning'
    : `${criticalPercent}% av kritiske oppgaver fullfort — ${readinessConfig.criticalPathThreshold}% krevet for å fortsette.`

  const handleSave = () => {
    updateReadinessThreshold(editCritical, editNonCritical)
    setShowConfig(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Beredskapsindikator
        </h2>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Konfigurer terskel"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className={`rounded-lg border p-4 ${indicatorBg}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-4 h-4 rounded-full ${indicatorColor}`} />
          <span className="font-medium text-gray-900">{statusText}</span>
        </div>

        {/* Critical path progress */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Kritisk vei</span>
            <span className="font-medium text-gray-900">
              {criticalComplete}/{criticalItems.length} ({criticalPercent}%)
            </span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${criticalReady ? 'bg-green-500' : 'bg-red-400'}`}
              style={{ width: `${criticalPercent}%` }}
            />
          </div>
        </div>

        {/* Non-critical progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">Ikke-kritiske oppgaver</span>
            <span className="font-medium text-gray-900">
              {nonCriticalComplete}/{nonCriticalItems.length} ({nonCriticalPercent}%)
            </span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${nonCriticalReady ? 'bg-green-500' : 'bg-yellow-400'}`}
              style={{ width: `${nonCriticalPercent}%` }}
            />
          </div>
        </div>
      </div>

      {showConfig && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Konfigurer terskelverdier</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-gray-600">Kritisk vei minstekrav (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={editCritical}
                onChange={(e) => setEditCritical(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-600">Ikke-kritisk minstekrav (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={editNonCritical}
                onChange={(e) => setEditNonCritical(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              />
            </label>
          </div>
          <button
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Lagre
          </button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Add to App layout**

Add import to `src/App.tsx`:

```tsx
import ReadinessIndicator from './components/ReadinessIndicator'
```

Add `<ReadinessIndicator />` **before** `<CloseProgressOverview />` in the `<main>` body — it should be the first thing the accountant sees.

- [ ] **Step 3: Verify in browser**

Expected: Red indicator showing "33% av kritiske oppgaver fullfort — 100% krevet for å fortsette." with progress bars for critical and non-critical items. Gear icon opens threshold config form.

- [ ] **Step 4: Commit**

```bash
git add src/components/ReadinessIndicator.tsx src/App.tsx
git commit -m "feat: add readiness indicator with configurable threshold"
```

---

## Task 10: Final App Layout and Polish

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Finalize App.tsx layout with all components**

Replace `src/App.tsx` with the final layout:

```tsx
import { CloseProvider, useClose } from './context/CloseContext'
import ReadinessIndicator from './components/ReadinessIndicator'
import CloseProgressOverview from './components/CloseProgressOverview'
import ApprovalTaskList from './components/ApprovalTaskList'
import ApprovalStats from './components/ApprovalStats'
import { Calendar, Building2 } from 'lucide-react'

function Dashboard() {
  const { periodLabel, companyName, closeDeadline } = useClose()
  const daysLeft = Math.ceil(
    (new Date(closeDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const deadlineStr = new Date(closeDeadline).toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Period Closing Control Central
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {companyName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {periodLabel}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Frist for periodeavslutning</div>
            <div className="text-lg font-semibold text-gray-900">{deadlineStr}</div>
            {daysLeft > 0 ? (
              <div className="text-xs text-orange-600">{daysLeft} dager gjenstår</div>
            ) : (
              <div className="text-xs text-red-600 font-medium">Fristen er passert!</div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <ReadinessIndicator />
        <CloseProgressOverview />
        <ApprovalTaskList />
        <ApprovalStats />
      </main>

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-xs text-gray-400">
          Business NXT — Period Closing Control Central — Hackathon Demo
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <CloseProvider>
      <Dashboard />
    </CloseProvider>
  )
}
```

- [ ] **Step 2: Add a nicer font import to index.css**

Replace `src/index.css` with:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

Add to `index.html` inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Also update the `<title>` tag in `index.html` to:

```html
<title>Period Closing Control Central</title>
```

- [ ] **Step 3: Verify full application in browser**

```bash
npm run dev
```

Expected: Complete dashboard with:
- Header showing company name, period, deadline countdown
- Readiness indicator (red — critical path not complete)
- Phase-grouped close progress overview with collapsible sections
- Approval task table with overdue highlighting and reminder buttons
- Approval statistics in two-column grid
- Footer

- [ ] **Step 4: Run type check**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: finalize dashboard layout with header, footer, and all components"
```

---

## Summary of PRD Coverage

| PRD Requirement | Task | Component |
|---|---|---|
| FR-1: Close progress overview by phase | Task 5 | CloseProgressOverview |
| FR-2: Critical path prioritisation | Task 5 | CloseProgressOverview (sortByCriticality) |
| FR-3: Near real-time refresh | N/A (mock data, no backend) | — |
| FR-4: Approval task aggregation | Task 6 | ApprovalTaskList |
| FR-5: Overdue visual distinction | Task 6 | ApprovalTaskList (red row highlight) |
| FR-6: Send reminder from hub | Task 7 | ReminderButton |
| FR-7: Reminder history display | Task 7 | ReminderButton (history popover) |
| FR-8: Spam prevention (24h cooldown) | Task 3+7 | CloseContext + ReminderButton |
| FR-9: Per-approver stats | Task 8 | ApprovalStats |
| FR-10: Per-task-type stats | Task 8 | ApprovalStats |
| FR-11: Readiness indicator | Task 9 | ReadinessIndicator |
| FR-12: Configurable threshold | Task 9 | ReadinessIndicator (settings panel) |
| FR-13: Deep links to source modules | Task 5 | CloseProgressOverview (ExternalLink icons) |
