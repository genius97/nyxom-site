# Testing & Mutation Testing

## Unit test pattern
```ts
// Vitest
import { describe, it, expect, vi } from 'vitest';
describe('calculateDiscount', () => {
  it('returns 0 for orders below the threshold', () => {
    // Arrange
    const order = { total: 9 };
    // Act
    const result = calculateDiscount(order);
    // Assert
    expect(result).toBe(0);
  });
});
```
```python
# pytest
def test_returns_zero_below_threshold():
    assert calculate_discount(Order(total=9)) == 0
```
Test: happy path, each branch, boundaries (0, 1, max, max+1), empty/null, invalid input, error paths. Use table-driven tests (`it.each` / `pytest.mark.parametrize`) for many cases. Fake time with `vi.useFakeTimers()` / `freezegun`.

## Coverage
- TS: `npx vitest run --coverage` (config `coverage: { provider: 'v8', thresholds: { lines: 80, branches: 80 } }`)
- Py: `pytest --cov=src --cov-branch --cov-fail-under=80`

## Mutation testing — why
Coverage shows code *ran*; mutation testing shows tests *would catch a bug*. The tool changes code (`>` → `>=`, `+` → `-`, `true` → `false`, removes calls) and reruns tests. A "surviving" mutant means no test noticed → add a sharper assertion.

### StrykerJS (TS/JS)
```bash
npm i -D @stryker-mutator/core @stryker-mutator/vitest-runner @stryker-mutator/typescript-checker
```
`stryker.config.json`:
```json
{
  "testRunner": "vitest",
  "checkers": ["typescript"],
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts"],
  "thresholds": { "high": 85, "low": 70, "break": 70 },
  "incremental": true,
  "reporters": ["html", "clear-text", "progress"]
}
```
Run on changed files only: `npx stryker run --mutate "src/booking/**/*.ts"`.

### mutmut (Python)
```bash
pip install mutmut
mutmut run --paths-to-mutate src/booking/
mutmut results   # list survivors
mutmut show <id> # inspect one
```

### Handling survivors
1. Read the mutant diff. 2. Write a test that fails on the mutant and passes on real code. 3. If the mutant is truly equivalent (no behaviour change), mark it ignored with a comment explaining why.

## CI (GitHub Actions sketch)
```yaml
name: ci
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint && npm run typecheck
      - run: npm run test:coverage
      - run: npx stryker run --incremental
```
Run full mutation testing nightly if it is slow; on PRs mutate only changed files.
