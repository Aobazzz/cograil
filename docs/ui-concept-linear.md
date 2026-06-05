# UI Concept: Linear-Style Human-Agent Control Plane

This concept uses Linear as a directional reference for speed, density, and
keyboard-first focus. It should not copy Linear one-to-one. Cograil needs its
own product surface because the primary objects are not only issues: they are
work items, agent task runs, context packs, artifact changes, reviews, gates,
validation evidence, and evolution records.

## Product Feeling

The interface should feel like a quiet engineering cockpit:

- Fast enough for daily triage.
- Dense enough for large programs.
- Calm enough for high-risk agent governance.
- Structured enough that every agent action has provenance, status, and an
  accountable next human or automated gate.

The visual direction is dark, compact, and precise, with a warm charcoal base,
bone text, brass warnings, green approvals, red blockers, and cyan selection.
The product should feel operational rather than promotional.

## Information Architecture

The first navigation model should center on work and gates:

- Inbox: attention set, mentions, approvals, and blocked work.
- Work Graph: work items with dependencies, ownership, milestones, and related
  artifact changes.
- Reviews: artifact changes, patch sets, comments, labels, and submit
  requirements.
- Agents: agent profiles, task runs, squads, runtime status, cost, and failures.
- Context: context packs, resources, prompts, skills, trust tiers, and expiry.
- Pipelines: validation jobs, evidence, protected targets, and release gates.
- Evolution: proposed prompt, skill, policy, and validation improvements.

## Primary Screen

The first useful screen is a split command board:

- Left rail: workspace, project switcher, navigation, and standing views.
- Center: active queue with work items and linked changes.
- Right rail: selected item detail, current gate status, task run trail, and
  submit requirements.
- Command palette: create, assign, request review, rerun validation, open
  context, and start controlled write-back.

This avoids a chat-first interface. Chat can exist, but the product's center of
gravity is the reviewable project event graph.

## Core Components

- Work row: ID, title, type, agent or human owner, risk, state, linked change,
  and gate health.
- Gate stack: owner approval, context integrity, validation evidence, security
  scan, and protected target policy.
- Task run timeline: compile context, execute agent, produce artifact, open
  review, rerun after feedback.
- Patch-set strip: ordered versions with author, time, review state, and
  validation result.
- Attention marker: explicit current owner of the next decision.
- Context drawer: source pointers, trust level, redaction, expiry, and evidence.

## Interaction Model

The product should support three working speeds:

- Scan: triage rows by risk, blocked state, owner, and gate status.
- Inspect: select a row and review the right rail without changing route.
- Act: use command palette or contextual actions to assign, approve, request
  changes, rerun validation, or escalate to a human.

The prototype in `prototypes/linear-control-plane` implements the first version
of this command-board idea as static HTML, CSS, and JavaScript.

## Figma Reference Board

The active reference board lives in Figma:

- https://www.figma.com/design/yc27usRZosjAkdiccMHUeg

Use it before rebuilding the next prototype. The board separates borrowed
component quality from Cograil-specific product primitives so the next pass does
not collapse back into generic dashboard blocks.

## Kit Selection Gate

Before drawing `V2 Main Screen`, use the `Kit 选择看板` page in the Figma file
to inspect candidate kits visually. This page uses Chinese labels and component
mockups instead of relying on English descriptions.

Candidate kits:

- Untitled UI Free: strongest general SaaS component base.
- Preline UI Figma: strongest Tailwind-aligned free implementation base.
- Figma Simple Design System: useful baseline, too plain for final direction.
- Obra shadcn/ui Community or Shadcn Space: useful if implementation targets
  shadcn/ui.
- Figma dashboard templates: inspiration only, not a base.

Decision rule: pick one primary kit for primitives first, then compose Cograil's
custom primitives around artifact review, agent runs, context, gates, evidence,
and attention routing. Do not start the next screen from generic metrics cards.

Current decision: use Preline UI Figma as the primary web product component
base, because the target is a web app with a matching desktop UI and Preline is
free, Tailwind-aligned, and implementation-friendly. Keep Untitled UI Free as an
aesthetic reference only.

The Figma file now contains:

- `Reference Board`: product-specific UI primitives and composition rules.
- `Kit 选择看板`: Chinese visual comparison of candidate kits.
- `V2 Main Screen`: first artifact review console direction using a Preline-like
  structure plus Cograil-specific review, agent, context, gate, and evidence
  surfaces.
