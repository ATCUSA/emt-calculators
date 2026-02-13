Create a new feature branch from an up-to-date master.

Ask the user what they're working on, then:

1. Stash any uncommitted changes: `git stash` (if there are changes)
2. Switch to master: `git checkout master`
3. Pull latest: `git pull origin master`
4. Create and switch to new branch

**Branch naming conventions:**
| Prefix | Use |
|--------|-----|
| `feature/` | New calculator, tool, or capability |
| `fix/` | Bug fix |
| `chore/` | Maintenance, deps, CI, docs, config |
| `refactor/` | Code restructuring, no behavior change |
| `hotfix/` | Critical medical calculation errors only |

**Examples:**
- `feature/iv-drip-calculator`
- `fix/dark-mode-stroke-assessment`
- `chore/update-dependencies`
- `refactor/theme-system`

5. After creating the branch, pop stash if we stashed: `git stash pop`
6. Confirm the branch name and that we're ready to work