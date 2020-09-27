<script>
  import { onMount } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { validateMnemonic } from 'bip39'
  import { mnemonicTerm, mnemonicHtml } from '@/constants.js'
  import { childLockNext, childLockPrev } from '@store/firstVisitNav.js'

  // lock navigation on mount, and return a bound function which unlocks
  // this returned function will be run onDestroy lifetime
  onMount(() => setNav(true) && setNav.bind(null, false))

  function setNav(lock) {
    childLockPrev.set(lock)
    childLockNext.set(lock)
    return $childLockPrev === $childLockNext && $childLockNext
  }
  
  function handleVerify() {
    alert(mnemonicUser === $mnemonic)
  }

  let mnemonicUser = ''
  $: isMnemonicUserValid = validateMnemonic(mnemonicUser)
</script>

<p>
  Please verify your {@html mnemonicTerm} phrase here! TODO test the order of the phrase by shuffling it around
</p>
<textarea class:red-border="{mnemonicUser.length > 0 && !isMnemonicUserValid}" placeholder="Enter your {mnemonicTerm} here..." bind:value={mnemonicUser}/>
<button disabled={!isMnemonicUserValid} on:click={handleVerify}>
  Verify
</button>
<p>
  {isMnemonicUserValid}
</p>

<style>
  .red-border {
    border-color: red;
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
