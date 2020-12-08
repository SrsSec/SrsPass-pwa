<script>
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { validateMnemonic } from 'bip39'
  import { mnemonicTerm, mnemonicHtml } from '@/constants.js'
  import { childFocus, childTitle, childLockNext } from '@store/firstVisitNav'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

  onMount(() => {
    childTitle.set('Existing User?')
    disableAnnoyingMobileInputBugs()
  })
  onDestroy(() => childTitle.set(null))

  function handleImport() {
    mnemonic.overwrite(mnemonicUser)
  }

  let mnemonicUser = ''
  $: isMnemonicUserValid = validateMnemonic(mnemonicUser)
  $: imported = mnemonicUser === $mnemonic
  $: mnemonicUser.length > 0 && !imported ? childLockNext.set(true) : childLockNext.set(false)
</script>

<p>
  If you have your own {@html mnemonicHtml} already, you may import it here, or continue to the next step to generate a new one.
</p>
<textarea on:focus={() => childFocus.set(true)} on:blur={() => childFocus.set(false)} class:red-border="{mnemonicUser.length > 0 && !isMnemonicUserValid}" placeholder="Enter your {mnemonicTerm} here..." bind:value={mnemonicUser}/>
<button disabled={!isMnemonicUserValid} on:click={handleImport}>
  Import
</button>

<style>
  .red-border {
    border: 2px solid red;
    border-radius: 4px;
  }
  textarea {
    width: 100%;
    height: auto;
  }
  @media (max-width: 440px) {
    textarea { min-height: 6rem }
  }
  @media (min-width: 441px) and (max-width: 580px) {
    textarea { min-height: 5rem }
  }
</style>
