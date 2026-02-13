#!/bin/bash
# Prevent direct commits to master branch
# PreToolUse hook for Bash tool - checks git commit commands

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only check git commit commands
if ! echo "$COMMAND" | grep -qE '^\s*git\s+commit|&&\s*git\s+commit'; then
  exit 0
fi

# Check if we're on master branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)

if [ "$CURRENT_BRANCH" = "master" ] || [ "$CURRENT_BRANCH" = "main" ]; then
  echo "Cannot commit directly to master. Create a feature branch first: git checkout -b feature/your-feature-name" >&2
  exit 2
fi

exit 0