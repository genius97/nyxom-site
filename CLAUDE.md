# CLAUDE.md — nyxom-site

Static marketing website for Nyxom (nyxom.ai): plain HTML/CSS/JS served by nginx in Docker, deployed via Coolify.

## Mandatory coding standard
Every code change in this repository — new code, edits, refactors, fixes and reviews — MUST follow the skill
`.claude/skills/nyxom-code-standards/SKILL.md` (clean code, unit tests, mutation testing, security gates, self-review).
Load and apply it before writing code. A task is not done until its Definition of Done is met.

## Repo notes
- Arabic pages at the root, English under `en/`. Keep both in sync when content changes.
- RTL layout for Arabic; test at phone width.
- Never commit secrets. Deployment config lives in `.coolify/` and `Dockerfile`.
