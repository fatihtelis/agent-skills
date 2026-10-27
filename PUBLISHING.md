# Publish to GitHub and share through skills.sh

## Prepare the repository

1. The publication target is `https://github.com/fatihtelis/agent-skills`. Confirm the repository is public and that README.md installation commands match this address.
2. Confirm the publisher name and MIT license, then run `npm ci --ignore-scripts`, `npm run validate`, and `npm run skills:list` using Node.js 22.20 or later.
3. Review and stage the files, create the initial commit, and create an empty **public** GitHub repository. Push the `main` branch to it. No application server or npm publication is required.
4. Run the remote discovery and installation commands below from a disposable project directory. Confirm the installed skill includes its reference files and license.
5. Run the behavioral examples in README.md before tagging a release such as `v0.1.0`.

Git publication example for a fresh checkout without an existing remote:

```bash
git add README.md PUBLISHING.md LICENSE .gitignore .gitattributes .github package.json package-lock.json scripts skills
git commit -m "Add persistent multi-repository security audit skill"
git remote add origin git@github.com:fatihtelis/agent-skills.git
git push -u origin main
```

## Verify public installation

```bash
npx skills add fatihtelis/agent-skills --list
npx skills add fatihtelis/agent-skills --skill security-audit -a codex
```

Only skill instructions, references, and the bundled license belong in the distributable skill directory. Audit records produced against a user's repositories remain in that user's audit workspace.

## Verify skills.sh listing separately

The Vercel CLI supports public GitHub sources and discovers `skills/security-audit/SKILL.md`. No skills.sh-specific manifest is needed for this layout.

A successful GitHub installation proves the package is installable; it does not by itself prove that the website has listed it. After publication, check https://skills.sh and its current FAQ for listing/submission requirements, then search for your repository and skill. Do not claim the skill is listed until it actually appears.

On 2026-10-26, the skills.sh documentation host could not be resolved from the preparation environment. The CLI behavior, repository layout, and format were instead checked against the first-party sources below. A manual submission requirement, indexing delay, or guaranteed appearance could not be verified.

The CLI documents anonymous install telemetry and security-audit requests for confirmed-public GitHub repositories. This is not a documented guarantee of catalog inclusion. Respect the user's telemetry preferences; do not generate installs just to inflate ranking.

## Updates

Keep `security-audit` as the stable skill name. Update the instructions and reference files together, run validation, and push the reviewed changes. Maintain the version in `package.json` and SKILL.md metadata together when releasing a new version. Users can use `npx skills update security-audit` to request updates.

## Sources

- [Agent Skills specification](https://agentskills.io/specification)
- [Vercel Skills CLI](https://github.com/vercel-labs/skills)
- [Creating skills and discovery paths](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md)
- [Installation commands](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- [Telemetry and troubleshooting](https://github.com/vercel-labs/skills/blob/main/docs/troubleshooting.md)
- [skills.sh FAQ](https://skills.sh/docs/faq)
