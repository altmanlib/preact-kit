#!/usr/bin/env bash
# Merge without a release: run ci, fast-forward main to dev, push main, then push dev.
# Usage: bun run merge-main   (run it on dev)
set -euo pipefail

if [ "$(git branch --show-current)" != "dev" ]; then
  echo "run merge-main from dev" >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "uncommitted changes; commit or stash them before merging" >&2
  git status --short >&2
  exit 1
fi

bun run ci

git switch --quiet main
git merge --ff-only --quiet dev
git push --quiet origin main
git switch --quiet dev
git push --quiet origin dev
echo "main is at $(git rev-parse --short main)"
