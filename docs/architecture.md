# Architecture

Cograil is a self-hosted bridge between legacy engineering platforms and AI
coding agents.

## System Overview

```text
Redmine / Gerrit / GitLab
        |
        | webhooks, polling, API reads
        v
Event Ingest
        |
        v
Core Work Graph
        |
        +--> Context Compiler
        +--> Policy Engine
        +--> Approval Queue
        +--> Audit Log
        |
        v
MCP Server
        |
        v
Codex / Claude Code / opencode
```

## Components

### Event Ingest

Receives webhook events and polling results from Redmine, Gerrit, and GitLab.
Every incoming event is appended to the event store before any derived state is
updated.

Responsibilities:

- Verify webhook signatures when available.
- Normalize platform payloads.
- Store raw event metadata and payload hashes.
- Correlate events to work items.
- Trigger context recompilation or agent runs.

### Platform Adapters

Adapters isolate platform-specific API details from the rest of the product.

Initial adapters:

- `redmine`
- `gerrit`
- `gitlab`
- `fixture`

Adapter responsibilities:

- Read external objects.
- Map external states into Cograil domain states.
- Execute approved write actions.
- Return source references for audit and context packs.

### Core Work Graph

The work graph is the durable model of a piece of engineering work. It links
issues, changes, reviews, pipelines, comments, actors, actions, and beliefs.

The graph should be rebuilt from the event log plus external object snapshots.
Agents do not own this state.

### Context Compiler

Builds compact context packs for agents.

Inputs:

- WorkItem.
- ExternalObject snapshots.
- Recent events.
- Previous agent run summaries.
- Approved memories and beliefs.
- Policy hints.

Outputs:

- Orientation.
- Reading plan.
- Evidence summary.
- Unknowns.
- Available actions.
- Risk hints.

### Cognitive Layer

The cognitive layer structures how agents read, understand, and remember work.
It is described separately in [Cognitive layer](cognitive-layer.md).

### Policy Engine

Evaluates whether a proposed action is allowed, blocked, or requires approval.

Policy inputs:

- Agent identity.
- Delegating user.
- Work item scope.
- Tool name.
- Target platform.
- Action type.
- Risk level.

Policy outputs:

- `allow`
- `require_approval`
- `block`

### Approval Queue

Stores actions that need human approval before execution. Approval records must
include the action preview, policy decision, requester, target, and expected
external side effect.

### MCP Server

Exposes Cograil tools to Codex, Claude Code, opencode, and other MCP clients.
The MCP layer is an agent interface, not the system of record.

### Agent Runner

Optional runtime that can launch agent CLIs in response to events.

Initial adapters:

- `codex exec`
- `claude -p`
- `opencode run`

The runner is useful for automation, but the MVP can work with a human opening
an MCP client and asking it to process a work item.

### Web Console

The control plane for humans.

Initial screens:

- Work inbox.
- Work item detail.
- Agent run detail.
- Approval queue.
- Audit log.
- Integrations.
- Agent identities and policies.

## Runtime Modes

### Local Demo

```text
docker compose up
fixture event -> Cograil -> MCP client -> approval -> fake write back
```

### Self-hosted Team

```text
internal Redmine/Gerrit/GitLab
  -> Cograil server in private network
  -> Postgres
  -> MCP clients on developer machines or runners
```

## Suggested Repository Layout

```text
apps/
  api/              HTTP API, MCP server, event ingest
  web/              control plane UI
packages/
  core/             domain model, state machine, policies
  adapters/         Redmine, Gerrit, GitLab, fixtures
  context/          context pack compiler
  runner/           Codex, Claude Code, opencode runners
  shared/           schemas and shared types
docs/
```

## Technology Direction

The likely implementation stack:

- TypeScript.
- Fastify or Hono for API.
- React and Vite for the control plane.
- Postgres for production state.
- SQLite for a local demo mode if it keeps setup simple.
- Drizzle or Prisma for schema management.
- Zod or JSON Schema for MCP tool inputs and outputs.

## Durability Rule

Anything needed to continue work after agent failure must be stored in Cograil:

- Events.
- Work item state.
- External object snapshots.
- Context pack versions.
- Agent run summaries.
- Tool calls.
- Action proposals.
- Approval decisions.
- Audit logs.
- Evidence-backed beliefs.
