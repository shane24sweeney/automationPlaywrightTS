module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    requireModule: ['tsx/cjs'],
    require: ['tests/support/**/*.ts', 'tests/steps/**/*.ts'],
    format: ['progress']
  }
};