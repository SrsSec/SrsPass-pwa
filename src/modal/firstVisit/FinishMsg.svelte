<script>
  /*
  Finish setup msg
   */
  import { passTerm, passHtml, mnemonicTerm, mnemonicHtml, childPassesHtml } from '@/constants.js'

  export const parentModal = {
    title: `Setup is complete!`,
    finishBtnLabel: 'Finish Setup'
  }

  const setupOption = window.SrsPassAppProps.setupOption.readableValue

</script>

<p>You've successfully finished {setupOption} setup to get started with SrsPass.</p>
<p>You may now go ahead and create <span title="derived cryptographically from your {passTerm} and {mnemonicTerm}">{@html childPassesHtml}</span> for various accounts using your {@html passHtml}.</p>
{#if setupOption === 'full'}
  <p>If you would like to generate these passwords on another device, simply run through the setup using the same
  {@html mnemonicHtml} and {@html passHtml}.</p>
{:else if setupOption === 'quick'}
  <p>You can start using the app now. During the app use, you will be requested to safely store and then verify your {@html mnemonicHtml}, at your leisure. Both it and your {@html passHtml} are needed to recover your passwords for device migration.</p>
{:else if setupOption === 'existing'}
  <p>Welcome back!!</p>
{/if}
