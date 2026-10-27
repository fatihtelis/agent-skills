# Durable audit state contract

Use UTF-8 Markdown, YAML, and CSV so another tool or session can resume without a database or chat transcript. Stable IDs and relative paths within the audit directory are required. Record timestamps with timezone. Increment schema_version when intentionally changing the contract and document migrations; do not silently reinterpret old state.

## Runtime layout

```text
<audit-root>/security-audit/
  AGENTS.md
  CHECKPOINT.md
  scope.yaml
  tasks.yaml
  architecture.md
  coverage.csv
  findings/F-0001.md
  evidence/T-0001/...
  handoffs/<timestamp>-<session-label>.md
  REPORT.md
```

Only create individual findings, evidence, handoffs, and reports when they have content. Skill package files can coexist here and must remain untouched.

## scope.yaml

Required fields:
- schema_version, audit_id, created_at, updated_at, audit_root, language.
- status: active | blocked | partial | complete.
- objective, priorities, exclusions (each with reason and user decision), verification_policy.
- repositories: stable id, name, path, URL if known, role, availability (available | missing | excluded), requested_revision, baseline, included_areas, excluded_areas.
- related_repository_requests: id, originating task, discovered relationship, requested information, scope/access decision, status.
- constraints and open_questions, including which questions actually block which tasks.

For each baseline record the commit SHA and branch where available, capture time, dirty status and relevant tracked/untracked changes. Do not include secrets from diffs. For non-Git projects use a reproducible file-hash manifest or equivalent snapshot identity for reviewed files. A commit alone is not an identity for a dirty working tree: capture content hashes or sanitized patches for files used as evidence. Preserve old baseline identifiers when updating.

Absolute repository paths are local mappings, not repository identities. When repos move, retain IDs and update mappings. Record unavailable URLs without pretending to have cloned or reviewed them.

## tasks.yaml

Start with schema_version, audit_id, updated_at, and tasks. Each task has:
- id, title, type (discovery | local_review | cross_repo_review | verification | reporting).
- repository_ids, area, security_checks, baseline_ids.
- depends_on, acceptance_criteria, priority.
- status: pending | in_progress | blocked | done | stale | excluded.
- last_action, next_action, blocker (if any), updated_at.
- coverage_ids, finding_ids, evidence_paths.

An empty finding list is valid. Done means criteria were met with evidence or documented review coverage, not that vulnerabilities were found. Excluded requires an explicit scoped decision, not a workaround for an inaccessible repo. Discovery completion does not imply review completion.

When a task grows too large, create child tasks with stable IDs and dependencies and change the parent criteria to require their completion. When splitting the queue into files, keep a small index with file paths, task IDs, statuses, and dependencies so a new session can choose work without reading all task details.

## architecture.md

Describe assets, actors/roles/tenants, entry points, and trust boundaries. Maintain a relationship table:
- edge ID, producer repo/component, consumer repo/component.
- protocol or artifact (HTTP, queue, shared library, database, build/deploy artifact, etc.).
- data and identity propagated; authentication/authorization expected at each end.
- code/config evidence on both sides and baseline IDs.
- verified facts versus assumptions; missing repo/version/configuration.
- related task and finding IDs.

A similarly named endpoint or library does not establish a deployed relationship. Distinguish source-level compatibility from verified deployment configuration.

## coverage.csv

Use valid CSV quoting and this header:

```csv
coverage_id,task_id,repository_ids,baseline_ids,area,check,method,result,evidence_paths,limitations,updated_at
```

Result vocabulary:
- reviewed_no_finding: the specified check was reviewed without an identified issue.
- finding: linked evidence supports a finding.
- inconclusive: inspected, but insufficient evidence for a conclusion.
- blocked: the check could not be performed.
- not_applicable: give the technical reason.
- stale: reviewed against an obsolete baseline and awaiting revalidation.

Use semicolons inside multi-value fields. Paths, checks, and results must be specific enough to distinguish inspected coverage from planned coverage. Store commands, tool versions, exit codes, baseline, and output references with tool evidence. A failed scanner is blocked/inconclusive, never reviewed_no_finding.

## findings/F-NNNN.md

Every finding records:
- Stable ID, title, status: hypothesis | confirmed | rejected | remediated.
- Severity and rationale; confidence separately. If assigning CVSS, supply a justified vector rather than an invented number.
- Affected repository IDs, baseline IDs, files and line locations/symbols.
- Root cause, attacker capabilities/preconditions, reachable flow, impact.
- Evidence paths and source excerpts necessary to establish the conclusion.
- Verification method: source trace | isolated reproduction | scanner indication; commands and outcomes when applicable.
- Related architecture edges, task IDs, and other findings.
- Remediation and verification criteria; remaining uncertainty.
- Timestamps and brief status history.

Confirmed findings require a supported reachable security failure, not just a scanner warning or a dangerous function name. Rejected hypotheses retain the reason to prevent repeated investigation. Remediated requires review of the changed baseline and relevant verification, not just a suggested patch.

Evidence should identify secret locations and types with redacted values; never copy full credentials, tokens, or unnecessary personal data into audit records.

## CHECKPOINT.md

Use these sections, with short entries:
1. Audit: audit_id, status, timestamp, absolute audit root, scope file link.
2. Baselines: repository IDs and current baseline IDs; dirty or unavailable repos.
3. Progress: task counts by status derived from records, last durable action.
4. Current/next work: task ID, exact next action, dependencies, completion criteria.
5. Load next: minimal relative links and relevant source paths.
6. Blockers/questions: pending input and affected task IDs.
7. Recovery: partial updates, interrupted commands, or stale evidence to reconcile.
8. Resume instruction: "Read <absolute-audit-root>/security-audit/CHECKPOINT.md and AGENTS.md, then continue the next ready task using the security-audit workflow."

Do not maintain competing START_HERE.md files. Counts are convenience summaries; the task queue is authoritative.

## Runtime AGENTS.md content

Create a short instruction file equivalent to:

```markdown
# Audit continuity
- This directory contains durable security-audit state. Preserve existing records and stable IDs.
- Begin with CHECKPOINT.md and scope.yaml; select work from the task index.
- Load only the selected task's linked records and source, not this entire directory.
- Verify baselines and reconcile interrupted updates before continuing.
- Keep hypotheses, confirmed findings, negative coverage, and failures distinguishable.
- Persist evidence, coverage and task changes before updating CHECKPOINT.md.
- Do not mark blocked, stale, failed, or unverified work complete.
- Preserve installed skill package files if they coexist in this directory.
```

This is a recovery aid, not an automatically installed root-level instruction. A user starting a fresh unrelated session must point to CHECKPOINT.md or invoke the installed skill.

## Reconciliation and final report

If interrupted between file writes, inspect affected IDs and evidence before deriving task state. Missing checkpoint updates do not invalidate complete durable evidence. A done task lacking required coverage/evidence must be reopened; do not manufacture missing proof. Preserve historical evidence when invalidating work.

REPORT.md must state the audit status and baselines, distinguish confirmed findings from pending hypotheses, summarize coverage and missing access, and explain remaining limitations. A partial report is useful and must be labeled partial.
