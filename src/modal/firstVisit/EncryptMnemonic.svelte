<script>
  /*
  consider zxcvbn but figure out way to bundle it nicely, or only load on firstVisit, maybe on verify phase?
zxcvbn.js bundled and minified is about 400kB gzipped or 820kB uncompressed, most of which is dictionaries. Consider these tips if you're noticing page load latency on your site.
   */
  // NOTE zxcvbn is likely too heavy... for intended purpose...
  // However can consider adding it as optional dynaload... with option like check pasword strength
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic, clearMnemonicInSession } from '@store/mnemonic.js'
  import { saveEncryptSeedFromMnemonic, saveEncryptMnemonic } from '@util/crypto/encryption.js'
  import { mnemonicTerm, passTerm, passHtml } from '@/constants.js'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

  // TODO if full verification was NOT completed... save the plain mnemonic... ofc encrypted, in the browser
  // to allow for viewing of the backup phrase at a later time, in case of quick setup flow
  // or to give users who did full setup, but did SKIP on the verification, a chance to recover their backup phrase
  // in case they did in fact write it down incorrectly or not at all. This is basically meant to lower user friction.

  export const parentModal = {
    title: `Enter your ${passTerm}`,
    lockNext: true,
    lockPrev: true,
    focus: true
  }

  onMount(() => {
    // NOTE: be sure to update this if unlock pass element tag is changed
    disableAnnoyingMobileInputBugs()
    passInputDOM = document.getElementById('encryptInputPass')
  })

  onDestroy(() => {
    // little trick that may get GC to replace old pass instance in memory
    const oldPassUserLen = passUser.length
    passUser = ''
    passUser = '0'.repeat(oldPassUserLen)
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
    try {
      // let's first make sure we're working with clean storage
      localStorage.clear()
      const encryptSeedProm = saveEncryptSeedFromMnemonic(passUser, $mnemonic)
      const encryptPlainProm = mnemonic.isVerified() ? null : saveEncryptMnemonic(passUser, $mnemonic)
      // in this manner we run all these processes in parallel, if sufficient cores available
      ;[encrypted] = await Promise.all([encryptSeedProm, encryptPlainProm])
      clearMnemonicInSession()
    } catch(e) {
      console.error(e)
      alert(`Encountered error during encryption step!\n\nError:\n${e.message}`)
    }
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

  $: encrypted ? parentModal.lockNext = false : parentModal.lockNext = true
  $: passInputDOM && (
    showPass ? passInputDOM.setAttribute('type', 'text') : passInputDOM.setAttribute('type', 'password'))
</script>

<p>Please create your own {@html passHtml}.</p>
<p>You will need it to unlock the interface whenever you use this app, so this should be memorizable, and is the only password you have to remember.</p>
<!--><textarea class:red-border="{mnemonicUser.length > 0 && !isMnemonicUserValid}" placeholder="Enter your {passTerm} here..." bind:value={mnemonicUser}/><-->
<br/>
<input id="encryptInputPass"
       autofocus
       on:focus={() => parentModal.focus = true}
       on:blur={() => parentModal.focus = false}
       disabled={encrypting || encrypted}
       type="text"
       required
       placeholder="Enter {passTerm} here..."
       on:keydown={handleKeydown}
       bind:value={passUser}/>
<div class="checkbox">
  <label for=showPass><span>show password<input name="showPass" type="checkbox" bind:checked={showPass}></span></label>
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
  .checkbox label {
    display: inline-block;
  }
  .checkbox input {
    width: auto;
    margin-left: 0.6rem;
  }
</style>
