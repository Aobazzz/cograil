# MCP Tools

Cograil exposes a controlled MCP server for Codex, Claude Code, opencode, and
other MCP clients.

The MCP layer should be stable, compact, and policy-aware. Platform-specific
details should stay behind Cograil adapters.

## Naming

Tool names use the `cograil_` prefix.

Read tools should return source references. Write tools should either create
action proposals or execute only after policy allows the action.

## Tool List for v0.1

### cograil_inbox_next

Return the next work item available to the agent.

Input:

```json
{
  "agent_id": "codex-backend",
  "limit": 1
}
```

Output:

```json
{
  "items": [
    {
      "work_item_id": "wi_4218",
      "title": "Payment callback timeout after retry change",
      "state": "ready_for_agent",
      "priority": "high",
      "summary": "Redmine bug linked to Gerrit change and failed GitLab pipeline."
    }
  ]
}
```

### cograil_workitem_get

Return work item metadata and linked external objects.

Input:

```json
{
  "work_item_id": "wi_4218"
}
```

Output:

```json
{
  "work_item": {
    "id": "wi_4218",
    "title": "Payment callback timeout after retry change",
    "state": "ready_for_agent",
    "source_of_truth": "redmine:4218"
  },
  "external_objects": [
    {
      "platform": "redmine",
      "type": "issue",
      "external_id": "4218",
      "url": "https://redmine.example/issues/4218"
    }
  ]
}
```

### cograil_context_pack_get

Return the current context pack for an agent.

Input:

```json
{
  "work_item_id": "wi_4218",
  "agent_id": "codex-backend"
}
```

Output:

```json
{
  "context_pack_id": "cp_001",
  "version": 3,
  "objective": "Understand the payment callback timeout and propose a safe next action.",
  "orientation": "...",
  "reading_plan": ["Read latest Redmine comments", "Inspect Gerrit unresolved comments"],
  "evidence": [],
  "unknowns": [],
  "available_actions": ["submit_understanding", "propose_comment"]
}
```

### cograil_external_object_read

Read a specific external object through Cograil.

Input:

```json
{
  "external_object_id": "ext_gerrit_Iabc123",
  "view": "summary"
}
```

Allowed views:

```text
summary
latest_comments
diff_summary
pipeline_summary
full
```

### cograil_understanding_submit

Submit the agent's structured understanding before proposing a side effect.

Input:

```json
{
  "work_item_id": "wi_4218",
  "agent_id": "codex-backend",
  "situation": "Redmine reports callback timeouts after a retry change.",
  "current_state": "Latest Gerrit patchset exists and GitLab pipeline is failing.",
  "evidence": [
    {
      "source_ref": "redmine:4218#comment-12",
      "claim": "Timeout started after retry behavior changed."
    }
  ],
  "unknowns": ["Whether the failure reproduces locally."],
  "conflicts": [],
  "proposed_next_action": "Post a status comment saying investigation is focused on retry configuration and CI failure.",
  "risk_assessment": "Low risk if posted as a comment only.",
  "confidence": 0.73
}
```

Output:

```json
{
  "understanding_check_id": "uc_001",
  "accepted": true,
  "messages": []
}
```

### cograil_action_propose

Create an action proposal for a platform side effect.

Input:

```json
{
  "work_item_id": "wi_4218",
  "agent_id": "codex-backend",
  "action_type": "redmine.comment.post",
  "target": {
    "platform": "redmine",
    "external_id": "4218"
  },
  "preview": "I found that the timeout investigation should focus on retry configuration and the failed payment-e2e pipeline.",
  "reason": "Keeps stakeholders updated without changing state."
}
```

Output:

```json
{
  "action_proposal_id": "ap_001",
  "policy_decision": "require_approval",
  "status": "pending_approval"
}
```

### cograil_action_status

Check whether a proposed action has been approved, rejected, executed, or
failed.

Input:

```json
{
  "action_proposal_id": "ap_001"
}
```

Output:

```json
{
  "action_proposal_id": "ap_001",
  "status": "executed",
  "external_result": {
    "platform": "redmine",
    "comment_id": "9862"
  }
}
```

### cograil_audit_get

Return audit events for a work item or agent run.

Input:

```json
{
  "work_item_id": "wi_4218"
}
```

## Tool Approval Defaults

Recommended defaults:

```text
read tools: auto
understanding tools: auto
proposal tools: auto
write execution tools: prompt or server-side approval only
administrative tools: prompt
```

## Agent Instructions

The MCP server should advertise instructions similar to:

```text
Cograil gives you governed access to engineering work. Read context packs first.
Submit an understanding check before proposing side effects. Prefer evidence
over assumptions. Use action proposals for writes. Do not claim a platform
change happened until cograil_action_status reports it as executed.
```

## Error Shape

Errors should be machine-readable:

```json
{
  "error": {
    "code": "policy_requires_approval",
    "message": "This action requires approval.",
    "details": {
      "action_proposal_id": "ap_001"
    }
  }
}
```
