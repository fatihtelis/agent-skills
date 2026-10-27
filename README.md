# Agent Skills

Portable workflows for coding agents, following the [Agent Skills standard](https://agentskills.io/specification). Install individual skills through the [Vercel Skills CLI](https://github.com/vercel-labs/skills).

## Available skills

| Skill | Purpose |
| --- | --- |
| [security-audit](skills/security-audit/SKILL.md) | Review one or multiple repositories, connect security-sensitive flows across services, and resume work across sessions through durable checkpoints. |

## Install

The current Skills CLI requires **Node.js 22.20 or later**. The skill itself has no Node.js or Python runtime dependency: it consists of instructions and reference files.

Install from the public GitHub repository:

```bash
npx skills add fatihtelis/agent-skills --skill security-audit
```

Select your coding agent when prompted, or target one explicitly:

```bash
npx skills add fatihtelis/agent-skills --skill security-audit -a codex
npx skills add fatihtelis/agent-skills --skill security-audit -a claude-code
```

Add `-g` for installation across projects. From a local checkout, you can preview discovery without installing:

```bash
npx skills add . --list
```

To install the local checkout into a project, run this from that project's directory:

```bash
npx skills add /absolute/path/to/agent-skills --skill security-audit
```

The distribution uses the shared skill format. Host permissions, tool access, and invocation syntax vary; format compatibility is not a claim that every agent has been behaviorally tested.

## Use security-audit

The agent needs access to the source repositories and permission to write audit records. It asks for missing scope, related repositories, revisions, and verification preferences. It can inspect any language or framework; specific scanners are optional.

Example in Codex:

```text
$security-audit Audit this repository. Ask me about related repositories
and scope before starting. Save the audit state in this repository's root.
```

Multiple repositories:

```text
Use the security-audit skill to review /work/frontend and /work/api.
Keep audit records under /work/frontend/security-audit.
Focus on tenant isolation and authorization across both repositories.
Use source inspection only.
```

In a new session:

```text
Use the security-audit skill. Read /work/frontend/security-audit/CHECKPOINT.md
and AGENTS.md, then continue the next ready task.
```

It creates runtime records in the chosen audit root:

```text
security-audit/
├── AGENTS.md
├── CHECKPOINT.md
├── scope.yaml
├── tasks.yaml
├── architecture.md
├── coverage.csv
├── findings/       # Created when needed
├── evidence/       # Created when needed
├── handoffs/       # Created when needed
└── REPORT.md       # Written for partial or final reporting
```

The installed skill remains separate from these records. Repository baselines, unfinished checks, confirmed findings, and hypotheses are tracked explicitly. New sessions load the checkpoint and relevant task records rather than the entire audit history.

This workflow does not automatically launch new sessions or guarantee exhaustive vulnerability detection. It records coverage and limitations so results can be reviewed.

## Maintain and validate

```bash
npm ci --ignore-scripts
npm run validate
npm run skills:list
```

Development dependencies are used only for validation and discovery. `package.json` is marked private because distribution is through GitHub; publishing an npm package is unnecessary.

Validation checks YAML syntax, required metadata, naming, local references, and the bundled license. GitHub Actions runs the same checks. These checks do not replace behavioral evaluation: before releasing, exercise a single-repository audit, a cross-repository audit, and continuation in a fresh session with an interrupted task or changed revision.

See [PUBLISHING.md](PUBLISHING.md) for GitHub publication and skills.sh verification.

## License

[MIT](LICENSE). A copy of the license is included inside each distributed skill.
