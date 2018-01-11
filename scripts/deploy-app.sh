yarn build-app

git push -d origin gh-pages

echo "whereis.jcaw.me" > packages/app/dist/CNAME

git add packages/app/dist -f
git commit --allow-empty -m "Commiting built assets"
git subtree push --prefix packages/app/dist https://${GH_TOKEN}@github.com/johnwiseheart/whereis.git origin gh-pages

