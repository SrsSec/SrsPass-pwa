<script>
// TODO consider security implications of importing package.json
import { version } from '@root/package.json'
const currentYear = new Date().getFullYear()
  , shortHash = process.env.GIT_HASH.substr(0,4)
  , email = 'srspass@srssec.com'
</script>
<footer>
  &copy; 2020-{currentYear} -
  <a href={"mailto:" + email}>
    contact
  </a> -
  v{version}-{shortHash}
</footer>
