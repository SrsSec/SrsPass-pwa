const { includes } = require('ramda')
const path = require('path');
const { IgnorePlugin, DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

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
      // Will be using commit hash that necessitated rev update
      revision: '0e3080f68de94ade475ab73ef9e0ce8687625110',
    },
  ],
  runtimeCaching: [
    {
      urlPattern: /\.png$/,
      handler: 'CacheFirst',
    },
    {
      urlPattern: '/',
      handler: 'StaleWhileRevalidate',
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
        test: /\.m?js$/,
        include: /src/,
        use: ['babel-loader'],
      },
      {
        test: /\.svelte$/,
        include: /src/,
        use: ['babel-loader', {
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
        }]
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
        loader: "worker-loader",
        options: {
          filename: "[name].js",
        },
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
      },
      scriptLoading: 'defer'
    }),
    new IgnorePlugin(/^\.\/wordlists\/(?!english)/, /bip39\/src$/),
    ...(prod ? [WorkboxServiceWorker] : []),
    new DefinePlugin({
      'process.env.GIT_HASH': JSON.stringify(githash),
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.75
    }),
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.75,
      filename: '[path][base].br',
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
    }),
  ],
  devtool: prod ? false : 'eval-source-map',
  optimization: !prod ? {} : {
    splitChunks: {
      chunks: 'all',
      maxSize: 400000,
      minSize: 300000,
    },
    runtimeChunk: true,
    usedExports: true,
    mangleWasmImports: true,
    sideEffects: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          ecma: 2020
          , output: {
            comments: false
          }
        }
      })
    ]
  },
};
