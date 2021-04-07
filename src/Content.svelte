<script>
  import Title from '@component/Title.svelte'
  import LoadingSpinner from '@component/LoadingSpinner.svelte'
  import { onMount } from 'svelte'

  let FirstVisitSetup
    , PassGenerator

  onMount(async () => {
    import('@component/PassGenerator.svelte')
      .then(c => PassGenerator = c.default)
    import('@component/Setup.svelte')
      .then(c => FirstVisitSetup = c.default)
  })
</script>

<Title />
<svelte:component this={FirstVisitSetup} />
{#if PassGenerator}
  <svelte:component this={PassGenerator} />
{:else}
  <LoadingSpinner />
{/if}
