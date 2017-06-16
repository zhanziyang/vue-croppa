const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const commentjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const eslint = require('rollup-plugin-eslint')
const uglify = require('rollup-plugin-uglify')
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const fs = require('fs')

module.exports = {
  entry: 'src/main.js',
  dest: `${process.env.BUILD === 'production' ? 'dist' : 'docs/croppa'}/vue-croppa.js`,
  format: 'umd',
  moduleName: 'Croppa',
  sourceMap: process.env.BUILD === 'production' ? false : 'inline',
  plugins: [
    commentjs(),
    resolve(),
    json(),
    vue({
      css: function (css, allStyles, compile) {
        postcss([autoprefixer]).process(css).then(function (result) {
          result.warnings().forEach(function (warn) {
            console.warn(warn.toString())
          })
          fs.writeFile(`${process.env.BUILD === 'production' ? 'dist' : 'docs/croppa'}/vue-croppa.css`, result.css, (err) => {
            if (err) throw err
          })
        })
      }
    }),
    (process.env.BUILD === 'production' && eslint()),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    (process.env.BUILD === 'production' && uglify())
  ]
}