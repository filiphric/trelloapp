module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: [
    'vue',
  ],
  rules: {
    'comma-spacing': ['error', { before: false, after: true }],
    'space-infix-ops': 'error',
    'key-spacing': ['error', { afterColon: true }],
    'arrow-spacing': ['error', { before: true, after: true }],
    indent: [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
    'no-multiple-empty-lines': [
      'error', {
        max: 1,
        maxEOF: 1,
      },
    ],
    'padding-line-between-statements': [
      'error', { blankLine: 'always', prev: 'multiline-block-like', next: 'multiline-block-like' },
    ],
    'no-console': 'off',
    'no-undef': 'off'
  },
};
