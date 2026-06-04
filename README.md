# Cograil

Governed work identity for AI coding agents in legacy engineering systems.

Cograil connects agents such as Codex, Claude Code, and opencode to traditional
engineering platforms like Redmine, Gerrit, and self-hosted GitLab. It gives
agents a durable work inbox, compact context packs, policy-gated actions, and an
auditable memory layer before they act on behalf of a team.

## Why

AI coding agents can edit code, but many engineering teams still coordinate
through older project systems. Agents need more than raw API access. They need a
safe way to understand tickets, reviews, CI state, ownership, approvals, and
platform-specific workflows.

Cograil is the bridge and control plane for that loop.

## Initial Scope

- Redmine issue intake, comments, and status workflows
- Gerrit change, patchset, and review context
- Self-hosted GitLab merge requests and pipeline state
- MCP tools for Codex, Claude Code, opencode, and other MCP clients
- Durable event log, agent runs, approvals, and audit trail
- Context packs and understanding checks before write actions

## Product Principle

Agents can forget. Cograil cannot.

The bridge owns durable state, source provenance, permissions, and memory. Each
agent run receives a concise briefing, uses controlled tools, proposes actions,
and leaves a replayable record.

## Status

Early product design and architecture work. The first milestone is a local
developer preview that can read a Redmine issue, correlate Gerrit and GitLab
context, and let an MCP-connected coding agent propose a safe comment.

## Documentation

- [Vision](docs/vision.md)
- [MVP v0.1](docs/mvp-v0.1.md)
- [Architecture](docs/architecture.md)
- [Domain model](docs/domain-model.md)
- [Cognitive layer](docs/cognitive-layer.md)
- [MCP tools](docs/mcp-tools.md)
- [Security model](docs/security.md)
- [Demo scenario](docs/demo-scenario.md)
