<script>
  import { mnemonic } from '@store/mnemonic.js'
  import { mnemonicHtml } from '@/constants.js'

  export const parentModal = {
    title: 'Backup Phrase Generator'
  }

  function handleRegen() {
    mnemonic.regenerate()
  }

</script>

<p>
  Here is your 12-word {@html mnemonicHtml}... it will be saved in this browser, but you'll need a copy for other devices or if your browser cache is deleted.
</p>
<textarea autocorrect="off" readonly>{$mnemonic}</textarea>
<button on:click={handleRegen}>
  Change Phrase
</button>
<p>
  The next dialog will verify that you have backed up your {@html mnemonicHtml} correctly!
  The order of the words is important!
</p>

<style>
	textarea { width: 100%; height: auto; }
  @media (max-width: 440px) {
    textarea { min-height: 6rem }
  }
  @media (min-width: 441px) and (max-width: 580px) {
    textarea { min-height: 5rem }
  }
</style>
