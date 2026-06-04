---

```
# CONTEXT: User Research — Period Closing in Business NXT (ERP System)

## Background
This data is from user research interviews and internal expert sessions about the
"period closing" (periodeavslutning) process in a cloud-based ERP system called
Business NXT. Participants include accountants and an internal product expert.

---

## DOCUMENT 1: Interview Guide Topics (Used to Structure Research Sessions)

Themes explored in interviews:
- Interviewee role and experience with the system
- Usability rating (1–10 scale) for performing period closing
- Timing: When does the process start? When must reports be ready?
- Number of people involved in the process
- Process flow: natural start/end? Sequential steps?
  - Typical steps: accruals, bank reconciliation, periodisations, payroll,
    VAT reporting, depreciation, currency adjustments, consolidation
- Dependency: Does step A have to happen before step B?
- Time per step in a normal month
- Manual vs. system-supported work: What is done outside the system?
- Integration with other systems (time tracking, project systems, etc.)
- Pain points: Which steps take too long? Which are most feared to fail?
- Drill-down: How easy is it to find the root cause when numbers don't add up?
- Wishlist: "If you could press one button to automate 2 hours of work, what would it do?"
- Control reports: What is needed to feel confident the period is correctly closed?
- System guidance: Does the system show where you are in the process?
- Experience from other systems

---

## DOCUMENT 2: Internal Expert Session — Process Walk-Through

Source: Internal session with a product expert (role: Product Expert / ERP specialist)

Key findings:

**Closing frequency varies widely**
- Some companies close monthly, some every other month (often tied to VAT reporting),
  some annually (low turnover, no VAT).
- Accounting firms (regnskapsbyrå) tend to close when VAT is submitted.
- Large corporations may require a hard close 2–3 days into the next period.

**Usability rating: ~5/10**
- Rated "middle of the road" — functional but involves many manual steps.
- Automation features exist in the system but are almost entirely unknown to users.
- Even with full automation, users spend 30–60 minutes; it should take ~2 minutes.

**Typical process (1 person, starting ~day 5 of next month)**
- The process usually involves one person.
- Main blocker: invoices that are not yet approved/booked. Accountant must call
  approvers to get them to act before the period can be locked.
- Recurring invoices that haven't arrived must be accrued manually.

**Wishlist from expert**
- A single "Run Period Closing" button that:
  1. Asks you to set the lock date
  2. Lists all outstanding tasks before locking (e.g. unapproved invoices,
     missing depreciations)
  3. Suggests: "These invoices are not yet approved. Should I create accruals?"
  4. Offers checkboxes for items to handle
  5. Auto-moves unapproved items to next period, runs depreciations, etc.
- This button should also trigger automatically when running the VAT report
  (so users who only close for VAT get the same benefit without extra steps)

**System guidance**
- The system does NOT guide users through the process.
- There is no checklist or status indicator.
- Users must know the full sequence themselves — "you have to know where to go,
  where to go, where to go."

**External systems**
- Some data must be fetched from external systems before closing:
  - Time-tracking systems (for cost allocation)
  - Project systems (for revenue recognition on ongoing projects, e.g.
    recognising partial revenue on a 3-month consulting project)
- Answers will vary greatly depending on the company's system landscape.

---

## DOCUMENT 3: Customer Interview — Accountant at an Accounting Firm

Source: Interview with an experienced accountant (superuser, 15+ years with the
vendor's product suite, works at an accounting firm, manages multiple client companies)

**Role and experience**
- Superuser and responsible for accounting processes at an accounting firm
- Has used the vendor's products since 2007: ERP, payroll, reporting, approval,
  expense systems
- Currently uses only Business NXT (not legacy version)

**What is a period closing?**
- Locking the accounts for a given period (monthly, per VAT term, quarterly, annually)
- Purpose: Quality assurance of the accounts before reporting to authorities,
  board, or management
- Also serves as a management steering tool — "we don't make accounts just to
  report VAT"
- Example: One client is stock-listed with quarterly reporting, which doesn't
  align with VAT terms — emphasising that closing is about more than compliance

**Usability rating: ~5/10**
- "Not very easy. I wouldn't give it more than a 5."
- "It's doable, but it's manual. You don't get much help from the system."
- Has created her own written working routines for what to do before closing.

**Typical process (VAT term example)**
- Timing: Aligns closing with VAT submission deadline (e.g. submit by the 20th →
  close accounts by the 20th)
- Duration: 1–5 hours depending on complexity (transactions, projects, departments,
  accruals)
- Uses a reconciliation program (external tool) to get a proper trial balance
  (saldobalanse) — Business NXT alone is not sufficient
- Compares month-to-month or year-on-year to spot anomalies (e.g. unexpected
  bonus payments, missing recurring income like rent)

**Steps performed (in order)**
1. Bank reconciliation (bankavstemming)
2. VAT report (momsrapport)
3. Depreciation (avskrivninger)
4. Periodisations and accruals (periodiseringer og avsetninger) — done last

**Positive system behaviour noted**
- The system has a "valuation date" (valueringsdato) override on top of the
  document date (bilagsdato). This allows posting to the correct period without
  altering the original document date — considered logical and helpful.
- On locked periods: once VAT is submitted, the system prevents further postings
  to that period.

**Pain points**
- Business NXT alone cannot produce a proper trial balance — external reporting
  tool required (One Stop Reporting)
- No system guidance through the closing steps
- Manual reconciliation process — though she notes AI could help here
- Uses a separate reconciliation/matching program that she accesses via a
  period-comparison view to spot deviations

**Quotes (anonymised)**
- "I've created my own working routines for what I do before I lock."
- "You don't get much help from the system. You have to know what to do yourself."
- "I couldn't do a proper period closing in [the ERP] alone."

---

## DOCUMENT 4: Synthesised Insight — Top Pain Points

**#1 — Missing and unapproved invoices (biggest pain point)**
Called "the main blocker." Every invoice for the period must be booked before
locking. Invoices stuck in approval flows require manual follow-up (phone calls).
Expected recurring invoices that haven't arrived (rent, utilities) must be manually
accrued. No proactive system prompt or automated accrual suggestions exist.

**#2 — No system guidance or checklist**
The system does not guide users through closing steps. Users rely on their own
written routines or memory. Even where automation exists, it is virtually unknown
to users. With full automation, closing should take ~2 minutes; in practice it
takes 30–60 minutes.

**#3 — VAT analysis arrives too late**
Warnings about VAT report errors only appear after submission — too late to fix
without reopening the period. Users want proactive pre-submission analysis.

**Honourable mention — External reconciliation tools required**
Business NXT is not considered sufficient for a complete period closing on its own.
Users rely on an external reporting tool (e.g. "One Stop Reporting") to get a
proper trial balance, adding friction and context-switching.

---

## DOCUMENT 5: Synthesised Insight — Standard Monthly Closing Procedure in Business NXT

Step-by-step process (current state, mostly manual):

1. **Ensure all invoices are approved and posted**
   All invoices for the period must be approved and booked before locking.
   Unapproved invoices block the close. Accountant contacts approvers manually.

2. **Accruals and periodisations**
   Match costs and revenues to the correct period (matching principle).
   Includes manual accruals for invoices not yet received.

3. **Bank reconciliation**
   Reconcile bank accounts against the ledger.

4. **VAT/Moms reporting**
   Run the VAT report. For many, this is the primary closing trigger.
   Submitting to the tax authority automatically locks the period.

5. **Depreciation**
   Run fixed asset depreciation. Can potentially be automated if no new
   assets have been activated.

6. **Currency adjustments**
   Adjust open items and balances for foreign currency fluctuations.

7. **Consolidation (if applicable)**
   Consolidate figures from subsidiaries. Hard close often required 2–3 days
   into the following period.

8. **Lock/close the period**
   Set the lock date in company settings to the last day of the period.
   Alternatively, submitting the VAT report via the tax authority portal
   automatically locks the period.

Note: The system does not guide users through these steps. Users must know
the correct sequence themselves.
```

---

