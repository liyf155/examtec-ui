var path = require('path')
// var baseUrl = 'https://gxpta.examtec.cn'
var baseUrl = 'http://10.0.0.83:19080'
// function resolve (dir) {
//   return path.join(__dirname, '..', dir)
// }
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: () => {},
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }

    // Object.assign(config, {
    //   // 开发生产共同配置
    //   resolve: {
    //     extensions: ['.js', '.vue', '.json'],
    //     alias: {
    //       'vue$': 'vue/dist/vue.esm.js',
    //       '@': resolve('src')
    //     }
    //   }
    // })
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: true,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    // env: require("./dev.env"),
    port: 9080,
    open: true,
    host: '0.0.0.0',
    https: false,
    hotOnly: false,
    // path: '/',
    proxy: {
      '/auth': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': '/'
        }
      },
      '/admin': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/code': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/code': '/code'
        }
      },
      '/basic': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/basic': '/basic'
        }
      },
      '/gen': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/gen': '/gen'
        }
      },
      '/bigdata': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/bigdata': '/bigdata'
        }
      },
      '/platform': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/platform': '/platform'
        }
      },
      '/checkin': {
        target: baseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/checkin': '/checkin'
        }
      }
    }
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}
