#!/bin/bash
# Block AI/Claude mentions in commit messages (not filenames or paths)
# PreToolUse hook for Bash tool - checks git commit commands

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only check git commit commands
if ! echo "$COMMAND" | grep -qE 'git\s+commit'; then
  exit 0
fi

# Extract the commit message from -m flag (between quotes or heredoc)
# Try to get text after -m " or -m '
MSG=$(echo "$COMMAND" | grep -oP '(?<=git commit -m ")[^"]*' | head -1)
if [ -z "$MSG" ]; then
  # Try heredoc style: everything between EOF markers
  MSG=$(echo "$COMMAND" | sed -n '/<<.*EOF/,/EOF/p' | grep -v 'EOF' | grep -v '<<')
fi
if [ -z "$MSG" ]; then
  # Try single quotes
  MSG=$(echo "$COMMAND" | grep -oP "(?<=git commit -m ')[^']*" | head -1)
fi

# If we couldn't extract a message, allow it (don't block on parse failure)
if [ -z "$MSG" ]; then
  exit 0
fi

# Check for AI attribution patterns in the message only
if echo "$MSG" | grep -iE '(co-authored-by.*(claude|anthropic|ai|chatgpt|openai|copilot)|ai.generated|ai.assist)' > /dev/null 2>&1; then
  echo "Commit message contains AI references. Per project rules, never mention AI or automated tools in commit messages." >&2
  exit 2
fi

exit 0