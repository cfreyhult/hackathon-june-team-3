---
feature: Period Closing Control Central
slug: period-closing-control-central
date: 2026-06-04
author: Christina Freyhult
status: Draft
suite: business-nxt
linked-process: /processes/period-closing/
linked-value-propositions:
  - /processes/period-closing/#close-calendar-discipline
  - /processes/period-closing/#predictable-variance-review
  - /clusters/approval/#approval-throughput-visibility
linked-actors:
  - /actors/accountant/
  - /actors/controller/
  - /actors/project-manager/
linked-strategy-sections:
  - /strategy/how-to-win/#a-compelling-value-proposition
  - /strategy/capabilities/#the-need-for-transformation
  - /strategy/capabilities/#artificial-intelligence
strategy-fit-score: 85
strategy-fit-verdict: aligned
---

# Period Closing Control Central

A unified close-progress hub in Business NXT that gives accountants, controllers, and project managers a single view of what remains to close the period — prioritised by urgency, enriched with approval-status context, and equipped with one-click reminder tools. The accountant no longer needs to hold the close checklist in their head or context-switch across modules to assess readiness; the hub tells them what needs attention now, who is blocking it, and provides the tools to act without leaving the screen. The outcome is a faster, more predictable close: the team reaches "good enough to lock" with fewer escalations and fewer missed deadlines.

---

## Problem

**Core pain:** The accountant must mentally aggregate the state of the close from multiple modules — outstanding approvals in Approval, open accruals in Accounting, unposted project journals in Project Financial Management, unreconciled bank lines — while simultaneously chasing approvers who have not acted within the close window. This dual load (status aggregation + human coordination) is the primary reason closes slip past their target date.

**Evidence from strategy:**
- The Period Closing process file (`/processes/period-closing/`) names "Close-Calendar Discipline" and "Predictable Variance Review" as the two value props most at risk when status aggregation is manual.
- The Approval VP (`/clusters/approval/`) identifies "Approval Throughput Visibility" as a directly named value prop: *"A controller can see that the period-closing approvals are slipping."* This is the exact pain this feature addresses.
- SWOT for Business NXT identifies **"it's too cumbersome to activate more features/modules"** and **"the administration is experienced as fragmented"** as active weaknesses — a close hub directly removes fragmentation at the most time-critical moment in the finance calendar.
- The strategy's transformation pillar calls out **"seamless digital workflows instead of disconnected tools"** as a top customer expectation.

**Missing evidence to collect before In Review:**
- Support ticket volume tagged to period-close delays and approval chasing.
- NPS verbatim comments from accountants referencing close complexity.
- Time-in-motion study or customer interview confirming the context-switch cost.

---

## Target actors

- **[Accountant](/actors/accountant/)** — MLE & Upper SMB — *Primary.* The close hub replaces their mental checklist and eliminates context-switching. They see the full close status, act on outstanding tasks, and decide when the period is "good enough to lock."
- **[Controller](/actors/controller/)** — MLE & Upper SMB — *Primary.* Owns the close calendar and tracks progress across entities or departments. Consumes the aggregated close-day dashboard to identify bottlenecks before they slip the close date.
- **[Project Manager](/actors/project-manager/)** — MLE — *Secondary.* Needs visibility on whether project-linked journals, accruals, and milestone approvals are settled before the period locks. Does not drive the close but can unblock it by acting on open project tasks.

---

## Linked value propositions

