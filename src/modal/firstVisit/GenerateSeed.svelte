<script>
  import { seed } from '@store/seed.js'
  const seedHtml = '<strong>seed phrase</strong>'

  function handleRegen() {
    seed.regenerate()
  }
  // should be what longest possible seed may look like
  const fakeSeed = "longword wordlong longword wordlong longword wordlong longword wordlong longword wordlong longword wordlong"

</script>

<p>
  Here is your 12-word {@html seedHtml}... (your browser will remember it unless you delete its cache).
</p>
<textarea readonly>{$seed}</textarea>
<button on:click={handleRegen}>
  Regenerate
</button>
<p>
  The next dialog will verify that you have backed up your {@html seedHtml} correctly!
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
