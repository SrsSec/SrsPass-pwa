<script>
  import { readable } from 'svelte/store'
  import * as bip39 from 'bip39'

  // consider extracting this out to a a store file...
  // maybe store as base58check
  const seedStoreKey = 'seed'
  const seedHtml = '<strong>seed phrase</strong>'

  function getLocalStoredSeed() {
    const seedMaybe = localStorage.getItem(seedStoreKey)
    return bip39.validateMnemonic(seedMaybe) && seedMaybe
  }

  function generateNewSeedAndStore() {
    const seedNew = bip39.generateMnemonic(128)
    localStorage.setItem(seedStoreKey, seedNew)
    return seedNew
  }

  const seed = readable(
    getLocalStoredSeed() ||
    generateNewSeedAndStore())

  // TODO remove
  // should be what longest possible seed may look like
  const fakeSeed = "longword wordlong longword wordlong longword wordlong longword wordlong longword wordlong longword wordlong"

</script>

<p>
  Here is your 12-word {@html seedHtml}... (your browser will remember it unless you delete its cache).
</p>
<textarea readonly>{$seed}</textarea>
<p>
  The next dialog will verify that you have backed up your {@html seedHtml} correctly!
  The order of the words is important!
</p>
<p>
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
