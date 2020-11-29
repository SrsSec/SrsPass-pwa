import argon2 from 'argon2-browser'
// https://crypto.stackexchange.com/questions/48935/why-use-argon2i-or-argon2d-if-argon2id-exists
// rules for minimum time/passes, should aim for 25 in general it seems to be safe
// or could add algorithmic checks and pass/safe/unsafe param?
// by using time + binary mem log > 26 on argon2id we should achieve a 1.16 time-area factor
// safePassCalc is based off this

const safeTimeCalc = mem =>
  Math.max(27 - Math.ceil(Math.log(mem)/Math.log(2)), 1)

async function argon2id({ pass, params }) {
  try {
    const { salt } = params
    const mem = params.mem || (1 << 16)
    const res = await argon2.hash({
      pass
      , salt
      , mem
      , time: params.time || safeTimeCalc
      , type: argon2.ArgonType.Argon2id
      , hashLen: params.hashLen || 32
    })
    return {
      res,
      params
    }
  } catch(error) {
    return { error }
  }
}

onmessage = async ({ data }) => {
  // TODO: non destructured param may have useful props to inspect for security
  postMessage(await argon2id(data))
}
