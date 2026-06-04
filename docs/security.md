# Security Model

Cograil should be safe enough for internal engineering systems before it is
powerful enough to automate them.

## Core Rule

Agents do not hold Redmine, Gerrit, or GitLab credentials directly.

Cograil holds platform credentials, evaluates policy, executes approved actions,
and records every side effect.

## Identity Model

Every action is associated with:

- Agent identity.
- Delegating user or service account.
- Work item.
- Agent run.
- Tool call.
- Policy decision.
- External platform target.

This is the minimum chain needed for auditability.

## Credential Modes

### Bot Account

Cograil uses a dedicated bot account per platform.

Pros:

- Simple to set up.
- Easy to revoke.
- Easy to audit.

Cons:

- May not represent user delegation clearly.

### Delegated User

Cograil records the user who delegated work to the agent and can apply
user-scoped policy.

Pros:

- Better accountability.
- Useful for enterprise permissions.

Cons:

- Harder auth model.
- Requires careful token handling.

### Hybrid

Use platform bot credentials for execution while recording delegated user and
agent identity in Cograil audit metadata.

This is the recommended MVP mode.

## Policy Decisions

Policies return one of:

```text
allow
require_approval
block
```

Example policy:

```yaml
agent: codex-backend
platform: redmine
action: redmine.comment.post
project: payment-service
decision: require_approval
```

## Risk Levels

Suggested defaults:

```text
low:
  - read issue
  - read review
  - read pipeline
  - submit understanding

medium:
  - propose comment
  - post comment
  - add non-routing label

high:
  - transition status
  - assign human
  - request review
  - create merge request

critical:
  - merge
  - submit Gerrit label
  - delete branch
  - edit credentials
```

v0.1 should execute only low-risk reads automatically and route writes through
approval.

## Approval Requirements

An approval view must show:

- Proposed action.
- Target platform and object.
- Agent identity.
- Delegating user.
- Understanding check.
- Evidence.
- Risk level.
- Policy decision.
- Exact payload preview.

Humans should be able to approve, reject, or edit when safe.

## Audit Requirements

Audit logs must be append-only from the product perspective.

Record:

- Login and credential events.
- Integration configuration changes.
- Policy changes.
- Agent run lifecycle.
- Tool calls.
- Action proposals.
- Approval decisions.
- External write results.

## Data Handling

Default stance:

- Store minimal raw payloads.
- Store payload hashes for replay and integrity.
- Store external object snapshots only when useful for context and audit.
- Redact secrets before context compilation.
- Never include platform tokens in context packs or MCP responses.

## Memory Safety

Beliefs must not store secrets or private personal data. They should include
source references, scope, confidence, and expiration.

Human corrections should be visible and reversible.

## Deployment Assumptions

The first deployment target is self-hosted inside a private network.

Recommended production shape:

```text
Cograil API/Web
Postgres
private network access to Redmine/Gerrit/GitLab
TLS termination
restricted outbound access
backups for Postgres
```

## Threats to Design Against

- Agent prompt injection from ticket comments.
- Confused deputy attacks across delegated credentials.
- Accidental duplicate side effects after retries.
- Stale context causing invalid writes.
- Unbounded memory storing incorrect beliefs.
- Credential leakage into context packs.
- Over-broad bot account permissions.

## MVP Safety Bar

v0.1 should not support automatic merge, automatic Gerrit submit, or unapproved
status transitions. The product should prove the safe read, understand, propose,
approve, and write loop first.
