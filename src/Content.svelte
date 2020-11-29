<script>
  import { getContext } from 'svelte'
  import { isNil } from 'ramda'
  import Title from '@component/Title.svelte'
  import FirstVisitSetup from '@component/Setup.svelte'
  import PassGenerator from '@component/PassGenerator.svelte'
  import * as constant from '@/constants.js'

  localStorage.removeItem('loglevel:webpack-dev-server')
</script>

<Title/>
<FirstVisitSetup/>
<PassGenerator/>
