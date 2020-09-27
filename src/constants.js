// TODO consider recovery/sync as terminology?
// internally we'll refer to it as mnemonic
export const mnemonicTerm = 'backup phrase'
export const mnemonicHtml = `<strong>${mnemonicTerm}</strong>`

export const someMsg = `Testing 1234`

export const popUpWelcome = {
  title: 'Welcome!'
  , message : `This seems to be your first visit.
      Let's begin with a quick setup to get you going...
      <br/>
      <br/>
      In the next step, we'll generate your <strong>seed phrase</strong>
      <br/>
      <br/>
      You must make a backup of it on paper or your phone, it will consist of 12-words
      that will be used to secure your password generation, which you'll need if you
      need to perform an offline recovery of your passwords at some point.
      <br/>
      <br/>
      <i>This phrase doubles as a crypto wallet mnemonic, as it's bip39. In fact, if you like
      you may import your own phrase, which we'll prompt you for!</i>
  `
}
export const popUpWelcome2 = {
  title: 'Welcome!'
  , message : `This seems to be your first visit.
      Let's begin with a quick setup to get you going...
      <br/>
      <br/>
      In the next step, we'll generate your <strong>seed phrase</strong>. 
      <br/>
      <br/>
      This will basically serve as your account identifier, save it and keept it secure. In the next steps we will save it to your current browser's storage.
      <br/>
      <br/>
      You must make a backup of it on paper or your phone, it will consist of 12-words
      that will be used to secure your password generation, which you'll need if you
      need to perform an offline recovery of your passwords at some point or wish to sync
      your passwords on another device.
      <br/>
      <br/>
      <i>This phrase doubles as a crypto wallet mnemonic, as it's bip39. In fact, if you like
      you may import your own phrase, which we'll prompt you for!</i>
      TODO add docu link giving more details.
  `
}
