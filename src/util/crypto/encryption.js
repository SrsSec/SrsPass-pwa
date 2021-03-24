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
  mnemonicSeed: 'seedBlob'
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

async function encryptSeedFromMnemonic(pass, mnemonic) {
  // generate 256-bits of entropy to use for salt
  const salt = randomBytes(32)
  // use password and salt to run through KDF
  // to yield unique key for each device that should be impossible to bruteforce
  // without the salt, and non-trivial even with salt, as long as password is secure
  const keyPromise = deriveSeedEncryptionKey(pass, salt)
  const seedPromise = deriveMnemonicSeed(mnemonic)
  // assign encrypted object which contains encrypted payload
  // and the parameters needed to recreate key and decipher the payload
  const encrypted = {
    v: 1, // versioning to support updates to container and handling thereof
    key: {
      salt,
      params: a2params.heavy
    },
    // NOTE: this mechanism allows us to spawn 2 workers to run in parallel for KDF
    ...encryptAes(await keyPromise, await seedPromise)
  }
  const encryptedEncodedBlob = encodeForStorage(encrypted)
  return encryptedEncodedBlob
}

async function decryptMnemonicSeedBlob(pass, blob) {
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
  return decryptMnemonicSeedBlob(pass, blob)
}
