<script>
  // firstVisit Nav Modal

  // Static load lighter weight parts, dynaload others incrementally
  import NavModal from '@modal/NavModal.svelte'
  import WelcomeDescription from '@modal/firstVisit/WelcomeDescription.svelte'

  import { needsSetup } from '@util/helper.js'
  import { onMount } from 'svelte'

  // setup steps for first visits/new devices
  // string means it is dynamically loaded
  const setupSteps = [
    WelcomeDescription,
    'SetupMsg',
    'ImportMnemonic',
    'GenerateMnemonic',
    'VerifyMnemonic',
    'EncryptMnemonic',
    'FinishMsg',
  ]

  const show = needsSetup()

  onMount(async () => {
    if(show !== true) return

    // dynamically load future steps in order
    setupSteps.forEach(async (x,i) => {
      if (typeof x === 'string')
        setupSteps[i] = (await import(`@modal/firstVisit/${x}.svelte`)).default
    })

  })
</script>

<NavModal title='Loading...' bodies={setupSteps} {show} />
