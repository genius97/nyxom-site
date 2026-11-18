# Self-Review Checklist (run on the full diff)

**Correctness**
- [ ] Does it do exactly what was asked? Edge cases: empty, null, zero, huge, duplicate, concurrent, timezone (Oman = Asia/Muscat, UTC+4), Arabic/RTL text.
- [ ] Errors handled, not swallowed; failures leave data consistent.
- [ ] Async: every promise awaited; no race conditions; retries are idempotent.

**Security**
- [ ] No secrets/tokens in code, logs or commits. Uses env vars.
- [ ] Input validated at the edge; SQL parameterized; no injection in shell/HTML/prompts.
- [ ] Auth/permission checked; webhooks verify signatures.
- [ ] Personal data (phone numbers, health/booking data) minimized and not logged.

**Readability & maintainability**
- [ ] Names clear; functions small; no deep nesting; no duplication; no dead code.
- [ ] Would a new developer understand it in 5 minutes?
- [ ] Follows existing repo conventions and folder structure.

**Tests**
- [ ] New behaviour and bug fixes covered; tests fail if the code is broken.
- [ ] Coverage ≥ 80% (critical ≥ 100%), mutation score ≥ 70% (critical ≥ 85%) on changed code.
- [ ] Tests deterministic and fast.

**Performance & ops**
- [ ] No N+1 queries, unbounded loops or loading huge data into memory.
- [ ] Logs useful (context, no noise); config not hardcoded.
- [ ] Migrations reversible; backwards compatible with running services.

**Delivery**
- [ ] Lint, types, tests green locally.
- [ ] Docs/README updated; Conventional Commit message.
