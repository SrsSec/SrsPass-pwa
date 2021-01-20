import { readFile } from 'fs/promises'
import bs58check from 'bs58check'
import cbor from 'cbor'
import {
  a2params,
  deriveMnemonicSeed
} from './kdf'

// for fast lazy global import
import * as exports from './encryption'
if (typeof window !== 'undefined') {
  Object.entries(exports).forEach(([name, exported]) => window[name] = exported);
} else {
  Object.entries(exports).forEach(([name, exported]) => global[name] = exported);
}

jest.mock("@worker/argon2id.worker.js")
jest.setTimeout(10000);

describe('storageKeys', () => {
  describe('mnemonicSeed', () => {
    it('should be seedBlob', () => {
      expect(storageKeys.mnemonicSeed).toBe('seedBlob')
    })
  })
})

const pass = 'password'
const mnemonic = 'oyster ridge possible lunar october oyster rich pyramid group purse page crater'

describe('loadDecryptSeed(pass)', () => {
  describe('v1 spec', () => {
    const seedBlob = 'mZUii1UEWuLGCRNCZ3n7PzjkCSuU6Z5VJZFJxdZyQc8t3mfTKe1APryzCJcYM99wGgQ2ZbjXdX5M9ZwcghQXySR2VdBXR2ZqDR4ArFvKycqD6FgTnnKd69m21YWBzNoEtuRkXtWxysignpECHxTnvsRn58GDbHV94tczR19uxmc1FbuC85sHBFfiNAuNfXgyAdq93NzXzRt11x977nSx2'

    describe('decryption', () => {
      let decrypted, spy

      beforeAll(() => {
        localStorage.setItem(storageKeys.mnemonicSeed, seedBlob)
        spy = jest.spyOn(localStorage.__proto__, 'getItem')
      })
      afterAll(() => spy.mockRestore())
      it('should not have called localStorage.getItem yet', async() => {
        expect(spy)
          .not.toHaveBeenCalled()
      })
      it('should decrypt with correct pass and return a 256-bit Buffer', async() => {
        decrypted = await loadDecryptSeed(pass)
        expect(decrypted)
          .toBeInstanceOf(Buffer)
        expect(decrypted)
          .toHaveLength(256/8)
      })
      it('should match derived seed using original backup phrase', async() => {
        const seed = Buffer.from(await deriveMnemonicSeed(mnemonic))
        expect(decrypted)
          .toStrictEqual(seed)
      })
      it('should have called localStorage.getItem once with expected param', async() => {
        expect(spy)
          .toHaveBeenCalledTimes(1)
        expect(spy)
          .toHaveBeenCalledWith(storageKeys.mnemonicSeed)
      })
    })
  })
})

describe('saveEncryptSeedFromMnemonic(pass, mnemonic)', () => {
  let spy

  beforeAll(() => spy = jest.spyOn(localStorage.__proto__, 'setItem'))
  afterAll(() => spy.mockRestore())

  describe('v1 spec', () => {
    describe('pre invocation', () => {

      it('should have empty storage', async() => {
        localStorage.clear()
        expect(localStorage.getItem(storageKeys.mnemonicSeed))
          .toBeNull()
      })
      it('should not have called localStorage.setItem yet', async() => {
        expect(spy)
          .not.toHaveBeenCalled()
      })
    })
    describe('invocation', () => {
      it('should return true after calling the function', async() => {
        const res = await saveEncryptSeedFromMnemonic(pass, mnemonic)
        expect(res)
          .toBe(true)
      })
      it('should have now called localStorage.setItem once', async() => {
        expect(spy)
          .toHaveBeenCalledTimes(1)
      })
      it('should have called localStorage.setItem with expected params', async() => {
        // the encrypted blob is non-deterministic
        // so we can only test for a portion of the prefix here
        expect(spy)
          .toHaveBeenCalledWith(
            storageKeys.mnemonicSeed,
            expect.stringContaining('mZUii1UEWuLGCRNCZ3n')
          )
      })
    })
    describe('storage', () => {
      it('should be retrievable from storage', async() => {
        const iSpy = jest.spyOn(localStorage.__proto__, 'getItem')
        localStorage.getItem(storageKeys.mnemonicSeed)
        expect(iSpy)
          .toReturnWith(
            expect.any(String)
          )
        iSpy.mockRestore()
      })
    })
    describe('encrypted object blob', () => {
      let cborBlob, encryptedObj
      it('should decode base58check string in storage', async() => {
        const loadedBlob = localStorage.getItem(storageKeys.mnemonicSeed)
        cborBlob = bs58check.decode(loadedBlob)
        expect(cborBlob)
          .toBeInstanceOf(Buffer)
      })
      it('should decode further from cbor', async() => {
        encryptedObj = cbor.decode(cborBlob)
        expect(encryptedObj)
          .toBeInstanceOf(Object)
      })
      it('should match expected encrypted object schema', async() => {
        expect(encryptedObj)
          .toMatchObject(
            expect.objectContaining({
              v: 1,
              key: {
                salt: expect.any(Buffer),
                params: a2params.heavy,
              },
              payload: expect.any(Buffer),
              authTag: expect.any(Buffer),
              iv: expect.any(Buffer)
            })
          )
      })
    })
    describe('decryptability', () => {
      let decrypted
      it('should decrypt with correct pass and return a 256-bit Buffer', async() => {
        decrypted = await loadDecryptSeed(pass)
        expect(decrypted)
          .toBeInstanceOf(Buffer)
        expect(decrypted)
          .toHaveLength(256/8)
      })
      it('should match derived seed using original backup phrase', async() => {
        const seed = Buffer.from(await deriveMnemonicSeed(mnemonic))
        expect(decrypted)
          .toStrictEqual(seed)
      })
    })
  })
})
