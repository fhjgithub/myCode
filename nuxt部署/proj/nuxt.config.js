const { ENV_STAGE } = process.env
function getProxy(env) {
  return {
    online: {
      '/api': 'http:',
      '/oss': 'http:',
    },
    pre: {
      '/api': 'http:',
      '/oss': 'http:',
    },
    pre2: {
      '/api': 'http:',
      '/oss': 'http:',
    },
    daily: {
      '/api': 'http:',
      '/oss': 'http:',
    },
  }[env]
}
export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  mode: "universal",
  target: "server",
  head: {
    title: "",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
      },
      {
        hid: "description",
        name: "description",
        content:
          ""
      },
      {
        hid: "keywords",
        name: "keywords",
        content:
          ""
      },
      {
        hid: "og:title",
        property: "og:title",
        content: ""
      },
      {
        hid: "og:url",
        property: "og:url",
        content: ""
      },
      {
        hid: "og:image",
        property: "og:image",
        content:
          ""
      },
      {
        hid: "og:description",
        property: "og:description",
        content:
          ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["@/assets/styles/common.css"],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      src: "~/plugins/vant"
    },
    {
      src: "~/plugins/lib-flexible.js",
      mode: "client"
    }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: ["@nuxtjs/axios"],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ["@nuxtjs/axios"],

  axios: {
    proxy: true
  },
  proxy: getProxy(ENV_STAGE),

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    publicPath: "/_nuxt_m/",
    babel: {
      plugins: [
        [
          "import",
          {
            libraryName: "vant",
            // 目前在 nuxt 中无法按需引入样式，因此采用手动引入的方式
            style: false
          },
          "vant"
        ]
      ]
    },
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.less$/,
        use: [
          // ...其他 loader 配置
          {
            loader: "less-loader",
            options: {
              modifyVars: {
                // 直接覆盖变量
                "@nav-bar-background-color": "#1F253B",
                "@dropdown-menu-height": "40px",
                "@dropdown-menu-background-color": "transparent",
                "@dropdown-menu-box-shadow": "none",
                "@button-default-border-color": "#ffffff",
                "@button-default-background-color": "#1f2739",
                "@sidebar-selected-border-color": "#176AF0",
                "@tree-select-item-active-color": "#176AF0",
                "@field-placeholder-text-color": "#C3C3C3",
                "@swipe-indicator-inactive-background-color": "#E5E5E5"
              }
            }
          }
        ]
      });
    },
    postcss: {},
    preset: {
      autoprefixer: true
    }
  }
};
