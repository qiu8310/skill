const ENV = getEnv(['ENV', 'NODE_ENV'], 'development')
const PRODUCT = getEnv(['PRODUCT', 'P'], 'index')

module.exports = {
  // env 中的变量会注入全局之中，如 HOST ，在 JS 中可以用 __HOST__ 来取其值
  env: {
    VERSION: require('./package.json').version,
    PRODUCT,

    HOST: getEnv('HOST', 'localhost'),
    PORT: getEnv('PORT', '8000'),

    ENV,
    DEV: /dev/i.test(ENV),
    TEST: /test/i.test(ENV),
    BUILD: /(build|prod)/i.test(ENV)
  }
}

function getEnv(keys, defaultValue) {
  return []
    .concat(keys)
    .map(key => process.env[key] || process.env[key.toUpperCase()] || process.env[key.toLowerCase()])
    .find(val => !!val) || defaultValue
}
