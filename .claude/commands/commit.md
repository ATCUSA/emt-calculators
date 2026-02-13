Create a git commit following the project's conventional commit format.

**Before committing:**
1. Run `pnpm astro check` to verify TypeScript
2. Run `pnpm build` to verify the build passes

**Branch check:**
- If on `master` or `main`, STOP and ask the user to create a feature branch first
- Suggest a branch name based on the changes (feature/, fix/, chore/, refactor/)

**Commit process:**
1. Run `git status` and `git diff --staged` to see what's changed
2. If nothing is staged, show unstaged changes and ask the user what to stage
3. Group related changes into logical commits (not one giant commit)
4. Write commit messages in `type(scope): description` format
5. Types: feat, fix, docs, style, refactor, chore, perf
6. Scopes: calculator, reference, ui, a11y, pwa, ci, critical, or specific name (gcs, o2, stroke)
7. NEVER include Co-Authored-By lines or mention AI/Claude in messages
8. Keep the first line under 72 characters

**Multi-file example:**
```
git add src/data/newCalc.ts
git commit -m "feat(calc): add calculation logic and type definitions"

git add src/components/NewCalc.svelte
git commit -m "feat(calc): add calculator UI component"
```

After committing, show the git log of new commits.