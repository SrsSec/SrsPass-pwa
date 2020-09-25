<script>
  import { seed } from '@store/seed.js'
  import { validateMnemonic } from 'bip39'

  const seedHtml = '<strong>seed phrase</strong>'
  function handleImport() {
    seed.overwrite(seedUser)
  }

  let seedUser = ''
  $: isSeedUserValid = validateMnemonic(seedUser)
</script>

<p>
  If you have your own seed phrase already, you may import it here, or continue to the next step to generate one
</p>
<textarea class:red-border="{seedUser.length > 0 && !isSeedUserValid}" placeholder="Enter value here" bind:value={seedUser}/>
<button disabled={!isSeedUserValid} on:click={handleImport}>
  Import
</button>
<p>
  {isSeedUserValid}
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
