<script>
  import NavModal from '@modal/NavModal.svelte'
  import { defaultSetupOption } from '@/constants'

  export let key = defaultSetupOption,
    show = false

  let selectedSetup

  const setup = {
    'full': [
      'GenerateMnemonic',
      'VerifyMnemonic',
      'EncryptMnemonic',
      'FinishMsg',
    ],
    'quick': [
      'EncryptMnemonic',
      'FinishMsg',
    ],
    'existing': [
      'ImportMnemonic',
      'EncryptMnemonic',
      'FinishMsg',
    ],
  }

  $: selectedSetup = setup?.[key] || setup[defaultSetupOption]

</script>

<NavModal title='Loading....' bodies={selectedSetup} bind:show={show} />