- [Period Closing → Close-Calendar Discipline](/processes/period-closing/#close-calendar-discipline) — the hub makes the close calendar the operating contract by surfacing real-time progress against it.
- [Period Closing → Predictable Variance Review](/processes/period-closing/#predictable-variance-review) — outstanding items in the hub are the pre-variance queue; clearing them prevents surprises at sign-off.
- [Approval → Approval Throughput Visibility](/clusters/approval/#approval-throughput-visibility) — the hub is the period-close slice of the broader approval throughput picture; it surfaces approval bottlenecks in the context of the close deadline.

---

## Linked process

- [Period Closing](/processes/period-closing/)

The feature acts primarily in **Phase 1 (Pre-close)** and **Phase 3 (Variance review & sign-off)**. During Pre-close, the hub surfaces the sub-ledger sweep status and outstanding approval tasks that must clear before the close run. During Variance review & sign-off, it shows the variance queue depth and sign-off posture across the entities and actors involved, and provides the reminder tooling to accelerate the final clearance.

The feature has a secondary touchpoint on **Phase 2 (Close run)** — it shows the live progress of recurring journals and AI-drafted accruals so the accountant knows when the close run is complete and the variance queue is ready to work.

---

## In scope

1. **Close progress overview** — a single-screen view of the current period's close status, organised by close phase (Pre-close / Close run / Variance & sign-off), showing completed, open, and blocked items per phase.
2. **Task prioritisation** — items are ranked by their impact on the close date: items on the critical path (blocking the period lock) appear at the top; items that can slip without affecting the close date are clearly distinguished.
3. **Approval status aggregation** — outstanding approval tasks from Approval (supplier invoices, period-adjustment journals, expense claims, project invoices) are surfaced in context of the close deadline, showing approver, age of task, and SLA status.
4. **Multi-channel reminder sending** — the accountant can send reminders to individual approvers or groups directly from the hub, via in-app notification and email, without leaving the screen. Reminder history is visible per task.
5. **Approval behaviour statistics** — per-approver and per-task-type statistics showing historical approval completion times, typical delay patterns, and current-period vs historical comparison. Used to prioritise who to chase first.
6. **"Good enough to close" readiness indicator** — a configurable readiness threshold (e.g. all critical-path tasks cleared, ≥ N% of non-critical tasks cleared) that the accountant uses to decide whether to proceed with the period lock. The threshold is set by the controller or administrator; the hub shows current status against it.
7. **Direct links to open tasks** — every item in the hub is a deep link into the source module (Approval, Accounting, Project Financial Management) so the accountant can act without manually navigating.

---

## Out of scope

1. **Full financial reporting** — the hub shows close progress and task status, not trial balance output, variance reports, or management accounts. Reporting is owned by Reporting & Insight.
2. **Setting up or modifying approval flows** — approval rule configuration (who approves what, auto-approval thresholds, delegation rules) remains in Approval. The hub consumes approval state; it does not configure it.
3. **Running or scheduling the close** — triggering the close run, posting recurring journals, or applying the period lock is out of scope. The hub surfaces the status of these actions; it does not initiate them.
4. **Multi-entity consolidation view** — cross-entity group close coordination is a future phase. V1 targets single-entity close for Business NXT. Multi-entity is explicitly deferred.
5. **Mobile surface** — V1 targets the web UI. Mobile / Manager app surfacing is a follow-on, dependent on Approval's multi-surface roadmap.
6. **AI-drafted accrual review** — accrual drafting and approval is owned by the Period Closing close-run mechanics. The hub shows accrual approval status as an item; it does not replicate the accrual review UI.

---

## Functional requirements

### Overview & prioritisation

**FR-1:** The system MUST display a close-progress overview for the current open period, organised by close phase, showing each item's status (complete / open / blocked / overdue).

**FR-2:** The system MUST rank open items by criticality: items on the critical path to the period lock appear before items that do not block the close.

**FR-3:** The system MUST refresh close-progress status in near real time (≤ 5 minutes lag from source system events).

### Approval status aggregation

**FR-4:** The system MUST surface all outstanding approval tasks linked to the current period from the Approval service, showing task type, approver name, creation date, and days outstanding.

**FR-5:** The system MUST visually distinguish approval tasks that are overdue against the close deadline from those that are within tolerance.

### Reminder tooling

**FR-6:** The system MUST allow the accountant or controller to send a reminder to one or more approvers for a specific open task, via in-app notification and email, from within the hub without navigating away.

**FR-7:** The system MUST record and display the reminder history per task (sender, timestamp, channel) so the accountant can see what has already been sent.

**FR-8:** The system MUST prevent duplicate reminder spam: a reminder cannot be resent to the same approver for the same task within a configurable minimum interval (default: 24 hours).

### Approval behaviour statistics

**FR-9:** The system MUST display per-approver historical approval completion time (average, P90) for the current period type, derived from at least the previous 6 periods.

**FR-10:** The system MUST display per-task-type average approval time so the accountant can identify which task categories typically cause delays.

### Readiness indicator

**FR-11:** The system MUST display a close-readiness status against the configured threshold (set by controller or administrator), showing current completion percentage for critical-path and non-critical items.

**FR-12:** The system MUST allow the controller or administrator to configure the readiness threshold (minimum percentage of critical-path tasks complete required before the readiness indicator shows green).

### Navigation

**FR-13:** Every open item in the hub MUST be a deep link that opens the corresponding task in its source module (Approval, Accounting, Project Financial Management) in the same or a new tab.

---

## Non-functional requirements

### Performance
- Close-progress overview must load in < 2 seconds for a period with up to 200 open items.
- Reminder sending must complete (confirmation returned to UI) in < 3 seconds.

### Security & compliance
- Access to the hub is governed by the user's existing role permissions in Business NXT. Accountants and controllers see all items for their entity. Project managers see only project-linked items.
- Reminder messages sent via email must comply with GDPR data-minimisation principles — they must not include financial amounts or personal data beyond the approver's name and task reference.
- Full audit trail of reminders sent (sender, recipient, timestamp, channel) is retained for the same retention period as the period-close audit trail (5 years NO/SE, 5 years DK per Bogføringsloven 2022).
- Reference: [`/strategy/capabilities/#embedded-security-at-every-level`](/strategy/capabilities/#embedded-security-at-every-level)

### Localisation
- **Norway, Sweden, Denmark** supported at launch (aligned with Business NXT's three primary markets).
- Date formats, week numbering, and close-calendar references must respect locale.
- Reminder email templates must be available in Norwegian, Swedish, Danish, and English.

### Observability
- Log all reminder-send events (sender, recipient, task ID, channel, outcome) to the audit trail.
- Emit a metric: `close_hub.items_cleared_per_session` — measures how many open items an accountant resolves per hub session. Baseline to be measured post-launch; target: rising trend over first 6 periods.
- Emit a metric: `close_hub.reminder_to_approval_lag` — time between a reminder being sent and the corresponding approval task being completed. Maps to the *Approval cycle time* metric in the Approval VP.

### Accessibility
- WCAG 2.1 AA compliance for all web UI surfaces.

---

## Success metrics

| Metric | Definition | Source | Baseline | Target |
|---|---|---|---|---|
| **Days to Close** | Days from period-end to signed trial balance | ERP period-lock timestamp vs period-end date | To be measured (establish over first 3 periods post-launch) | Reduce by ≥ 1 day vs pre-launch baseline within 6 periods |
| **Approval tasks cleared within close window** | % of period-linked approval tasks completed before the period-lock date | Approval service + period-lock event | To be measured | Increase by ≥ 15 percentage points vs pre-launch baseline within 3 periods |
| **Reminder-to-approval lag** | Median time from reminder sent to approval task completed | Hub audit log + Approval decision timestamp | To be measured | < 4 business hours median within 6 periods |
| **Hub adoption** | % of accountant/controller users who open the hub at least once per close cycle | Product analytics | 0% (new feature) | ≥ 70% of active accountants within 3 periods of launch |

The *Approval tasks cleared within close window* metric maps directly to the *Approval cycle time per host process* metric in the Approval VP (`/clusters/approval/#metrics`), scoped to the period-closing host process.

---

## Acceptance criteria

### FR-1 & FR-2: Close progress overview with prioritisation

- **Given** the current period has open items across multiple close phases
  **When** an accountant opens the hub
  **Then** the system MUST display items grouped by phase (Pre-close / Close run / Variance & sign-off)
  **And** items on the critical path MUST appear before non-critical items within each phase
  **And** each item MUST show its current status (complete / open / blocked / overdue).

### FR-6 & FR-8: Reminder sending with spam prevention

- **Given** an approval task has been outstanding for more than the minimum reminder interval (24 hours default)
  **When** the accountant clicks "Send reminder" for that task
  **Then** the system MUST send an in-app notification and email to the approver
  **And** record the event in the reminder history with sender, timestamp, and channel
  **And** disable the "Send reminder" button for that task until the minimum interval has elapsed.

- **Given** the accountant attempts to send a reminder within the minimum interval
  **When** they click "Send reminder"
  **Then** the system MUST display a message indicating the next eligible reminder time
  **And** NOT send a reminder.

### FR-11: Readiness indicator

- **Given** the controller has configured a readiness threshold of 100% critical-path tasks
  **And** 80% of critical-path tasks are currently complete
  **When** the accountant views the hub
  **Then** the readiness indicator MUST display amber (not ready)
  **And** show "80% of critical-path tasks complete — 100% required to proceed."

- **Given** all critical-path tasks are complete
  **When** the accountant views the hub
  **Then** the readiness indicator MUST display green
  **And** show the current completion percentage for non-critical tasks alongside.

### FR-13: Deep links

- **Given** an open approval task is displayed in the hub
  **When** the accountant clicks the task
  **Then** the system MUST navigate to the corresponding task in the Approval service
  **And** the task MUST be pre-selected / highlighted on arrival.

---

## Dependencies & risks

**Depends on:**
- **Approval service API** — the hub consumes approval task state, approver identity, task age, and decision events from the Approval service. Approval's direct source-system integration roadmap (MDM/MR migration, target Jan 2028) must expose period-close approval tasks with sufficient metadata. PRD to be linked once authored.
- **Period Closing close-calendar data** — the hub needs access to the close calendar (target close date, phase boundaries, critical-path definition) to calculate deadline proximity and readiness. This data must be structured and queryable; current state unknown — flagged as open question.
- **Notification infrastructure** — in-app notification and email sending infrastructure must support reminder-type messages with audit-trail retention. Confirm with platform team.

**Blocks:**
- A future multi-entity close coordination feature would naturally extend this hub. V1 single-entity scope does not block it, but the data model should anticipate entity-scoping from the start.

**Risks:**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Approval API does not expose sufficient period-close task metadata | Medium | High | Align with Approval PM early; define minimum API contract before engineering starts |
| Close-calendar data is not structured/queryable in current BNXT data model | Medium | High | Spike in discovery phase; may require data-model work that extends timeline |
| Accountants bypass the hub and continue using existing manual methods | Medium | Medium | Onboarding flow; ensure hub is surfaced prominently in the period-close workflow, not as an opt-in side panel |
| Reminder emails trigger GDPR concerns from customers | Low | Medium | Legal review of reminder template content before launch |

---

## Open questions

1. **Close-calendar data availability** — Is the period close calendar (target close date, phase definitions, critical-path task list) already structured and queryable in Business NXT, or does this require data-model work? **Owner: Engineering lead. Decision deadline: 2026-07-01.**
2. **Critical-path definition** — Who defines which close tasks are "critical path" vs non-critical — the customer (configurable), VSN (opinionated default), or a combination? **Owner: Product Manager + Controller subject-matter expert. Decision deadline: 2026-07-15.**
3. **Approval API contract** — What approval task metadata does the Approval service currently expose, and what is the minimum contract needed for this hub? Is a new endpoint required? **Owner: Approval PM + Engineering. Decision deadline: 2026-07-01.**
4. **Reminder channel scope** — V1 specifies in-app + email. Should MS Teams be included in V1 given Approval's Teams integration roadmap? **Owner: Product Manager. Decision deadline: 2026-07-15.**
5. **Project manager scope** — Project managers are listed as secondary actors seeing project-linked items only. Is there appetite from the Project Financial Management team to expose project close status via the same hub, or should project items be a V2 addition? **Owner: Project Financial Management PM. Decision deadline: 2026-08-01.**

---

## Strategy alignment

### Verdict
🟢 Aligned

### Strategy Fit Score: 85 / 100

---

### Strategic fit [40%] — 34/40

The feature directly operationalises two of the seven Period Closing value propositions (**Close-Calendar Discipline** and **Predictable Variance Review**) and the Approval VP's **Approval Throughput Visibility** — all three are named, documented value props with existing strategy backing.

The strategy explicitly identifies the pain this feature solves: the SWOT weakness *"the administration is experienced as fragmented"* and *"it's too cumbersome to activate more features/modules"* both manifest acutely at period close, and this feature removes fragmentation at the most time-critical moment in the finance calendar.

The feature advances the AI & Automation pillar by surfacing approval-behaviour statistics and readiness indicators — making the close a data-driven decision rather than a judgment call held in the accountant's head. This is consistent with the strategy principle *"seamless digital workflows instead of disconnected tools."*

Minor deduction: the feature does not yet incorporate AI-powered predictions (e.g. "at current approval pace, you will miss your close date by 2 days") — this would be a natural V2 extension that would fully realise the AI pillar.

### Actor fit [25%] — 22/25

All three actors (Accountant, Controller, Project Manager) are canonical slugs with documented roles in the Period Closing and Approval process files. The actor priority order (Accountant primary, Controller primary, Project Manager secondary) is consistent with the process file's actor descriptions.

Minor deduction: the PRD scopes Project Manager to project-linked items only, which is correct — but the boundary between what the Project Manager sees and what the Accountant sees needs explicit product design. If the boundary is unclear in implementation, the Project Manager may see too little to act or too much to focus.

### Non-goal conflicts [25%] — 25/25

No conflicts with stated non-goals:
- ✅ Does not provide full reporting (explicitly out of scope).
- ✅ Does not set up or modify approval flows (explicitly out of scope).
- ✅ Does not trigger the close run or period lock (explicitly out of scope).
- ✅ Scoped to Business NXT; no distributor or cross-Visma-BU implications.
- ✅ Single-entity V1; multi-entity deferred with clear rationale.

### Trade-offs [10%] — 4/10

- The hub's value depends entirely on the quality of data it aggregates. If the Approval API or close-calendar data is incomplete, the hub shows a partial picture — which may be worse than no picture (false confidence). This is the primary delivery risk and is flagged as open questions 1 and 3.
- Configurable readiness threshold (FR-12) introduces customer configuration overhead. If the default threshold is wrong for a customer's close culture, adoption suffers. Recommend shipping a sensible opinionated default (100% critical-path tasks) with the option to adjust, rather than requiring configuration before use.

---

### Recommendation
> Proceed to discovery and engineering scoping. Resolve open questions 1 (close-calendar data) and 3 (Approval API contract) before committing to a delivery timeline — these are the two load-bearing technical dependencies. Promote to `In review` once both are answered and a customer interview or support-data evidence triple (actor + process + evidence) has been assembled to confirm the pain magnitude.

---

## Stakeholders

- **Product Manager:** Christina Freyhult
- **Product Lead:** TBD
- **Service Delivery Team / squad:** TBD — Period Closing + Approval intersection; confirm squad ownership
- **Product Marketing Manager:** TBD
- **Customer Success / Partner contact:** TBD — identify a BNXT accountant customer for validation interview
- **Legal / Compliance reviewer:** Required before launch for GDPR review of reminder email content
