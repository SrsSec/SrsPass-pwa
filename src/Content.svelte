<script>
  import Title from '@component/Title.svelte'
  import LoadingSpinner from '@component/LoadingSpinner.svelte'
  import { onMount } from 'svelte'
  import { needsSetup } from '@util/helper.js'

  let Setup
    , PassGenerator

  onMount(() => {
    import(
      /*
        webpackChunkName: "unlock",
        webpackPreload: true
      */
      '@component/PassGenerator.svelte'
    ).then(c => PassGenerator = c.default)
    needsSetup() && import(
        /*
          webpackChunkName: "setup",
          webpackPrefetch: true
        */
        '@component/setup/Root.svelte'
      ).then(c => Setup = c.default)
    })

</script>

<Title />
{#if needsSetup()}
  <svelte:component this={Setup} />
{/if}
{#if PassGenerator}
  <svelte:component this={PassGenerator} />
{:else}
  <LoadingSpinner />
{/if}
