<script>
  import SelectSetup from '@component/setup/Select'
  import ProcessSetup from '@component/setup/Process'

  let showSelect = true,
    showProcess = false,
    setupOption

  // when selection is closed, begin selected setup process
  $: showProcess = !showSelect
</script>

<SelectSetup bind:setupOption={setupOption} bind:show={showSelect} />
<ProcessSetup bind:key={setupOption} bind:show={showProcess} />
