<script>
  import { fade } from 'svelte/transition';

  let idx = 0

  // close is only enabled on last page
  function handleClose(e) {
    if (lastPage && 'close' in e.target.dataset)
      show = false
  }

  $: lockPrev = () => childProps.lockPrev || idx < 1
  $: lockNext = () => childProps.lockNext || idx >= bodies.length - 1 || !isNextReady

  // add vim key nav
  function handleKeydown(evt) {
    if (!show || childProps.focus) return
    const { key, keyCode } = evt
    if (!lockPrev() && (key === 'h' || keyCode === 72)) {
      evt.preventDefault()
      return idx--
    }
    if (!lockNext() && (key === 'l' || keyCode === 76)) {
      evt.preventDefault()
      return idx++
    }
  }

  export let title
  , bodies = []
  , show = false
  , childProps = {}

  let loading = false

  $: lastPage = idx === bodies.length - 1
  // if other than function, it means it hasn't loaded yet or is invalid,
  // which we lock in either case
  $: isReady = typeof bodies[idx] === 'function'
  $: isNextReady = typeof bodies[idx + 1] === 'function'
  // reset childProps when page changes
  $: if (idx) {
    childProps = {}
  }
  $: {
    // we disable reactivity here until last loading request completed
    if (!isLoadingChildren()) {
      bodies.forEach(async (x,i,a) => {
        // only lock loading if there are bodies to iterate, so that loading false path can be reached
        if (i === 0)
          loading = true
        if (typeof x === 'string')
          bodies[i] = (await import(`@modal/firstVisit/${x}.svelte`)).default
        if (i === a.length - 1)
          loading = false
      })
    }
  }

  const clearChildProps = () => childProps = {}
  const isLoadingChildren = () => loading
</script>

<svelte:window autofocus on:keydown={handleKeydown} />
{#if show}
  <div>
    <div class="modal-overlay" data-close on:click={handleClose} transition:fade={{duration: 1500}}>
      <div class="modal-container center">
        <h2>{childProps.title || title}</h2>
        {#if isReady}
          <main>
            <svelte:component
           this={bodies[idx]}
           bind:parentModal={childProps}
           />
          </main>
          {#if lastPage}
            <div>
              <button data-close on:click={handleClose}>{ childProps.finishBtnLabel || 'Finish' }</button>
            </div>
          {/if}
          <button disabled={lockPrev()} on:click={() => idx -= 1}>Prev</button>
          <span>{idx + 1}/{bodies.length}</span>
          <button disabled={lockNext()} on:click={() => idx += 1}>Next</button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .center {
    margin: auto;
    text-align: center;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .modal-container {
    position: relative;
    background-color: #ffffff;
    max-width: min(50ch, 97%);
    padding: 1.5rem;
    border-radius: 0.2em;
    box-shadow: 0 3px 10px #555;
    overflow-y: auto;
  }
  button {
    margin: 0.5em 1em;
  }
  main {
    padding: 0rem 1rem 1rem 1rem;
  }
  @media screen and (max-width: 599px) {
    .modal-container {
      padding: 1.5rem 0;
      margin: 4px auto;
    }
  }
</style>
