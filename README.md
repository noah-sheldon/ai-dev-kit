# AI Dev Kit

AI Dev Kit is a production-oriented scaffold for plugin-based developer workflows.
It includes the core surfaces needed to install, validate, and extend the kit:

- plugin manifests for Codex, Claude, and OpenCode
- installer, doctor, and uninstall entrypoints
- agents, skills, commands, hooks, rules, manifests, schemas, and MCP config
- smoke tests and surface validation

## Quick Start

```bash
npm install
npm test
npm run doctor
```

## Install

```bash
./install.sh
```

```powershell
.\install.ps1
```

## What ships

- `agents/` for reusable agent specs
- `skills/` for task-specific playbooks
- `commands/` for developer commands
- `hooks/` for lifecycle automation
- `rules/` for common, Python, TypeScript, and web guidance
- `manifests/` and `schemas/` for deterministic install and validation
- `.claude-plugin/`, `.codex-plugin/`, and `.opencode/` for harness integration

## Validation

Run `npm test` before publishing changes. The suite checks for required files,
valid JSON manifests, and a complete production surface.

## Role Mapping

- `planner` - plan complex changes before code is touched
- `tdd-guide` - write tests first and keep the RED/GREEN/REFACTOR loop strict
- `code-reviewer` - review diffs for correctness and regressions
- `security-reviewer` - inspect input handling, secrets, and unsafe defaults
- `git-agent-coordinator` - coordinate branch work and merges

## CLI Compatibility

- Claude Code: `.claude-plugin/`
- Codex: `.codex-plugin/`
- Cursor: `.cursor/`
- OpenCode: `.opencode/`
- Gemini: `.gemini/`

## FAQ

- If a model is unavailable, the workspace should fall back to the default model.
- If a plugin surface looks stale, rerun `npm test` and `node scripts/validate-surface.js`.
- If you are adapting this repo for another project, start from `docs/examples/project-guidelines-template.md`.
