'use strict';

const ImageminPlugin = require('imagemin-webpack-plugin').default;

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDir = path.resolve(__dirname, '..', 'app');
const distDir = path.resolve(__dirname, '..', 'dist');

module.exports = {
  context: appDir,

  devtool: 'hidden-source-map',

  entry: {
    main: './js/main.js'
  },

  output: {
    filename: 'js/[name].js',
    path: distDir,
    publicPath: '/'
  },

  devServer: {
    contentBase: distDir,
    historyApiFallback: true,
    port: 3000,
    compress: true,
    inline: false
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../app')
        ],
        use: [
          {
            loader: 'babel-loader',
            'options': {
              sourceMap: true,
              presets: [['env', {
                useBuiltIns: true
              }]],
              plugins: [require('babel-plugin-transform-es3-member-expression-literals'), require('babel-plugin-transform-es3-property-literals')],
              // compact: true,
              babelrc: false
            }
          },
        ],
      }, 
      {
        test: /\.(scss|css)$/,
        include: [
          path.resolve(__dirname, '../app')
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
            }
          ],
          publicPath: '../'
        }),
      },
      {
        test: /\.(glsl|frag|vert|template)$/,
        include: [
          path.resolve(__dirname, '../app')
        ],
        use: 'raw-loader'
      },
      {
        test: /\.(woff(2)?|eot|ttf|svg)(\?[a-z0-9]+)?$/,
        include: [
          path.resolve(__dirname, '../app')
        ],
        use: "file-loader?name=fonts/[name].[ext]"
      },
      {
        test: /\.(mp3|ogg)$/,
        include: [
          path.resolve(__dirname, '../app')
        ],
        use: "file-loader?name=sounds/[name].[ext]"
      },
      {
        test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
        include: [
          path.resolve(__dirname, '../app')
        ],
        use: [
          {
            loader: 'file-loader?name=images/[path][name].[ext]&context=app/assets/images'
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: [".js", ".scss", ".css"],

    modules: [path.resolve(__dirname, "../app"), "node_modules"],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),

    new HtmlWebpackPlugin(Object.assign({
      env: 'prod',
      template: path.join(appDir, 'index.tmp'),
      filename: 'index.html',
      jsPath: 'js/',
      inject: false
    })),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: false,
        // drop_console: true
      },
      mangle: {
        screw_ie8: false
      },
      comments: false,
      output: { screw_ie8: false }
    }),

    // Put all css code in this file
    new ExtractTextPlugin('css/main.css'),

    new CopyWebpackPlugin([{from: "assets", to: "assets"}]),

    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })
  ],
};