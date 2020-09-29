<script>
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { mnemonicHtml } from '@/constants.js'
  import { childTitle } from '@store/firstVisitNav'

  onMount(() => childTitle.set(`Let's set you up!`))
  onDestroy(() => childTitle.set(null))

  function handleRegen() {
    mnemonic.regenerate()
  }
  // should be what longest possible mnemonic may look like
  const fakeMnemonic = "longword wordlong longword wordlong longword wordlong longword wordlong longword wordlong longword wordlong"

</script>

<p>
  Here is your 12-word {@html mnemonicHtml}... (your browser will remember it unless you delete its cache).
</p>
<textarea readonly>{$mnemonic}</textarea>
<button on:click={handleRegen}>
  Regenerate
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
