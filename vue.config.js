const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // Zoho widgets must use relative paths
  publicPath: './',

  // Keep your existing outputDir
  outputDir: 'app',

  transpileDependencies: [
    'vuetify'
  ],

  // 🔥 CRITICAL: Disable dev-server WebSockets & HMR
  devServer: {
    hot: false,
    liveReload: false,

    // Completely disable webpack-dev-server socket
    client: false,
    webSocketServer: false,

    // Zoho loads widgets in iframe
    allowedHosts: 'all',

    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  // Avoid iframe + source-map issues
  productionSourceMap: false
})
