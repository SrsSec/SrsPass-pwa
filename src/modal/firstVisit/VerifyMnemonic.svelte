<script>
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { validateMnemonic } from 'bip39'
  import { verifySuccess, verifySkip, mnemonicHtml, mnemonicTerm } from '@/constants.js'
  import { childLockNext, childTitle, lockNav } from '@store/firstVisitNav.js'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

  const DEBUG = process.env.NODE_ENV === 'development'

  // lock navigation on mount, and return a bound function which unlocks
  // this returned function will be run onDestroy lifetime
  // onMount(() => setNav(true) && setNav.bind(null, false))
  onMount(() => {
    lockNav(true)
    childTitle.set(`Verify your ${mnemonicTerm}`)
    disableAnnoyingMobileInputBugs('TEXTAREA')
  })

  onDestroy(() => {
    lockNav(false)
    childTitle.set(null)
  })

  const mnemonicArray = $mnemonic.split(' ')
  const mixedArray = Array(...Array(mnemonicArray.length).keys())
    .sort(() => Math.random() - .5)
  let ctr = 0
  let wordUser = ''

  function handleVerify() {
    if (wordUser !== mnemonicArray[mixedArray[ctr]]) return
    wordUser = ''
    ctr += 1
    document.getElementById('verifyInput').focus()
    return true
  }

  function handleKeydown(evt) {
    const { key, keyCode } = evt
    // supports continuing with space also
    if (key === 'Enter' || [13, 32].indexOf(keyCode) >= 0) {
      evt.preventDefault()
      const verifyButtonDOM = document.getElementById('verifyWord')
      verifyButtonDOM.focus()
      verifyButtonDOM.click()
      //handleVerify()
    }
  }


  $: wordIdx = mixedArray[ctr]
  $: currentWord = mnemonicArray[wordIdx]
  $: wordUser = wordUser.trim()
  $: isWordUserValid = wordUser === currentWord
  // TODO add something to a logging store, to indicate user has done a skip
  $: if(wordUser === 'SKIP') { verified = true; wordUser = verifySkip }
  $: verified = DEBUG ? ctr >= 2 : ctr >= mnemonicArray.length
  $: verified && childLockNext.set(false)
  $: placeholder = verified ?
      verifySuccess :
      `Enter Word #${wordIdx + 1} then hit verify/enter!${'\n'}Typing SKIP ends verification early...`

</script>

<p>
  Please verify your {@html mnemonicHtml} phrase here. Enter the word requested in the textbox (shows it when empty)!
</p>
<!-- svelte-ignore a11y-autofocus -->
<textarea
  autofocus
  id="verifyInput"
  on:blur={() => handleVerify()} on:keydown={handleKeydown} disabled={verified} class:red-border="{wordUser.length > 0 && !isWordUserValid && !verified}" {placeholder} bind:value={wordUser}/>
<button id="verifyWord" disabled={verified || wordUser.length === 0} on:click={handleVerify}>
  Verify
</button>

<style>
  .red-border {
    border: 2px solid red !important;
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
