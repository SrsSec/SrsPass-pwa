<script>

import { isAppUnlocked } from '@store/main'
import * as c from '@/constants'
import { needsPostVerify } from '@util/helper'

import NavModal from '@modal/NavModal.svelte'

import Start from '@modal/postVerify/Start.svelte'
import DecryptMnemonic from '@modal/postVerify/DecryptMnemonic.svelte'
import VerifyMnemonicFinal from '@modal/postVerify/VerifyMnemonicFinal.svelte'
import Finish from '@modal/postVerify/Finish.svelte'

let showModal = false

const steps = [
  Start,
  DecryptMnemonic,
  VerifyMnemonicFinal,
  Finish
]

const clickHandler = () =>
  showModal = true

</script>
<NavModal bodies={steps} bind:show={showModal} alwaysClosable={true} />

{#if $isAppUnlocked && needsPostVerify()}
  <li>
    <button id="verify"
            on:click={clickHandler}
            >{c.postVerifyName}</button>
  </li>
  <hr/>
{/if}
