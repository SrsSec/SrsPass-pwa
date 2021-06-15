<script>

// TODO name this component better
import { onMount, onDestroy } from 'svelte'
import { mnemonicTerm } from '@/constants.js'

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
<div class="setup-radio-line"><input type="radio" id="radio1" bind:group={setupOption} value={'full'}><label for="radio1" title="Recommended setup for new users.">Full Setup</label></div>
<div class="setup-radio-line"><input type="radio" id="radio2" bind:group={setupOption} value={'quick'}><label for="radio2" title="Minimal setup prompts to get new users quickly on SrsPass.">Quick Setup</label></div>
<div class="setup-radio-line"><input type="radio" id="radio3" bind:group={setupOption} value={'existing'}><label class="tooltip-flag" for="radio3" title="For existing users that have a {mnemonicTerm} to import. &#013;{mnemonicTerm}s are crypto BIP39 12/18/24 mnemonics, new users with crypto wallets could use this step also.">Existing User</label></div>
{#if window.matchMedia('(pointer:fine)').matches}
  <p>Some text has tooltips, like the setup options above! Mouse over them to show tooltips.</p>
{:else if window.matchMedia('(pointer:coarse)').matches}
  <p>Click on text with a <sup>?</sup> to get tooltips. Try with the setup options above!</p>
{:else}
  <p>Hover or click over the above setup options to see tooltips explaining them!</p>
{/if}
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
