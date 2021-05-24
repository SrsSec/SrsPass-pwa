<script>
// FIXME make whole highlighted part clickable
// Above could be done by making on:click listener on the li elems, but may not be conventional
// TOOD add optional Verify Phrase option from settings, for those wanting to just confirm they have it written correctly
// TODO add option to disable tooltip glyphs
import { isAppUnlocked } from '@store/main'
import * as c from '@/constants'
import { onMount } from 'svelte'

let PostVerifyMnemonic

onMount(() => {
  import(
    /*
      webpackChunkName: "menuPostVerify",
    */
    '@component/menu/PostVerifyMnemonic'
  ).then(c => PostVerifyMnemonic = c.default)
})

const aboutHandler = () =>
  alert(c.menuAboutText)

</script>

<div id="menu">
  <button id="dropdown">
  </button>
  <div id="dropdown-content">
    <hr/>
    <svelte:component this={ PostVerifyMnemonic } />
    <li><button><a href='https://docs.srspass.com/faq' target='_blank' id="help">Help</a></button></li>
    <li><button on:click={aboutHandler} id="about">About</button></li>
    <!--
      TODO see about getting this working with PWA
      https://stackoverflow.com/questions/41742390/javascript-to-check-if-pwa-or-mobile-web
    <hr/>
    <li><button on:click={closeWindow} id="close">Exit</button></li>
    -->
  </div>
</div>

<style>
  #menu {
    position: fixed;
    top: -0.75rem;
    right: 2rem;
    font-size: 3rem;
    color: black;
    z-index: 20;
  }
  #menu:hover #dropdown-content {
    display: block;
  }
  :global(
    #menu > button,
    #dropdown-content > li > a,
    #dropdown-content > li > button,
    #dropdown-content > li > button > a
    ) {
    cursor: pointer;
    border: none;
    background-color: inherit;
    margin: 0;
    z-index: 0;
    display: block;
    text-decoration: none;
    color: black;
  }
  #dropdown::before {
    content: "\2261";
  }
  #menu:hover #dropdown::before {
    content: "\2630";
  }
  #dropdown-content {
    display: none;
    position: fixed;
    right: 0;
    top: -1.25rem;
    font-size: 1rem;
    background-color: #f9f9f9;
    box-shadow: 0 0.5rem 1rem 0 rgba(0,0,0,0.2);
    padding: 6rem 1rem 0.5rem 1rem;
    z-index: -1;
    min-width: 7.5rem;
  }
  #dropdown-content > :global(li) {
    display: block;
    margin: 0 -1rem;
    padding: 0.375rem 1rem;
  }
  #dropdown-content > :global(li:hover) {
    background-color: #e6e6e6;
  }
  #dropdown-content > :global(hr) {
    margin: 0.1875rem -0.5rem;
  }
</style>
