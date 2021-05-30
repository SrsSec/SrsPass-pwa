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

  const placeholder = `Enter your ${mnemonicTerm} here...`

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
<textarea
  class:red-border="{input.length > 0 && !isMnemonicUserValid && !parentModal.focus}"
  {placeholder}
  title={input.length > 0 ? placeholder : ''}
  bind:value={input}
  on:focus={() => parentModal.focus = true}
  on:blur={() => parentModal.focus = false}
  />
<button disabled={!isMnemonicUserValid || imported} on:click={handleImport}>
  Import
</button>

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
