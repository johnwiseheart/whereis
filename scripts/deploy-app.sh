REMOTE_URL=$(git config --get remote.origin.url)
USER_NAME=$(basename $(dirname $REMOTE_URL))
REPO_NAME=$(basename $REMOTE_URL)
GITHUB_URL="https://${GH_TOKEN}@github.com/${USER_NAME}/${REPO_NAME}"

git push -d $GITHUB_URL gh-pages

echo $FRONTEND_URL > packages/app/dist/CNAME

git add packages/app/dist -f
git commit --allow-empty -m "Commiting built assets for gh-pages"
git subtree push --prefix packages/app/dist $GITHUB_URL gh-pages

