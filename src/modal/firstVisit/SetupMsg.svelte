<script>

// TODO name this component better
import { onMount, onDestroy } from 'svelte'
import { mnemonicHtml } from '@/constants.js'

let setupOption = 'full'

export const parentModal = {
  title: 'Setup Selection',
  lockNext: true,
  finishBtnLabel: 'Start Setup',
  export: {
    setupOption
  }
}

$: parentModal.export.setupOption = setupOption

// TODO remove this before production... or implement in constant.js
const tt = `<sup>?</sup>`

// add vim key nav
function handleKeydown(evt) {
  const { key } = evt

  keyNavBlock: {
    switch (key) {
      case '1':
      case 'f':
      case 'F':
        setupOption = 'full'
        break
      case '2':
      case 'q':
      case 'Q':
        setupOption = 'quick'
        break
      case '3':
      case 'e':
      case 'E':
        setupOption = 'existing'
        break
      default:
        break keyNavBlock
    }
    // doesn't trigger on non-match, due to block break
    evt.preventDefault()
  }

}

</script>

<svelte:window on:keydown={handleKeydown} />

<p>Please select your setup option!</p>
<div class="setup-radio-line"><input type="radio" id="radio1" bind:group={setupOption} value={'full'}><label for="radio1" title="Recommended setup for new users.">Full Setup{@html tt}</label></div>
<div class="setup-radio-line"><input type="radio" id="radio2" bind:group={setupOption} value={'quick'}><label for="radio2" title="Minimal setup prompts to get new users on SrsPass.">Quick Setup{@html tt}</label></div>
<div class="setup-radio-line"><input type="radio" id="radio3" bind:group={setupOption} value={'existing'}><label for="radio3" title="For existing users that have a backup phrase to import. &#013;Backup phrases are crypto BIP39 12/18/24 mnemonics, new users with crypto wallets can use this step.">Existing User</label></div>
<p>In the next steps, we'll generate your 12-word {@html mnemonicHtml} and store it safely encrypted in your browser.</p>
<p>Think of it as a secret account ID, like a SIN, <strong style="text-transform: uppercase">save a backup for yourself and keep it secure.</strong></p>
<p>Seriously, write it in a notebook at least and securely on your phone, save multiple copies. You will need it to sync other devices or recover your passwords in the future.</p>
<p>If you previously generated one, you may instead import it in the next step!</p>
<!--><p><i>This phrase doubles as a crypto wallet mnemonic, as it's bip39. In fact, if you like
    you may import your own phrase, which we'll prompt you for!</i></p>-->
<style>
  .setup-radio-line {
    display: inline-block;
  }
  .setup-radio-line label {
    display: unset;
    margin-left: 0.5em;
    margin-right: 1em;
  }
</style>
