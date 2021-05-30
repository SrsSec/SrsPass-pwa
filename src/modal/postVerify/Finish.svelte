<script>

import { onMount } from 'svelte'
import * as c from '@/constants.js'
import { clearMnemonic } from '@store/mnemonic'
import { clearPlainMnemonicFromStorage } from '@util/crypto/encryption'

export const parentModal = {
  title: `Verification Completed!`,
  lockPrev: true
}

onMount(()=>{
  clearMnemonic()
  clearPlainMnemonicFromStorage()
})

</script>

<p>You have completed verification, so we can stop nagging you about it.</p>
<p>Completion of this step indicates you should have your {@html c.mnemonicHtml} stored safely.</p>
<p>It is now cleared from your browser and should be solely in your possession! Keep it safe.</p>
