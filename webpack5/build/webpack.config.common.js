const { ProvidePlugin } = require('webpack')
// IgnorePlugin
const { VueLoaderPlugin } = require('vue-loader')

const HtmlPlugin = require('html-webpack-plugin')
// const ESLintPlugin = require("eslint-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { DefinePlugin } = require('webpack')

const { resolvePath, getExternals, getCdnConfig, readEnv } = require('./lib/utils.js')

const chalk = require('chalk')
const alias = require('./lib/alias.js')
const baseConfig = readEnv('./.env')
const otherConfig = readEnv(`./.env.${process.env.ENV_NAME}`)
const config = { ...baseConfig, ...otherConfig }
const {
  VUE_APP_umdLibraryName,
  VUE_APP_publicPath
} = config

const { NODE_ENV } = process.env

module.exports = {
  entry: ['./src/main.js'],
  cache: { type: 'filesystem' },
  output: {
    clean: true,
    path: resolvePath('./dist/'),
    // publicPath: NODE_ENV === 'production' ? VUE_APP_publicPath : '//127.0.0.1:8080/',
    // NODE_ENV === 'production' ? VUE_APP_publicPath : '//127.0.0.1:8080/', // 微前端调试用的配置
    publicPath: NODE_ENV === 'production' ? VUE_APP_publicPath : '/',
    assetModuleFilename: 'images/[name]-[contenthash:8][ext]',
    library: {
      name: VUE_APP_umdLibraryName.replace(/"/g, ''),
      type: 'umd'
    }
    // libraryTarget: 'umd',
    // library: VUE_APP_umdLibraryName.replace(/"/g, '')
  },
  resolve: {
    alias,
    extensions: ['.js', '.ts', '.vue'],
    fallback: { path: require.resolve('path-browserify') }
  },
  externals: getExternals(),
  ignoreWarnings: [
    /only default export is available soon/,
    /Do not use v-for index as key on <transition-group> children, this is the same as not using keys/,
    /The new "slot-scope" attribute can also be used on plain elements in addition to <template> to denote scoped slots./
  ],
  // experiments: {
  //   lazyCompilation: true
  // },
  plugins: [
    new DefinePlugin({
      BASE_URL: NODE_ENV === 'production' ? VUE_APP_publicPath : JSON.stringify('/'),
      'process.env': config
    }),
    new HtmlPlugin({
      inject: 'head',
      filename: 'index.html',
      template: resolvePath('./public/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true
      },
      cdnConfig: getCdnConfig()
    }),
    new ProvidePlugin({ process: require.resolve('process/browser') }),
    // new ESLintPlugin({ fix: true, extensions: ["js", "vue"], exclude: "node_modules" }),
    new ProgressBarPlugin({ format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`, clear: true }),
    new VueLoaderPlugin()
  ],
  stats: 'errors-only'
}
