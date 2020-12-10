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

<p>{appTerm} is a stateless password manager utilizing cryptography to generate deterministic passwords with at least 128-bits of security.</p>
<p>This means you can generate highly secure passwords, that are consistent across devices,
derived from a single password of your own.</p>
<p>No more having to memorize multiple passwords.</p>
<p>Being stateless, you no longer need to worry about managing files or vaults across devices.
Same input equals same output on any other device.</p>
<p>Would you like to know more? Let's continue with setup.</p>
