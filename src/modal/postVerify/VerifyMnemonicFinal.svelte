<script>
  //TODO fix border change artifact when word is incorrect -> correct
  // maybe with variable padding
  import { onMount } from 'svelte'
  import { mnemonic } from '@store/mnemonic.js'
  import { verifySuccess, mnemonicHtml, mnemonicTerm } from '@/constants.js'
  import { disableAnnoyingMobileInputBugs } from '@util/helper.js'

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
    }
  }

  const verifiedHook = () => {
    if (!verified) return
    parentModal.lockNext = false
  }

  $: wordIdx = mixedArray[ctr]
  $: currentWord = mnemonicArray[wordIdx]
  $: wordUser = wordUser.trim()
  $: isWordUserValid = wordUser === currentWord
  $: wordsRemaining = mnemonicArray.length - ctr
  $: verified = wordsRemaining <= 0
  $: verified && verifiedHook()
  $: placeholder = verified ?
      verifySuccess :
      `Enter Word #${wordIdx + 1} then hit verify/enter!`

</script>

<p>
  Please verify your {@html mnemonicHtml} phrase here. Enter the word # requested in the textbox (shows # when empty)! Go back if you still need to store them, it will be deleted from your browser after this step.
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
  on:focus={() => parentModal.focus = true} on:blur={() => { parentModal.focus = false; handleVerify(); }} on:keydown={handleKeydown} disabled={verified} class:red-border="{wordUser.length > 0 && !isWordUserValid && !verified}" {placeholder} bind:value={wordUser}/>
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
