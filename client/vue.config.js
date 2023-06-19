module.exports = {
  publicPath: process.env.BASE_URL,
  devServer: { port: process.env.VUE_APP_PORT },
  configureWebpack: {
    devtool: 'source-map'
  }
}
