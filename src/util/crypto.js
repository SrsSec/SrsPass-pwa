import cbor from 'cbor'
import WorkerArgon2id from 'worker-loader!@worker/argon2id.js'

import bs58check from 'bs58check'
import {
  createCipheriv,
  createDecipheriv,
  randomBytes
} from 'crypto'
// base58 will be used for any at rest blobs to help identify potential corruption and fail on it
// derived key should be argon2id with `srsPass aes-gcm ${csprng 256 bits}` as the salt, 256 bits/32 bytes; we derive a new decryption key on each device for this purpose then
//// derived key doesnt make sense..., there should be one encryption/gen key...
// good real IV would be HMACx2 SHA-512 wit hash data being the plain mnemonic and the password, 256 bits derived key
//// HMAC once could be sufficient, read into her. The 256-bit key should be impossibru to brute force, and we would only use the truncation of its first 96-bits, thereby not actually revealing a hash. The IV portion should be stored in a bloom filter or tree structure to identify possible repetition...
// In particular, in 2006 Mihir Bellare proved that HMAC is a PRF under the sole assumption that the compression function is a PRF.[8] Therefore, HMAC-MD5 does not suffer from the same weaknesses that have been found in MD5.
//
// NEW
//
// base58 will be used for any at rest blobs to help identify potential corruption and fail on it
// derived key should be argon2id with `srsPass aes-gcm ${csprng 256 bits}` as the salt, 256 bits/32 bytes; we derive a new decryption key on each device for this purpose then
// IV will be CSPRNG, as good randomness and implementation is dependent on the browser... could improve by passing through hmac once
//crypto.subtle.importKey('raw', new ArrayBuffer(32), { name: 'AES-GCM' }, false, ['encrypt']).then(key => {
//console.log(Date.now())
//
// TODO DOCUMENT THIS HEAVILY

const aesMode = 'aes-256-gcm'
// t 12 m 15 takes about 5 secs
// t 13 m 14 takes about 2 secs
export const a2params = {
  heavy: {
    time: 12,
    mem: (1 << 15)
  },
  light: {
    time: 16,
    mem: (1 << 12)
  },
  test: {
    time: 19,
    mem: (1 << 9)
  }
}
//const argon2MediumParams = {
//  hashLen: 32,
//  time: 13,
//  mem: (1 << 14)
//}

export const storageKeys = {
  mnemonicSeed: 'seedBlob'
}

const encodeForStorage = obj =>
  bs58check.encode(cbor.encode(obj))

const decodeFromStorage = blob =>
  cbor.decode(bs58check.decode(blob))

// promisified interface to the argon2id worker
// creates ephemeral instances per call
// this has the benefit of allowing parallel runs for different hashes
export function argon2(pass, salt, opt = {}) {
  return new Promise(resolve => {
    const worker = new WorkerArgon2id()
    const params = { salt, ...opt }
    if (!params.hashLen) params.hashLen = 32
    worker.postMessage({ pass, params })
    worker.onmessage = ({ data }) => {
      worker.terminate()
      resolve(data)
    }
  })
}

// unlike bip39, we derive using custom argon2 params instead of pbkdf2
const deriveMnemonicSeed = async (mnemonic) =>
  await getArgon2Hash(mnemonic, 'SrsPass seed', a2params.heavy)

// for the most part will be working with Buffer types
// so this helper function helps avoid redundant await code
export const getArgon2Hash = async (pass, salt, opt) =>
  (await argon2(pass, salt, opt)).res.hash

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

const deriveSeedEncryptionKey = async (pass, salt) =>
  await getArgon2Hash(pass, salt, a2params.heavy)

export const deriveGeneratorPassword = async pass =>
  await getArgon2Hash(pass, 'SrsPass generator v0', a2params.heavy)

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
  console.log(params)
  const key = await deriveSeedEncryptionKey(pass, salt, params)
  const payload = decryptAes(key, encrypted)
  return payload
}


// returns bool on success or fail
// TODO make sure to catch any exceptions at calls of this
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

//;(async () => {
//  //let x = await encryptMnemonicSeed('test', 'ffff')
//  //console.log(x)
//  //console.log(bs58check.decode(x))
//  //console.log(cbor.decode(bs58check.decode(x)))
//  //
//  //
//  //let z = []
//  //saveEncryptSeedFromMnemonic('test', 'ayy yoo')
//  console.log(await saveEncryptSeed('testing', 'yolo!!!'))
//  alert('done')
//  //let x = await loadDecryptSeed('testing')
//  //console.log(x)
//  //alert(x.toString('ascii'))
//})()
