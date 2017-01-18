#!/bin/bash
set -e           # aborts if there are errors
set -u           # errors if you use an undefined variable
set -o pipefail  # errors if a pipe fails

git checkout master

npm run build

cp test/support/index.html dist/

git checkout gh-pages

mv dist/* .

git add restricted-input.js
git add index.html
git commit -ve -m 'Update demo page for restricted-input'

echo 'You can now `git push` to gh-pages!'
