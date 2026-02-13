Create a pull request for the current branch following project guidelines.

**Pre-flight checks:**
1. Verify we're NOT on `master` or `main` - if so, STOP
2. Run `pnpm astro check` and `pnpm build` to verify quality
3. Check if branch is pushed to remote, push with `-u` if not

**Analyze changes:**
1. Run `git log master..HEAD --oneline` to see all commits on this branch
2. Run `git diff master...HEAD --stat` to see files changed
3. Understand the full scope of changes (not just latest commit)

**Create PR:**
Use `gh pr create` with this format:
- Title: short, under 70 characters, descriptive of the change
- Body using this template:

```
## Summary
- [1-3 bullet points describing what changed and why]

## Medical References
[If applicable - cite sources for any medical calculations or data]

## Test Plan
- [ ] `pnpm astro check` passes
- [ ] `pnpm build` succeeds
- [ ] [Feature-specific test items]
- [ ] Dark mode rendering verified
- [ ] Touch targets adequate for field use
- [ ] Offline functionality confirmed
```

After creating, display the PR URL.