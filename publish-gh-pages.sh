#!/bin/bash
set -e           # aborts if there are errors
set -u           # errors if you use an undefined variable
set -o pipefail  # errors if a pipe fails

git checkout main

npm run build

cp test/support/index.html dist-app/

git checkout gh-pages

mv dist-app/* .

git add restricted-input.js
git add index.html
git commit -ve -m 'Update demo page for restricted-input'

echo 'You can now `git push` to gh-pages!'
