<script>
  /*
  consider zxcvbn but figure out way to bundle it nicely, or only load on firstVisit, maybe on verify phase?
zxcvbn.js bundled and minified is about 400kB gzipped or 820kB uncompressed, most of which is dictionaries. Consider these tips if you're noticing page load latency on your site.
   */
  // NOTE zxcvbn is likely too heavy... for intended purpose...
  // However can consider adding it as optional dynaload... with option like check pasword strength
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic, clearMnemonic } from '@store/mnemonic.js'
  import { saveEncryptSeedFromMnemonic, saveEncryptMnemonic } from '@util/crypto/encryption.js'
  import { mnemonicTerm, passTerm, passHtml } from '@/constants.js'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

  export const parentModal = {
    title: `Enter your ${passTerm}`,
    lockNext: true,
    lockPrev: true,
    focus: true
  }

  const setupOption = window.SrsPassAppProps.setupOption.readableValue
  const adjective = setupOption === 'existing' ? 'existing' : 'desired'

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
      clearMnemonic()
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

<p>Please type your {adjective} {@html passHtml}.</p>
{#if setupOption !== 'existing'}
  <p>You will need it to unlock the interface whenever you use this app, so this should be memorizable, and is the only password you have to remember.</p>
{/if}
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

{#if !encrypted}
  <button disabled={encrypting || encrypted} on:click={handleConfirm}>
  Confirm
</button>
{:else}
  <div>
    <em>Hit Next to continue!</em>
  </div>
{/if}

{#if encrypting}
  <div>
    <strong>Encrypting</strong>, please wait...
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
