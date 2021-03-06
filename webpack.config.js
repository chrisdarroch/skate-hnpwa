const path = require('path');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const publicPath = path.join(__dirname, 'public');
const contextPath = path.join(__dirname, 'src', 'client');
const skateIconPath = path.resolve(__dirname, 'src', 'client', 'app', 'skatejs@2x.png')

const extractCssPlugin = new MiniCssExtractPlugin({
    filename: 'hnpwa.[name].css'
});

module.exports = {
    mode: process.env.NODE_ENV || 'development',
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
        'sw': ['./sw/index.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src', 'client'),
                    path.resolve(__dirname, 'src', 'routes'),
                    path.resolve(__dirname, 'node_modules', 'lit-html'),
                ],
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
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
        new HtmlWebpackPlugin({
            cache: true,
            template: 'index.html',
            excludeChunks: ['sw'],
        }),
        new WebpackPwaManifest({
            name: 'Skate HackerNews PWA Demo',
            short_name: 'Skate HNPWA',
            description: "The HNPWA app built using Skate.js, Google lit-html, and Google workbox.",
            display: "standalone",
            background_color: '#f2f5eb', // todo: extract common value from CSS
            theme_color: '#f2567c', // todo: extract common value from CSS
            start_url: "/",
            filename: 'site.webmanifest',
            inject: true,
            icons: [{
                src: skateIconPath,
                sizes: [16, 32, 64, 48, 96, 128, 256, 384, 512]
            }],
        }),
        new FaviconsWebpackPlugin({
            logo: skateIconPath,
            inject: true,
        }),
        new CompressionWebpackPlugin({
            algorithm: 'gzip'
        }),
        new WorkboxWebpackPlugin.InjectManifest({
            // logistical build-time stuff
            swDest: 'sw.js',
            importWorkboxFrom: 'local', // not that I distrust Google's CDN, but I want all the files in one place for now.
            excludeChunks: ['sw'],
            // runtime stuff
            swSrc: path.resolve(__dirname, 'src', 'client', 'sw', 'index.js'),
            // ...and that's it; inject manifest == DIY!
        }),
    ]
};
