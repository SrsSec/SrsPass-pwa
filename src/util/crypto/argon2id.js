import argon2 from 'argon2-browser'
// https://crypto.stackexchange.com/questions/48935/why-use-argon2i-or-argon2d-if-argon2id-exists
// rules for minimum time/passes, should aim for 25 in general it seems to be safe
// or could add algorithmic checks and pass/safe/unsafe param?
// by using time + binary mem log > 26 on argon2id we should achieve a 1.16 time-area factor
// safePassCalc is based off this

export const safeTimeCalc = mem =>
  Math.max(27 - Math.ceil(Math.log(mem)/Math.log(2)), 1)

// argon2id with safe defaults if certain arguments are omitted
// pass and salt are required
const argon2id = async ({ pass, params }) => {
  try {
    // fallbacks
    params.mem = params.mem || (1 << 16)
    params.time = params.time > 1 ? params.time : safeTimeCalc(params.mem)
    params.hashLen = params.hashLen || 32

    const { salt, mem, time, hashLen } = params

    const res = await argon2.hash({
      pass
      , salt
      , mem
      , time
      , type: argon2.ArgonType.Argon2id
      , hashLen
    })

    return {
      res,
      params
    }
  } catch(error) {
    return { error }
  }
}

export default argon2id
