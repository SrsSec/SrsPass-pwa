import argon2 from 'argon2-browser'

async function genPass({ pass, salt }) {
  try {
    const res = await argon2.hash({
      pass
      , salt
      , time: 3
      , mem: 1 << 16 - 1
      , type: argon2.ArgonType.Argon2id
    })
    return res.hashHex
  } catch(error) {
    return { error }
  }
}

onmessage = async ({data}) => {
  postMessage(await genPass(data))
}
