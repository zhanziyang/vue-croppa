var path = require('path')
var webpack = require('webpack')
var BrowserSync = require('browser-sync-webpack-plugin')
var express = require('express')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/vue-croppa/dist/',
    filename: 'build.js'
  },
  externals: {
    vue: 'Vue',
    vuetify: 'Vuetify'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.md$/,
        loader: 'vue-markdown-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    open: false,
    setup (app) {
      app.use('/vue-croppa/static/', express.static(path.resolve(__dirname, './static')))
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new BrowserSync({
      host: 'localhost',
      files: ['./simple-test.html', './src/croppa/*'],
      port: 3000,
      proxy: 'http://localhost:8080/',
      serveStatic: [{
        route: '/vue-croppa/static',
        dir: 'static'
      }]
    }, { reload: false })
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'nosources-source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      uglifyOptions: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
