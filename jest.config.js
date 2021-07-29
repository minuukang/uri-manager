const path = require('path');
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: path.join(__dirname, './tsconfig.test.json'),
      diagnostics: false
    }
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1'
  },
  testRegex: '(test|spec)\\.tsx?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  'transformIgnorePatterns': [
    '../node_modules/'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['cobertura'],
  automock: false
};
