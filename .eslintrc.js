module.exports = {
  ignorePatterns: ['**/*.js'],
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import'
  ],
  rules: {
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    'import/order': ['error', {
      'groups': [
        'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'
      ],
      'pathGroups': [
        {
          pattern: './style',
          group: 'object',
          position: 'after'
        }
      ],
      'newlines-between': 'always'
    }],
    'import/newline-after-import': 'error'
  }
};
