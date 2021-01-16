const { includes } = require('ramda')
const path = require('path');
const { IgnorePlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const githash = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim()

const WorkboxServiceWorker = new WorkboxPlugin.GenerateSW({
  //include: [path.resolve(__dirname, 'public')],
  include: [],
  additionalManifestEntries: [
    // consider precaching this when stable
    //'/',
    {
      url: '/argon2id.worker.js',
      // TODO update this with a real subhash or rev number, should stay pretty static though
      revision: '13337',
    },
  ],
  runtimeCaching: [
    {
      urlPattern: /\.png$/,
      handler: 'CacheFirst',
    },
    {
      urlPattern: '/index.html',
      handler: 'CacheFirst',
    },
    {
      urlPattern: '/',
      handler: 'CacheFirst',
    },
    {
      urlPattern: '/bundle.js',
      handler: 'StaleWhileRevalidate',
    },
    {
      urlPattern: /\.css$/,
      handler: 'StaleWhileRevalidate',
    },
    {
      urlPattern: /\.js$/,
      handler: 'StaleWhileRevalidate',
    },
  ],
  maximumFileSizeToCacheInBytes: 5000000,
  // these options encourage the ServiceWorkers to get in there fast
  // and not allow any straggling "old" SWs to hang around
  clientsClaim: true,
  skipWaiting: true,
})


module.exports = {
  node: {
    fs: 'empty'
  },
  entry: {
    bundle: ['./src/main.js']
  },
  resolve: {
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
      '@': path.resolve(__dirname, 'src'),
      '@root': path.resolve(__dirname, ''),
      '@public': path.resolve(__dirname, 'src/public'),
      '@component': path.resolve(__dirname, 'src/component'),
      '@modal': path.resolve(__dirname, 'src/modal'),
      '@worker': path.resolve(__dirname, 'src/worker'),
      '@util': path.resolve(__dirname, 'src/util'),
      '@store': path.resolve(__dirname, 'src/store')
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    noParse: /\.wasm$/,
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
            onwarn: (warning, handleWarning) => {
              const ignored = [
                'autofocus'
              ]

              const warnMsg = warning.code.replace('a11y-', '')
              if (includes(warnMsg, ignored))
                return

              handleWarning(warning)
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.wasm$/,
        // Tells WebPack that this module should be included as
        // base64-encoded binary file and not as code
        loaders: ['base64-loader'],
        // Disables WebPack's opinion where WebAssembly should be,
        // makes it think that it's not WebAssembly
        //
        // Error: WebAssembly module is included in initial chunk.
        type: 'javascript/auto'
      },
      {
        include: /public\//,
        test: /\.webmanifest$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/public/index.html',
      favicon: 'src/public/favicon.png',
      files: {
        manifest: 'src/public/manifest.webmanifest',
        css: 'src/public/global.css',
      }
    }),
    new IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
    ...(prod ? [WorkboxServiceWorker] : []),
    new DefinePlugin({
      'process.env.GIT_HASH': JSON.stringify(githash),
    })
  ],
  devtool: prod ? false : 'source-map'
};
