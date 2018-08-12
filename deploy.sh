#!/bin/bash
set -euo pipefail

declare dir=$(pwd)

declare timestamp=$(date +%Y-%m-%d_%H%M)

declare release_dir="$dir/releases/$timestamp"


# Pull latest revision
echo "-> Pulling latest release"
git pull | grep -q -v 'Already up-to-date.' && echo "Already up-to-date" && exit 0

echo "-> Checking validity of data.json"
jsonlint src/data.json


# Create release dir and copy sources to that dir
echo "-> This release will be stored in $release_dir"
mkdir -p "$release_dir"
cp -ar src/* "$release_dir"

# Link this relase to $current
echo "-> Linking $dir/current to $release_dir"
rm "$dir/current" || true # This may fail
ln -sf "$dir/releases/$timestamp" "$dir/current"

echo "-> Deployed succesfully!"
