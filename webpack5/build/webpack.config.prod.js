const { IgnorePlugin } = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const SentryPlugin = require('@sentry/webpack-plugin')

const rules = require('./lib/rules.js')
const common = require('./webpack.config.common.js')

const {
  VUE_APP_publicPath,
  NODE_ENV,
  VUE_APP_RELEASE_VERSION,
  APP_GZIP
} = process.env
module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    filename: 'js/[name]-[contenthash:8].js',
    chunkFilename: 'chunk/[name]-[contenthash:8].js',
    publicPath: NODE_ENV === 'production' ? VUE_APP_publicPath : '/'
  },
  module: { rules: rules('prod') },
  optimization: {
    nodeEnv: 'production',
    // runtimeChunk 运行时文件 增加缓存 导致子应用加载失败
    // runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      minChunks: 3,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          priority: 10, // 优先级
          enforce: true
        },
        main: {
          test: /src/,
          name: 'main',
          enforce: true
        }
      }
    },
    minimizer: [
      new MiniCssExtractPlugin({ filename: 'style/[name]-[contenthash:8].css' }),
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
      ...(APP_GZIP === 'ON'
        ? [
          new CompressionPlugin({
            filename: '[path][base].gz',
            threshold: 10240,
            minRatio: 0.8
          })
        ]
        : [])
    ]
  },
  plugins: [
    new SentryPlugin({
      ignoreFile: ['node_modules', '.gitignore'],
      // 指定上传目录
      include: './dist',
      // 指定sentry上传配置
      configFile: './.sentryclirc',
      // 指定发布版本
      release: VUE_APP_RELEASE_VERSION,
      // 保持与publicPath相符
      urlPrefix: NODE_ENV === 'production' ? VUE_APP_publicPath : '/'
    }),
    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/*.ico',
          to: path.resolve(__dirname, '../', 'dist', '[name][ext]')
        }
      ]
    })
  ]
})
