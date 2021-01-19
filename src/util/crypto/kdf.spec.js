import { readFile } from 'fs/promises'

// for fast lazy global import
import * as exports from './kdf'
if (typeof window !== 'undefined') {
  Object.entries(exports).forEach(([name, exported]) => window[name] = exported);
} else {
  Object.entries(exports).forEach(([name, exported]) => global[name] = exported);
}

jest.mock("@worker/argon2id.worker.js")
jest.setTimeout(10000);

// helpers
const hexToBytes = str => Uint8Array.from(Buffer.from(str, 'hex'))

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


describe('getArgon2Hash(pass, salt, { time, mem, hashLen })', () => {
  // https://github.com/D-Nice/argon2_bind/blob/master/tests/fixtures/from_c.nim#L332
  describe('Reference C Fixtures for Argon2id V0x13', () => {

    describe('case 1', () => {
      const pass = 'password'
        , salt = 'somesalt'
        , opt = { time: 2 }
      const expectedHashHex = '09316115d5cf24ed5a15a31a3ba326e5cf32edc24702987c02b6566f61913cf7'
        , expectedHash = hexToBytes(expectedHashHex)

      it('should compute expected argon2 hash', async() => {
        const hash = await getArgon2Hash(pass, salt, opt)
        expect(hash)
          .toStrictEqual(expectedHash)
      })
    })
  })
})

describe('deriveGeneratorPassword(pass)', () => {
  describe('SrsPass generator v0', () => {
    let case1Hash
    describe('case 1 - low ascii', () => {
      const pass = 'password'
      const expectedHash = new Uint8Array([85, 69, 133, 46, 51, 191, 144, 125, 40, 255, 28, 248, 91, 12, 10, 195, 200, 209, 246, 211, 198, 10, 150, 42, 118, 67, 40, 162, 222, 157, 113, 119])

      it('should derive expected hashed password', async() => {
        const hash = await deriveGeneratorPassword(pass)
        case1Hash = hash
        expect(hash)
          .toStrictEqual(expectedHash)
      })
    })

    describe('case 2 - low ascii different', () => {
      const pass = 'differentpassword'
      const expectedHash = new Uint8Array([64, 59, 218, 106, 154, 221, 112, 163, 127, 191, 229, 57, 222, 242, 144, 136, 139, 69, 127, 192, 83, 87, 196, 90, 15, 14, 49, 10, 8, 108, 221, 193])
      let hash

      it('should derive expected hashed password', async() => {
        hash = await deriveGeneratorPassword(pass)
        expect(hash)
          .toStrictEqual(expectedHash)
      })
      it('should differ from case1', async() => {
        expect(hash)
          .not.toStrictEqual(case1Hash)
      })
    })

    describe('case 3 - spaced low ascii', () => {
      const pass = 'different password'
      const expectedHash = new Uint8Array([225, 135, 168, 134, 247, 146, 85, 252, 15, 171, 198, 124, 20, 164, 59, 183, 111, 251, 87, 225, 128, 18, 136, 100, 156, 217, 36, 85, 17, 151, 205, 254])

      it('should derive expected hashed password', async() => {
        const hash = await deriveGeneratorPassword(pass)
        expect(hash)
          .toStrictEqual(expectedHash)
      })
    })

    describe('case 4 - spaced low + upp ascii', () => {
      const pass = 'DIFFerent passWORD'
      const expectedHash = new Uint8Array([27, 130, 208, 193, 100, 7, 154, 229, 166, 87, 86, 136, 253, 172, 224, 19, 127, 233, 102, 67, 184, 78, 233, 247, 128, 180, 72, 236, 202, 236, 106, 155])

      it('should derive expected hashed password', async() => {
        const hash = await deriveGeneratorPassword(pass)
        expect(hash)
          .toStrictEqual(expectedHash)
      })
    })

    describe('case 5 - full printable ascii', () => {
      // var s = ''
      // for (var i = 32; i <= 127; i++) s += String.fromCharCode(i)
      const pass = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
      const expectedHash = new Uint8Array([255, 76, 34, 17, 210, 153, 84, 116, 74, 153, 217, 224, 161, 175, 91, 201, 247, 1, 129, 229, 172, 134, 139, 218, 64, 238, 107, 22, 132, 190, 107, 3])

      it('should derive expected hashed password', async() => {
        const hash = await deriveGeneratorPassword(pass)
        expect(hash)
          .toStrictEqual(expectedHash)
      })
    })

    describe('case 6 - full printable utf8', () => {
      // https://github.com/bits/UTF-8-Unicode-Test-Documents/blob/master/UTF-8_sequence_separated/utf8_sequence_0-0xffff_assigned_printable.txt
      let pass
      const expectedHash = new Uint8Array([125, 214, 148, 79, 140, 109, 12, 20, 36, 73, 59, 140, 182, 29, 241, 161, 128, 47, 45, 197, 79, 247, 180, 92, 181, 142, 234, 81, 64, 234, 65, 5])

      it('should derive expected hashed password', async() => {
        pass = await readFile('tests/unit/misc/utf8_sequence_0-0xffff_assigned_printable.txt')
        const hash = await deriveGeneratorPassword(pass)
        expect(hash)
          .toStrictEqual(expectedHash)
      })
    })
  })
})
