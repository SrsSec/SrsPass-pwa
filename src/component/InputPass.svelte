<script>
  import WorkerPassGen from 'worker-loader!@worker/passGen.js'

  const worker = new WorkerPassGen()

  const salt = "somesalt"
      , msg = {
    passInput: "Enter password here..."
    , loading:  "Generating..."
  }
  let generating = false
    , pass = ""
    , derivedPass = ""

  // consider wrapping this in a promise
  // and use await template
  worker.onmessage = ({data}) => {
    derivedPass = data
    generating = false
  }

  function enterHandler(event) {
    if (event.key === "Enter") {
      event.preventDefault()
      // consider passing as uint8array or custom basex encoded...
      worker.postMessage({ pass, salt })
      derivedPass = ""
      generating = true
      pass = ""
    }
  }

  // could see about ruunning passInput through an encoder or encryption key
  // above is futile i think... however, consider uintarray conversion or the like
  // and definitely send the message encoded across worker threads, maybe even encrypted
  // could generate a key in memory for the worker... for this purpose
	function handleClick() {
		console.log('clicked')
	}
</script>

<h1>SrsPass</h1>
<br/>
<button on:click={handleClick}>
	generate pass
</button>

<div>
  <label for="passInput">Master Pass:</label>
  <input name="passInput" disabled={generating} placeholder={generating && msg.loading || msg.passInput} bind:value={pass} on:keypress={enterHandler} type="text">
  <div>
    <textarea placeholder="hey gaylord fawker" bind:value={derivedPass} disabled/>
  </div>
</div>

