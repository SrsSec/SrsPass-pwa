<script>
  /*
  Finish setup msg
  delete mnemonic from store and session storage
   */
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { saveEncryptSeedFromMnemonic } from '@util/crypto.js'
  import { passTerm, passHtml, mnemonicTerm, mnemonicHtml, childPassesHtml } from '@/constants.js'
  import { childTitle, lockNav } from '@store/firstVisitNav.js'

  onMount(() => {
    lockNav(true)
    childTitle.set(`Setup is complete! Click finish to use the App`)
  })

  onDestroy(() => {
    lockNav(false)
    childTitle.set(null)
  })
</script>

<p>You've successfully finished initial setup to get started with SrsPass.</p>
<p>You may now go ahead and create <span title="derived cryptographically from your {passTerm} and {mnemonicTerm}">{@html childPassesHtml}</span> for various accounts using your {@html passHtml}.</p>
<p>These passwords are deterministic, in that they will always be the same, if you use the same options, alongside your
{@html passHtml}.</p>
<p>If you would like to generate these passwords on another device, simply run through the setup using the same
{@html mnemonicHtml} and {@html passHtml}.</p>
