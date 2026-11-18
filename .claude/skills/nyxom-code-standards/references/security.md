# Security Gates (mandatory, block merge on failure)

Run these on every PR; fix findings, never silence them without a written reason.

| Gate | Tool | Command |
|---|---|---|
| Secrets in code/history | gitleaks | `gitleaks detect --source . --redact` (also as pre-commit hook) |
| Static analysis (SAST) | Semgrep | `semgrep scan --config p/default --config p/owasp-top-ten --config p/secrets --error` |
| Deep SAST (GitHub) | CodeQL | GitHub Advanced Security / `github/codeql-action` workflow |
| Vulnerable deps (JS) | npm audit | `npm audit --audit-level=high` |
| Vulnerable deps (Py) | pip-audit | `pip-audit --strict` |
| Python security lint | bandit | `bandit -r src -ll` |
| Containers / IaC | Trivy | `trivy fs --severity HIGH,CRITICAL --exit-code 1 .` |
| Dockerfile lint | hadolint | `hadolint Dockerfile` |
| Workflow security | zizmor / pinned actions | pin third-party actions to a commit SHA |
| Dependency updates | Dependabot / Renovate | `.github/dependabot.yml`, weekly |

## Pre-commit (local, fast)
`.pre-commit-config.yaml` with: gitleaks, ruff/eslint, prettier, end-of-file-fixer, check-added-large-files, detect-private-key.

## OWASP Top 10 rules of thumb
- **Injection**: parameterized queries only; never build SQL/shell/HTML with string concatenation; escape output; validate input with schemas.
- **Auth**: verify identity and permission server-side on every request; rate-limit login/OTP; short-lived tokens; httpOnly+Secure+SameSite cookies.
- **Secrets**: env vars or secret manager only; rotate on leak; never log tokens, phone numbers, health data.
- **SSRF**: allowlist outbound hosts when fetching user-supplied URLs.
- **Webhooks**: verify signatures (WhatsApp/Meta `X-Hub-Signature-256`, Stripe etc.) with constant-time compare; reject replays.
- **Headers (web)**: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, frame-ancestors.
- **LLM/agents**: treat model output and user text as untrusted (prompt injection); validate tool arguments; never let the model build raw SQL/shell; least-privilege tool scopes.
- **Dependencies**: lockfiles committed; pin versions; remove unused packages.
- **Errors**: generic messages to users, detailed logs server-side.

## Supply chain
- Commit lockfiles; use `npm ci` / `pip install --require-hashes` in CI.
- Pin GitHub Actions by SHA; set `permissions:` to least privilege in every workflow.
- Enable branch protection: required reviews + required CI checks on `main`.
