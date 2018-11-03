const pxtorem = require('postcss-pxtorem')
const conf = require('./conf')
const plugins = [
  // autoprefixer 在 css-loader 中配置了，这里不需要，参见 http://cssnano.co/optimisations/
]

if (conf.env.PRODUCT === 'index' || conf.env.PRODUCT === 'trydesignlab') {
  plugins.push(pxtorem({
    rootValue: 37.5,
    propList: ['*']
  }))
}

module.exports = {
  plugins
}
