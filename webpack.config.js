const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

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
      'main': ['babel-polyfill', './index.js'],
      'sw': ['./sw/index.js']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, "src", "client"),
            path.resolve(__dirname, "node_modules", "lit-html"),
          ],
          use: 'babel-loader',
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
      }),
      // new WebpackPrerenderPlugin(),
      new SWPrecacheWebpackPlugin({
        cacheId: 'skate-hnpwa',
        filename: 'sw.js',
        importScripts: [
          { chunkName: 'sw' },
        ],
        staticFileGlobsIgnorePatterns: [
          /\.map$/,
          /asset-manifest\.json$/,
        ],
      }),
    ]
  };
  