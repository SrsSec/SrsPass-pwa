<script>
// TODO consider security implications of importing package.json
import { version } from '@root/package.json'
const currentYear = new Date().getFullYear()
  , commitHash = process.env.GIT_HASH
  , shortHash = commitHash.substr(0,4)
  , email = 'srspass@srssec.com'
</script>
<footer>
  &copy; {currentYear} -
  <a href="https://srssec.com" rel="noopener"> SrsSec</a> -
  <a href="https://docs.srspass.com" rel="noopener"> docs</a> -
  v{version}-<a href={"https://github.com/SrsSec/SrsPass-pwa/tree/" + commitHash} rel="noopener">{shortHash}</a>
</footer>
