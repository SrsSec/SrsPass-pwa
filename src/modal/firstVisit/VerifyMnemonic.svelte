<script>
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { validateMnemonic } from 'bip39'
  import { verifySuccess, verifySkip, mnemonicHtml, mnemonicTerm } from '@/constants.js'
  import { childLockNext, childTitle, childFocus, lockNav } from '@store/firstVisitNav.js'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

  // NOTE was used for verifying only 2 words during dev
  // but skip keyword made its use obsolete
  const DEBUG = process.env.NODE_ENV === 'development'

  // lock navigation on mount, and return a bound function which unlocks
  // this returned function will be run onDestroy lifetime
  // onMount(() => setNav(true) && setNav.bind(null, false))
  onMount(() => {
    childLockNext.set(true)
    // needed here because autofocus doesn't trigger on:focus on the textarea
    childFocus.set(true)
    childTitle.set(`Verify your ${mnemonicTerm}`)
    disableAnnoyingMobileInputBugs('TEXTAREA')
  })

  onDestroy(() => {
    lockNav(false)
    childFocus.set(false)
    childTitle.set(null)
  })

  const mnemonicArray = $mnemonic.split(' ')
  const mixedArray = Array(...Array(mnemonicArray.length).keys())
    .sort(() => Math.random() - .5)
  const minCtrToSkip = 1
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
  $: wordsRemaining = mnemonicArray.length - ctr
  $: skippable = ctr >= minCtrToSkip
  // TODO add something to a logging store, to indicate user has done a skip
  $: if(wordUser === 'SKIP' && skippable) { verified = true; wordUser = verifySkip }
  $: verified = wordsRemaining <= 0
  $: verified && childLockNext.set(false)
  $: placeholder = verified ?
      verifySuccess :
      `Enter Word #${wordIdx + 1} then hit verify/enter!${skippable ? '\nType SKIP to end verification early...' : ''}`

</script>

<p>
  Please verify your {@html mnemonicHtml} phrase here. Enter the word # requested in the textbox (shows it when empty)! If you don't have the 12 words, click the <em>Prev</em> button to go back and save them first.
</p>
{#if wordsRemaining > 0}
  <p>
    {wordsRemaining} word(s) left to verify
  </p>
{/if}
<!-- svelte-ignore a11y-autofocus -->
<textarea
  autofocus
  id="verifyInput"
  on:focus={() => childFocus.set(true)} on:blur={() => { childFocus.set(false); handleVerify(); }} on:keydown={handleKeydown} disabled={verified} class:red-border="{wordUser.length > 0 && !isWordUserValid && !verified}" {placeholder} bind:value={wordUser}/>
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
