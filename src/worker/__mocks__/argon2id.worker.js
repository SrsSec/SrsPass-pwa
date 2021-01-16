import argon2id from '@util/argon2id'

export default class mockedArgon2WebWorker {
  constructor() {
    // onmessage ought to be overwritten where it is used in the code
    this.onmessage = () => { }
    // for now we have this just so we don't get undefined errors when this is called
    this.terminate = () => { }
  }

  async postMessage(data) {
    this.onmessage({ data: await argon2id(data) })
  }
}
