const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

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
          loaders: 'html-loader'
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
      new HtmlWebpackPlugin({
        cache: true,
        template: 'index.html',
      }),
      new WorkboxWebpackPlugin.GenerateSW({
        // logistical build-time stuff
        swDest: 'sw.js',
        importWorkboxFrom: 'local', // not that I distrust Google's CDN, but I want all the files in one place for now.
        excludeChunks: ['sw'],
        exclude: [
          /\.map$/,
          /asset-manifest\.json$/,
        ],
        // runtime stuff
        cacheId: 'skate-hnpwa',
        clientsClaim: true, // run the SW on pages immediately when it activates
        skipWaiting: true, // because we're claiming the client immediately
        runtimeCaching: [{
          urlPattern: new RegExp('^http://localhost:8000/api/'),
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'skate-hnpwa-data',
          }
        }]
      }),
    ]
};
