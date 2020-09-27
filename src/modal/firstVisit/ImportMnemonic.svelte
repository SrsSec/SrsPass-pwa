<script>
  import { mnemonic } from '@store/mnemonic.js'
  import { validateMnemonic } from 'bip39'
  import { mnemonicTerm, mnemonicHtml } from '@/constants.js'

  function handleImport() {
    mnemonic.overwrite(mnemonicUser)
  }

  let mnemonicUser = ''
  $: isMnemonicUserValid = validateMnemonic(mnemonicUser)
</script>

<p>
  If you have your own {@html mnemonicHtml} already, you may import it here, or continue to the next step to generate one
</p>
<textarea class:red-border="{mnemonicUser.length > 0 && !isMnemonicUserValid}" placeholder="Enter your {mnemonicTerm} here..." bind:value={mnemonicUser}/>
<button disabled={!isMnemonicUserValid} on:click={handleImport}>
  Import
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
