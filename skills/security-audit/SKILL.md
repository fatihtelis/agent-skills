---
name: security-audit
description: Conduct and resume evidence-based security audits of one or multiple repositories, in any language, with cross-repository analysis and persistent task, coverage, finding, and checkpoint records. Use for requested security audits and their continuation.
license: MIT
metadata:
  version: "0.1.0"
---

# Security audit

Manage a source-code security audit whose durable state lives in files, independently of chat history. Support any language, framework, repository layout, or mix of technologies. Communicate and write audit records in the user's language; preserve code identifiers.

## Location and operating boundaries

- Resolve the audit root from the user's explicit choice, otherwise the primary repository root (Git root when present, project root otherwise). If multiple repositories have no designated primary root, ask which root should hold the audit.
- Store state in `<audit-root>/security-audit/`. Do not create an audit in the installed skill directory merely because the skill lives there.
- The skill package may itself temporarily occupy that directory. Preserve `SKILL.md`, `references/`, `agents/`, `scripts/`, and `assets/`; create runtime records beside them. Their presence alone does not mean an audit exists.
- Never overwrite another audit or unrelated files. Resume an existing audit; if the user requests a separate new audit in the same root, resolve archival/location with them first.
- A source audit permits inspecting the supplied repositories and writing audit records. Respect existing authorization and environment permissions. Do not infer authorization to modify application code, install dependencies, execute untrusted project code, probe live services, or send findings externally. Local isolated verification can be used when authorized.
- No dependency on a particular scanner, package manager, MCP server, hosting provider, or agent feature. If a capability is unavailable, record the limitation and continue independent work.

## First invocation: intake and initialization

First inspect only enough local metadata to identify roots, existing audit state, and applicable instructions. If state exists, use the resume workflow instead of repeating intake.

Ask concise, grouped questions for information not already supplied:

1. Primary and additional repository paths or URLs, desired revision(s), and where to keep the audit. Ask about related repositories: API/backend, clients, shared libraries, identity, workers, infrastructure, and deployment configuration as applicable.
2. Intended scope and priorities: broad audit or specific concerns; important assets, user roles, tenants, entry points, and known service relationships.
3. Exclusions and allowed verification: source-only or also isolated tests/scanners; any time constraints and desired report language.

Do not require the user to know the architecture or programming languages: discover these from source and configuration. Preserve answers already available in the conversation or records. Ask for required roots/access before dependent inspection; continue available scoped work while optional context is pending. Record unknowns explicitly rather than inventing answers. Do not make unanswered optional questions block the entire audit.

Read [state-contract.md](references/state-contract.md) when initializing or changing records. Create `CHECKPOINT.md`, `scope.yaml`, `tasks.yaml`, `architecture.md`, `coverage.csv`, and runtime `AGENTS.md` in the state directory. Create finding/evidence/handoff files as needed, without dummy findings. Capture repository revisions and dirty-worktree state before relying on source.

Use the runtime AGENTS.md content in the state contract. Do not alter a repository's existing root AGENTS.md merely to install this workflow. The nested file is a recovery guide to read explicitly when resuming; do not assume an unrelated session automatically loads it.

Create bounded discovery tasks, then adapt the task queue as the architecture becomes known. Every task needs a scope, dependencies, and observable completion criteria. Include cross-repository data-flow tasks as well as repository-local checks.

## Resume with a small context

1. Read `security-audit/CHECKPOINT.md` and runtime `AGENTS.md`, then scope and the task index. If invoked only with "continue", use the audit root available in context; ask if multiple candidate audits are ambiguous.
2. Load only the selected task's architecture sections, coverage rows, findings, evidence, and source. Do not read all audit files or replay all historical logs.
3. Verify repository paths, revisions, and relevant working-tree changes. If moved, update path mappings after identifying the same repository. If changed, preserve historical evidence and mark affected work stale; enqueue revalidation and update the baseline. When the impact cannot be bounded, broaden revalidation.
4. Reconcile interrupted work. An `in_progress` task is not complete just because a previous session ended. Check persisted evidence, coverage, and criteria; continue from the last durable action. Do not rerun completed checks without a change, new evidence, or recorded reason.
5. Select an unblocked task whose dependencies are satisfied. If all remaining work requires missing access/input, save a checkpoint listing exactly what is needed and report the limitation.

The checkpoint is a compact navigation aid, not the authority for every result. Task, coverage, and evidence records resolve discrepancies. Large task queues may be split into per-repository/domain files with a small index; preserve stable IDs and links.

## Execute and relate repositories

Read [review-method.md](references/review-method.md) before substantive review and selectively on later sessions.

For each bounded unit:

- Mark the task `in_progress` and persist its next concrete action.
- Inspect relevant code and configuration; trace security-sensitive inputs through controls to effects. Capture useful negative results as well as potential vulnerabilities.
- Save evidence and findings as you go. Record command failures as failures, never as clean scans. Separate an unverified hypothesis from a confirmed finding.
- Update coverage with the precise area, check, revision, method, result, and limitations. A search returning no matches does not establish that an entire vulnerability class is absent.
- If a new related repository emerges, record an architecture edge and an access/scope gap. Ask for its path/URL, relevant version, relationship, and whether it belongs in scope; reuse known answers. Continue independent work. Do not silently expand inspection to unknown repositories or treat an inaccessible dependency as reviewed.
- Reuse stable finding IDs and link manifestations of the same root cause across repositories. Create separate findings when fixes or root causes differ.
- Check acceptance criteria before marking the task done, then checkpoint. Split an oversized task into explicit smaller tasks before context becomes unwieldy.

Persist after each meaningful unit or verified finding, and before expensive operations or a planned handoff. Do not wait for context exhaustion. Keep tool output targeted; put large raw output in evidence files and load excerpts.

## Checkpoint and handoff

Write supporting evidence/findings first, then coverage and task status, then update `CHECKPOINT.md` last. Use atomic replacement for individual state files when supported. A partial multi-file update must remain recoverable from stable task/evidence IDs.

Keep CHECKPOINT.md approximately one page (target at most 1,000 words). Include audit identity, scope/baseline summary, last durable action, current and next task, exact next action, required record links, blockers, and unresolved cross-repository questions. Do not embed raw logs or repeat finding bodies.

At a deliberate session boundary, save a concise dated note under `handoffs/`, reconcile records, and give the user a restart prompt with the audit root. Never claim that a new session has started automatically. Compaction, resume commands, and subagents are optional conveniences; persistence must work without them.

If the user requests parallel agents, assign disjoint task IDs and evidence files, with one coordinator owning shared indexes and CHECKPOINT.md. Merge results only after reviewing evidence and duplicate findings.

## Completion and reporting

Audit status is `complete` only when all in-scope acceptance criteria and cross-repository checks are satisfied, findings are triaged, and no in-scope blocked/stale tasks remain. Explicitly accepted exclusions belong in scope and the report. A time budget ending, missing repository, or failed tool produces a partial/blocked result, not a completed audit.

Create `REPORT.md` when reporting final or partial results: revisions and scope, architecture/trust boundaries, prioritized confirmed findings with evidence and remediation, hypotheses needing verification, coverage, exclusions, and limitations. Distinguish source-confirmed findings from reproduced behavior. Do not equate absence of findings with proof of security.

Finish with a short user-facing result and links to REPORT.md and CHECKPOINT.md. For incomplete work, include the precise next step or required input.
