const config = require('../config/config')
const { HttpException } = require('../core/http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const isHttpexception = error instanceof HttpException

    if (config.enviroment === 'dev' && !isHttpexception) {
      console.log(error)
      throw error
    }
    //已知的异常信息
    if (isHttpexception) {
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = error.code
    } else {
      ctx.body = {
        msg: '服务器未知异常！！！',
        error_code: 999,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError