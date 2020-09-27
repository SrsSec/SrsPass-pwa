import { writable } from 'svelte/store'
import * as bip39 from 'bip39'
import bs58check from 'bs58check'

// by default we generate a 128-bit mnemonic, however, power users are free to override this with 128-256 bit bip39 mnemonics via overwrite. The overwrite only checks that the mnemonic's mnemonic passes validation, not its size.

// TODO consider if there's any benefits to bs58checking this?
// TODO encrypt this...
// TODO once encrypted, might be better to just "drop" this session
// storage stuff
const mnemonicStoreKey = 'mnemonic'
  , mnemonicBits = 128

function storeMnemonicInSession(mnemonicString) {
  if (!bip39.validateMnemonic(mnemonicString))
    return false
  sessionStorage.setItem(
    mnemonicStoreKey,
    bs58check.encode(
      Buffer.from(
        bip39.mnemonicToEntropy(mnemonicString),
        'hex'
      )
    )
  )
  //bip39.mnemonicToMnemonic(mnemonicString).then(
  //  buf => sessionStorage.setItem(bs58check.encode(buf))
  //)
  //sessionStorage.setItem(
  //  mnemonicStoreKey,
  //  bs58check.encode(
  //    Buffer.from(
  //      mnemonicString,
  //      'ascii'
  //    )
  //  )
  //)
  return true
}

function generateNewMnemonicAndStore() {
  const mnemonicNew = bip39.generateMnemonic(mnemonicBits)
  storeMnemonicInSession(mnemonicNew)
  return mnemonicNew
}

export function getSessionStoredMnemonic() {
  try { 
    const mnemonicStore = sessionStorage.getItem(mnemonicStoreKey)
    if (mnemonicStore === null) return
    const mnemonicMaybe = bip39.entropyToMnemonic(
      bs58check.decode(
        mnemonicStore
      )
    )

    if (!bip39.validateMnemonic(mnemonicMaybe))
      throw new Error('Invalid mnemonic')
    return mnemonicMaybe
  }
  catch (e) {
    // NOTE these are triggered before rest of docu load...
    // might be good for avoiding additional corruption
    if (e.message === 'Invalid checksum')
      alert(`Session storage corruption... key '${mnemonicStoreKey}' failed checksum... creating new one. Reimport your own mnemonic if you have one already!`)
    else if (e.message === 'Invalid mnemonic')
      alert(`Session storage corruption... key '${mnemonicStoreKey}' failed mnemonic validation... creating new one. Reimport your own mnemonic if you have one already!`)
    console.error(e)
    return
  }
}

function createMnemonic() {
	const { subscribe, set } = writable(
    getSessionStoredMnemonic() ||
    generateNewMnemonicAndStore()
  )

	return {
		subscribe,
		regenerate: () => set(generateNewMnemonicAndStore()),
		overwrite: mnemonicUser => bip39.validateMnemonic(mnemonicUser) &&
      storeMnemonicInSession(mnemonicUser) &&
      set(mnemonicUser)
	}
}

export const mnemonic = createMnemonic()
export const readableMnemonic = (() => {
  // does a shallow copy and strips the aforementioned props
  const {
    regenerate,
    overwrite,
    ...readableMnemonic
  } = mnemonic
  return readableMnemonic
})()
