<script>
  let dots = '...'
  setInterval(() => {
    dots = dots.length >= 3 ? '' : dots + '.'
  }, 333)
</script>
<h3>Loading{dots}</h3>
