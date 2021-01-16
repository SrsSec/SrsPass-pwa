import argon2id from '@util/argon2id'

onmessage = async ({ data }) => {
  // TODO: non destructured param may have useful props to inspect for security
  postMessage(await argon2id(data))
}
