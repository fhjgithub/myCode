const mode = process.env.ENV_NAME
const isPublic0 = ['online', 'prepare', 'prepare2'].includes(mode)
const publicPath = !isPublic0 ? `https://cdntest.111.cn/cdns-${mode}` : `https://hcdntest.111.cn/cdns-${mode}`
module.exports = [
  {
    name: 'vue',
    library: 'Vue',
    js: `${publicPath}/vue/2.6.14/vue.min.js`,
    css: ''
  },
  {
    name: 'vue-router',
    library: 'VueRouter',
    js: `${publicPath}/vue-router/3.5.3/vue-router.min.js`,
    css: ''
  },
  {
    name: 'vuex',
    library: 'Vuex',
    js: `${publicPath}/vuex/3.6.2/vuex.min.js`,
    css: ''
  },
  {
    name: 'axios',
    library: 'axios',
    js: `${publicPath}/axios/0.26.0/axios.min.js`,
    css: ''
  },
  {
    name: 'lodash',
    library: '_',
    js: `${publicPath}/lodash/4.17.21/lodash.min.js`,
    css: ''
  }
]
