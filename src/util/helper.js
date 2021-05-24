import { storageKeys } from '@util/crypto/encryption'

export const needsSetup = () => {
  // TODO should check if it is a proper formatted encrypted blob
  return !localStorage.getItem(storageKeys.mnemonicSeed)
}

export const needsPostVerify = () => {
  return localStorage.getItem(storageKeys.mnemonicPlain)
}

// they call em features, but seem more like bugs
// would be nice to be able to limit to subset of DOM
export const disableAnnoyingMobileInputBugs = (tags = ['TEXTAREA', 'INPUT']) => {
  // let's be nice and interpret non-array input into an array
  if (!Array.isArray(tags)) tags = [tags]
  // done this way to convert from html collection and allow flatmap to work
  const els = tags.flatMap(x => [...document.getElementsByTagName(x)])
  els.forEach(x => {
    x.setAttribute('autocapitalize', 'none')
    x.setAttribute('autocorrect', 'off')
  })
}
