<script>
  import Title from '@component/Title.svelte'
  import LoadingSpinner from '@component/LoadingSpinner.svelte'
  import { onMount } from 'svelte'

  let FirstVisitSetup
    , PassGenerator

  onMount(() => {
    import(
      /* webpackChunkName: "unlock" */
      '@component/PassGenerator.svelte'
    ).then(c => PassGenerator = c.default)
    import(
      /* webpackChunkName: "setup" */
      '@component/Setup.svelte'
    ).then(c => FirstVisitSetup = c.default)
  })

</script>

<Title />
<svelte:component this={FirstVisitSetup} />
{#if PassGenerator}
  <svelte:component this={PassGenerator} />
{:else}
  <LoadingSpinner />
{/if}
