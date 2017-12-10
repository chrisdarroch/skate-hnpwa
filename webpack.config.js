const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const contextPath = path.join(__dirname, 'src', 'client');
const publicPath = path.join(__dirname, 'public');

const extractCssPlugin = new ExtractTextPlugin('hnpwa.[name].css');

module.exports = {
    context: contextPath,
    devServer: {
      compress: true,
      contentBase: publicPath,
      historyApiFallback: true,
      open: true
    },
    devtool: 'source-map',
    entry: {
      'main': './index.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                'transform-skate-flow-props'
              ],
            }
          }
        },
        {
          test: /\.css$/,
          use: extractCssPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { importLoaders: 1 } },
              'postcss-loader'
            ]
          })
        },
        {
          test: /\.html$/,
          loaders: 'file-loader?{ name: "[path][name].[ext]"}'
        },
        {
          test: /\.png$/,
          loaders: ['file-loader', 'img-loader']
        },
        {
          test: /\.worker\.js$/,
          loaders: 'worker-loader'
        }
      ]
    },
    output: {
      filename: 'hnpwa.[name].js',
      path: publicPath,
      publicPath: '/'
    },
    plugins: [
        extractCssPlugin,
        new webpack.optimize.CommonsChunkPlugin({
        children: true,
        deepChildren: true,
        filename: 'hnpwa.[name].js',
        minChunks: 2,
        name: 'main'
      })
      // new WebpackPrerenderPlugin()
    ]
  };
  