# Cograil Documentation

This folder currently treats the full functional requirements map as the source
of truth for product discovery. New documents should trace back to that map
rather than narrowing the platform too early.

## Current Documents

- [Human-Agent Platform Functional Requirements](platform-functional-requirements.md)  
  Full product capability map across Redmine-style work management,
  Multica-style agent operations, Gerrit-style review, GitLab-style validation
  and release binding, governance, integrations, and evolution.

- [UI Concept: Linear-Style Control Plane](ui-concept-linear.md)  
  Frontend concept direction for a focused human-agent workspace.

## Prototype

- [Linear-style Control Plane Prototype](../prototypes/linear-control-plane/index.html)  
  Static HTML/CSS/JS prototype that can be opened directly in a browser.

- [Figma UI Reference Board](https://www.figma.com/design/yc27usRZosjAkdiccMHUeg)  
  Design reference board for borrowing mature component primitives while keeping
  Cograil's review, agent, context, gate, and evidence surfaces original.

## Suggested Decomposition

The next documentation pass should split the requirements map into smaller
working artifacts:

1. `mvp-v0.1.md` - first end-to-end product slice and explicit non-goals.
2. `product-model.md` - core objects, relationships, ownership, and lifecycle.
3. `domain-model.md` - entities and state machines suitable for API design.
4. `architecture.md` - control plane, external bindings, task execution, storage,
   policy, and audit architecture.
5. `demo-scenario.md` - one guided flow from work item to agent run to reviewed
   artifact and controlled write-back.
6. `security.md` - authority boundaries, context trust, least privilege,
   approval gates, and audit rules.

## Working Rule

The full requirements document is not an MVP plan. MVP decisions should preserve
one complete human-agent loop before reducing breadth:

WorkItem -> ContextPack -> TaskRun -> ArtifactChange -> Review -> Validation ->
Approval -> Audit -> EvolutionCandidate.
