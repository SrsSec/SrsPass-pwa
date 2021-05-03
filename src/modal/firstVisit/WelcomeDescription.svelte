<script>

import { onMount, onDestroy } from 'svelte'
import { appTerm, passTerm } from '@/constants.js'

const DEBUG = process.env.NODE_ENV === 'development'

export const parentModal = {
  title: `Welcome to ${appTerm}!`
}

onMount(() => {
  // locks nav so users dont just skip without reading
  if(!DEBUG) {
    lockNav(true)
    setTimeout(() => lockNav(false), 4000)
  }
})

</script>

<p>{appTerm} is a stateless cryptographic password manager generating deterministic passwords backed by 128-bits of security.</p>
<p>Generate many secure passwords, that are consistent across devices,
from just one password.</p>
<p>Being stateless, means you can synchronize your passwords anywhere, without the need for files or vaults, even synchronize offline devices!</p>
<p>Find out more in the <a target="_blank" rel="noopener" href="https://docs.srspass.com">documentation</a>. Next continues with the setup.</p>
