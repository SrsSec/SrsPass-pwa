// TODO consider recovery/sync as terminology?
// internally we'll refer to it as mnemonic
// we capitalize terms, as it's easier to use lowercase() it than vice versa
export const appTerm = 'SrsPass'

export const mnemonicTerm = 'Backup Phrase'
export const mnemonicHtml = `<strong>${mnemonicTerm.toLowerCase()}</strong>`
export const verifySuccess = `Verification complete! Make sure to keep your ${mnemonicTerm} stored for future use.`
export const verifySkip = 'Skipping voids your warranty! It is your responsibility to ensure you have a correct copy of your backup phrase.'

export const passTerm = 'Unlock Password'
export const passHtml = `<strong>${passTerm.toLowerCase()}</strong>`

export const childPassTerm = 'Srs Password'
export const childPassHtml = `<strong>${childPassTerm.toLowerCase()}</strong>`
export const childPassesTerm = `${childPassTerm}s`
export const childPassesHtml = `<strong>${childPassesTerm.toLowerCase()}</strong>`

export const aesAlgo = 'aes-256-gcm'

export const tipChildPass = 'This is the generated password you should use for the above login/uri combo. ' +
  `It derives from your setup credentials and is reproducible on other devices with these same parameters.`
// export const tipChildPass = 'This contains the child password you should enter as the password for the above login/uri combo. ' +
//   `It is derived by mashing your memory-hard hashes of your ${mnemonicTerm} and ${passTerm} with the login/uri combo and options ` +
//   `through another round of the argon2id KDF, to receive the desired set of cryptographically random bytes to derive a deterministic ` +
//   `yet random password`
export const tipLogin = `Enter the login details here. Using either your "e-mail" or "username", or better yet, both in the form of "e-mail/username" is recommended

Note: All inputs are cAsE sensitive!`
export const tipUri = 'Enter the URI (Uniform Resource Identifier) of the resource you are looking to create a password for. In most cases, this can be a website name, in the form of "domainname.com".'
export const tipIndex = `You would increment the index by 1, any time you may need to update the ${childPassTerm} for a site, either due to ` +
  `a site requiring periodic password updates or it being compromised. By incrementing, a completely different password will be generated.`
export const tipPassLen = `Request a specific character length for your ${childPassTerm}, to suit your needs or conform to peculiar website requirements`
export const tipUnlockPass = `This is the password you created at the end of initial setup. It is used to decrypt things like your backup seed and derive your ${childPassTerm}s.`
export const tipCustomAlpha = `Define your own custom alphabet, usable as the 'c' format key in the ${childPassTerm} format input.`
export const tipPassFormat = `Set a specific character output format for this generated ${childPassTerm}. The following built-ins are available, in 'key: value' format
`

export const defaultSetupOption = 'full'

export const menuAboutText = `
An open-source password generator that gives users the ability to statelessly manage their passwords.

This is an installable web app or PWA. Most modern browsers allow you to install it, via a prompt such as "Add to Homescreen" on mobile, or an install icon in the address bar! It is recommended you run it like that for best security!

Made possible by SrsSec

Copyrights Denis Milicevic
Served under AGPLv3
`

export const postVerifyName = 'Backup Phrase'
// TODO make this bold text linked and click leading to docu page explaining backup phrase?
export const postVerifyAlert = `REMINDER: make a copy of your ${mnemonicHtml}! Click <b>${postVerifyName}</b> in the settings menu at the top-right!`

export const decryptMnemonicTextPlaceholder = `${mnemonicTerm} will display here.
Click here to unblur them.
Make sure to save these words!!!`
