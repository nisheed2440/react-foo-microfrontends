module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
    mocha: true
  },
  globals: {
    __SERVER__: true,
    expect: true
  },
  plugins: ['react', 'jsx-a11y'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    indent: 'off',
    quotes: [2, 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'never'],
    complexity: [1, { max: 10 }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': [2, 'as-needed'],
    'class-methods-use-this': 0,
    'function-paren-newline': 0,
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 2,
    'import/no-webpack-loader-syntax': 0,
    'import/prefer-default-export': 0,
    'object-curly-newline': 0,
    'jsx-a11y/aria-props': 2,
    'jsx-a11y/heading-has-content': 0,
    'jsx-a11y/anchor-is-valid': 2,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'max-len': 0,
    'newline-per-chained-call': 0,
    'no-confusing-arrow': 0,
    'no-console': 1,
    'no-restricted-syntax': 0,
    'no-use-before-define': 0,
    'prefer-template': 2,
    'react/forbid-prop-types': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-filename-extension': 0,
    'react/jsx-no-target-blank': 0,
    'react/require-default-props': 0,
    'react/require-extension': 0,
    'react/self-closing-comp': 0,
    'react/prefer-stateless-function': 0,
    'line-break-style': 0
  },
  settings: {}
};
