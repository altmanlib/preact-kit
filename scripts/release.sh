#!/usr/bin/env bash
# Release: run ci, fast-forward main to dev, bump the version on main, move CHANGELOG's Unreleased entries under it, tag, push and publish the GitHub release.
# Usage: bun run release <patch|minor|major>   (run it on dev, with entries under `## Unreleased` in CHANGELOG.md)
set -euo pipefail

case "${1:-}" in
  patch | minor | major) bump=$1 ;;
  *)
    echo "usage: bun run release <patch|minor|major>" >&2
    exit 2
    ;;
esac

if [ "$(git branch --show-current)" != "dev" ]; then
  echo "run the release from dev" >&2
  exit 1
fi

# Refuse to release from a dirty working tree (tracked or untracked files).
if [ -n "$(git status --porcelain)" ]; then
  echo "uncommitted changes; commit or stash them before releasing" >&2
  git status --short >&2
  exit 1
fi

# Everything that can fail cheaply fails before main is touched.
gh auth status > /dev/null
bun scripts/changelog.ts check
bun run ci

git switch --quiet main
git merge --ff-only --quiet dev
npm version "$bump" --no-git-tag-version > /dev/null
version=$(node -p "require('./package.json').version")
notes=$(mktemp)
bun scripts/changelog.ts release "$version" "$notes"
git add package.json CHANGELOG.md
git commit --quiet -m "chore: release v$version"
git tag "v$version"
git push --atomic origin main "v$version"
gh release create "v$version" --title "v$version" --notes-file "$notes"
rm -f "$notes"

git switch --quiet dev
git merge --ff-only --quiet main
git push --quiet origin dev
echo "released v$version"
