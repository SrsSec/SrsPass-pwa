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
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

  onMount(() => {
    lockNav(true)
    childTitle.set(`Enter your ${passTerm}`)
    // NOTE: be sure to update this if unlock pass element tag is changed
    disableAnnoyingMobileInputBugs()
    passInputDOM = document.getElementById('encryptInputPass')
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

  function handleKeydown(evt) {
    const { key, keyCode } = evt
    if (key === 'Enter' || keyCode === 13) {
      evt.preventDefault()
      handleConfirm()
    }
  }

  let passUser = '',
    encrypting = false,
    encrypted = false,
    showPass = false,
    passInputDOM

  $: encrypted ? childLockNext.set(false) : childLockNext.set(true)
  $: passInputDOM && (
    showPass ? passInputDOM.setAttribute('type', 'text') : passInputDOM.setAttribute('type', 'password'))
</script>

<p>Please create a {@html passHtml}.</p>
<p>This is your own password you must come up with and not the {mnemonicTerm.toLowerCase()}.</p>
<p>You will need it to unlock the interface whenever you use this app, so this should be memorizable, and is the only password you have to remember.</p>
<!--><textarea class:red-border="{mnemonicUser.length > 0 && !isMnemonicUserValid}" placeholder="Enter your {passTerm} here..." bind:value={mnemonicUser}/><-->
<br/>
<input id="encryptInputPass"
       disabled={encrypting || encrypted}
       type="text"
       required
       placeholder="Enter {passTerm} here..."
       on:keydown={handleKeydown}
       bind:value={passUser}/>
<div class="checkbox">
  <label for=showPass><span>show plaintext pass<input name="showPass" type="checkbox" bind:checked={showPass}></span></label>
</div>
<br/>
<button disabled={encrypting || encrypted} on:click={handleConfirm}>
  Confirm
</button>
{#if encrypting}
  <div>
    Encrypting, please wait...
  </div>
{/if}

<style>
  input {
    width: 100%;
    height: auto;
  }
  div.input-container {
    max-width: 333px;
  }
  .checkbox label {
    display: inline-block;
  }
  .checkbox input {
    width: auto;
    margin-left: 0.6rem;
  }
</style>
