<script>
  import { onMount } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { validateMnemonic } from 'bip39'
  import { verifySuccess, mnemonicHtml } from '@/constants.js'
  import { childLockNext, childLockPrev } from '@store/firstVisitNav.js'

  //TODO remove
  const DEBUG = true

  // lock navigation on mount, and return a bound function which unlocks
  // this returned function will be run onDestroy lifetime
  onMount(() => setNav(true) && setNav.bind(null, false))

  const mnemonicArray = $mnemonic.split(' ')
  const mixedArray = Array(...Array(mnemonicArray.length).keys())
    .sort(() => Math.random() - .5)
  let ctr = 0
  let wordUser = ''

  function setNav(lock) {
    childLockPrev.set(lock)
    childLockNext.set(lock)
    return $childLockPrev === $childLockNext && $childLockNext
  }
  
  function handleVerify() {
    if (!isWordUserValid) return
    ctr++
    if (verified) childLockNext.set(false)
    else wordUser = ''
  }

  function handleKeydown(evt) {
    const { key, keyCode } = evt
    if (key === 'Enter' || keyCode === 13) {
      evt.preventDefault()
      handleVerify()
    }
  }

  $: wordIdx = mixedArray[ctr]
  $: currentWord = mnemonicArray[wordIdx]
  $: isWordUserValid = wordUser.trim() === currentWord
  // could lessen required verified words by passing something lower than menmonic length
  // TODO research if we should do whole phrase, based on user feedback and safety...
  $: verified = DEBUG ? ctr >= 1 : ctr >= mnemonicArray.length
  $: placeholder = verified ?
      verifySuccess :
      `Enter Word #${wordIdx + 1} then hit verify or enter!`

</script>

<svelte:window on:keydown={handleKeydown}/>
<p>
  Please verify your {@html mnemonicHtml} phrase here. Enter the word requested in the box!
</p>
<textarea on:keypress={handleVerify} disabled={verified} class:red-border="{wordUser.length > 0 && !isWordUserValid && !verified}" {placeholder} bind:value={wordUser}/>
<button disabled={!isWordUserValid} on:click={handleVerify}>
  Verify
</button>

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
