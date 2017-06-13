const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const commentjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const stylus = require('rollup-plugin-stylus')

module.exports = [
  {
    entry: 'src/main.js',
    format: 'umd',
    moduleName: 'Croppa',
    dest: 'dist/vue-croppa.js',
    plugins: [
      commentjs(),
      resolve(),
      json(),
      vue(),
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      })
    ]
  },
  {
    entry: 'src/main.js',
    format: 'umd',
    moduleName: 'Croppa',
    dest: 'example/croppa/vue-croppa.js',
    plugins: [
      commentjs(),
      resolve(),
      json(),
      vue(),
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      })
    ]
  }
]