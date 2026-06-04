# Domain Model

The domain model should make legacy platform state understandable to agents
without hiding source provenance from humans.

## Core Entities

### WorkItem

A durable unit of engineering work.

Examples:

- Redmine issue.
- Redmine issue linked to Gerrit change and GitLab pipeline.
- Gerrit review thread that needs a response.

Fields:

```text
id
title
kind
state
priority
source_of_truth
current_owner
risk_level
created_at
updated_at
closed_at
```

States:

```text
new
triaged
ready_for_agent
running
waiting_approval
waiting_external_event
waiting_human
completed
failed
escalated
```

### ExternalObject

A source object from a connected platform.

Fields:

```text
id
platform
external_id
external_url
object_type
title
state
payload_hash
snapshot
fetched_at
```

Examples:

- `redmine.issue`
- `redmine.comment`
- `gerrit.change`
- `gerrit.patchset`
- `gerrit.review_comment`
- `gitlab.merge_request`
- `gitlab.pipeline`
- `gitlab.job`

### Event

Append-only record of something that happened.

Fields:

```text
id
source_platform
event_type
external_object_id
work_item_id
actor_ref
payload_hash
received_at
processed_at
```

The raw payload may be stored separately if needed for debugging and replay.

### AgentIdentity

The governed identity for an agent.

Fields:

```text
id
name
role
description
allowed_projects
allowed_platforms
allowed_tools
requires_approval_for
created_by
created_at
disabled_at
```

### AgentRun

A single attempt by an agent to process work.

Fields:

```text
id
agent_identity_id
work_item_id
runner_kind
goal
status
started_at
ended_at
summary
failure_reason
```

Statuses:

```text
queued
running
waiting_tool
waiting_approval
completed
failed
cancelled
```

### ToolCall

An MCP tool call or internal adapter call made during a run.

Fields:

```text
id
agent_run_id
tool_name
input_hash
output_hash
status
started_at
ended_at
risk_level
external_side_effect
```

### ContextPack

A versioned briefing for an agent.

Fields:

```text
id
work_item_id
version
orientation
reading_plan
evidence
unknowns
available_actions
policy_hints
source_refs
created_at
```

### UnderstandingCheck

The agent's structured proof that it understands the situation before acting.

Fields:

```text
id
agent_run_id
work_item_id
situation
current_state
evidence
unknowns
conflicts
proposed_next_action
risk_assessment
confidence
created_at
```

### ActionProposal

A proposed side effect.

Fields:

```text
id
agent_run_id
work_item_id
action_type
target_platform
target_external_object_id
preview
input
risk_level
policy_decision
status
created_at
executed_at
```

Statuses:

```text
draft
pending_approval
approved
rejected
executed
failed
cancelled
```

### Approval

Human or policy decision for an action proposal.

Fields:

```text
id
action_proposal_id
decision
decided_by
reason
created_at
```

Decisions:

```text
approved
rejected
edited
expired
```

### AuditLog

Immutable record of important system activity.

Fields:

```text
id
actor_type
actor_id
action
target_type
target_id
work_item_id
agent_run_id
source_ip
created_at
```

### Belief

Evidence-backed long-term memory.

Fields:

```text
id
scope_type
scope_id
statement
confidence
source_event_ids
source_object_ids
created_by
corrected_by
last_verified_at
expires_at
created_at
updated_at
```

Beliefs must be scoped and expirable. They should not become unbounded hidden
memory.

## Relationship Sketch

```text
WorkItem
  has many ExternalObjects
  has many Events
  has many ContextPacks
  has many AgentRuns
  has many ActionProposals
  has many Beliefs

AgentRun
  belongs to AgentIdentity
  belongs to WorkItem
  has many ToolCalls
  has many UnderstandingChecks
  has many ActionProposals

ActionProposal
  belongs to AgentRun
  has many Approvals
  has many AuditLogs
```

## Source of Truth Rule

Cograil stores durable work state, but connected platforms remain authoritative
for their own objects.

If Redmine says an issue is closed and Cograil has stale state, Redmine wins.
Cograil should record the conflict, refresh snapshots, and update derived state.
