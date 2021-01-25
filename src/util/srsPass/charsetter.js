import * as R from 'ramda'

export const charsetDict = {
  '0': '123456789', // base58 numbers
  'A': 'ABCDEFGHJKLMNPQRSTUVWXYZ', // base58 uppercase
  'a': 'abcdefghijkmnopqrstuvwxyz', // base58 lowercase
  '@': `!@#$%^&*?`,
  '#': `!@#$%^&*?()-=_+[]{};':",.`,
}

export const dedupeChars = R.pipe(
  R.split(''),
  R.uniq,
  R.join('')
)

charsetDict.x = charsetDict['0'] + charsetDict['A'] + charsetDict['a']
charsetDict['*'] = charsetDict['x'] + charsetDict['#']
charsetDict.c = ''
// run through the dict and dedupe... should probably give warning
// if there are dupes
Object.entries(charsetDict).forEach(([k, v]) => {
  charsetDict[k] = dedupeChars(v)
  if (v !== charsetDict[k]) throw new Error(`charset ${k} has dupe chars... please resolve`)
})

export const charsetDefinitions =
  Object.entries(charsetDict)
  .map(([k,v]) => `${k}: ${v}`)
  .join('\n') + '(custom alphabet)\n\ne.g. aA0a for a 6 length password may create a password that looks like: yM5etu'

export const validatePassFormat = R.pipe(
  R.split(''),
  R.all(
    R.includes(
      R.__,
      R.keys(charsetDict)
    )
  )
)

// TODO consider optimizing this to cut off the duplicates at end
export const deriveAlphaArray = R.pipe(
  R.split(''),
  R.map(
    R.prop(
      R.__,
      charsetDict
    )
  )
)
