# AI Dev Kit — Agent Instructions

This is a production-ready AI dev kit for Python, TypeScript, web, AI/ML, and
infrastructure workflows.

**Version:** 1.1.0

---

## Core Principles

1. **Agent-first** — delegate domain work to the right specialist. Don't generalize when a specialist exists.
2. **Test-driven** — write tests before implementation when behavior changes. RED → GREEN → REFACTOR.
3. **Security-first** — validate inputs, avoid unsafe defaults, never hardcode secrets. Stop and review if a change touches auth, secrets, or external input.
4. **Plan-before-execute** — break complex work into phases. Use the `planner` agent before touching code for multi-file changes.
5. **Model fallback** — if a requested model is unavailable, use the workspace default model and continue. Never block progress on model unavailability.

---

## Available Agents

| # | Agent | Purpose | When to Use |
|---|---|---|---|
| 1 | `planner` | Implementation planning for complex features | Breaking down feature requests into phased, mergeable plans with ADRs |
| 2 | `architect` | System design, tradeoffs, component boundaries | New service design, API contracts, data store selection |
| 3 | `tdd-guide` | Test-driven development specialist | Writing tests first for new features or bug fixes |
| 4 | `code-reviewer` | Code quality and regression prevention | Reviewing PR diffs for correctness, maintainability, performance |
| 5 | `security-reviewer` | Security audit and threat modeling | Changes touching auth, input validation, secrets, external APIs |
| 6 | `ai-judge` | Rubric-based validation | Validating plans, implementations against quality criteria |
| 7 | `build-error-resolver` | Build and type error diagnosis | Fixing TypeScript, Python, lint, and build pipeline errors |
| 8 | `e2e-runner` | End-to-end testing | Writing and running E2E tests for critical user flows |
| 9 | `refactor-cleaner` | Cleanup and modernization | Tech debt paydown, dead code removal, dependency updates |
| 10 | `doc-updater` | Documentation sync | Updating docs to match code changes |
| 11 | `docs-lookup` | Documentation reference | Finding and citing official docs for frameworks and APIs |
| 12 | `python-reviewer` | Python-specific code review | FastAPI, Pandas, SQLAlchemy, Pydantic pattern review |
| 13 | `database-reviewer` | Database and migration review | Schema design, migration safety, query optimization |
| 14 | `git-agent-coordinator` | Git orchestration | Branch creation, PR management, merge coordination |
| 15 | `ml-engineer` | ML/LLMOps specialist | RAG pipelines, model training, evals, deployment |
| 16 | `chrome-ext-developer` | WXT and Chrome extension work | Extension scaffolding, manifest config, permissions |
| 17 | `data-engineer` | ETL and data quality | Pipeline design, data validation, quality gates |
| 18 | `infra-as-code-specialist` | IaC and delivery pipelines | Terraform, CI/CD, deployment automation |
| 19 | `observability-telemetry` | Logs, metrics, traces, dashboards | Setting up monitoring, alerting, and observability |
| 20 | `multi-agent-project-manager` | Multi-workflow orchestration | Managing concurrent workflows, backlog, priority queue, never stops |
| 21 | `workflow-auditor` | Health checks and anomaly detection | Stuck workflow detection, quality gate trending, resource leaks |
| 22 | `reddit-researcher` | Reddit sentiment and experience mining | Real-world user experiences, production war stories, community consensus |
| 23 | `codebase-analyzer` | Codebase structure and complexity analysis | Understanding codebase architecture, dependency mapping |
| 24 | `codebase-learner` | Codebase learning specialist | Rapid onboarding to unfamiliar codebases |
| 25 | `code-quality-analyzer` | Static analysis and quality metrics | Code quality enforcement, standards checking |
| 26 | `test-debt-analyzer` | Test coverage and debt tracking | Identifying testing gaps, test debt prioritization |
| 27 | `security-debt-analyzer` | Security vulnerability tracking | Security debt identification, remediation planning |
| 28 | `performance-debt-analyzer` | Performance bottleneck analysis | Performance debt tracking, optimization opportunities |
| 29 | `dependency-debt-analyzer` | Dependency health monitoring | Outdated dependencies, upgrade path planning |
| 30 | `architecture-debt-analyzer` | Architectural debt detection | Design flaws, architectural drift detection |
| 31 | `process-debt-analyzer` | Workflow inefficiency detection | Process bottlenecks, workflow optimization |
| 32 | `documentation-debt-analyzer` | Documentation gap detection | Stale docs, missing documentation identification |
| 33 | `technical-debt-analyzer` | Overall technical debt assessment | Comprehensive debt aggregation and prioritization |

