<script>
  // firstVisit Nav Modal
  import NavModal from '@modal/NavModal.svelte'
  import WelcomeDescription from '@modal/firstVisit/WelcomeDescription.svelte'
  import SetupMsg from '@modal/firstVisit/SetupMsg.svelte'
  import ImportMnemonic from '@modal/firstVisit/ImportMnemonic.svelte'
  import GenerateMnemonic from '@modal/firstVisit/GenerateMnemonic.svelte'
  import VerifyMnemonic from '@modal/firstVisit/VerifyMnemonic.svelte'
  import EncryptMnemonic from '@modal/firstVisit/EncryptMnemonic.svelte'
  import FinishMsg from '@modal/firstVisit/FinishMsg.svelte'

  import { needsSetup } from '@util/helper.js'

  // setup steps for first visits/new devices
  const setupSteps = [
    WelcomeDescription,
    SetupMsg,
    ImportMnemonic,
    GenerateMnemonic,
    VerifyMnemonic,
    EncryptMnemonic,
    FinishMsg,
  ]

  const show = needsSetup()
</script>

<NavModal title='test' bodies={setupSteps} {show}/>
