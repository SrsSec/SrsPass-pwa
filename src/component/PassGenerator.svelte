<script>
import * as R from 'ramda'
import {
  getArgon2Hash
  , a2params 
  , loadDecryptSeed 
  , deriveGeneratorPassword
} from '@util/crypto'
import * as c from '@/constants.js'

const msg = {
  passInput: "Enter password here..."
  , loading:  "Generating..."
}
let unlocking = false
  , generating = false
  , unlockPass = ''
  , salt = ''
  , pass = "p"
  , childPass = ""
  , login = ""
  , uri = ""
  , advOpts = false
  , index = 0
  , passLen = 20
  , customAlpha = ''

function enterHandler(event) {
  if (event.key === "Enter") {
    event.preventDefault()
    handleGenerateClick()
  }
}

const alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
// A = upperlpha, a = lower, @ = symbol, 0 = num, * = any
// x = any alpha
// c = custom alphabet
// add custom symbol alphabet

const toUint64Array = buffer =>
  new BigUint64Array(buffer)

const toUint32Array = buffer =>
  new Uint32Array(buffer)

const toPassString = (arr, al=alpha) =>
  Array.from(arr, x => al[x % al.length]).join('')

const toPassStringFromBigN = (arr, al=alpha) =>
  Array.from(arr, x => al[x % BigInt(al.length)]).join('')

const unlockPassFromBuffer64 = ({ buffer }) => R.pipe(
  toUint64Array,
  toPassStringFromBigN
)(buffer)

async function handleUnlockClick() {
  unlocking = true
  try {
    // add appropriate exceptions and handling thereof
    const saltProm = loadDecryptSeed(unlockPass)
    const passProm = deriveGeneratorPassword(unlockPass)
    unlockPass = ''
    salt = await saltProm
    pass = await passProm
  } catch (e) {
    const errorDict = {
      'Unsupported state or unable to authenticate data': `Incorrect ${c.passTerm.toLowerCase()} entered...`
    }
    const knownError = errorDict[e.message]
    if (knownError)
      alert(knownError)
    else
      console.error(e) || alert('Unhandled Error, check log and report!')
  } finally {
    unlocking = false
  }
}

const concatBufWithStr = (b, s) =>
  Buffer.concat([b, Buffer.from(s, 'utf8')])

async function handleGenerateClick() {
  childPass = ""
  generating = true
  // uint8 array
  //let fmt = `${index}${uri}${login}`
  // index is omitted unless non-zero, to keep the salt from being too easily
  // identifiable by such a consistent marker
  let fmt = (index > 0 ? index : '') + uri + login
  console.log(fmt)
  console.log(Buffer.from(fmt))
  console.log(concatBufWithStr(salt, fmt))
  const derived = await getArgon2Hash(
    pass,
    concatBufWithStr(salt, fmt), //TODO use buffers?
    // TODO salt ought to be the seed
    {
      hashLen: passLen*8,
      ...a2params.test
    }
  )
  generating = false
  childPass = unlockPassFromBuffer64(derived)
}

//const isNumPress = event =>
//  event.keyCode >= 48 && event.keyCode <= 57
//const isNavPress = event =>
//  console.log(event)

// prevents decimals or periods from being inserted
// when bound to onkeydown events
const blacklistDecimal = event =>
  event.keyCode === 190 && event.preventDefault()
/*
  <label for="passInput">Master Pass:</label>
  <input name="passInput" disabled={generating} placeholder={generating && msg.loading || msg.passInput} bind:value={pass} on:keypress={enterHandler} type="text">
 */
const isEmpty = x => !x || x.length === 0
$: needsCredentials = isEmpty(pass) || isEmpty(salt)
$: index = Math.floor(index)
$: passLen = Math.floor(passLen)
</script>

<div>
  {#if needsCredentials}
    <h3 title="It's literally http for frig sakes">a.k.a. consider anything you put in this website to be keylogged/compromisable atm</h3>
    {#if unlocking}
      <p>Unlocking... please wait</p>
    {:else}
      <div>
        <label for="unlockPassInput" title={c.tipUnlockPass}>Please enter your {@html c.passHtml}!</label>
        <input title={c.tipUnlockPass} name="unlockPassInput" type="text" bind:value={unlockPass} disabled={unlocking}>
        <button title={c.tipUnlockPass} on:click={handleUnlockClick} disabled={unlocking}>
          Unlock
        </button>
      </div>
    {/if}
  {:else}
    <div class="input-container" title={c.tipLogin}>
      <label for="loginInput">login</label>
      <input name="loginInput" type="text" bind:value={login} placeholder="e.g. user@email.com/username">
    </div>
    <div class="input-container" title={c.tipUri}>
      <label for="uriInput">uri</label>
      <input name="uriInput" type="url" bind:value={uri} placeholder="e.g. myspace.com">
    </div>
    <br/>
    <div class="checkbox">
      <label><span>advanced<input name="advOptsInput" type="checkbox" bind:checked={advOpts}></span></label>
    </div>
    {#if advOpts}
      <div class="input-container" title={c.tipIndex}>
        <label for="indexInput">index</label>
        <input name="indexInput" type="number" min="0" steps="1" bind:value={index} on:keydown={blacklistDecimal} />
      </div>
      <div class="input-container" title={c.tipPassLen}>
        <label for="passLenInput">length</label>
        <input name="passLenInput" type="number" min="4" steps="1" bind:value={passLen} on:keydown={blacklistDecimal} />
      </div>
      <br/>
      <!-- TODO custom alpha
      <label for="customAlphaInput">custom alphabet</label>
      <input name="customAlphaInput" type="text" bind:value={customAlpha}>
      -->
    {/if}
    <br/>
    <div>
      <button on:click={handleGenerateClick}>
        generate {@html c.childPassHtml}
      </button>
      <div class="input-container" title={c.tipChildPass}>
        <textarea style="width:100%" placeholder="Copy me after generating!" bind:value={childPass} disabled/>
      </div>
    </div>
  {/if}
</div>

<style>
  div.input-container {
    max-width: 333px;
  }
  input {
    width: 100%;
    max-width: 333px;
  }
  .checkbox label {
    display: inline-block;
  }
  .checkbox input {
    width: auto;
    margin-left: 0.6rem;
  }
</style>
