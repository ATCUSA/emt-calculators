#!/bin/bash
# PostToolUse hook: detect when a .svelte file was written/edited
# Outputs JSON to tell Claude to run the Svelte autofixer

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only trigger for .svelte files
if [[ "$FILE_PATH" == *.svelte ]]; then
  FILENAME=$(basename "$FILE_PATH")
  echo "Svelte file modified: $FILENAME - run mcp__svelte-docs__svelte-autofixer to validate" >&2
fi

exit 0