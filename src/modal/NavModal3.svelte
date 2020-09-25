<script>
import { fade } from 'svelte/transition';

function overlay_click(e) {
    if ('close' in e.target.dataset)
        show = false;
}

export let title
  , body
  , prev
  , next
  , show = false

let visible = show
</script>

{#if show}
<div>
  <div class="modal-overlay" data-close on:click={overlay_click} transition:fade={{duration: 1500}}>
    <div class="modal-container center">
      <h2>{@html title}</h2>
      <main><p>{@html body}</p></main>
      <button disabled={!prev} autofocus on:click={prev}>Prev</button>
      <button disabled={!next} autofocus on:click={next}>Next</button>
    </div>
  </div>
</div>
{/if}
{#if next && !visible}
  <slot></slot>
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
    padding: 1.5rem;
  }
</style>
