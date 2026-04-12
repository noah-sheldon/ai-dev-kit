---
name: multi-agent-git-workflow
description: Multi-agent Git workflow for parallel AI development — issue-driven branches, deep agents (research/architecture/security), AI-as-judge validation, git worktrees, parallel implementation, automated PRs, context isolation, conflict resolution, quality gates, and rollback.
origin: AI Dev Kit
---

# Multi-Agent Git Workflow

Coordinated parallel development using specialized AI agents, Git issue-driven branching, AI-as-judge validation, and automated quality gates. Enables multiple domain specialists to work simultaneously on a single feature without stepping on each other.

## When to Use

- A feature requires expertise across multiple domains (data, ML, backend, frontend, security)
- You want parallel development instead of sequential handoffs between specialists
- You need structured validation before implementation begins
- You're managing complex features with interdependent components and potential merge conflicts
- You want automated PR creation, review, and quality gates in the development lifecycle

## Core Concepts

### Full Workflow Diagram

```
Git Issue #N → [Git Agent Coordinator]
            ↓ Parallel Spawn
  ├─ [Research Agent] → RAG patterns, best practices
  ├─ [Architecture Agent] → System design, API contracts
  └─ [Security Agent] → Auth, data privacy, dependency audit
            ↓
  [AI Judge Agent] → Validates against rubric
    ├─ FAIL → Loop back with feedback
    └─ PASS → Proceed
            ↓
  [Planning Agent] → Phased implementation plan, branch strategy, file ownership
            ↓
  [Human Approval Gate] → Review plan, approve or request changes
    ├─ REJECT → Loop back to Planning Agent with feedback
    ├─ REQUEST_CHANGES → Routing to specific agent for revision
    └─ APPROVE → Proceed (or auto-approve for trivial changes)
            ↓
  [Implementation Plan] → Branch: feat/description
    ├─ [Data Engineer]    → Ingestion, migrations
    ├─ [ML Engineer]      → Embeddings, retrieval, prompts
    ├─ [Backend Agent]    → FastAPI endpoints, middleware
    └─ [Frontend Agent]   → React/Next.js UI
            ↓
  [Code Reviewer] + [Security Reviewer] → PR → Merge
```

### 1. Git Issue-Driven Development

Every feature starts with a structured Git issue that serves as the single source of truth:

```markdown
## Issue #42: Add semantic caching to RAG pipeline

### Description
Users report slow responses for repeated queries. Implement semantic caching
using embedding similarity to avoid redundant LLM calls for near-identical queries.

### Acceptance Criteria
- [ ] P95 latency < 500ms for cache hits
- [ ] Cache hit rate > 30% in production
- [ ] Cache invalidation when source documents change
- [ ] No regression on answer quality (RAGAS faithfulness >= 0.85)

### Technical Scope
- New `SemanticCache` class with FAISS backend
- Integration into existing `rag_chain()` function
- Metrics: cache_hit_rate, cache_latency, cache_size
- Redis-backed distributed cache for horizontal scaling

### Dependencies
- Requires PR #38 (embedding model upgrade) to be merged first
- No breaking changes to existing API contracts
```

### 2. Parallel Deep Agent Spawn

The coordinator spawns independent research, architecture, and security agents:

```bash
# Create isolated working directories per agent
git worktree add ../research-worktree main -b research/issue-42
git worktree add ../arch-worktree main -b arch/issue-42
git worktree add ../security-worktree main -b security/issue-42
```

**Research Agent** output (`research/issue-42/finding.md`):

```markdown
# Research: Semantic Caching for RAG

## Survey
1. **Embedding-based caching**: Store query embeddings, lookup by cosine similarity
2. **Exact-match caching**: Redis key-value for identical queries (simpler, less effective)
3. **LLM-based caching**: Use a small model to judge semantic equivalence (expensive)

## Recommendation: FAISS + Redis Hybrid
- FAISS for in-memory similarity search (< 50ms for 100K entries)
- Redis for distributed cache persistence and TTL management
- Similarity threshold: 0.95 (tunable)

## Benchmarks
| Approach | Lookup Latency | Hit Rate | Cost |
|----------|---------------|----------|------|
| Exact-match | 2ms | 8% | $0 |
| FAISS-IP | 15ms | 32% | $0 |
| LLM judge | 500ms | 45% | $0.01/query |
```

