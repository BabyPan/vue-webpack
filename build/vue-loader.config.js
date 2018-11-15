module.exports = (isDev) => {
  return {
    preserveWhitepace: true, //配置去除多余空格
    extractCSS: !isDev, //抽离vue里面的css
    cssModules: {
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5 ]' : '[hash:base64:5 ]',
      camelCase: true, //自动把css里 - 命名转换为驼峰命名
    },
    // hotReload: true //热加载
  }
}
