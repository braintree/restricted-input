#!/bin/bash

git checkout master

npm run build

cp test/support/index.html dist/

git checkout gh-pages

mv dist/* .

git add restricted-input.js
git add index.html
git commit -ve -m 'Update test page for restricted-input'

echo 'You can now `git push` to gh-pages!'
