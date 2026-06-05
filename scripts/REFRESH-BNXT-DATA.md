# Business NXT Data Refresh Procedure

This document defines the MCP queries Claude runs to refresh the dashboard data.
Ask Claude: "refresh the Business NXT data" and it will execute this procedure.

## Prerequisites

- Business NXT MCP must be connected and authenticated
- Customer: "VBNXT production test1#"
- Tenants: 1368910, 3396575

## Companies

| companyNo | name                  | tenantId |
|-----------|-----------------------|----------|
| 4810168   | Demo Business NXT AS  | 1368910  |
| 4810161   | Demo BNXT AS          | 1368910  |
| 4191481   | Erling NXT Demo       | 3396575  |
| 4119784   | Inga AS               | 3396575  |

## For each company, run:

### 1. Init company

```
businessnxt-init_company(tenantId, companyNo)
```

### 2. Fetch incoming accounting documents

```graphql
query {
  useCompany(no: $companyNo) {
    incomingAccountingDocument(first: 50, filter: { changedDate_gte: 20260101 }, orderBy: { incomingAccountingDocumentNo: DESC }) {
      totalCount
      items {
        incomingAccountingDocumentNo
        description
        documentDate
        dueDate
        supplierNo
        supplierName
        incomingAccountingDocumentStatusFlags
        incomingAccountingDocumentType
        incomingAccountingDocumentOrigin
        invoiceNo
        voucherNo
        createdDate
        changedDate
      }
    }
  }
}
```

### 3. Fetch supplier current balances

```graphql
query {
  useCompany(no: $companyNo) {
    supplierCurrentBalance(first: 30, filter: { outstandingAmount_ne: 0 }, orderBy: { outstandingAmount: ASC }) {
      totalCount
      items {
        supplierNo
        name
        outstandingAmount
        numberOfOpenEntries
        oldestDueDate
      }
    }
  }
}
```

### 4. Fetch active approval tasks

```graphql
query {
  useCompany(no: $companyNo) {
    approvalTask(first: 50, filter: { approvalTaskStatus_in: [1, 2, 3, 6, 9] }, orderBy: { approvalTaskNo: DESC }) {
      totalCount
      items {
        approvalTaskNo
        approvalTaskStatus
        description
      }
    }
  }
}
```

Also fetch recently completed/rejected tasks:

```graphql
query {
  useCompany(no: $companyNo) {
    approvalTask(first: 20, filter: { approvalTaskStatus_in: [4, 5, 8] }, orderBy: { approvalTaskNo: DESC }) {
      totalCount
      items {
        approvalTaskNo
        approvalTaskStatus
        description
      }
    }
  }
}
```

### 5. For each approval task, fetch change log to extract approval chain

```graphql
query {
  useCompany(no: $companyNo) {
    approvalTaskChangeLog(
      filter: { approvalTaskNo: $taskNo, action_in: [1, 3, 4, 5] }
      orderBy: { approvalTaskChangeLogNo: ASC }
    ) {
      items {
        approvalTaskChangeLogNo
        approvalTaskNo
        action
        messageXml @decodeBase64
        changedDate
      }
    }
  }
}
```

#### Parse the XML from change log entries:

- **action=1 (Sent)**: Extract `<manualWorkflowDefinition>` → `<step>` elements define the approval chain. Each step has:
  - `stepId` attribute (ordering)
  - `xsi:type` → "andStep" or "orStep"
  - `<approver type="Email">` → approver email
  - Also extract: supplier name/number, invoice amount, due date, invoice number from the XML
  
- **action=3 (WaitingForApproval)**: Extract `<users>` → current active approver details (firstName, lastName, email)

- **action=4 (Approved)**: The step was approved

- **action=5 (Rejected)**: The step was rejected

#### Build the approval task object:

Map each task to this structure:
```json
{
  "taskNo": 626,
  "description": "Faktura 1001563 — Kontorpluss AS",
  "status": "waiting",
  "supplierNo": 50000,
  "supplierName": "Kontorpluss AS",
  "invoiceNo": "1001563",
  "amount": 1475,
  "dueDate": "2025-09-03",
  "createdDate": "2025-08-20",
  "flowName": "Tre step flyt",
  "steps": [
    {
      "stepId": 1,
      "stepType": "and",
      "approvers": [{ "email": "user@example.com", "name": "Full Name" }],
      "status": "active"
    }
  ],
  "currentStepId": 1,
  "currentApprover": { "email": "user@example.com", "name": "Full Name" }
}
```

Status mapping: 1→"sent", 3→"waiting", 4→"approved", 5→"rejected", 7→"cancelled", 8→"error", 9→"in-flow"

Step status logic:
- Steps before the current step: "approved"
- The current step: "active"
- Steps after the current step: "pending"
- If task is rejected, the failing step: "rejected"

### 6. Write JSON file

Write the results to `public/data/{companyNo}.json` with this structure:

```json
{
  "companyNo": 4810168,
  "companyName": "Demo Business NXT AS",
  "tenantId": 1368910,
  "periodLabel": "Mai 2026",
  "closeDeadline": "2026-06-10",
  "fetchedAt": "2026-06-05T14:30:00Z",
  "documents": [ ... ],
  "supplierBalances": [ ... ],
  "approvalTasks": [ ... ]
}
```

Set `fetchedAt` to the current ISO timestamp.

## After all companies

The app's refresh button will pick up the new JSON files immediately.
