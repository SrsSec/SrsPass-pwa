#!/bin/sh
FIRST=""
if [ ! -f CHANGELOG.md ]; then
  FIRST="-f"
fi

# supports passing of additional args to standard-version
npx standard-version@7.1.0 "$FIRST" "$@" --header '# CHANGELOG
' \
  && echo "Sign-off commit and tags via 'git commit --amend --signoff' and 'git tag -sf v...'" \
  && echo "Generating auto-script to do this for you, just run './signoff'" \
  && cat > signoff <<'EOF'
#!/bin/sh
echo "Running git commands to sign off the last release commit and tag..."
git commit --amend --signoff --no-edit \
  && git tag -sfm "$(git log --oneline -n1 | tail -n1)" $(git tag | tail -n1) \
  && echo "DONE signoff" \
  && rm "$0" \
  && exit 0
echo "something went wrong... rm this script"
echo "you may have to signoff manually if you didn't get a DONE msg"
exit 1
EOF
chmod +x signoff
