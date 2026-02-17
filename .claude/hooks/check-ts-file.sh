#!/bin/bash
# PostToolUse hook: detect when a .ts file was written/edited
# Reminds Claude to run astro check for TypeScript validation

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only trigger for .ts files (not .svelte which has its own hook)
if [[ "$FILE_PATH" == *.ts ]]; then
  FILENAME=$(basename "$FILE_PATH")
  echo "TypeScript file modified: $FILENAME — run pnpm astro check to validate" >&2
fi

exit 0