**Architecture Agent** output (`arch/issue-42/design.md`):

```markdown
# Architecture: Semantic Cache Integration

## Components
```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│  Query   │────→│ Cache Lookup │──HIT─│  Return  │
│          │     │ (FAISS+Redis)│     │  Cached  │
└──────────┘     └──────┬───────┘     └──────────┘
                        │ MISS
                        ↓
                 ┌──────────────┐
                 │  RAG Chain   │──→ Store in cache
                 └──────────────┘
```

## API Contract (unchanged — transparent caching)
POST /v1/chat → {query, ...} → {response, metadata: {cache_hit: bool, latency_ms: int}}

## Cache Schema
- Key: SHA-256 of query (for exact match fallback)
- Metadata: {embedding: float[], timestamp: ISO8601, source_version: str}
- TTL: 24h (configurable)
- Eviction: LRU when size > 100K entries
```

**Security Agent** output (`security/issue-42/audit.md`):

```markdown
# Security Audit: Semantic Cache

## Threat Model
| Threat | Risk | Mitigation |
|--------|------|-----------|
| Cache poisoning via crafted queries | Medium | Input validation, query length limits |
| PII leakage in cached responses | High | PII scrubbing before cache storage |
| DoS via cache flooding | Medium | Rate limiting, max cache size, TTL |
| Stale cache serving outdated info | Low | Invalidation on doc version change |

## Dependency Audit
- `faiss-cpu==1.7.4` — no known CVEs ✓
- `redis==5.0.1` — no known CVEs ✓
- `numpy==1.26.2` — no known CVEs ✓

## Recommendations
1. Add query sanitization before cache key generation
2. Implement cache TTL with jitter to prevent thundering herd
3. Log cache operations for audit trail
```

### 3. AI-as-Judge Validation

The judge agent evaluates all three outputs against a structured rubric:

```python
# ai_judge.py
from dataclasses import dataclass
from typing import Literal

@dataclass
class RubricItem:
    name: str
    weight: float
    threshold: float
    score: float = 0.0
    feedback: str = ""

@dataclass
class JudgeResult:
    verdict: Literal["PASS", "FAIL"]
    total_score: float
    rubric: list[RubricItem]
    feedback: str

def evaluate_design_package(
    research: str, architecture: str, security: str, issue: dict
) -> JudgeResult:
    """Evaluate the combined research + architecture + security output."""
    rubric = [
        RubricItem("Research completeness", weight=0.2, threshold=0.7),
        RubricItem("Architecture clarity", weight=0.25, threshold=0.8),
        RubricItem("API contract completeness", weight=0.15, threshold=0.9),
        RubricItem("Security threat coverage", weight=0.2, threshold=0.8),
        RubricItem("Acceptance criteria alignment", weight=0.2, threshold=0.85),
    ]

    # LLM-as-judge scoring (or use rule-based heuristics)
    scores = score_against_rubric(rubric, research, architecture, security, issue)

    for item, score in zip(rubric, scores):
        item.score = score

    total = sum(item.score * item.weight for item in rubric)
    all_pass = all(item.score >= item.threshold for item in rubric)

    return JudgeResult(
        verdict="PASS" if total >= 0.8 and all_pass else "FAIL",
        total_score=total,
        rubric=rubric,
        feedback=generate_feedback(rubric),
    )
```

**Judge output example**:

```
┌──────────────────────────────┬────────┬───────────┐
│ Rubric Item                  │ Score  │ Threshold │
├──────────────────────────────┼────────┼───────────┤
│ Research completeness        │ 0.85   │ 0.70      ✓
│ Architecture clarity          │ 0.90   │ 0.80      ✓
│ API contract completeness    │ 0.95   │ 0.90      ✓
│ Security threat coverage     │ 0.75   │ 0.80      ✗
│ Acceptance criteria alignment│ 0.88   │ 0.85      ✓
├──────────────────────────────┼────────┼───────────┤
│ WEIGHTED TOTAL              │ 0.865  │ 0.80      │
└──────────────────────────────┴────────┴───────────┘

VERDICT: FAIL — Security threat coverage below threshold
FEEDBACK: Add rate limiting specification for cache DoS prevention.
          Define max concurrent cache write operations.
```

### 3b. Planning Agent — Phased Implementation Plan

After the AI judge passes, the **Planning Agent** synthesizes all research, architecture, and security outputs into a concrete, phased implementation plan:

