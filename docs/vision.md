# Vision

Cograil gives AI coding agents a governed work identity inside legacy
engineering systems.

The first target is teams that still coordinate real engineering work through
Redmine, Gerrit, and self-hosted GitLab. These systems often live inside private
networks, carry long project histories, and encode workflows that generic SaaS
AI products do not understand.

Cograil is not another chat app. It is a self-hosted bridge and control plane
that lets agents understand work before acting on it.

## Problem

Coding agents can inspect repositories and edit files, but they usually lose the
operational context around the code:

- Which Redmine issue is the source of truth?
- Which Gerrit change contains the active patchset?
- Which GitLab pipeline failure matters?
- Who is waiting for whom?
- Which action is safe to perform automatically?
- What did the agent already learn in a previous run?

Without a durable work layer, the agent keeps reconstructing state from raw
tools and stale chat context. This produces context drift, unsafe actions, and
poor handoffs.

## Product Thesis

Agents can forget. Cograil cannot.

Cograil owns the durable work graph, event log, source provenance, policy
decisions, action approvals, and memory. Agents receive compact context packs
and controlled tools. Humans keep visibility and authority over risky actions.

## Target Users

The first users are engineering teams that:

- Run Redmine, Gerrit, or self-hosted GitLab.
- Want to use Codex, Claude Code, opencode, or other MCP clients.
- Need auditability before allowing agents to write to project systems.
- Maintain legacy systems where context is spread across tickets, reviews, CI,
  and tribal knowledge.

## Positioning

Short version:

> Governed work identity for AI coding agents in legacy engineering systems.

Long version:

> Cograil is a self-hosted cognitive bridge that lets AI coding agents read,
> understand, and safely act across Redmine, Gerrit, and self-hosted GitLab.

## Principles

1. Source systems remain the source of truth.
2. Agents never hold platform credentials directly.
3. Read access and write access are separate products.
4. Every side effect is tied to an identity, run, policy decision, and audit log.
5. Memory must be evidence-backed, scoped, expirable, and correctable.
6. Agents must show understanding before making write actions.
7. The first user experience should feel like an engineering control plane, not
   a chatbot.

## Non-goals

Cograil is not:

- A replacement for Redmine, Gerrit, or GitLab.
- A generic multi-agent orchestration framework.
- A ticket auto-closer that bypasses human ownership.
- A memory store that keeps unverifiable model impressions forever.
- A hosted-only SaaS product.

## Success Criteria

The product is working when an engineer can point Codex, Claude Code, or
opencode at a Redmine issue and the agent can:

1. Read the issue.
2. Discover related Gerrit and GitLab context.
3. Explain what it understands with evidence.
4. Propose a safe next action.
5. Wait for approval when needed.
6. Write back through Cograil.
7. Leave a replayable trace.
