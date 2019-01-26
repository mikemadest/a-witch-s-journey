'use strict'

const webpack = require('webpack');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


//var phaserModule = path.join(__dirname, '/node_modules/phaser/')
//var phaser = path.join(phaserModule, 'src/phaser.js')


module.exports = {
    entry: {
        app: ['babel-polyfill', path.resolve(__dirname, 'src', 'index.js')],
        vendor: ['phaser']
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[chunkhash].js'
    },

    module: {
        rules: [
            { test: /\.js$/, include: path.join(__dirname, 'src'), loader: "babel-loader" },
            { test: [/\.vert$/, /\.frag$/], use: 'raw-loader' }
        ]
    },
    optimization: {
        minimize: false
    },

    plugins: [
        new CleanWebpackPlugin('build'),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        }),
        new HtmlWebpackPlugin({
            path: path.resolve(__dirname, 'build', 'index.html'),
            template: 'index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        new webpack.HashedModuleIdsPlugin(),

        //  webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
        /*new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),*/
        /*new webpack.optimize.UglifyJsPlugin({
            comments: false,
            sourceMap: true
        }),*/
        new CopyWebpackPlugin([
            {from:path.resolve(__dirname,'assets'), to:path.resolve(__dirname, 'build', 'assets')}
        ]),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './build']
            }
        })
    ]
}