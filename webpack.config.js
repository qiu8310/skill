const path = require('path')
const webpack = require('webpack')
const fs = require('fs-extra')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')

const conf = require('./conf')
const env = conf.env

const PRODUCT = env.PRODUCT

const ROOT_DIR = path.resolve(__dirname)
const SRC_DIR = path.join(ROOT_DIR, 'src')
const DIST_DIR = path.join(ROOT_DIR, 'dist', 'public')
const ENTRIES_DIR = path.join(SRC_DIR, '_')
const SCSS_CONFIG_FILE = path.join(SRC_DIR, 'styles', PRODUCT + '-config.json')
const DEFAULT_SCSS_CONFIG_JSON = path.join(SRC_DIR, 'styles', 'default-config.json')

// if (env.BUILD) { fs.ensureDirSync(DIST_DIR); fs.emptyDirSync(DIST_DIR) }
outputEnv(env)

const cssnanoOptions = { // http://cssnano.co/optimisations/
  autoprefixer: {
    browsers: ['last 10 version', 'ie >= 10'], // https://github.com/ai/browserslist#queries
    remove: false,
    add: true
  },
  discardDuplicates: false // 有时为了兼容，会写两个不同版本的样式
}
const getNormalCssLoader = (importLoaders) => ({loader: 'css-loader', options: { importLoaders, minimize: cssnanoOptions }})
// postcss 和 cssmodule 一起使用时要注意： https://github.com/postcss/postcss-loader#css-modules
const postcssLoader = {loader: 'postcss-loader'}
const normalSassLoader = {loader: 'sass-loader', options: {includePaths: ['node_modules', SRC_DIR]}}

const styleConfigFile = fs.existsSync(SCSS_CONFIG_FILE) ? SCSS_CONFIG_FILE : DEFAULT_SCSS_CONFIG_JSON
const jsonToSassLoader = {loader: require.resolve('./plugin/jsontosass/index'), options: {path: styleConfigFile}}
module.exports = {
  devtool: env.DEV ? 'eval' : 'source-map', // eval: Fastest at the expense of detail
  // devtool: 'source-map',
  target: 'web',
  entry: {
    [`${PRODUCT}-common`]: path.join(ENTRIES_DIR, PRODUCT + '-common.tsx'),
    [PRODUCT]: path.join(ENTRIES_DIR, PRODUCT + '.tsx')
  },
  output: {
    path: DIST_DIR,
    publicPath: env.BUILD ? '' : `http://${env.HOST}:${env.PORT}/`,
    filename: `${getAssetName('js')}`,
    chunkFilename: '[name]-[id].js'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [SRC_DIR, 'node_modules'],
    alias: {
      // antd$: path.resolve(ROOT_DIR, 'node_modules', 'antd', 'dist', 'antd.min.js')
    }
  },

  plugins: [
    new webpack.DefinePlugin(Object.keys(env).reduce((res, k) => {
      res['__' + k + '__'] = JSON.stringify(env[k])
      return res
    }, {
      SCSS_CONFIG_FILE: JSON.stringify(styleConfigFile),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || env.ENV)
      }
    })),

    ...getConditionalPlugins(env.DEV, () => {
      return [
        new StyleLintPlugin({
          emitErrors: false,
          files: ['src/**/*.s?(a|c)ss']
        }),
        new webpack.NamedModulesPlugin()
      ]
    }),
    new CopyWebpackPlugin([
      {from: path.join(ROOT_DIR, 'public'), to: './'}
    ]),
    new ExtractTextPlugin({
      filename: `${getAssetName('css')}`,
      disable: !env.BUILD
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: PRODUCT + '-common',
      minChunks: Infinity
      // minChunks: (mod, count) => {
      //   console.log(mod.mapChunks(c => c.name).join(' '))
      //   return true
      // }
    }),
    new HtmlWebpackPlugin({
      env,
      inject: true,
      template: path.join(ENTRIES_DIR, PRODUCT + '.ejs'),
      filename: PRODUCT + '.html',
      minify: {
        minifyJS: env.BUILD,
        minifyCSS: env.BUILD,
        removeComments: true,
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true
      }
    })
  ],

  module: {
    rules: [
      // {test: /\.tsx?$/, loader: 'ts-loader', options: {
      //   transpileOnly: true, // 会失去很多语法检查功能，但要用 getCustomTransformers 必须设置此值
      //   getCustomTransformers: () => ({
      //     before: [require('ts-import-plugin')({libraryName: 'antd', style: false})]
      //   })
      // }},

      {test: /\.tsx?$/, use: [
        'awesome-typescript-loader',
        {
          loader: require.resolve('mora-common/helper/index-loader'),
          options: {
            modules: [
              // {debug: true, name: 'widget', root: path.join(SRC_DIR, 'widget'), realtimeParse: true},
              {debug: false, name: 'mora-common', realtimeParse: true},
              {debug: true, name: 'mora-scripts'},
              {debug: false, name: 'antd'}
            ]
          }
        }
      ]},

      // {test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: [getNormalCssLoader(1), postcssLoader]})}, // normal
      // {test: /\.s(c|a)ss$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: [getNormalCssLoader(2), postcssLoader, normalSassLoader]})}, // normal
      {test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: [getNormalCssLoader(1), postcssLoader]})}, // normal
      {test: /\.s(c|a)ss$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: [getNormalCssLoader(3), postcssLoader, normalSassLoader, jsonToSassLoader]})}, // normal

      {test: /\.(gif|png|jpg|jpeg|svg)$/, use: `url-loader?limit=800&name=${PRODUCT}-static/[hash].[ext]`},
      {test: /\.(ico|woff|woff2|ttf|eot|otf)$/, use: `file-loader?name=${PRODUCT}-static/[hash].[ext]`}
    ]
  },

  stats: 'minimal',
  devServer: {
    contentBase: path.join(ROOT_DIR, 'public'),
    stats: 'minimal',
    port: env.PORT,
    host: env.HOST,
    proxy: {
      '/admin/': 'http://120.132.18.132',
      '/api/': 'http://120.132.18.132'
      // '/admin/': 'http://192.168.133.145:9090',
      // '/api/': 'http://192.168.133.145:9090'
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/' + PRODUCT + '.html' }
      ]
    }
  }
}

function getAssetName(type) {
  return (process.env.HASH ? (type === 'css' ? '[contenthash:16]' : '[chunkhash:16]') : '[name]') + '.' + type
}

function outputEnv(env) {
  if (process.env.JSON) return
  let KEYS = Object.keys(env)
  let MAX_LENGTH = Math.max(...KEYS.map(k => k.length)) + 2

  console.log('\r\n\x1b[36m==================== 环境变量 ======================\x1b[0m')
  Object.keys(env).forEach(k => {
    let color = env[k] === true ? '\x1b[35m' : ''
    let len = k.length
    let prefix = len < MAX_LENGTH ? ' '.repeat(MAX_LENGTH - k.length) : ''
    console.log('%s%s: %j\x1b[0m', color, prefix + k, env[k])
  })
  console.log('\x1b[36m===================================================\x1b[0m\r\n')
}

function getConditionalPlugins(condition, fn) {
  return [].concat(condition ? fn() : [])
}
