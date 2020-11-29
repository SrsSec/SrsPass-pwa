<script>
  /*
  consider zxcvbn but figure out way to bundle it nicely, or only load on firstVisit, maybe on verify phase?
zxcvbn.js bundled and minified is about 400kB gzipped or 820kB uncompressed, most of which is dictionaries. Consider these tips if you're noticing page load latency on your site.
   */
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { saveEncryptSeedFromMnemonic } from '@util/crypto.js'
  import { mnemonicTerm, passTerm, passHtml } from '@/constants.js'
  import { childLockNext, childTitle, lockNav } from '@store/firstVisitNav.js'

  onMount(() => {
    lockNav(true)
    childTitle.set(`Enter your ${passTerm}`)
  })

  onDestroy(() => {
    passUser = ''
    lockNav(false)
    childTitle.set(null)
  })

  // On confirm, the mnemonic is run through
  // a hard argon2id KDF to get a 256-bit seed.
  // This seed is then encrypted using AES-GCM, by likewise
  // running the provided password through argon2id KDF
  // for a 256-bit AES key. We doubly use the seed as a salt
  // for child password derivation and the encrypted blob itself
  // for authenticating the password/key thanks to GCM mode.

  async function handleConfirm() {
    encrypting = true
    encrypted = await saveEncryptSeedFromMnemonic(passUser, $mnemonic)
    encrypting = false
  }

  let passUser = '',
  encrypting = false,
  encrypted = false
  $: encrypted ? childLockNext.set(false) : childLockNext.set(true)
</script>

<p>Please enter a {@html passHtml}.</p>
<p>This is your own password and not the {mnemonicTerm.toLowerCase()}.</p>
<p>You will need it to unlock the interface whenever you use this app, so this should be memorizable, and is the only password you have to remember.</p>
<!--><textarea class:red-border="{mnemonicUser.length > 0 && !isMnemonicUserValid}" placeholder="Enter your {passTerm} here..." bind:value={mnemonicUser}/><-->
<textarea disabled={encrypting || encrypted} placeholder="Enter your {passTerm} here..." bind:value={passUser}/>
<button disabled={encrypting || encrypted} on:click={handleConfirm}>
  Confirm
</button>
{#if encrypting}
  <div>
    Encrypting, please wait...
  </div>
{/if}

<style>
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
