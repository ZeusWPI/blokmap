#!/bin/bash
set -euo pipefail

declare timestamp=$(date +%Y-%m-%d_%H%M)

declare release_dir="$HOME/releases/$timestamp"

# Pull latest revision
git pull

# Create release dir and copy sources to that dir
mkdir -p "$release_dir"
cp -ar src/* "$release_dir"

# Link this relase to $current
rm "$HOME/current"
ln -sf "$HOME/releases/$timestamp" "$HOME/current"
