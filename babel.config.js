module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ["> 1%, not dead"]
        },
        modules: false
      },
    ],
  ],
  env: {
    // for jest
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              esmodules: true,
            },
          },
        ],
      ],
    }
  }
}
