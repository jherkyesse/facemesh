const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  devtool: 'cheap-module-source-map',
  entry: {
    webapp: './index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    publicPath: '/',
    pathinfo: false,
    hashDigestLength: 8
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1000,
            name: '[hash:base64:5].[ext]',
            outputPath: 'assets'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve('src'),
      'node_modules'
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'style/[contenthash].css' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development') }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: './index.html',
      template: './index.html',
      chunks: ['webapp']
    })
  ],
  devServer: {
    inline: true,
    hot: true,
    open: true,
    clientLogLevel: 'error',
    historyApiFallback: true,
    port: 3000
  }
}
