const Router = require('koa-router')
const requireDirectory = require('require-directory')

class InitManager {
  //入口方法
  static initCore(app) {
    InitManager.app = app
    InitManager.initLoadRouters()
  }

  //初始化理由， 自动注册api文件夹下面的路由
  static initLoadRouters() {
    requireDirectory(module, '../app/api', {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
}

module.exports = InitManager