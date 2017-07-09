const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const commentjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const vue = require('rollup-plugin-vue')
const eslint = require('rollup-plugin-eslint')
const uglify = require('rollup-plugin-uglify')
const autoprefixer = require('autoprefixer')
const clean = require('postcss-clean')
const postcss = require('postcss')
const fs = require('fs')
const { version } = require('./package.json')

let production = /^production/.test(process.env.BUILD)
let min = process.env.BUILD === 'production-min'

module.exports = {
  entry: 'src/main.js',
  dest: `${production ? 'dist' : 'docs/src/croppa'}/vue-croppa${min ? '.min' : ''}.js`,
  format: 'umd',
  moduleName: 'Croppa',
  sourceMap: production ? false : 'inline',
  banner: `\
/*
 * vue-croppa v${version}
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2017 zhanziyang
 * Released under the ISC license
 */
  `,
  plugins: [
    commentjs(),
    resolve(),
    json(),
    vue({
      css: function (css, allStyles, compile) {
        postcss(min ? [autoprefixer, clean] : [autoprefixer]).process(css).then(function (result) {
          result.warnings().forEach(function (warn) {
            console.warn(warn.toString())
          })
          fs.writeFile(`${production ? 'dist' : 'docs/src/croppa'}/vue-croppa${min ? '.min' : ''}.css`, result.css, (err) => {
            if (err) throw err
          })
        })
      }
    }),
    (production && eslint()),
    babel({
      presets: [
        [
          'es2015',
          {
            'modules': false
          }
        ]
      ],
      plugins: [
        'external-helpers'
      ],
      exclude: 'node_modules/**'
    }),
    (min && uglify({
      output: {
        comments: /zhanziyang/
      }
    }))
  ]
}