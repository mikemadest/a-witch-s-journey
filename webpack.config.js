'use strict'

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  entry: {
    app: path.resolve(__dirname, 'src/index.js'),
    'production-dependencies': ['phaser']
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },

  //watch: true,

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/'),
        use: {
          loader: 'babel-loader'
        }
      },
      {
          test: /phaser-split\.js$/,
          use: ['expose-loader?Phaser']
      },
      {
          test: [/\.vert$/, /\.frag$/],
          use: 'raw-loader'
      }
    ]
  },

  plugins: [

    //new CleanWebpackPlugin(['dist']),

    new HtmlWebpackPlugin({
        path: path.resolve(__dirname, 'dist', 'index.html'),
        template: './index.html',
        chunks: ['production-dependencies', 'app'],
        chunksSortMode: 'manual',
        minify: {
            removeAttributeQuotes: false,
            collapseWhitespace: false,
            html5: false,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: false,
            removeComments: true,
            removeEmptyAttributes: false
        },
        hash: false
    }),

    new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'index.html'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'assets', '**', '*'),
        to: path.resolve(__dirname, 'dist')
      }
    ]),

    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'production-dependencies',
      filename: 'vendor.bundle.[chunkhash].js'
    })
  ],

  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  performance: {
      hints: false // Ignore warnings about large bundles as it really don't apply to games
  }

};
