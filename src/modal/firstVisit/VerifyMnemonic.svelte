<script>
  import { onMount } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { verifySuccess, verifySkip, mnemonicHtml, mnemonicTerm } from '@/constants.js'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

  // lock navigation on mount, and return a bound function which unlocks
  export const parentModal = {
    title: `Verify your ${mnemonicTerm}`,
    lockNext: true,
    focus: true
  }
  onMount(() => {
    disableAnnoyingMobileInputBugs('TEXTAREA')
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
      //handleVerify() // prolly commented out and replaced with above 2 lines
      // for proper visual feedback, with the textbox actually turning red in case
      // of wrong input iirc
    }
  }

  const verifiedHook = () => {
    if (!verified) return
    parentModal.lockNext = false

    if (!mnemonic.isSkipped())
      mnemonic.verify()
  }

  $: wordIdx = mixedArray[ctr]
  $: currentWord = mnemonicArray[wordIdx]
  $: wordUser = wordUser.trim()
  $: isWordUserValid = wordUser === currentWord
  $: wordsRemaining = mnemonicArray.length - ctr
  $: skippable = ctr >= minCtrToSkip
  // TODO add something to a logging store, to indicate user has done a skip
  // RESOLUTION the existence of mnemonicBlob should be sufficient and is the
  // only pertinent side effect of a skip anyways... currently... or could log
  // it, if implementing a logger store for users to help with future troubleshooting
  $: if(wordUser === 'SKIP' && skippable) {
    verified = true
    mnemonic.skip()
    wordUser = verifySkip
  }
  $: verified = wordsRemaining <= 0
  $: verified && verifiedHook()
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
  on:focus={() => parentModal.focus = true }
  on:blur={() => { parentModal.focus = false; handleVerify(); }}
  on:keydown={handleKeydown}
  disabled={verified}
  class:red-border="{wordUser.length > 0 && !isWordUserValid && !verified && !parentModal.focus}"
  {placeholder}
  bind:value={wordUser}
  title={wordUser.length > 0 ? placeholder : ''}
  />
<button id="verifyWord" disabled={verified || wordUser.length === 0} on:click={handleVerify}>
  Verify
</button>

<style>
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
