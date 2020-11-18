<script>

import { onMount, onDestroy } from 'svelte'
import { mnemonicHtml } from '@/constants.js'
import { childTitle } from '@store/firstVisitNav'

onMount(() => childTitle.set('Setup!'))
onDestroy(() => childTitle.set(null))

</script>
<p>This seems to be your first visit.
Let's begin with a quick setup to get you going...</p>
<p>In the next steps, we'll generate your 12-word {@html mnemonicHtml} and store it in your browser.</p>
<p>Think of it is your account name, <strong style="text-transform: uppercase">save a backup for yourself and keep it secure.</strong></p>
<p>Seriously, write it in a notebook at least and securely on your phone, save multiple copies. You will need it to sync other devices or recover your passwords in the future.</p>
<p>If you previously generated one, you may import it in the next step!</p>
<!--><p><i>This phrase doubles as a crypto wallet mnemonic, as it's bip39. In fact, if you like
    you may import your own phrase, which we'll prompt you for!</i></p>-->
