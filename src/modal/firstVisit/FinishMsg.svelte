<script>
  /*
  Finish setup msg
  delete mnemonic from store and session storage
   */
  import { mnemonic } from '@store/mnemonic.js'
  import { passTerm, passHtml, mnemonicTerm, mnemonicHtml, childPassesHtml } from '@/constants.js'

export const parentModal = {
  title: `Setup is complete!`,
  finishBtnLabel: 'Finish Setup'
}

</script>

<p>You've successfully finished initial setup to get started with SrsPass.</p>
<p>You may now go ahead and create <span title="derived cryptographically from your {passTerm} and {mnemonicTerm}">{@html childPassesHtml}</span> for various accounts using your {@html passHtml}.</p>
<p>These passwords are deterministic, in that they will always be the same, if you use the same options, alongside your
{@html passHtml}.</p>
<p>If you would like to generate these passwords on another device, simply run through the setup using the same
{@html mnemonicHtml} and {@html passHtml}.</p>
