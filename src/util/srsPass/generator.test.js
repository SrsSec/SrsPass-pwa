import deriveSrsPass from './generator'
import { readFileSync } from 'fs'
import * as R from 'ramda'
import { charsetDict } from './charsetter'
import { deriveMnemonicSeed, deriveGeneratorPassword } from '../crypto/kdf'


jest.mock("@worker/argon2id.worker.js")
jest.setTimeout(2000);

const memDMS = R.memoizeWith(R.identity, x => deriveMnemonicSeed(x))
const memDGP = R.memoizeWith(R.identity, x => deriveGeneratorPassword(x))
const allPrintableUTF8 = readFileSync('tests/unit/misc/utf8_sequence_0-0xffff_assigned_printable_unseparated.txt')

describe('deriveSrsPass consistency tests', () => {

  // argon2id heavy generator seed of following ascii
  // pass
  const pass = Buffer.from('bef5d2ffb8325cc1c729161541c71c9ef05d5297432b4cf48b25cd87779e3fec', 'hex')
  // argon2id heavy backup seed of following BIP39 words
  // frozen situate repair gravity throw consider rude symbol wood orphan chronic image
    , salt = Buffer.from('6451a2e3e66f13a7a5c0ea7758e5f8c84ce81edcd9bc42c8e6669f3aefb19086', 'hex')
    , index = 0
    , srsPassLen = 20
    , childPassFormat = '*'
    , uri = 'myspace.com'
    , login = 'user@email.com/username'

  describe('case 1 - test varying indices', () => {
    it.concurrent.each([
      0
      , 1
      , 2
      , 5
      , 9
      , 10
      , 11
      , 100
      , 11111
      , 65536
      , 4294967296
      , Number.MAX_SAFE_INTEGER
    ])('should compute expected srsPass for index %i', async _index => {
      const srsPassOutput = await deriveSrsPass(
        pass,
        salt,
        _index,
        uri,
        login,
        srsPassLen,
        childPassFormat
      )
      expect(srsPassOutput)
        .toMatchSnapshot()
    })
  })

  describe('case 2 - test varying URIs', () => {
    it.concurrent.each([
      ''
      , ' '
      , '0'
      , 'a'
      , 'A'
      , '!'
      , ' 0aA!'
      , 'eff'
      , 'eff.org'
      , 'www.eff.org'
      , 'https://www.eff.org'
      , 'example:<anything>'
      , 'irc://<host>[:<port>]/[<channel>'
      , 'wikipedia.org'
      , 'pneumonoultramicroscopicsilicovolcanoconiosis.notasite'
      , 'https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC:%EB%8C%80%EB%AC%B8'
      , 'https://ko.wikipedia.org/wiki/위키백과:대문'
      , 'http://президент.рф'
      , '內建多媒體樂器音訊合成音樂軌道結合立體聽覺合成介面之電子樂器裝置附加內建小型音訊立體聲高級播放器之頭戴式聆聽裝置.中文网'
      , allPrintableUTF8
    ])('should compute expected srsPass for uri #%#', async _uri => {
      const srsPassOutput = await deriveSrsPass(
        pass,
        salt,
        index,
        _uri,
        login,
        srsPassLen,
        childPassFormat
      )
      expect(srsPassOutput)
        .toMatchSnapshot()
    })
  })

  describe('case 3 - test varying logins', () => {
    it.concurrent.each([
      ''
      , ' '
      , '0'
      , 'a'
      , 'A'
      , '!'
      , ' 0aA!'
      , 'user'
      , 'username'
      , 'username@usersite.com'
      , 'someone@eff.org'
      , 'pneumonoultramicroscopicsilicovolcanoconiosis@notanemail.com'
      , 'https://ko.wikipedia.org/wiki/%EC%9C%84%ED%82%A4%EB%B0%B1%EA%B3%BC:%EB%8C%80%EB%AC%B8'
      , 'https://ko.wikipedia.org/wiki/위키백과:대문'
      , 'http://президент.рф'
      , '內建多媒體樂器音訊合成音樂軌道結合立體聽覺合成介面之電子樂器裝置附加內建小型音訊立體聲高級播放器之頭戴式聆聽裝置.中文网'
      , allPrintableUTF8
    ])('should compute expected srsPass for login #%#', async _login => {
      const srsPassOutput = await deriveSrsPass(
        pass,
        salt,
        index,
        uri,
        _login,
        srsPassLen,
        childPassFormat
      )
      expect(srsPassOutput)
        .toMatchSnapshot()
    })
  })

  describe('case 4 - test varying srsPass lengths', () => {
    it.concurrent.each([
      1
      , 2
      , 3
      , 4
      , 5
      , 5
      , 9
      , 10
      , 11
      , 16
      , 20
      , 23
      , 30
      , 32
      , 64
      , 100
      , 128
      , 11111
      , 65536
      //, (4294967296 - 1)/1000 | 0 // this is ~ current max, some issue in argon2-browser stops larger from working, however, this takes several minutes to run... so disabling and would take stupid amount of disk space
      //, (4294967296 - 1)/8 | 0 // this is max, 2**32 / 8, div8 since we amp the output for our compression and charset transform
      // FIXME expcted max doesnt work, report/investigate argon2-browser
    ])('should compute expected srsPass for length %i', async _srsPassLen => {
      const srsPassOutput = await deriveSrsPass(
        pass,
        salt,
        index,
        uri,
        login,
        _srsPassLen,
        childPassFormat
      )
      expect(srsPassOutput)
        .toMatchSnapshot()
    })
  })

  // TODO expand similar tests elsewhere, testing whether all output are
  // numbers/values under specific keys, at specific locations
  describe('case 5 - test varying srsPass formats', () => {
    it.concurrent.each([
      '*'
      , '0'
      , 'a'
      , 'A'
      , 'x'
      , '@'
      , '#'
      , 'c'
      , '*0aAx'
      , '*0aA@xc'
      , '00000000000000000000'
      , '000000000000000000000'
      , '0*0a0A0x0@0#00000000'
    ])('should compute expected srsPass for format %s', async _childPassFormat => {
      // FIXME this charset impurity could be an issue... at least with testing, where one test is changing
      // the dict while another is running
      //
      // let's assign over 256 utf8 chars
      charsetDict.c = 'ЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂҃҄҅҆҈҉ҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖ'

      const srsPassOutput = await deriveSrsPass(
        pass,
        salt,
        index,
        uri,
        login,
        srsPassLen,
        _childPassFormat
      )
      expect(srsPassOutput)
        .toMatchSnapshot()
    })
  })

  describe('case 6 - test varying srsPass unlock passwords', () => {
    it.concurrent.each([
      'password'
      , '12345678'
      , '!@#$%^&*'
      , 'p1!a2@s3#s4$w5%o6^r7&d8*'
      , 'шщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂҃҄҅҆҈҉'
      , '0'.repeat(100)
      , '0'.repeat(1 << 16) // max SHOULD be 1<<32 -1, but js limits the memory size in varying runtimes, also too long is slow to test...
    ])('should compute expected srsPass for password #%#', async _plainPass => {
      const srsPassOutput = await deriveSrsPass(
        await memDGP(_plainPass),
        salt,
        index,
        uri,
        login,
        srsPassLen,
        childPassFormat
      )
      expect(srsPassOutput)
        .toMatchSnapshot()
    })
  })

  describe('case 7 - test varying srsPass backup phrases', () => {
    it.concurrent.each([
      'abandon '.repeat(11) + 'about'
      , 'abandon '.repeat(23) + 'art'
      , 'zoo '.repeat(23) + 'vote'
      , 'like subway unhappy minimum dinosaur sunset region kingdom rate civil pupil people'
      , 'そむりえ　へいおん　もうしあげる　だむる　くみたてる　へいねつ　にんち　せんねん　にっすう　がいらい　なまいき　てんかい'
      , '斜 绒 燕 尚 液 蓄 届 杆 幕 积 滤 援'
      , '斜 絨 燕 尚 液 蓄 屆 桿 幕 積 濾 援'
    ])('should compute expected srsPass for salt #%#', async _mnemonic => {
      const srsPassOutput = await deriveSrsPass(
        pass,
        await memDMS(_mnemonic),
        index,
        uri,
        login,
        srsPassLen,
        childPassFormat
      )
      expect(srsPassOutput)
        .toMatchSnapshot()
    })
  })

  describe('case 8 - test varying param combos', () => {
    it.each([
      [
        'p1!a2@s3#s4$w5%o6^r7&d8*'
        , 'like subway unhappy minimum dinosaur sunset region kingdom rate civil pupil people'
        , 1 << 16
        , 'https://www.eff.org'
        , 'someone@eff.org'
        , 64
        , '*0aAx'
      ], [
        'шщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂҃҄҅҆҈҉'
        , 'zoo '.repeat(23) + 'vote'
        , Number.MAX_SAFE_INTEGER
        , 'https://ko.wikipedia.org/wiki/위키백과:대문'
        , '內建多媒體樂器音訊合成音樂軌道結合立體聽覺合成介面之電子樂器裝置附加內建小型音訊立體聲高級播放器之頭戴式聆聽裝置.中文网'
        , 1 << 16
        , '*0aA@xc'
      ]

    ])('should compute expected srsPass for combo #%#', async (
      _plainPass
      , _mnemonic
      , _index
      , _uri
      , _login
      , _srsPassLen
      , _childPassFormat
    ) => {

      charsetDict.c = 'ЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюяѐёђѓєѕіїјљњћќѝўџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿҀҁ҂҃҄҅҆҈҉ҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟӠӡӢӣӤӥӦӧӨөӪӫӬӭӮӯӰӱӲӳӴӵӶӷӸӹԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖ'

      const srsPassOutput = await deriveSrsPass(
        await memDGP(_plainPass),
        await memDMS(_mnemonic),
        _index,
        _uri,
        _login,
        _srsPassLen,
        _childPassFormat
      )
      expect(srsPassOutput)
        .toMatchSnapshot()
    })
  })

})
