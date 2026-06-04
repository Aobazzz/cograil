# MVP v0.1

The v0.1 goal is a thin but complete product loop. It should prove that Cograil
can turn one legacy engineering event into one governed agent action.

## Demo Loop

```text
Redmine issue event
  -> normalize event
  -> create or update WorkItem
  -> correlate Gerrit and GitLab context
  -> compile ContextPack
  -> expose work through MCP tools
  -> agent submits UnderstandingCheck
  -> agent proposes a Redmine comment
  -> human approves
  -> Cograil posts the comment
  -> audit log records the full path
```

## In Scope

### Platforms

- Redmine issue read.
- Redmine issue comments read.
- Redmine issue comment write through approval.
- Gerrit change read.
- Gerrit review comments read.
- GitLab merge request read.
- GitLab pipeline read.

### Agent Clients

- Codex through MCP.
- Claude Code through MCP.
- opencode through MCP.

### Product Features

- Work inbox.
- Work item detail.
- Context pack generation.
- Agent run tracking.
- Understanding check.
- Action proposal.
- Approval queue.
- Audit log.
- Basic policy engine.

## Out of Scope

The first version should not include:

- Automatic merge.
- Automatic Gerrit submit.
- Automatic assignment of humans.
- Multi-agent planning.
- Broad Jira support.
- Full custom workflow designer.
- Semantic memory that writes facts without approval or evidence.

## User Stories

### Engineer

As an engineer, I want to open one work item and see the Redmine, Gerrit, and
GitLab context in one place so I can decide whether an agent understands the
problem.

### Engineering Manager

As an engineering manager, I want every agent action to show who delegated it,
which policy allowed it, and which external system changed.

### Agent Operator

As an agent operator, I want to register a Codex, Claude Code, or opencode
agent with scoped permissions so it can read freely but write only through
approved tools.

### Agent

As an agent, I want compact context and clear available actions so I do not have
to infer platform workflows from raw API responses.

## Milestones

### M0: Documentation

- Vision.
- Architecture.
- Domain model.
- MCP tool contract.
- Demo scenario.
- Security model.

### M1: Local Mock Loop

- SQLite or Postgres schema.
- Fake Redmine, Gerrit, and GitLab fixtures.
- Event ingestion endpoint.
- Context pack compiler.
- MCP server with read-only tools.

### M2: Approval and Write Back

- Action proposal model.
- Approval queue.
- Redmine comment write adapter.
- Audit log.

### M3: Real Read Adapters

- Redmine read adapter.
- Gerrit read adapter.
- GitLab read adapter.
- Basic external object correlation.

### M4: Developer Preview

- Docker Compose.
- README quickstart.
- Copy-paste MCP configs for Codex, Claude Code, and opencode.
- One runnable demo command.

## Definition of Done for v0.1

v0.1 is done when a user can run Cograil locally, load the demo Redmine issue,
connect an MCP client, and approve a proposed Redmine comment generated from a
context pack that includes Gerrit and GitLab evidence.
