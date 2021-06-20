<script>
  import NavModal from '@modal/NavModal.svelte'
  import WelcomeDescription from '@modal/firstVisit/WelcomeDescription.svelte'

  // setup steps for first visits/new devices
  // string means it is dynamically loaded
  const steps = [
    WelcomeDescription,
    'ChooseSetup',
  ]

  export let show, setupOption, childProps

  // if not undefined, set var to that, or keep it as is
  $: setupOption = childProps?.export?.setupOption || setupOption

</script>

<NavModal title='Loading...' bodies={steps} bind:show={show}  bind:childProps={childProps} />
