const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const common = [
  {
    test: /\.vue$/,
    loader: 'vue-loader'
  },
  {
    test: /\.txt$/,
    type: 'asset/source'
  },
  {
    test: /\.(png|svg|gif|jpe?g|webp)$/,
    type: 'asset/resource',
    parser: { dataUrlCondition: { maxSize: 20 * 1024 }}
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    type: 'asset/resource',
    generator: { filename: 'font/[name]-[contenthash:8][ext]' }
  }
]

const dev = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    ]
  },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.less$/i,
    use: ['style-loader', 'css-loader', 'less-loader']
  },
  {
    test: /\.s[ac]ss$/i,
    use: ['style-loader', 'css-loader', 'sass-loader']
  }
]

const prod = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'thread-loader',
        options: {
          workers: 2,
          workerParallelJobs: 50
        }
      },
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    ]
  },
  {
    test: /\.css$/i,
    use: [MiniCssExtractPlugin.loader, 'css-loader']
  },
  {
    test: /\.less$/i,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
  },
  {
    test: /\.s[ac]ss$/i,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
  }
]

module.exports = (env) => common.concat(env === 'prod' ? prod : dev)
