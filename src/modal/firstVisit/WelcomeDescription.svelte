<script>

import { onMount, onDestroy } from 'svelte'
import { appTerm, passTerm } from '@/constants.js'
import { childTitle, lockNav } from '@store/firstVisitNav'

const DEBUG = process.env.NODE_ENV === 'development'

onMount(() => {
  childTitle.set(`Welcome to ${appTerm}!`)
  // locks nav so users dont just skip without reading
  if(!DEBUG) {
    lockNav(true)
    setTimeout(() => lockNav(false), 4000)
  }
})
onDestroy(() => childTitle.set(null))

</script>

<p>{appTerm} is a stateless cryptographic password manager generating deterministic passwords backed by 128-bits of security.</p>
<p>Generate secure passwords, that are consistent across devices,
from just a single password.</p>
<p>No more having to memorize multiple passwords.</p>
<p>Being stateless, you no longer need to worry about managing files or vaults across devices.
Even synchronize your passwords with offline devices!</p>
<p>Find out more in the <a target="_blank" rel="noopener" href="https://docs.srspass.com">documentation</a>. Next continues with setup.</p>
