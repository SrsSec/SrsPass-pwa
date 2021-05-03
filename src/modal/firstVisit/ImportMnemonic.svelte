<script>
  import { onMount } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { validateMnemonic } from 'bip39'
  import { mnemonicTerm, mnemonicHtml } from '@/constants.js'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

  export const parentModal = {
    title: 'Import your Backup Phrase',
    lockNext: true
  }

  onMount(() => {
    disableAnnoyingMobileInputBugs()
  })

  function handleImport() {
    mnemonic.overwrite(userMnemonic)
  }

  let input = '',
    userMnemonic = ''
  $: userMnemonic = input.trim()
  $: isMnemonicUserValid = validateMnemonic(userMnemonic)
  $: imported = userMnemonic === $mnemonic
  $: !imported ? parentModal.lockNext = true : parentModal.lockNext = false
</script>

<p>
Enter your {@html mnemonicHtml} in the textbox below and import it to continue.
</p>
<textarea on:focus={() => parentModal.focus = true} on:blur={() => parentModal.focus = false} class:red-border="{input.length > 0 && !isMnemonicUserValid}" placeholder="Enter your {mnemonicTerm} here..." bind:value={input}/>
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
