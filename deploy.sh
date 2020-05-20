#!/bin/bash
set -euo pipefail

declare dir=$(pwd)

declare timestamp=$(date +%Y-%m-%d_%H%M)

declare release_dir="$dir/releases/$timestamp"


# Pull latest revision
echo "-> Pulling latest release"
# Apparently, some systems put "up to date", while others put "up-to-date"
git pull | grep 'Already up[- ]to[- ]date.' && echo "No updates, exiting..." && exit 20


# Create release dir and copy sources to that dir
echo "-> This release will be stored in $release_dir"
mkdir -p "$release_dir"
cp -ar src/* "$release_dir"

# Link this relase to $current
echo "-> Linking $dir/current to $release_dir"
rm "$dir/current" || true # This may fail
ln -sf "$dir/releases/$timestamp" "$dir/current"

echo "-> Deployed succesfully!"
