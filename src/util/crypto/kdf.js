import WorkerArgon2id from '@worker/argon2id.worker.js'

// t 12 m 15 takes about 5 secs
// t 13 m 14 takes about 2 secs
export const a2params = {
  heavy: {
    time: 12,
    mem: (1 << 15)
  },
  light: {
    time: 19,
    mem: (1 << 9)
  }
}

// promisified interface to the argon2id worker
// creates ephemeral instances per call
// this has the benefit of allowing parallel runs for different hashes
export function argon2(pass, salt, opt = {}) {
  return new Promise(resolve => {
    const worker = new WorkerArgon2id()
    const params = { salt, ...opt }
    if (!params.hashLen) params.hashLen = 32
    worker.onmessage = ({ data }) => {
      worker.terminate()
      resolve(data)
    }
    worker.postMessage({ pass, params })
  })
}

// for the most part will be working with Buffer types
// so this helper function helps avoid redundant await code
export const getArgon2Hash = async (pass, salt, opt) =>
  (await argon2(pass, salt, opt)).res.hash

// TODO put in encryption
export const deriveSeedEncryptionKey = async (pass, salt) =>
  await getArgon2Hash(pass, salt, a2params.heavy)

// unlike bip39, we derive using custom argon2 params instead of pbkdf2
// TODO put in encryption
export const deriveMnemonicSeed = async mnemonic =>
  await getArgon2Hash(mnemonic, 'SrsPass seed', a2params.heavy)

export const deriveGeneratorPassword = async pass =>
  await getArgon2Hash(pass, 'SrsPass generator v0', a2params.heavy)
