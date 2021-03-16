<script>
  import { fade } from 'svelte/transition';
  import {
    childLockNext,
    childLockPrev,
    childFocus,
    childTitle
  } from '@store/firstVisitNav.js'

  let idx = 0
  // close is only enabled on last page
  function handleClose(e) {
    if (lastPage && 'close' in e.target.dataset)
      show = false
  }

  $: lockPrev = () => $childLockPrev || idx < 1
  $: lockNext = () => $childLockNext || idx >= bodies.length - 1

  // add vim key nav
  function handleKeydown(evt) {
    if (!show || $childFocus) return
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

  $: lastPage = idx === bodies.length - 1
</script>

<svelte:window autofocus on:keydown={handleKeydown}/>
{#if show}
  <div>
    <div class="modal-overlay" data-close on:click={handleClose} transition:fade={{duration: 1500}}>
      <div class="modal-container center">
        <h2>{$childTitle || title}</h2>
        <main><svelte:component this={bodies[idx]} /></main>
        {#if lastPage}
          <div>
            <button data-close on:click={handleClose}>Finish</button>
          </div>
        {/if}
        <button disabled={lockPrev()} on:click={() => idx -= 1}>Prev</button>
        <span>{idx + 1}/{bodies.length}</span>
        <button disabled={lockNext()} on:click={() => idx += 1}>Next</button>
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
    width: calc(100vw - 4em);
    max-width: 44em;
    margin: 1rem auto 0.2rem;
    padding: 1rem;
    border-radius: 0.2em;
    box-shadow: 0 3px 10px #555;
  }
  button {
    margin: 0.5em 1em;
  }
  main {
    padding: 0rem 1rem 1rem 1rem;
  }
</style>
