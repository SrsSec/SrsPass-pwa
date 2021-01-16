//import {
//  argon2
//  , a2params
//} from './crypto'

// for fast lazy global import
import * as exports from './crypto'
if (typeof window !== 'undefined') {
  Object.entries(exports).forEach(([name, exported]) => window[name] = exported);
} else {
  Object.entries(exports).forEach(([name, exported]) => global[name] = exported);
}
console.log(exports)
jest.mock("@worker/argon2id.worker.js")
jest.setTimeout(20000);

describe('a2params', () => {
  describe('heavy', () => {
    it('time should be 12', () => {
      const { time } = a2params.heavy
      expect(time).toBe(12)
    })
    it('mem should be 32KiB', () => {
      const { mem } = a2params.heavy
      expect(mem).toBe(32768)
    })
    it('mem should be 1 << 15', () => {
      const { mem } = a2params.heavy
      expect(mem).toBe(1 << 15)
    })
  })
  describe('light', () => {
    it('time should be 16', () => {
      const { time } = a2params.light
      expect(time).toBe(16)
    })
    it('mem should be 4KiB', () => {
      const { mem } = a2params.light
      expect(mem).toBe(4096)
    })
    it('mem should be 1 << 12', () => {
      const { mem } = a2params.light
      expect(mem).toBe(1 << 12)
    })
  })
})

describe('argon2(pass, salt, { time, mem, hashLen })', () => {
  const hexToBytes = str => Uint8Array.from(Buffer.from(str, 'hex'))

  // https://github.com/D-Nice/argon2_bind/blob/master/tests/fixtures/from_c.nim#L332
  describe('Reference C Fixtures for Argon2id V0x13', () => {

    describe('case 1', () => {
      const pass = 'password'
        , salt = 'somesalt'
        , opt = { time: 2 }
      const expectedHashHex = '09316115d5cf24ed5a15a31a3ba326e5cf32edc24702987c02b6566f61913cf7'
        , expectedEncoded = '$argon2id$v=19$m=65536,t=2,p=1$c29tZXNhbHQ$CTFhFdXPJO1aFaMaO6Mm5c8y7cJHAph8ArZWb2GRPPc'
        , expectedHash = hexToBytes(expectedHashHex)
      let res, params

      it('should compute argon2 without error', async() => {
        const resolved = await argon2(pass, salt, opt)
        ;({ res, params } = resolved)
        expect(resolved)
          .not.toHaveProperty('error')
      })
      it('should match expected C fixtures', () => {
        expect(res.hashHex)
          .toBe(expectedHashHex)
        expect(res.encoded)
          .toBe(expectedEncoded)
      })
      it('should match u8array hash', () => {
        expect(res.hash)
          .toStrictEqual(expectedHash)
      })
      it('should not contain trace of password', () => {
        const stringifiedParams = JSON.stringify(params)
        expect(stringifiedParams)
          .not.toContain(pass)
      })
      it('should return used params', () => {
        expect(params.salt)
          .toBe(salt)
        expect(params.time)
          .toBe(opt.time)
        expect(params.hashLen)
          .toBe(32) // default & fallback
        expect(params.mem)
          .toBe(1 << 16) // default & fallback
      })
    })
  })
})
