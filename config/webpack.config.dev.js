const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDir = path.resolve(__dirname, '..', 'app');
const distDir = path.resolve(__dirname, '..', 'dist');

// const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  context: appDir,

  devtool: 'source-map',

  entry: {
    main: './js/main.js'
  },

  output: {
    filename: 'js/[name].js',
    path: distDir,
    publicPath: '/',
    sourceMapFilename: 'js/[name].map'
  },

  devServer: {
    https: true,
    // disableHostCheck: true,
    contentBase: appDir,
    // watchContentBase: true,
    // match the output path
    publicPath: '/',
    // match the output `publicPath`
    // historyApiFallback: true,
    port: 3000,
    inline: false
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'app')
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
              compact: true,
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
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(woff(2)?|eot|ttf|svg)(\?[a-z0-9]+)?$/,
        use: "file-loader?name=fonts/[name].[ext]",
        include: [
          path.resolve(__dirname, '../app')
        ],
      },
      {
        test: /\.(mp3|ogg)$/,
        use: "file-loader?name=sounds/[name].[ext]",
        include: [
          path.resolve(__dirname, '../app')
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|ico|svg)$/,
        use: 'file-loader?name=images/[path][name].[ext]&context=app/assets/images',
      },
      {
        test: /\.(glsl|frag|vert|template|paper.js)$/,
        use: 'raw-loader',
        include: [
          path.resolve(__dirname, '../app')
        ]
      },
      {
        test: /\.(glsl|frag|vert)$/,
        use: 'webpack-glsl-loader',
        include: [
          path.resolve(__dirname, '../app'),
          path.resolve(__dirname, '../node_modules/three/src/renderers/shaders/ShaderChunk'),
          path.resolve(__dirname, '../node_modules/three/src/renderers/shaders/ShaderLib')
        ]
      }
      // { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ }
      // { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ }
    ]
  },
  
  resolve: {
    extensions: [".js", ".scss", ".css"],

    modules: [path.resolve(__dirname, "../app"), "node_modules"],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('dev'),
      }
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin(Object.assign({
      template: path.join(appDir, 'index.tmp'),
      jsPath: 'js/',
      path: distDir,
      filename: 'index.html',
      inject: false
    }))
  ],

  stats: {    
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  }
};