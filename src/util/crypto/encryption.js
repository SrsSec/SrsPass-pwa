import cbor from 'cbor'
import bs58check from 'bs58check'
import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from 'crypto'
import {
  a2params,
  deriveSeedEncryptionKey,
  deriveMnemonicSeed
} from './kdf'

const aesMode = 'aes-256-gcm'

export const storageKeys = {
  mnemonicSeed: 'seedBlob',
  mnemonicPlain: 'plainBlob'
}

const encodeForStorage = obj =>
  bs58check.encode(cbor.encode(obj))

const decodeFromStorage = blob =>
  cbor.decode(bs58check.decode(blob))

function encryptAes(key, payload) {
  const iv = randomBytes(12)
  const cipher = createCipheriv(aesMode, key, iv)
  const encryptedPayload = Buffer.concat([
    cipher.update(payload),
    cipher.final()
  ])

  const encrypted = {
    payload: encryptedPayload,
    authTag: cipher.getAuthTag(),
    iv
  }
  return encrypted
}

// pass decoded blob as 2nd arg
function decryptAes(key, { iv, payload, authTag }) {
  const decipher = createDecipheriv(aesMode, key, iv)
  decipher.setAuthTag(authTag)
  const decrypted = Buffer.concat([
    decipher.update(payload),
    decipher.final()
  ])
  return decrypted
}

// payload may be a promise to be run through KDF or
// in case of cleardata a native type
async function createEncryptedBlob(pass, payload) {
  // generate 256-bits of entropy to use for salt
  const salt = randomBytes(32)
  // use password and salt to run through KDF
  // to yield unique key for each device that should be impossible to bruteforce
  // without the salt, and non-trivial even with salt, as long as password is secure
  const keyPromise = deriveSeedEncryptionKey(pass, salt)
  // assign encrypted object which contains encrypted payload
  // and the parameters needed to recreate key and decipher the payload
  const encrypted = {
    v: 1, // versioning to support updates to container and handling thereof
    key: {
      salt,
      params: a2params.heavy
    },
    // NOTE: this mechanism allows us to spawn 2 workers to run in parallel,
    // in the case of payload also needing KDF and being wrapped in a promise for it
    // await should have negligible execution effect on native type
    ...encryptAes(await keyPromise, await payload)
  }
  const encryptedEncodedBlob = encodeForStorage(encrypted)
  return encryptedEncodedBlob
}

async function encryptSeedFromMnemonic(pass, mnemonic) {
  const seedPromise = deriveMnemonicSeed(mnemonic)
  return createEncryptedBlob(pass, seedPromise)
}

async function encryptPlainMnemonic(pass, mnemonic) {
  return createEncryptedBlob(pass, mnemonic)
}

async function decryptBlob(pass, blob) {
  const encrypted = decodeFromStorage(blob)
  const { salt, params } = encrypted.key
  const key = await deriveSeedEncryptionKey(pass, salt, params)
  const payload = decryptAes(key, encrypted)
  return payload
}

// returns true on success
// NOTE make sure to catch any exceptions or check return at calls of this
export async function saveEncryptSeedFromMnemonic(pass, mnemonic) {
  const blob = await encryptSeedFromMnemonic(pass, mnemonic)
  localStorage.setItem(storageKeys.mnemonicSeed, blob)
  return true
}

// returns the seed buffer
// catch and handle its exceptions !!!
export async function loadDecryptSeed(pass) {
  const blob = localStorage.getItem(storageKeys.mnemonicSeed)
  return decryptBlob(pass, blob)
}

// returns true on success
// NOTE make sure to catch any exceptions or check return at calls of this
export async function saveEncryptMnemonic(pass, mnemonic) {
  const blob = await encryptPlainMnemonic(pass, mnemonic)
  localStorage.setItem(storageKeys.mnemonicPlain, blob)
  return true
}

// returns the mnemonic
// catch and handle its exceptions !!!
export async function loadDecryptMnemonic(pass) {
  const blob = localStorage.getItem(storageKeys.mnemonicPlain)
  return decryptBlob(pass, blob)
}
