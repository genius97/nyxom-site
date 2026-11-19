---
name: nyxom-code-standards
description: Use whenever writing, changing, refactoring or reviewing code in any Nyxom repository (TypeScript/JavaScript, Python, Kotlin/Android, n8n code nodes, scripts). Enforces clean, readable, maintainable code, unit tests, mutation testing, and a self-review before any commit or PR.
---

# Nyxom Code Standards

Apply these rules to every code change. Goal: code a senior engineer at a top company would approve without comments.

## Workflow (every change)
1. **Understand first** – read the surrounding code, existing conventions, linters and test setup. Follow the repo's style over personal preference.
2. **Plan small** – smallest change that solves the problem. No speculative features (YAGNI).
3. **Write the test first when practical** (TDD): a failing test that describes the behaviour, then the code.
4. **Implement** following the rules below.
5. **Run**: formatter → linter → type-check → unit tests → coverage → mutation tests (on changed modules) → security gates (`references/security.md`: gitleaks, Semgrep, dependency audit).
6. **Self-review** with `references/review-checklist.md`. Fix every item before committing.
7. **Commit** with a clear Conventional Commit message (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`).

## Clean code rules
- **Names** reveal intent: `invoiceTotal`, not `x`/`data2`. Booleans read as questions: `isPaid`, `hasAccess`. Functions are verbs.
- **Functions** do one thing, ideally < 30 lines, ≤ 3 parameters (use an options object beyond that). No hidden side effects.
- **Files/modules** have one responsibility; ~300 lines is a smell to split.
- **No duplication** (DRY) — but don't abstract until the third repetition.
- **Early returns** over deep nesting (max 3 levels).
- **No magic numbers/strings** → named constants or config.
- **Errors**: never swallow. Throw typed/specific errors, handle at boundaries, log with context. Validate all external input (API, webhook, user, AI output) at the edge (zod / pydantic).
- **Comments** explain *why*, not *what*. Remove dead and commented-out code.
- **Types**: TypeScript `strict: true`, no `any` (use `unknown` + narrowing). Python: type hints everywhere, `mypy`/`pyright` clean.
- **Pure core, thin edges**: keep business logic in pure functions; push I/O (DB, HTTP, WhatsApp, LLM calls) behind small adapters so logic is testable.
- **Dependency injection** for clocks, random, HTTP clients, DB — so tests can fake them.
- **Security**: no secrets in code or logs; parameterized SQL; least privilege; sanitize output; check auth on every endpoint.
- **SOLID** where it helps; prefer composition over inheritance.

## Testing rules (details: `references/testing.md`)
- Every new function/branch gets unit tests; every bug fix gets a regression test first.
- Tests follow **Arrange–Act–Assert**, one behaviour per test, descriptive names (`returns 0 when cart is empty`).
- Fast, deterministic, isolated: no real network/time/random — mock at the adapter boundary.
- Coverage target: **≥ 80% lines and branches** on changed code (100% on money, booking, auth logic).
- **Mutation score ≥ 70%** on changed modules (≥ 85% for critical logic). Surviving mutants = missing assertions → add tests.

## Tooling defaults (use repo's own if present)
| | TS/JS | Python | Kotlin/Android |
|---|---|---|---|
| Format | Prettier | ruff format (or black) | ktlint |
| Lint | ESLint (typescript-eslint strict) | ruff | detekt + Android Lint |
| Types | tsc --noEmit | mypy / pyright | Kotlin compiler (warnings as errors) |
| Unit tests | Vitest (or Jest) | pytest | JUnit5 + MockK |
| Coverage | vitest --coverage (v8) | pytest-cov | Kover / JaCoCo |
| Mutation | StrykerJS | mutmut (or cosmic-ray) | Pitest (pitest-kotlin) |

If a tool is missing, add it with a minimal config and an npm/make script (`test`, `test:coverage`, `test:mutation`, `lint`, `typecheck`). Commands and configs: `references/testing.md`.

## Security
Security gates in `references/security.md` are mandatory and block merging. Never disable a check to make CI pass.

## Review
Before finishing, run the checklist in `references/review-checklist.md` against the full diff. When asked to review someone else's code, report findings ranked by severity (bug > security > correctness > maintainability > style), each with file:line, the problem, and a concrete fix.

## Definition of done
- [ ] Formatter, linter, type-check pass with zero warnings
- [ ] Unit tests pass; coverage and mutation targets met for changed code
- [ ] Security gates pass (no secrets, no high/critical SAST or dependency findings)
- [ ] Self-review checklist complete
- [ ] README/docs updated if behaviour or setup changed
- [ ] Clear commit message; no secrets, debug logs or TODOs without a ticket