---

## Agent Orchestration

### When to Delegate

- **Single-file, single-language change** → handle directly, use the relevant language reviewer
- **Multi-file or multi-language change** → escalate to `planner` first
- **Anything touching auth, secrets, or external input** → route through `security-reviewer`
- **New architecture or service** → start with `architect`, then `planner`
- **Test writing for new behavior** → delegate to `tdd-guide`
- **PR review before merge** → run `code-reviewer` then `security-reviewer`

### Parallel Execution

Run agents in parallel when work is independent:
- Multiple skill reviews on the same codebase
- Independent feature branches with no shared dependencies
- Documentation updates alongside code changes

Never parallelize when there are dependencies:
- Don't implement before the planner has approved the plan
- Don't merge before code-review and security-review pass

---

## Security Guidelines

### Pre-Commit Checklist

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] User inputs validated at all boundaries
- [ ] No shell interpolation from untrusted strings
- [ ] Dependencies audited for known CVEs
- [ ] No PII in logs or error messages

### Secret Management

- Use environment variables for API keys and tokens
- Reference `.env.example` for required variables
- Never commit `.env` files
- Use `${CLAUDE_PLUGIN_ROOT}` or `${CLAUDE_PLUGIN_DATA}` in hooks/MCP configs

### Escalation Procedure

1. Flag the concern in the review comment with **BLOCKER** label
2. Route to `security-reviewer` for detailed analysis
3. Do not merge until the security concern is resolved
4. Document the decision in an ADR if it involves architectural change

---

## Coding Style

### Immutability

- Prefer immutable data structures where possible
- Avoid mutable global state — pass context explicitly
- Use `const`/`readonly` by default, `let`/`var` only when mutation is needed

### File Organization

- One concern per file — avoid god files
- Group related functions together
- Consistent import ordering (stdlib → third-party → local)
- Keep files under 300 lines — extract when larger

### Error Handling

- All error paths must be handled — no silent failures
- Meaningful error messages with context
- Use language-specific patterns: `try/except` with specific exceptions (Python), `try/catch` with typed errors (TypeScript)
- HTTP endpoints return proper status codes

### Input Validation

- Validate at boundaries — API endpoints, CLI arguments, file reads
- Use Pydantic models (Python) or Zod schemas (TypeScript)
- Reject early — fail fast with clear error messages

---

## Testing Requirements

### Coverage Thresholds

- **Line coverage:** ≥80%
- **Branch coverage:** ≥70%
- Measured by `pytest --cov` (Python) or `vitest --coverage` (TypeScript)

### TDD Workflow

1. **RED** — write a failing test that defines the expected behavior
2. **GREEN** — implement the minimum code to pass the test
3. **REFACTOR** — clean up the implementation while keeping tests green

### Test Quality

- Semantic assertions over snapshot-only
- Meaningful test names that describe the scenario
- Arrange-Act-Assert structure
- Test edge cases: null/empty inputs, boundary values, error paths
- No test order dependencies — tests must be independently runnable

### Failure Troubleshooting

```bash
# Run full test suite
npm test

# Run with coverage
pytest --cov=skills --cov=scripts --cov-report=term-missing

# Run specific test file
pytest tests/test_specific.py -v

# TypeScript type check
npx tsc --noEmit
```

---

## Development Workflow

### Phase 1: Plan
- Use `planner` for complex work — break into phases with acceptance criteria
- Identify affected surfaces: agents, skills, commands, hooks, rules, application code
- Emit ADR IDs for architectural decisions

### Phase 2: Test-First
- Delegate to `tdd-guide` for new behavior
- Write failing tests that define expected behavior
- Verify tests fail before implementation

### Phase 3: Implement
- Make the smallest change that makes tests pass
- Use parallel agents for independent surfaces
- Keep commits small and focused

### Phase 4: Review
- Run `code-reviewer` for quality check
- Run `security-reviewer` for security check
- Address BLOCKERs before merge
- Suggestions can be addressed in follow-up PRs

### Phase 5: Knowledge Capture
- Update relevant docs (README, AGENTS, skill docs)
- Run `npm test` and `node scripts/validate-surface.js`
- Commit with conventional commit message
- Merge with clean PR

---

## Workflow Surface Policy

