eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 .travis/id_rsa # Allow read access to the private key
ssh-add .travis/id_rsa # Add the private key to SSH

git add packages/server/dist -f
git commit --allow-empty -m "Building for dokku"

git remote add dokku "dokku@dynamic.jcaw.me:${DOKKU_APPNAME}"
git push dokku master