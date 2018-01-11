yarn build-app

GITHUB_URL="https://${GH_TOKEN}@github.com/johnwiseheart/whereis.git"

git push $GITHUB_URL -d origin gh-pages

echo "whereis.jcaw.me" > packages/app/dist/CNAME

git add packages/app/dist -f
git commit --allow-empty -m "Commiting built assets"
git subtree push --prefix packages/app/dist $GITHUB_URL gh-pages

