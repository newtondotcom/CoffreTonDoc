git filter-branch -f --env-filter "
    GIT_AUTHOR_NAME='newtondotcom'
    GIT_AUTHOR_EMAIL='asphalt9fr@gmail.com'
    GIT_COMMITTER_NAME='newtondotcom'
    GIT_COMMITTER_EMAIL='asphalt9fr@gmail.com'
  " HEAD
git push --force