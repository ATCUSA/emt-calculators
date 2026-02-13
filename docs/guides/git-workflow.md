# Git Workflow & Branching Guide

## Branch Strategy

**Never commit directly to `master`.** All work goes through feature branches and PRs.

```
master (production)
  ├── feature/stroke-assessment     # New calculators/features
  ├── fix/o2-calculation-error      # Bug fixes
  ├── chore/update-dependencies     # Maintenance
  └── hotfix/critical-calc-fix      # Emergency medical fixes (merge directly)
```

### Branch Naming

| Prefix | Use | Example |
|--------|-----|---------|
| `feature/` | New calculator, tool, or capability | `feature/iv-drip-calculator` |
| `fix/` | Bug fix | `fix/dark-mode-stroke-assessment` |
| `chore/` | Maintenance, deps, CI, docs | `chore/update-tailwind` |
| `refactor/` | Code restructuring, no behavior change | `refactor/theme-system` |
| `hotfix/` | Critical medical calculation errors | `hotfix/o2-tank-factor` |

### Workflow

```bash
# 1. Start from updated master
git checkout master
git pull origin master

# 2. Create feature branch
git checkout -b feature/calculator-name

# 3. Work, commit often with small focused commits
git add src/components/NewCalc.svelte
git commit -m "feat(calculator): add input form for IV drip rate"

git add src/data/ivDrip.ts
git commit -m "feat(calculator): add IV drip rate calculation logic"

# 4. Push and create PR
git push -u origin feature/calculator-name
gh pr create --title "Add IV Drip Rate Calculator" --body "..."

# 5. After PR review/approval, merge to master
# (via GitHub PR merge, not local merge)
```

### When to Use Hotfix (Skip PR)

Only for **critical medical calculation errors** that affect patient safety:

```bash
git checkout master
git checkout -b hotfix/critical-fix
# Fix the issue
git commit -m "fix(critical): correct O2 tank duration formula"
git checkout master
git merge hotfix/critical-fix
git push origin master
```

## Commit Message Format

**Format:** `type(scope): description`

Keep messages professional. Never mention Claude, AI, or automated tools.

### Types

| Type | When | Example |
|------|------|---------|
| `feat` | New feature or calculator | `feat(calculator): add stroke assessment with FAST scale` |
| `fix` | Bug fix | `fix(gcs): correct pediatric scoring interpretation` |
| `docs` | Documentation only | `docs: update PWA deployment guide` |
| `style` | Formatting, no logic change | `style: fix button alignment in vital signs` |
| `refactor` | Code change, same behavior | `refactor(theme): consolidate dark mode patterns` |
| `chore` | Build, deps, CI, config | `chore: bump version to 1.2.0` |
| `perf` | Performance improvement | `perf: lazy-load NIHSS scale data` |

### Scopes

| Scope | Files affected |
|-------|---------------|
| `calculator` | New/modified calculator component + data |
| `reference` | Reference tool changes |
| `ui` | Visual/styling changes |
| `a11y` | Accessibility improvements |
| `pwa` | Service worker, manifest, offline |
| `ci` | GitHub Actions workflows |
| `critical` | Medical safety fixes (use with `fix` type) |
| specific name | e.g., `gcs`, `o2`, `stroke`, `apgar` |

### Good vs Bad Commits

```bash
# Good - focused, descriptive
git commit -m "feat(stroke): add BEFAST scale with posterior stroke detection"
git commit -m "fix(vital-signs): correct pediatric respiratory rate ranges"
git commit -m "chore(pwa): add stroke assessment to offline cache"

# Bad - vague, bundled, mentions AI
git commit -m "update stuff"
git commit -m "fix everything and add new features"
git commit -m "AI-generated stroke calculator"
```

### Multi-file Changes

Group related changes into logical commits, not one giant commit:

```bash
# Adding a new calculator - 3-4 commits, not 1
git add src/data/ivDrip.ts src/types/medical.ts
git commit -m "feat(iv-drip): add calculation logic and type definitions"

git add src/components/IvDripCalculator.svelte
git commit -m "feat(iv-drip): add calculator UI component"

git add src/pages/iv-drip-calculator.astro
git commit -m "feat(iv-drip): add page with clinical reference content"

git add src/data/tools.ts public/sw.ts
git commit -m "chore(iv-drip): register tool and add to offline cache"
```

## Pre-Commit Checklist

Before every commit:
- [ ] `pnpm astro check` passes (TypeScript)
- [ ] `pnpm build` succeeds
- [ ] No hardcoded light-only colors (use `dark:` variants)
- [ ] Touch targets >= 44px on interactive elements
- [ ] Medical calculations have error handling
- [ ] No `.env`, credentials, or secrets staged

## PR Guidelines

```bash
gh pr create --title "Add IV Drip Rate Calculator" --body "$(cat <<'EOF'
## Summary
- Add IV drip rate calculator with gtts/min and mL/hr calculations
- Support for micro and macro drip sets
- Input validation for flow rates and volumes

## Medical References
- Standard IV drip rate formula: gtts/min = (Volume x Drop Factor) / Time

## Test Plan
- [ ] Verify calculations against known drip rate tables
- [ ] Test with edge cases (0 values, max values)
- [ ] Confirm offline functionality
- [ ] Check dark mode rendering
- [ ] Verify touch targets on mobile
EOF
)"
```