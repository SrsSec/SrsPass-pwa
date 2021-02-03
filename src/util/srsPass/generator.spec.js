// for fast lazy global import
import deriveSrsPass from './generator'

jest.mock("@worker/argon2id.worker.js")
jest.setTimeout(2000);

describe('async deriveSrsPass(pass, salt, index, uri, login, srsPassLen, childPassFormat)', () => {

  // argon2id heavy generator seed of following ascii
  // pass
  const pass = Buffer.from('bef5d2ffb8325cc1c729161541c71c9ef05d5297432b4cf48b25cd87779e3fec', 'hex')
  // argon2id heavy backup seed of following BIP39 words
  // frozen situate repair gravity throw consider rude symbol wood orphan chronic image
    , salt = Buffer.from('6451a2e3e66f13a7a5c0ea7758e5f8c84ce81edcd9bc42c8e6669f3aefb19086', 'hex')
    , index = 0
    , srsPassLen = 20
    , childPassFormat = '*'

  describe('case 1 - sane default params', () => {

    const uri = 'myspace.com'
      , login = 'user@email.com/username'

    it('should compute expected srsPass', async() => {
      const srsPassOutput = await deriveSrsPass(
        pass,
        salt,
        index,
        uri,
        login,
        srsPassLen,
        childPassFormat
      )
      expect(srsPassOutput)
        .toBe('U5WfN$kddPt_K(r"^yN[')
    })
  })
  // this case MAY become invalid, but being used atm, since it
  // was heavily relied upon in manual spec testing
  // where uri/login are just left empty and generate is hit
  describe('case 2 - quick generate, skip params', () => {

    const uri = ''
      , login = ''

    it('should compute expected srsPass', async() => {
      const srsPassOutput = await deriveSrsPass(
        pass,
        salt,
        index,
        uri,
        login,
        srsPassLen,
        childPassFormat
      )
      expect(srsPassOutput)
        .toBe('$8PqXmBY*X5NkVizg,VL')
    })
  })
})
