import { writable } from 'svelte/store'
import * as bip39 from 'bip39'
import bs58check from 'bs58check'

// by default we generate a 128-bit seed, however, power users are free to override this with 128-256 bit bip39 mnemonics via overwrite. The overwrite only checks that the seed's mnemonic passes validation, not its size.

// TODO consider if there's any benefits to bs58checking this?
// TODO encrypt this...
// TODO once encrypted, might be better to just "drop" this session
// storage stuff
const seedStoreKey = 'seed'
  , seedBits = 128

function storeSeedInSession(seedString) {
  if (!bip39.validateMnemonic(seedString))
    return false
  sessionStorage.setItem(
    seedStoreKey,
    bs58check.encode(
      Buffer.from(
        bip39.mnemonicToEntropy(seedString),
        'hex'
      )
    )
  )
  //bip39.mnemonicToSeed(seedString).then(
  //  buf => sessionStorage.setItem(bs58check.encode(buf))
  //)
  //sessionStorage.setItem(
  //  seedStoreKey,
  //  bs58check.encode(
  //    Buffer.from(
  //      seedString,
  //      'ascii'
  //    )
  //  )
  //)
  return true
}

function generateNewSeedAndStore() {
  const seedNew = bip39.generateMnemonic(seedBits)
  storeSeedInSession(seedNew)
  return seedNew
}

export function getSessionStoredSeed() {
  try { 
    const seedMaybe = bip39.entropyToMnemonic(
      bs58check.decode(
        sessionStorage.getItem(seedStoreKey)
      )
    )

    if (!bip39.validateMnemonic(seedMaybe))
      throw new Error('Invalid mnemonic')
    return seedMaybe
  }
  catch (e) {
    // NOTE these are triggered before rest of docu load...
    // might be good for avoiding additional corruption
    if (e.message === 'Invalid checksum')
      alert(`Session storage corruption... key '${seedStoreKey}' failed checksum... creating new one. Reimport your own seed if you have one already!`)
    else if (e.message === 'Invalid mnemonic')
      alert(`Session storage corruption... key '${seedStoreKey}' failed seed validation... creating new one. Reimport your own seed if you have one already!`)
    console.error(e)
    return
  }
}

function createSeed() {
	const { subscribe, set } = writable(
    getSessionStoredSeed() ||
    generateNewSeedAndStore()
  )

	return {
		subscribe,
		regenerate: () => set(generateNewSeedAndStore()),
		overwrite: seedUser => bip39.validateMnemonic(seedUser) &&
      storeSeedInSession(seedUser) &&
      set(seedUser)
	}
}

export const seed = createSeed()
export const readableSeed = (() => {
  // does a shallow copy and strips the aforementioned props
  const {
    regenerate,
    overwrite,
    ...readableSeed
  } = seed
  return readableSeed
})()
