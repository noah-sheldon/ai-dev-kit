# Command-Agent Map

This repo uses commands as shims and agents/skills as the maintained workflow surface.
Use this map to keep the command layer and the canonical prompt layer aligned.

| Command | Primary agent(s) | Main skill(s) |
| --- | --- | --- |
| `/plan` | planner | `project-capability`, `token-budget-advisor` |
| `/tdd` | tdd-guide | `tdd-workflow`, `verification-loop` |
| `/code-review` | code-reviewer | `code-review`, `security-review` |
| `/verify` | code-reviewer | `verification-loop`, `quality-gate` |
| `/quality-gate` | security-reviewer | `security-review`, `coding-standards` |
| `/build-fix` | build-error-resolver | `typescript-patterns`, `python-patterns` |
| `/e2e` | e2e-runner | `e2e-testing`, `frontend-patterns` |
| `/refactor-clean` | refactor-cleaner | `coding-standards`, `hexagonal-architecture` |
| `/update-docs` | doc-updater | `documentation-lookup`, `skill-authoring` |
| `/update-codemaps` | doc-updater | `codebase-onboarding`, `skill-authoring` |
| `/learn` | - | `search-first`, `continuous-agent-loop` |
| `/learn-eval` | - | `eval-harness`, `continuous-learning-v2` |
| `/eval` | - | `eval-harness`, `token-budget-advisor` |
| `/skill-create` | - | `skill-authoring`, `coding-standards` |
| `/skill-health` | - | `skill-authoring`, `verification-loop` |
| `/checkpoint` | - | `verification-loop` |
| `/git-agent` | git-agent-coordinator | `multi-agent-git-workflow`, `github-ops` |
| `/ml-review` | ml-engineer | `mlops-rag`, `openai-api` |
| `/context-budget` | - | `token-budget-advisor` |
| `/context-prune` | - | `context-prune`, `token-budget-advisor` |
| `/review-pr` | code-reviewer | `code-review`, `security-review` |
| `/feature-dev` | planner, tdd-guide | `project-capability`, `tdd-workflow` |
| `/sessions` | - | `continuous-agent-loop` |
| `/save-session` | - | `continuous-agent-loop` |
| `/resume-session` | - | `continuous-agent-loop` |
| `/hookify` | - | `github-ops`, `coding-standards` |

Notes:
- Commands should stay short and delegate the real work to the matching agent or skill.
- If a command starts growing logic, move that logic into a skill or agent prompt.
- Treat this doc as the first place to check when you add, rename, or retire a command.

