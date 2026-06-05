# Cograil

Cograil is a human-agent project control plane for large engineering programs.
It gives humans and AI agents a shared operating surface for work items, agent
runs, context packs, artifact changes, reviews, validation evidence, releases,
and governed evolution.

The product direction is inspired by the collaboration concepts behind Redmine,
Multica, Gerrit, and GitLab, but the goal is not to clone their interfaces. The
goal is to extract the durable platform capabilities needed when humans and
agents work on the same long-running project.

## Current State

This repository is currently in product design and requirements consolidation.
The previous early design notes have been folded into one complete functional
requirements map:

- [Human-Agent Platform Functional Requirements](docs/platform-functional-requirements.md)

That document is intentionally broader than an MVP. It defines the full product
surface before prioritization, including project management, agent operations,
context governance, artifact review, validation, release, security, integrations,
and continuous learning loops.

## Frontend Concept

A first static UI concept is available here:

- [Linear-style Control Plane Concept](prototypes/linear-control-plane/index.html)
- [UI Concept Notes](docs/ui-concept-linear.md)
- [Figma UI Reference Board](https://www.figma.com/design/yc27usRZosjAkdiccMHUeg)

The concept is a dense command-center workspace, not a landing page. It explores
how Cograil could feel when work items, agent runs, artifact changes, reviews,
and gates are visible in one focused operating surface.

## Next Product Slice

The recommended first MVP slice is an end-to-end governed collaboration loop:

1. Create or import a work item.
2. Assign or mention an agent.
3. Compile a context pack and start an observable task run.
4. Register an artifact change with patch-set history.
5. Review the change with human attention routing and submit requirements.
6. Attach validation evidence and approve a controlled external write.
7. Record the correction or success pattern for future prompt, skill, or policy
   evolution.

## Documentation

See [docs/README.md](docs/README.md) for the current documentation map and the
suggested decomposition path from the requirements map into PRD, domain model,
architecture, and demo scenario documents.
