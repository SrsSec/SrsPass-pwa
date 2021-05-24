<script>

import * as c from '@/constants.js'

export const parentModal = {
  title: `Store & Verify your ${c.mnemonicTerm}!`
}

</script>

<p>You will have a final chance to backup your {@html c.mnemonicHtml}, which we are currently storing in your browser.</p>
<p>Step 2 will request your password, to decrypt and view the words. You must then save the words if you haven't already.</p>
<p>Step 3 verifies that you have all the words saved correctly. Upon passing it, the {@html c.mnemonicHtml} will be cleared from the browser for security.</p>
