# Demo Scenario

The first demo should show one complete loop that feels real to legacy
engineering teams.

## Scenario

Redmine receives a new bug:

```text
REDMINE-4218: Payment callback timeout after retry change
```

The bug is linked to:

- Gerrit change `Iabc123`.
- Latest Gerrit patchset `7`.
- GitLab pipeline `33891`.
- Failed GitLab job `payment-e2e`.

## Demo Data

### Redmine Issue

Title:

```text
Payment callback timeout after retry change
```

Description:

```text
Callbacks to the payment gateway started timing out after the retry behavior
change. The customer impact is intermittent duplicate payment confirmation
delays.
```

Latest comments:

```text
Alice: This started after the retry interval change landed.
Bob: Please check whether idempotency still holds when retries exceed 3 attempts.
Chen: CI is currently red on payment-e2e.
```

### Gerrit Change

```text
Project: payment-service
Branch: main
Change: Iabc123
Subject: Adjust callback retry interval
Patchset: 7
Review state: open
```

Unresolved review comment:

```text
Please explain how this behaves when the gateway returns 504 for more than 30s.
```

### GitLab Pipeline

```text
Pipeline: 33891
Status: failed
Failed job: payment-e2e
Failure summary: callback retry test exceeded timeout threshold
```

## Expected Cograil Behavior

### 1. Ingest Event

Cograil receives a Redmine issue event and creates a work item.

Expected state:

```text
WorkItem wi_4218
state: ready_for_agent
source_of_truth: redmine:4218
linked objects:
  - redmine:4218
  - gerrit:Iabc123
  - gitlab:pipeline:33891
```

### 2. Compile Context Pack

Cograil produces a compact context pack:

```text
Objective:
Understand the payment callback timeout and propose a safe update.

Evidence:
- Redmine comment says timeout started after retry interval change.
- Gerrit review asks about 504 behavior over 30s.
- GitLab payment-e2e pipeline is failing on retry timeout.

Unknowns:
- Whether the failure reproduces locally.
- Whether the issue is retry configuration or external gateway latency.

Available actions:
- submit understanding check
- propose Redmine comment
```

### 3. Agent Reads Through MCP

The agent calls:

```text
cograil_workitem_get
cograil_context_pack_get
cograil_external_object_read
```

### 4. Agent Submits Understanding

The agent submits:

```text
Situation:
Payment callback timeouts appear related to a retry interval change.

Evidence:
Redmine, Gerrit, and GitLab all point at retry behavior.

Unknowns:
Local reproduction and external gateway timing are not yet confirmed.

Risk:
Posting a status comment is low risk. Changing status would be higher risk.
```

### 5. Agent Proposes Action

The agent proposes a Redmine comment:

```text
I found three signals pointing at retry behavior: the Redmine report started
after the retry interval change, Gerrit has an unresolved question about 504
responses over 30s, and GitLab payment-e2e is failing on retry timeout. I will
focus investigation on retry configuration and idempotency before suggesting a
status change.
```

### 6. Human Approves

The approval screen shows:

- Proposed comment.
- Agent identity.
- Evidence.
- Unknowns.
- Policy decision.
- Target Redmine issue.

The human clicks approve.

### 7. Cograil Writes Back

Cograil posts the comment to Redmine and records:

```text
ActionProposal ap_001 -> executed
AuditLog -> redmine.comment.post
External result -> comment id 9862
```

## What the Demo Proves

The demo proves that Cograil can:

- Normalize events.
- Link platform context.
- Give agents compact context.
- Require understanding before action.
- Gate side effects through approval.
- Write back safely.
- Produce an audit trail.

It intentionally does not prove automatic fixing, merging, or full workflow
automation. Those should come after the safe loop is reliable.
