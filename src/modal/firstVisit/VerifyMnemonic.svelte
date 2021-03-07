<script>
  import { onMount, onDestroy } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { validateMnemonic } from 'bip39'
  import { verifySuccess, mnemonicHtml, mnemonicTerm } from '@/constants.js'
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
  // could lessen required verified words by passing something lower than menmonic length
  // ODOT research if we should do whole phrase, based on user feedback and safety...
  // yes, it is needed, user miss the words at times...
  $: verified = DEBUG ? ctr >= 2 : ctr >= mnemonicArray.length
  $: verified && childLockNext.set(false)
  $: placeholder = verified ?
      verifySuccess :
      `Enter Word #${wordIdx + 1} then hit verify or enter!`

</script>

<p>
  Please verify your {@html mnemonicHtml} phrase here. Enter the word requested in the textbox (shows it when empty)!
</p>
<!-- svelte-ignore a11y-autofocus -->
<textarea
  autofocus
  on:blur={() => handleVerify()} on:keydown={handleKeydown} disabled={verified} class:red-border="{wordUser.length > 0 && !isWordUserValid && !verified}" {placeholder} bind:value={wordUser}/>
<button id="verifyWord" disabled={wordUser.length === 0} on:click={handleVerify}>
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
