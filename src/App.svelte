<script>
import '@public/global.css'
import '@public/manifest.webmanifest'
import Footer from '@component/Footer.svelte'
import Content from '@/Content.svelte'
</script>

<style>
.page-container {
  position: relative;
  min-height: 100vh;
}

.content-wrap {
  padding-bottom: 3rem;    /* At Least Footer height */
}

:global(footer) {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;            /* Footer height */
}
</style>

<div class="page-container">
  <div class="content-wrap">
    <Content />
  </div>
  <Footer />
</div>
