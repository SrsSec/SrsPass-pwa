import JSBI from 'jsbi'
import {
  getArgon2Hash
  , a2params
} from '@util/crypto/kdf'

const a2light = a2params.light

const concatBufWithStr = (b, s) =>
  Buffer.concat([b, Buffer.from(s, 'utf8')])

// FIXME: these typed arrays will have a differing byte order depending on system endianness
// aka dont use in production
const toUint64Array = buffer =>
  new BigUint64Array(buffer)

const toUint32Array = buffer =>
  new Uint32Array(buffer)

// we use this instead of native DataView.prototype.getBigUint64
// to work on Apple devices, whose software lacks support
const getUint64JSBI = (view, byteOffset, littleEndian) => {
  const { BigInt } = JSBI,
    LE = !!littleEndian,
    BO = byteOffset|0
  const lo = BigInt(view.getUint32(LE ? BO + 0 : BO + 4, LE))
  const hi = BigInt(view.getUint32(LE ? BO + 4 : BO + 0, LE))
  // let's convert both lo/hi to u64, combine them by applying a 32 bit lshift on hi
  // could prolly do bitwise OR, test
  return JSBI.asUintN(64, JSBI.bitwiseOr(lo, JSBI.leftShift(hi, BigInt(32))))
}

// TODO do some obund checks or workarounds, or ensure that buff will fit nicely, or supplement with 0s at end?
const toUint64ArrayLE = buffer => {
  const view = new DataView(buffer)
  return Array.from(Array(view.byteLength / 8 | 0)).map((_, i) =>
    getUint64JSBI(view, i * 8, true))
}

// this is the original native implementation
// which can be a consideration for returning to if apple support lands
const transformUArrWithFormatToPass = (arr, alArr) =>
  Array.from(Array(arr.length)).map((_,i) => {
    let x = arr[i]
    let idx = Math.min(i, alArr.length - 1)
    let al = alArr[idx]
    return al[x % BigInt(al.length)]
  }).join('')

const transformUArrWithFormatToPassJSBI = (arr, alArr) =>
  Array.from(Array(arr.length)).map((_,i) => {
    const x = arr[i] // BigInt
    const idx = Math.min(i, alArr.length - 1)
    const al = alArr[idx]
    return al[JSBI.remainder(x, JSBI.BigInt(al.length))]
  }).join('')

const childPassFromBuffer64 = ({ buffer }, alphaArray) =>
  transformUArrWithFormatToPassJSBI(toUint64ArrayLE(buffer), alphaArray)

const deriveSrsPass = async (pass, salt, index, uri, login, srsPassLen, alphaArray) => {
  const userParams = (index > 0 ? index : '') + uri + login

  const hash = await getArgon2Hash(
    pass,
    concatBufWithStr(salt, userParams),
    {
      hashLen: srsPassLen*8,
      // FIXME switch to light, or make current test params, prod light
      ...a2light
    }
  )
  return childPassFromBuffer64(hash, alphaArray)
}
export default deriveSrsPass
