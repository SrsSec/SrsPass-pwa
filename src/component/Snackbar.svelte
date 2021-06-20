<script>
  export let text = "Enter Snackbar Text Here!"
</script>

<div id="snackbar">{@html text}</div>

<style>
#snackbar {
  min-width: 8vw;
  width: fit-content;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 0.125rem;
  padding: 1rem 1.25rem;
  position: fixed;
  z-index: 10;
  left: 50%;
  transform: translateX(-50%);
  margin-right: 3rem;
  bottom: 4rem;
  -webkit-animation: fadeinout 10s linear forwards;
  animation: fadeinout 10s linear forwards;
}

@-webkit-keyframes fadeinout {
  0%,100% { opacity: 0; visibility: hidden; }
  10%,80% { opacity: 1; visibility: visible; }
}

@keyframes fadeinout {
  0%,100% { opacity: 0; visibility: hidden; }
  10%,80% { opacity: 1; visibility: visible; }
}
</style>
