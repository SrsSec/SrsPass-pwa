<script>
  import Modal from '@modal/Modal.svelte'

  export let title, body

  let showModal = true
</script>
{#if showModal}
	<Modal on:close="{() => showModal = false}">
		<h2 slot="header">
      {@html title}
      <!--modal
      <small><em>adjective</em>  mod·al \ˈmō-dəl\</small>-->
		</h2>
    <p>
      {@html body} 
    </p>
	</Modal>
{/if}
