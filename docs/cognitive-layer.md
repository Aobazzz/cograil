# Cognitive Layer

The cognitive layer is what makes Cograil more than a connector bundle. It
structures how an agent understands work before it acts.

## Goal

When an agent receives a work item, it should know:

- Who it is.
- What it is responsible for.
- Which systems matter.
- Which object is the source of truth.
- What happened recently.
- What evidence supports the current understanding.
- What remains unknown.
- What action is allowed next.

## Agent Self Model

Each run starts with an identity briefing.

Example:

```yaml
agent_id: codex-backend
role: backend maintenance engineer
scope:
  projects:
    - payment-service
  systems:
    - redmine
    - gerrit
    - gitlab
can_do:
  - read work items
  - inspect reviews
  - inspect pipeline state
  - propose comments
requires_approval:
  - post comments
  - transition issue status
  - submit review labels
  - merge changes
style:
  - cite evidence
  - state unknowns
  - avoid destructive actions without approval
```

The self model belongs to Cograil, not to the model provider.

## World Model

Cograil explains platform roles to the agent.

Initial defaults:

```text
Redmine = issue, project, status, business discussion source of truth.
Gerrit = code review, patchset, reviewer feedback source of truth.
GitLab = repository mirror, merge request, CI pipeline, job log source of truth.
```

The world model may be customized per team or project.

## Reading Model

Agents should not read every raw comment first. Cograil guides a staged reading
process.

Default reading sequence:

```text
Orient
  -> Skim latest state
  -> Trace linked external objects
  -> Deep-read high-value evidence
  -> Summarize understanding
  -> Propose next action
```

The context pack should include a reading plan:

```text
1. Read the Redmine summary and latest 5 comments.
2. Inspect the latest Gerrit patchset and unresolved review comments.
3. Check failed GitLab pipeline jobs.
4. Submit an understanding check before proposing a comment.
```

## Context Pack

A context pack is the agent's short-term working memory.

It should be compact, versioned, and reconstructable.

Sections:

- Objective.
- Current state.
- Source objects.
- Recent timeline.
- Evidence.
- Unknowns.
- Conflicts.
- Available actions.
- Policy hints.

## Understanding Check

Before write actions, the agent must submit an understanding check.

Required fields:

```text
situation
current_state
evidence
unknowns
conflicts
proposed_next_action
risk_assessment
confidence
```

Cograil can reject or downgrade action proposals when the understanding check is
missing evidence, ignores conflicts, or proposes actions outside policy.

## Belief Graph

Long-term memory should be represented as evidence-backed beliefs.

Example:

```json
{
  "statement": "payment-service uses Gerrit as the final review system, not GitLab MR approvals.",
  "confidence": 0.86,
  "source_object_ids": ["redmine:4218", "gerrit:Iabc123"],
  "scope_type": "project",
  "scope_id": "payment-service",
  "expires_at": "2026-07-04T00:00:00Z"
}
```

Beliefs are not raw chat memory. They must be:

- Scoped.
- Evidence-backed.
- Correctable.
- Expirable.
- Visible in the UI.

## Conflict Detection

Cograil should detect conflicting platform signals.

Examples:

- Redmine says issue is resolved, but Gerrit review has unresolved comments.
- GitLab pipeline is green, but Gerrit Verified label is negative.
- Agent believes a team uses GitLab MR approvals, but project memory says Gerrit
  is authoritative.

Conflicts should appear in context packs and run detail views.

## Human Correction

Humans should be able to correct agent understanding.

Example correction:

```text
This project uses Gerrit only. GitLab MRs are mirrors and should not be used for
review decisions.
```

Cograil can turn approved corrections into scoped beliefs.

## UI Implication

The run detail screen should show:

- What the agent thinks is happening.
- Evidence.
- Unknowns.
- Conflicts.
- Proposed next read.
- Proposed next action.
- Confidence.

This makes agent reasoning reviewable without pretending the model is
deterministic or always correct.
