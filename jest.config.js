/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  verbose: true,
  moduleNameMapper: {
    "^@util/(.*)$": "<rootDir>/src/util/$1",
    "^@worker/(.*)$": "<rootDir>/src/worker/$1"
  },
  transform: {
    '^.+\\.js?$': 'babel-jest',
    //"^.+\\.worker.[t|j]sx?$": "workerloader-jest-transformer"
  },
}
