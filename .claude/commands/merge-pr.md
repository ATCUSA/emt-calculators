Merge an approved pull request and clean up the branch.

If no PR number is provided as $ARGUMENTS, check the current branch's PR.

**Process:**
1. Check PR status: `gh pr view` (or `gh pr view $ARGUMENTS`)
2. Verify CI checks have passed
3. Verify PR is approved (or ask user to confirm merge without approval)
4. Merge using squash strategy: `gh pr merge --squash`
5. Switch back to master: `git checkout master`
6. Pull the merged changes: `git pull origin master`
7. Delete the local feature branch: `git branch -d <branch-name>`
8. Confirm merge was successful with `git log --oneline -5`