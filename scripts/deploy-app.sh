rm -rf _build
mkdir _build

git clone https://${GH_TOKEN}@github.com/johnwiseheart/whereis.git _build

cd _build

yarn
yarn build-app

git push -d origin gh-pages

git add packages/app/dist -f
git commit --allow-empty -m "Commiting built assets"
git subtree push --prefix packages/app/dist origin gh-pages

