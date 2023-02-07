const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy:'https://www.escook.cn',  //请求的服务器地址


  }
})
