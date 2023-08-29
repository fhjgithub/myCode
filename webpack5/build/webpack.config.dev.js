const { merge } = require('webpack-merge')

const { resolvePath } = require('./lib/utils.js')

const rules = require('./lib/rules.js')
const common = require('./webpack.config.common.js')
const {
  VUE_APP_proxyTarget
} = process.env

module.exports = merge(common, {
  mode: 'development',
  // devtool: "eval-cheap-module-source-map",
  output: { filename: 'js/[name].js' },
  optimization: {
    nodeEnv: 'development',
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
    minimize: false,
    concatenateModules: false,
    usedExports: false
  },
  module: { rules: rules() },
  devServer: {
    port: 'auto',
    static: {
      directory: resolvePath('public')
    },
    hot: true,
    open: true,
    host: 'localhost',
    compress: true,		// 开发服务器启用gzip压缩
    historyApiFallback: true, // history路由错误问题
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/*.html': {
        target: VUE_APP_proxyTarget,
        changeOrigin: true
      },
      '/login': {
        target: VUE_APP_proxyTarget,
        changeOrigin: true
      },
      '/humanadmin/v1/': {
        target: VUE_APP_proxyTarget,
        changeOrigin: true
      },
      '/heavenadmin/v1/': {
        target: VUE_APP_proxyTarget,
        changeOrigin: true
      },
      '/landadmin/v1/': {
        target: VUE_APP_proxyTarget,
        changeOrigin: true
      }
    }
    // client: {
    //   logging: "warn",
    //   overlay: {
    //     errors: true,
    //     warnings: false,
    //   },
    // },
  }
})
