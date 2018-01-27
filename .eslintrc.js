module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  env: {
    browser: true,
    node: true
  },
  extends: 'plugin:vue/recommended',
  // required to lint *.vue files
  plugins: ['html'],
  // add your custom rules here
  rules: {
    'space-before-function-paren': 0,
    'eol-last': 0,
    eqeqeq: 0,
    camelcase: 0,
    'no-useless-call': 0
  },
  globals: {
    DocumentTouch: true
  }
}
