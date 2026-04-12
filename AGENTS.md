# AI Dev Kit - Agent Instructions

This is a production-ready AI dev kit for Python, TypeScript, web, AI/ML, and
infrastructure workflows.

**Version:** 1.0.0

## Core Principles

1. Agent-first: delegate domain work to the right specialist.
2. Test-driven: write tests before implementation when behavior changes.
3. Security-first: validate inputs and avoid unsafe defaults.
4. Plan-before-execute: break complex work into phases.
5. Model fallback: if a requested model is unavailable, use the workspace
   default model and continue.

## Available Agents

| Agent | Purpose |
|-------|---------|
| planner | Implementation planning |
| architect | System design and tradeoffs |
| tdd-guide | Test-driven development |
| code-reviewer | Code quality and regressions |
| security-reviewer | Security review |
| ai-judge | Rubric validation |
| build-error-resolver | Build and type fixes |
| e2e-runner | End-to-end testing |
| refactor-cleaner | Cleanup and modernization |
| doc-updater | Documentation sync |
| docs-lookup | Documentation lookup |
| python-reviewer | Python code review |
| database-reviewer | Database review |
| git-agent-coordinator | Git orchestration |
| ml-engineer | ML/LLMOps work |
| chrome-ext-developer | WXT and extension work |
| data-engineer | ETL and data quality |
| infra-as-code-specialist | IaC and delivery pipelines |
| observability-telemetry | Logs, metrics, traces, dashboards |

## Workflow

1. Plan complex work first.
2. Write or update tests before implementation.
3. Review code immediately after changes.
4. Keep docs, manifests, and templates in sync.
5. Use the repo-local validation scripts before publishing.

## Surface Policy

- `skills/` is the canonical workflow surface.
- `commands/` is compatibility and migration surface.
- Keep markdown prompts short, direct, and explicit.
- Prefer the maintained skill files over duplicated command logic.

## Security

- Never hardcode secrets.
- Validate user input at boundaries.
- Prefer least privilege and explicit allowlists.
- Stop and review if a change touches auth, secrets, or external input.

## Testing

- Unit tests, integration tests, and E2E tests are all expected.
- Run `npm test` and `node scripts/validate-surface.js` before release.

## Project Structure

```text
agents/            19 agents
skills/            50+ skills
commands/          compatibility commands and workflow shims
hooks/             automation hooks
rules/             common, python, typescript, web guidance
manifests/         install manifests
schemas/           JSON schemas
mcp-configs/       MCP server configs
docs/              installation, architecture, operations, publishing
examples/          reusable markdown templates
scripts/           install, validate, sync, and template helpers
tests/             smoke tests
```

## Execution

- Use parallel agents for independent work.
- Escalate to planner for multi-file or risky changes.
- Use security-reviewer for auth, secrets, shell usage, or data handling.
- Use e2e-runner for critical user flows.
