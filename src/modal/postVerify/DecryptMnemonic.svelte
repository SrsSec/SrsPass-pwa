<script>
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { loadDecryptMnemonic } from '@util/crypto/encryption.js'
  import { passTerm } from '@/constants.js'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'
  import * as c from '@/constants'

  export const parentModal = {
    title: `Enter your ${passTerm}`,
    lockNext: true,
    focus: true
  }

  onMount(() => {
    // NOTE: be sure to update this if unlock pass element tag is changed
    disableAnnoyingMobileInputBugs()
    passInputDOM = document.getElementById('decryptInputPass')
  })

  onDestroy(() => {
    // little trick that may get GC to replace old pass instance in memory
    const oldPassUserLen = passUser.length
    passUser = ''
    passUser = '0'.repeat(oldPassUserLen)
  })

  async function handleConfirm() {
    decrypting = true
    try {
      decryptedMnemonic = await loadDecryptMnemonic(passUser)
      // above gives us u8 array... convert to utf8 to futureproof locales
      decryptedMnemonic = decryptedMnemonic.toString('utf8')
      const valid = mnemonic.overwrite(decryptedMnemonic)
      if (!valid)
        throw new Error('Decrypted mnemonic failed to validate... got ' + decryptedMnemonic)
      decrypted = true
    } catch(e) {
      console.error(e)
      // TODO look into something better to rely on than message
      if (e.message === 'Unsupported state or unable to authenticate data')
        alert(`Incorrect ${passTerm.toLowerCase()} entered...`)
      else
        alert(`Encountered error during decryption step!\n\nError:\n${e.message}`)
      decryptedMnemonic = ''
    }
    decrypting = false
  }

  function handleKeydown(evt) {
    const { key, keyCode } = evt
    if (key === 'Enter' || keyCode === 13) {
      evt.preventDefault()
      handleConfirm()
    }
  }

  let passUser = '',
    decrypting = false,
    decrypted = false,
    showPass = false,
    showMnemonic = false,
    decryptedMnemonic = '',
    passInputDOM

  $: decrypted ? parentModal.lockNext = false : parentModal.lockNext = true
  $: passInputDOM && (
    showPass ? passInputDOM.setAttribute('type', 'text') : passInputDOM.setAttribute('type', 'password'))
</script>

<p>to continue with verification</p>
<br/>
<input id="decryptInputPass"
       autofocus
       on:focus={() => parentModal.focus = true}
       on:blur={() => parentModal.focus = false}
       disabled={decrypting || decrypted}
       type="text"
       required
       placeholder="Enter {passTerm} here..."
       on:keydown={handleKeydown}
       bind:value={passUser}/>
<div class="checkbox">
  <label for=showPass><span>show password<input name="showPass" type="checkbox" bind:checked={showPass}></span></label>
</div>
<br/>
<button disabled={decrypting || decrypted} on:click={handleConfirm}>
  Confirm
</button>
{#if decrypting}
  <div>
    Checking, please wait...
  </div>
{/if}
<div
  title="Make sure to store this somewhere secure"
  on:click={() => showMnemonic = !showMnemonic}
  >
  <textarea
    class="{ decryptedMnemonic.length > 0 && !showMnemonic ? 'text-blur' : ''}"
    placeholder={c.decryptMnemonicTextPlaceholder}
    bind:value={decryptedMnemonic}
    readonly
  />
</div>

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
  textarea {
    margin-top: 2.25rem;
    width: 100%;
    height: 5rem;
  }
  @media (max-width: 440px) {
    textarea { min-height: 6rem }
  }
  @media (min-width: 441px) and (max-width: 580px) {
    textarea { min-height: 5rem }
  }
</style>
