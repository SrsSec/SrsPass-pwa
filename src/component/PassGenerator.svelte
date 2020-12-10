<script>
  import {
    afterUpdate
    , onMount
  } from 'svelte'
import * as R from 'ramda'
import {
  getArgon2Hash
  , a2params
  , loadDecryptSeed
  , deriveGeneratorPassword
} from '@util/crypto'
import * as c from '@/constants.js'
import JSBI from 'jsbi'
import {
  needsSetup
  , disableAnnoyingMobileInputBugs
} from '@util/helper.js'

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
  , childPassFormatDefault = 'x'
  , childPassFormat = childPassFormatDefault
  , unlockPassInputDOM
  , showPass = false

onMount(() => unlockPassInputDOM = document.getElementById('unlockPassInput'))

function handleUnlockEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault()
    handleUnlockClick()
  }
}

function handleCopyClick() {
  navigator.clipboard.writeText(childPass)
}

function handlePassFormatInput(event) {
  const { key } = event
  if (Object.keys(charsetDict).indexOf(key) < 0)
    return event.preventDefault()
  else if (key === 'c' && customAlpha.length === 0) {
    event.preventDefault()
    return alert(`You must define a custom alphabet in the input underneath, before you can use 'c' in the format!`)
  }
}

const dedupeChars = R.pipe(
  R.split(''),
  R.uniq,
  R.join('')
)
const charsetDict = {
  '0': '123456789',
  'A': 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  'a': 'abcdefghijkmnopqrstuvwxyz',
  '@': `!@#$%^&*?`,
  '#': `!@#$%^&*?()-=_+[]{};':",.`,
}
charsetDict.d = charsetDict['0'] + charsetDict['A'] + charsetDict['a']
charsetDict.x = charsetDict['d'] + charsetDict['#']
charsetDict.c = customAlpha
// run through the dict and dedupe... should probably give warning
// if there are dupes
Object.entries(charsetDict).forEach(([k, v]) => {
  charsetDict[k] = dedupeChars(v)
  if (v !== charsetDict[k]) throw new Error(`charset ${k} has dupe chars... please resolve`)
})
const charsetDefinitions = Object.entries(charsetDict).map(([k,v]) => `${k}: ${v}`).join('\n') + '(custom alphabet)\n\ne.g. aA0a for a 6 length password may create a password that looks like: yM5etu'
const alpha = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
// A = upperlpha, a = lower, @ = symbol, 0 = num, * = any
// x = any alpha
// c = custom alphabet
// add custom symbol alphabet

// FIXME: these typed arrays will have a differing byte order depending on system endianness
// aka dont use in production
const toUint64Array = buffer =>
  new BigUint64Array(buffer)

const toUint32Array = buffer =>
  new Uint32Array(buffer)

/*
 * DataView.prototype.getBigUint64 polyfill
 */
const getUint64JSBI = (view, byteOffset, littleEndian) => {
  const { BigInt } = JSBI,
    LE = !!littleEndian,
    BO = byteOffset|0
  const lo = BigInt(view.getUint32(LE ? BO + 0 : BO + 4, LE))
  const hi = BigInt(view.getUint32(LE ? BO + 4 : BO + 0, LE))
  // let's convert both lo/hi to u64, combine them by applying a 32 bit lshift on hi
  // could prolly do bitwise OR, test
  return JSBI.asUintN(64, JSBI.bitwiseOr(lo, JSBI.leftShift(hi, BigInt(32))))
}

// TODO do some obund checks or workarounds, or ensure that buff will fit nicely, or supplement with 0s at end?
const toUint64ArrayLE = buffer => {
  const view = new DataView(buffer)
  return Array.from(Array(view.byteLength / 8 | 0)).map((_, i) =>
    getUint64JSBI(view, i * 8, true))
}

// kept for reference just
//const toPassString = (arr, al=alpha) =>
//  Array.from(arr, x => al[x % al.length]).join('')
//
//const toPassStringFromBigN = (arr, al=alpha) =>
//  Array.from(arr, x => al[x % BigInt(al.length)]).join('')

// old method, must be consistent with below method!!!
// TODO test their consistency
const transformUArrWithFormatToPass = (arr, alArr) =>
  Array.from(Array(arr.length)).map((_,i) => {
    let x = arr[i]
    let idx = Math.min(i, alArr.length - 1)
    let al = alArr[idx]
    return al[x % BigInt(al.length)]
  }).join('')

const transformUArrWithFormatToPassJSBI = (arr, alArr) =>
  Array.from(Array(arr.length)).map((_,i) => {
    let x = arr[i] //BigInt
    let idx = Math.min(i, alArr.length - 1)
    let al = alArr[idx]
    return al[JSBI.remainder(x, JSBI.BigInt(al.length))]
  }).join('')

// const childPassFromBuffer64old = ({ buffer }) => R.pipe(
//   toUint64Array,
//   toPassStringFromBigN
// )(buffer)

const childPassFromBuffer64 = ({ buffer }, alphaArray) =>
  transformUArrWithFormatToPassJSBI(toUint64ArrayLE(buffer), alphaArray)
  //transformUArrWithFormatToPass(toUint64Array(buffer), alphaArray)


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

