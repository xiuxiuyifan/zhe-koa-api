class HttpException extends Error {
  constructor(msg, errorCode, code) {
    super()
    this.errorCode = errorCode || 10001
    this.code = code || 400
    this.msg = msg || '服务器异常'
  }
}


class ParameterException extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.errorCode = errorCode || 10000
    this.code = 400
    this.msg = msg || '参数错误'
  }
}

module.exports = {
  HttpException,
  ParameterException
}