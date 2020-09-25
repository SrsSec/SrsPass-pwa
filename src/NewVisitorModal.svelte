<script>
  //import { wordlists } from 'bip39'
  import * as bip39 from 'bip39'
  ////const seed = bip39.generateMnemonic()
  ////const w = bip39.wordlists.english
  ////console.log(w)
  ////const seed = "hi"
  //const test = bip39.mnemonicToSeedSync('basket actual').toString('hex')
  let seed = bip39.generateMnemonic()
  window.bip39 = bip39
  const message = `This is your first visit, let's setup your seed phrase!`
</script>

<p>
  {message}
</p>
<div>
  {seed}
</div>
  end