// check that each char passed yields a key in the charsetDict
const validatePassFormat = R.pipe(
  R.split(''),
  R.all(
    R.includes(
      R.__,
      R.keys(charsetDict)
    )
  )
)

// TODO consider optimizing this to cut off the duplicates at end
const deriveAlphaArray = R.pipe(
  R.split(''),
  R.map(
    R.prop(
      R.__,
      charsetDict
    )
  )
)

async function handleGenerateClick() {
  const cpf = childPassFormat
  if (!validatePassFormat(cpf))
    return alert(`Invalid pass format... please check tooltips for valid characters by hovering over the ${childPassTerm} format input`)
  childPass = ""
  generating = true
  // uint8 array
  //let fmt = `${index}${uri}${login}`
  // index is omitted unless non-zero, to keep the salt from being too easily
  // identifiable by such a consistent marker
  let fmt = (index > 0 ? index : '') + uri + login
  //console.log(fmt)
  //console.log(Buffer.from(fmt))
  //console.log(concatBufWithStr(salt, fmt))
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
  childPass = childPassFromBuffer64(derived, deriveAlphaArray(cpf))
}

//const isNumPress = event =>
//  event.keyCode >= 48 && event.keyCode <= 57
//const isNavPress = event =>
//  console.log(event)

// prevents decimals or periods from being inserted
// when bound to onkeydown events
const blacklistDecimal = event =>
  event.keyCode === 190 && event.preventDefault()

const isEmpty = x => !x || x.length === 0

afterUpdate(() => {
  disableAnnoyingMobileInputBugs()
})

$: needsCredentials = isEmpty(pass) || isEmpty(salt)
$: index = Math.floor(index)
$: passLen = Math.floor(passLen)
$: customAlpha = dedupeChars(customAlpha)
$: charsetDict.c = customAlpha
$: if(customAlpha.length === 1 &&
  childPassFormat === childPassFormatDefault) childPassFormat = 'c'
$: unlockPassInputDOM && (
  showPass ? unlockPassInputDOM.setAttribute('type', 'text') : unlockPassInputDOM.setAttribute('type', 'password'))
</script>

<div>
  {#if needsCredentials}
    <h3>Usable offline & as PWA for extra security</h3>
    {#if unlocking}
      <p>Unlocking... please wait</p>
    {:else}
      <div>
        <label for="unlockPassInput" title={c.tipUnlockPass}>Please enter your {@html c.passHtml} to begin!</label>
        <input autofocus={!needsSetup()} id="unlockPassInput" title={c.tipUnlockPass} name="unlockPassInput" type="text" bind:value={unlockPass} disabled={unlocking} on:keypress={handleUnlockEnter}>
        <button title={c.tipUnlockPass} on:click={handleUnlockClick} disabled={unlocking}>
          Unlock
        </button>
        <div class="checkbox">
          <label for=showUnlockPass><span>show password<input name="showUnlockPass" type="checkbox" bind:checked={showPass}></span></label>
        </div>
      </div>
    {/if}
  {:else}
    <p>Note: All inputs are case sensitive, so remember where you use capital or small letters!</p>
    <br/>
    <div class="input-container" title={c.tipLogin}>
      <label for="loginInput">login</label>
      <input name="loginInput" type="text" bind:value={login} placeholder="e.g. user@email.com/username">
    </div>
    <div class="input-container" title={c.tipUri}>
      <label for="uriInput">website address</label>
      <input name="uriInput" type="url" bind:value={uri} placeholder="e.g. myspace.com">
    </div>
    <br/>
    <div class="checkbox">
      <label for=advOptsInput><span>advanced options<input name="advOptsInput" type="checkbox" bind:checked={advOpts}></span></label>
    </div>
    {#if advOpts}
      <br/>
      <div class="input-container" title={c.tipIndex}>
        <label for="indexInput">index</label>
        <input name="indexInput" type="number" min="0" steps="1" bind:value={index} on:keydown={blacklistDecimal} />
      </div>
      <div class="input-container" title={c.tipPassLen}>
        <label for="passLenInput">length</label>
        <input name="passLenInput" type="number" min="4" steps="1" bind:value={passLen} on:keydown={blacklistDecimal} />
      </div>
      <br/>
      <div class="input-container" spellcheck="false" title={c.tipPassFormat+`${charsetDefinitions}`}>
        <label for="childPassFormat">{c.childPassTerm.toLowerCase()} format</label>
        <input name="childPassFormat" type="text" bind:value={childPassFormat} on:keypress={handlePassFormatInput}>
      </div>
      <div class="input-container" spellcheck="false" title={c.tipCustomAlpha}>
        <label for="customAlphaInput">c: (custom alphabet)</label>
        <input name="customAlphaInput" type="text" bind:value={customAlpha} placeholder="e.g. abcd_!">
      </div>
      <br/>
    {/if}
    <br/>
    <br/>
    <div>
      <button on:click={handleGenerateClick}>
        generate {@html c.childPassHtml}
      </button>
      <div class="input-container" title={c.tipChildPass}>
        <textarea style="width:100%" placeholder="Copy me after generating!" bind:value={childPass} disabled />
      </div>
      <button disabled={childPass.length === 0} on:click={handleCopyClick}>
        copy
      </button>
    </div>
  {/if}
</div>

<style>
  /* used for tooltips to encompass the whole view of the input */
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