```markdown
# Implementation Plan: Issue #42 — Semantic Cache for RAG

## Summary
Implement transparent semantic caching using FAISS + Redis to reduce P95 latency
for repeated queries. No API contract changes — cache is a transparent optimization.

## Phase 1: Foundation (data engineering)
**Branch:** `feat/issue-42/data`
**Agent:** data-engineer
**Files to create:**
- `src/cache/store.py` — Redis-backed cache store with TTL and LRU eviction
- `src/cache/schema.py` — CacheEntry dataclass, serialization
- `tests/unit/test_cache_store.py` — Unit tests for store operations
**Acceptance criteria:**
- [ ] Cache entry creation, retrieval, deletion works
- [ ] TTL expires entries automatically
- [ ] LRU eviction kicks in at 100K entries
- [ ] Unit test coverage ≥ 85%

## Phase 2: Core Logic (ML engineering)
**Branch:** `feat/issue-42/ml`
**Agent:** ml-engineer
**Files to create:**
- `src/cache/semantic_cache.py` — SemanticCache class with FAISS similarity lookup
- `src/cache/embedding.py` — Query embedding generation
- `tests/unit/test_semantic_cache.py` — Cache hit/miss, threshold tuning
**Dependencies:** Phase 1 (cache store)
**Acceptance criteria:**
- [ ] Cache hit when query similarity ≥ 0.95
- [ ] Cache miss for dissimilar queries
- [ ] P95 lookup latency < 50ms
- [ ] No regression on RAGAS faithfulness (≥ 0.85)

## Phase 3: Integration (backend)
**Branch:** `feat/issue-42/backend`
**Agent:** code-reviewer (also acts as backend integrator)
**Files to modify:**
- `src/api/v1/chat.py` — Add cache lookup before RAG chain execution
- `src/middleware/cache_middleware.py` — Transparent cache layer
- `tests/integration/test_cache_endpoint.py` — End-to-end cache behavior
**Dependencies:** Phase 1 + Phase 2
**Acceptance criteria:**
- [ ] Cache hit returns cached response with `cache_hit: true` metadata
- [ ] Cache miss triggers RAG chain and stores result
- [ ] Error in cache layer does not break the endpoint (graceful degradation)
- [ ] Response format unchanged for downstream consumers

## Phase 4: Polish (frontend — if applicable)
**Branch:** `feat/issue-42/frontend`
**Agent:** ml-engineer (also handles UI indicator)
**Files to modify:**
- `src/components/ChatMessage.tsx` — Show cache hit indicator
**Dependencies:** Phase 3
**Acceptance criteria:**
- [ ] Cache hits display a subtle "cached" badge
- [ ] No visual change for cache misses (existing behavior preserved)

## Merge Order
1. Phase 1 (data) → merge to main first (no dependencies)
2. Phase 2 (ml) → merge after Phase 1 (depends on cache store)
3. Phase 3 (backend) → merge after Phase 2 (depends on SemanticCache)
4. Phase 4 (frontend) → merge after Phase 3 (depends on API metadata)

## Rollback Strategy
- Each phase is independently revertible
- Phase 3 has a feature flag: `ENABLE_SEMANTIC_CACHE=false` disables cache transparently
- Full rollback: revert all 4 PRs in reverse merge order

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Cache serves stale responses | Medium | High | TTL + version invalidation |
| FAISS memory usage grows unbounded | Low | Medium | LRU eviction at 100K entries |
| Cache layer introduces latency on miss | Low | Medium | Async cache store, non-blocking |
| Merge conflicts between phases | Medium | Low | Disjoint file sets, rebase strategy |
```

### 3c. Human Approval Gate

After the Planning Agent produces the phased plan, a **human approval gate** decides whether to proceed:

#### Auto-Approval (No Human Needed)

For **trivial changes**, the workflow proceeds automatically without human review:

```yaml
# auto-approve criteria
auto_approve:
  - files_changed <= 3
  - no security-sensitive files touched (no auth, secrets, payment, PII)
  - test coverage maintained or improved
  - no new external dependencies added
  - scope is limited to single surface (e.g., documentation, one module)
```

If all auto-approve criteria are met, skip to **Implementation** immediately.

#### Human Review Required

For **non-trivial changes**, the plan is presented to the human for review:

```
═══════════════════════════════════════════════════════
  IMPLEMENTATION PLAN READY FOR REVIEW
  Issue #42: Add semantic caching to RAG pipeline
═══════════════════════════════════════════════════════

  4 phases planned:
    Phase 1: data — Cache store (3 new files)
    Phase 2: ml   — SemanticCache class (2 new files)
    Phase 3: backend — API integration (2 modified files)
    Phase 4: frontend — Cache indicator (1 modified file)

  Merge order: data → ml → backend → frontend
  Risk: Medium (cache staleness, memory usage)
  Rollback: Feature flag + per-phase revert

  Review the full plan at: plans/issue-42/implementation-plan.md

  Respond with one of:
    APPROVE          → Proceed with implementation
    REJECT           → Cancel this feature, close the issue
    REQUEST_CHANGES  → Send back with specific feedback
═══════════════════════════════════════════════════════
```

#### Approval Responses

| Response | Behavior |
|---|---|
| `APPROVE` | Proceed to implementation — spawn agents per phase |
| `REJECT` | Close the issue, clean up worktrees, log reason |
| `REQUEST_CHANGES` | Route feedback to the Planning Agent for revision |

**REQUEST_CHANGES feedback examples:**

```
REQUEST_CHANGES:
- Phase 2 should not depend on Phase 1 — make SemanticCache self-contained
- Add a Phase 0: benchmark the current RAG latency as a baseline
- Missing: metrics dashboard for cache hit rate and latency
- Security review flagged PII risk — add cache content scrubbing to Phase 1
```

When `REQUEST_CHANGES` is received, the Planning Agent revises the plan incorporating the feedback and re-submits for approval. This loop continues until the human approves or rejects.

#### Timeout Behavior

If the human does not respond within a configurable timeout (default: 2 hours):

- **During business hours:** Send a reminder notification
- **After hours:** Queue the plan for review at next business day
- **Emergency mode (if flagged):** Proceed with implementation but add a `# HUMAN_REVIEW_PENDING` marker to each PR description

### 4. Branch Coordination with Git Worktrees

```bash
# After judge PASS, create implementation worktrees
git worktree add ../impl-data main -b feat/issue-42/data
git worktree add ../impl-ml main -b feat/issue-42/ml
git worktree add ../impl-backend main -b feat/issue-42/backend
git worktree add ../impl-frontend main -b feat/issue-42/frontend

# Each agent works in isolation — no lock contention
cd ../impl-ml
# ML Engineer: implements SemanticCache class
cd ../impl-backend
# Backend Agent: integrates cache into FastAPI middleware
```

### 5. Context Isolation Per Agent

Each agent receives only the context it needs:

```yaml
# agent-context.yaml — passed to each agent
issue:
  number: 42
  title: "Add semantic caching to RAG pipeline"
  acceptance_criteria: [...]

shared_artifacts:
  research: research/issue-42/finding.md
  architecture: arch/issue-42/design.md
  security: security/issue-42/audit.md

agent_specific:
  ml_engineer:
    scope: "Implement SemanticCache class"
    files_to_modify:
      - src/cache/semantic_cache.py
      - src/cache/__init__.py
    test_files:
      - tests/unit/test_semantic_cache.py
  backend_agent:
    scope: "Integrate cache into /v1/chat endpoint"
    files_to_modify:
      - src/api/v1/chat.py
      - src/middleware/cache_middleware.py
```

### 6. Automated PR Creation

```bash
# After all agents complete, coordinator creates PRs
# Data Engineer PR
cd ../impl-data && git add -A && git commit -m "feat: add ingestion pipeline for cache warming

- Add batch document ingestion with cache pre-warming
- DVC tracking for cache seed data
- Idempotent upsert logic

Closes #42"
git push origin feat/issue-42/data

# Create PR via GitHub CLI
gh pr create \
  --base main \
  --head feat/issue-42/data \
  --title "feat: add cache warming ingestion pipeline (#42)" \
  --body-file ../impl-data/PR_BODY.md

# Merge after approval
gh pr merge --squash --delete-branch
```

### 7. Conflict Resolution

**Preventive strategy** — agents work on disjoint file sets:

```yaml
# ownership.yaml — declare file ownership to prevent conflicts
paths:
  src/cache/: ml_engineer
  src/api/v1/: backend_agent
  src/components/Chat.tsx: frontend_agent
  data/: data_engineer
  tests/unit/cache/: ml_engineer
  tests/integration/api/: backend_agent
```

