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

  import { storageKeys } from '@util/crypto'

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

  const { mnemonicSeed } = storageKeys
  // TODO should check if it is a proper formatted encrypted blob
  const x = localStorage.getItem(mnemonicSeed)
  const show = !x
</script>

<NavModal title='test' bodies={setupSteps} {show}/>
