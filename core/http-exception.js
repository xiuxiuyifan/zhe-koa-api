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

class Success extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 201
    this.msg = msg || '操作成功'
    this.errorCode = errorCode || 0
  }
}

class AuthFailed extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 401
    this.msg = msg || '授权失败'
    this.errorCode = errorCode || 10004
  }
}

class Forbbiden extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 403
    this.msg = msg || '禁止访问'
    this.errorCode = errorCode || 10006
  }
}

class LikeError extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 200
    this.msg = msg || '你已经点过赞了！'
    this.errorCode = errorCode || 10007
  }
}

class DisLikeError extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 200
    this.msg = msg || '你已经取消过点赞了'
    this.errorCode = errorCode || 10008
  }
}

class NotFound extends HttpException {
  constructor(msg, errorCode) {
    super()
    this.code = 404
    this.msg = msg || '未找到！'
    this.errorCode = errorCode || 40004
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  AuthFailed,
  Forbbiden,
  LikeError,
  DisLikeError,
  NotFound
}