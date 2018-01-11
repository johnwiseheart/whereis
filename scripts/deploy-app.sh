REPO_NAME=`git config --get remote.origin.url | cut -d':' -f2`
GITHUB_URL="https://${GH_TOKEN}@github.com/${REPO_NAME}"

git push -d $GITHUB_URL gh-pages

echo $FRONTEND_URL > packages/app/dist/CNAME

git add packages/app/dist -f
git commit --allow-empty -m "Commiting built assets for gh-pages"
git subtree push --prefix packages/app/dist $GITHUB_URL gh-pages