**Resolution when conflicts occur**:

```bash
# Rebase-based resolution (preferred for linear history)
git checkout feat/issue-42/backend
git fetch origin main
git rebase origin/main

# If conflicts arise with another in-flight PR:
git checkout feat/issue-42/backend
git rebase feat/issue-42/data  # rebase on top of merged data PR
# Resolve conflicts, continue rebase
git rebase --continue
git push --force-with-lease  # Safe force push

# Patch-based for complex conflicts
git diff main > ../conflict-resolution.patch
# Manually resolve, then apply
git apply ../conflict-resolution.patch
```

### 8. Quality Gates

```yaml
# quality-gates.yaml
pre_pr:
  - type: lint
    command: "ruff check src/ && black --check src/"
  - type: type_check
    command: "mypy src/"
  - type: unit_tests
    command: "pytest tests/unit/ --cov=src/ --cov-fail-under=80"
  - type: integration_tests
    command: "pytest tests/integration/ -m 'not slow'"

pr_review:
  - reviewer: code-reviewer
    scope: "All changed files"
    focus: ["correctness", "readability", "test_coverage"]
  - reviewer: security-reviewer
    scope: "Auth, secrets, input validation"
    focus: ["injection", "auth_bypass", "data_exposure", "dependencies"]

merge_gates:
  - all_pre_pr_checks: pass
  - code_review: approved
  - security_review: no_critical_findings
  - ci_pipeline: green
  - coverage_threshold: 80%
```

### 9. Rollback Procedures

```bash
# Identify the problematic merge
git log --oneline -20
# Find merge commit SHA: abc1234

# Option 1: Revert the merge (safest for shared branches)
git revert -m 1 abc1234
git push origin main

# Option 2: Hotfix branch (when revert is too disruptive)
git checkout -b hotfix/issue-42-cache-bug main
# Fix the bug
git commit -am "fix: resolve cache invalidation bug from #42"
git push origin hotfix/issue-42-cache-bug
gh pr create --base main --title "hotfix: cache invalidation fix"

# Option 3: Reset (only if no downstream merges — NEVER on shared branches)
# DANGER: Rewrites history
# git reset --hard abc1234^
# git push --force-with-lease
```

## Anti-Patterns

- **Monolithic PRs** — combining data, ML, backend, and frontend changes in a single PR for review
- **No AI-as-judge gate** — agents start implementing before design and security are validated
- **Shared worktrees** — multiple agents writing to the same branch, causing merge conflicts
- **Skipping security review** — implementing features without threat modeling or dependency audits
- **Manual PR descriptions** — PRs without structured context, making review difficult
- **Force pushing to main** — rewriting shared history instead of using revert
- **No coverage gates** — merging code that reduces test coverage without tracking
- **Context overflow** — giving agents too much irrelevant context, diluting focus
- **Sequential instead of parallel** — agents waiting on each other when they could work independently
- **No rollback plan** — deploying without a tested rollback strategy

## Best Practices

1. **One issue, one feature branch** — keep scope tight; split large issues into sub-issues
2. **Validate before implementing** — AI judge gate ensures research, architecture, and security are solid
3. **Use git worktrees for isolation** — each agent gets a clean, independent working directory
4. **Declare file ownership upfront** — prevent conflicts by assigning disjoint file sets to agents
5. **Rebase, don't merge** — maintain linear history for easier conflict resolution and rollback
6. **Automate PR descriptions** — generate PR body from the issue + design artifacts
7. **Run quality gates locally before pushing** — lint, type-check, test, and security-scan in pre-push hooks
8. **Use `--force-with-lease` not `--force`** — safe force pushes that won't overwrite others' work
9. **Revert over reset on shared branches** — preserve history and downstream merges
10. **Keep agent context scoped** — pass only relevant files and artifacts to each agent

## Related Skills

- **code-reviewer** — automated code review as part of the quality gate
- **security-reviewer** — security validation in the parallel spawn and pre-merge review
- **ai-judge** — the AI-as-judge agent that validates design packages
- **tdd-guide** — test-driven implementation within each agent's scope
- **planner** — breaking large features into sub-issues for parallel work
- **git-agent-coordinator** — orchestrating the multi-agent workflow
