#!/usr/bin/env bash
f=$(jq -r ".tool_input.file_path // empty")
case "$f" in
  */src/tasks.js|*/src/index.js|src/tasks.js|src/index.js)
    cd "${CLAUDE_PROJECT_DIR:-.}" && npm test
    ;;
esac
