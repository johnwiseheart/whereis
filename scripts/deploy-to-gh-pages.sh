#!/bin/bash
echo "Starting deployment"
echo "Target: gh-pages branch"

DIST_DIRECTORY="packages/app/dist/"
CURRENT_COMMIT=`git rev-parse HEAD`
ORIGIN_URL=`git config --get remote.origin.url`
ORIGIN_URL_WITH_CREDENTIALS=${ORIGIN_URL/\/\/github.com/\/\/$GITHUB_TOKEN@github.com}

GH_USER_NAME="johnwiseheart"
GH_USER_EMAIL="johnwiseheart@gmail.com"

echo "Checking out gh-pages branch"
git checkout -B gh-pages || exit 1

echo "Pushing new content to $ORIGIN_URL"
git config user.name "$GH_USER_NAME" || exit 1
git config user.email "$GH_USER_EMAIL" || exit 1

git add $DIST_DIRECTORY -f
git commit --allow-empty -m "Regenerated static content for $CURRENT_COMMIT" || exit 1
git subtree push --prefix $DIST_DIRECTORY "https://${GITHUB_TOKEN}@$github.com/${GITHUB_REPO}.git" origin gh-pages

git reset HEAD~
git checkout .gitignore

echo "Cleaning up temp files"
rm -Rf $DIST_DIRECTORY

echo "Deployed successfully."
exit 0
