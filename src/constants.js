// TODO consider recovery/sync as terminology?
// internally we'll refer to it as mnemonic
// we capitalize terms, as it's easier to use lowercase() it than vice versa
export const appTerm = 'SrsPass'

export const mnemonicTerm = 'Backup Phrase'
export const mnemonicHtml = `<strong>${mnemonicTerm.toLowerCase()}</strong>`
export const verifySuccess = `Verification complete! Make sure to keep your ${mnemonicTerm} stored for future use.`

export const passTerm = 'Unlock Password'
export const passHtml = `<strong>${passTerm.toLowerCase()}</strong>`

export const childPassTerm = 'Srs Password'
export const childPassHtml = `<strong>${childPassTerm.toLowerCase()}</strong>`
export const childPassesTerm = `${childPassTerm}s`
export const childPassesHtml = `<strong>${childPassTerm.toLowerCase()}</strong>`

export const aesAlgo = 'aes-256-gcm'

export const tipChildPass = 'This contains the child password to use as the password for the above login/uri combo. ' +
  `It is generated using your credentials from the setup step and is reproducible on other devices with those same parameters.`
// export const tipChildPass = 'This contains the child password you should enter as the password for the above login/uri combo. ' +
//   `It is derived by mashing your memory-hard hashes of your ${mnemonicTerm} and ${passTerm} with the login/uri combo and options ` +
//   `through another round of the argon2id KDF, to receive the desired set of cryptographically random bytes to derive a deterministic ` +
//   `yet random password`
export const tipLogin = 'Enter the login details here. Using either your "e-mail" or "username", or better yet, both in the form of "e-mail/username" is recommended'
export const tipUri = 'Enter the URI (Uniform Resource Identifier) of the resource you are looking to create a password for. This will usually be a domain name, in the form of "domain.com"'
export const tipIndex = `You would increment the index by 1, any time you may need to update the ${childPassTerm} for a site, either due to ` +
  `a site requiring periodic password updates or it being compromised. By incrementing, a completely different password will be generated.`
export const tipPassLen = `Request a specific character length for your ${childPassTerm}, to suit your needs or conform to peculiar website requirements`