- **`skills/` is the canonical workflow surface.** This is where primary workflow definitions live.
- **`commands/` is a compatibility and migration surface.** It provides slash-command shims for harnesses that still expect them.
- Keep markdown prompts short, direct, and explicit — no fluff or conversational filler.
- Prefer the maintained skill files over duplicated command logic.
- When a skill and command overlap, the skill is the source of truth.

---

## Git Workflow

### Branch Naming

```
<type>/<short-description>
# Examples:
feature/tdd-workflow-skill
fix/agent-parsing-error
docs/update-readme-install
```

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): brief description

- Detail what changed and why
- Reference related issues
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`

### PR Process

1. Create feature branch from `main`
2. Make focused changes
3. Run `npm test` — must pass
4. Run `node scripts/validate-surface.js` — must pass
5. Create PR with description of what and why
6. Request review from `code-reviewer` agent
7. Address feedback
8. Squash merge to `main`

---

## Architecture Patterns

### Plugin Architecture

The kit uses a **multi-harness plugin model**. Each platform (Claude Code, Codex, OpenCode, Gemini) has its own manifest in a dot-prefixed directory, all pointing to the same source content:

```
.claude-plugin/    → Claude Code manifest + marketplace
.codex-plugin/     → Codex manifest
.agents/           → Codex marketplace catalog
.gemini/           → Gemini extension
.opencode/         → OpenCode config + TypeScript plugin
skills/            → Shared skill definitions (single source of truth)
agents/            → Shared agent definitions
commands/          → Shared command definitions
```

### Skills-First Design

Skills are the primary workflow surface. Each skill is a `SKILL.md` file with:
- YAML frontmatter: `description`, optional `disable-model-invocation`
- Body: instructions for the AI agent
- Located in `skills/<name>/SKILL.md`

### Hooks

Hooks are lifecycle automations triggered by events:
- Defined in `hooks/hooks.json`
- Auto-loaded by convention in Claude Code v2.1+
- Events: `PostToolUse`, `SessionStart`, `PreCommit`, etc.

---

## Performance

### Context Management

- Keep skill files concise — under 500 lines each
- Use `context-prune` skill for large context windows
- Reference files by path rather than embedding full content
- Use `${CLAUDE_PLUGIN_ROOT}` variable for dynamic path resolution

### Model Selection

- Use stronger models (opus) for planning and complex reasoning
- Use standard models (sonnet) for routine code review and implementation
- Use lighter models (haiku) for simple lookups and formatting
- All agents specify their preferred model with fallback

---

## Project Structure

```
ai-dev-kit/
├── agents/              33 agent definitions (.md files)
├── skills/              59 skill playbooks (<name>/SKILL.md)
├── commands/            41 command definitions (.md files)
├── hooks/               lifecycle automation hooks
├── rules/               language-specific guidance
│   ├── common.md        Universal coding standards
│   ├── python.md        Python-specific standards
│   ├── typescript.md    TypeScript-specific standards
│   └── web.md           Web/frontend standards
├── manifests/           install manifests
├── schemas/             JSON schemas for validation
├── mcp-configs/         MCP server configurations
├── docs/                architecture, design, operations
├── examples/            reusable templates
├── scripts/             install, validate, sync helpers
├── tests/               smoke tests
├── .claude-plugin/      Claude Code plugin + marketplace
├── .codex-plugin/       Codex plugin manifest
├── .agents/             Codex marketplace
├── .gemini/             Gemini extension
└── .opencode/           OpenCode config + plugin
```

---

## Success Metrics

| Metric | Target | How to Measure |
|---|---|---|
| Test coverage | ≥80% line, ≥70% branch | `pytest --cov`, `vitest --coverage` |
| Plan quality | Judge PASS rate ≥80% | `ai-judge` rubric validation |
| Review quality | BLOCKER rate <20% of reviews | `code-reviewer` output analysis |
| Skill completeness | All skills have SKILL.md | `node scripts/validate-surface.js` |
| Manifest validity | All JSON valid | `npm test` |

---

## Execution Guidelines

- **Use parallel agents for independent work** — e.g., reviewing multiple files simultaneously
- **Escalate to `planner` for multi-file or risky changes** — don't start coding without a plan
- **Use `security-reviewer` for auth, secrets, shell usage, or data handling** — mandatory for security-sensitive changes
- **Use `e2e-runner` for critical user flows** — test the full pipeline before shipping
- **Use `ai-judge` before declaring work done** — validate against the quality rubric
