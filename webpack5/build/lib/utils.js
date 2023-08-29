const path = require('path')

const resolvePath = (_path) => path.resolve(process.cwd(), _path)
const cdn = require('./cdn.js')

module.exports = {
  resolvePath,
  readEnv: (file) => {
    const { parsed } = require('dotenv').config({ path: file })
    Object.keys(parsed).forEach((key) => (parsed[key] = JSON.stringify(parsed[key])))
    return parsed
  },
  getExternals: () => {
    const externals = {}
    if (process.env.APP_CDN === 'ON' && process.env.NODE_ENV === 'production') {
      cdn.forEach((config) => {
        externals[config.name] = config.library
      })
    }

    return externals
  },
  getCdnConfig: () => {
    const cdnConfig = {
      js: [],
      css: []
    }
    if (process.env.APP_CDN === 'ON' && process.env.NODE_ENV === 'production') {
      cdn.forEach((config) => {
        if (config.js) cdnConfig.js.push(config.js)
        if (config.css) cdnConfig.css.push(config.css)
      })
    }
    return cdnConfig
  },
  getLibraryName: () => {
    return {
      name: process.env.APP_umdLibraryName,
      type: 'umd'
    }
  }
}
