<script>
  import SelectSetup from '@component/setup/Select'
  import ProcessSetup from '@component/setup/Process'

  let showSelect = true,
    showProcess = false,
    setupOption

  // when selection is closed, begin selected setup process
  $: showProcess = !showSelect
  $: {
    if (showProcess && !window.SrsPassAppProps?.setupOption) {
      window.SrsPassAppProps.setupOption = { readableValue: setupOption }
      Object.freeze(window.SrsPassAppProps.setupOption)
    }
  }
</script>

<SelectSetup bind:setupOption={setupOption} bind:show={showSelect} />
<ProcessSetup bind:key={setupOption} bind:show={showProcess} />
