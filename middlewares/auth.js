const basicAuth = require('basic-auth')
const { Forbbiden } = require('../core/http-exception')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

class Auth {
  constructor(level) {
    this.level = level || 1
    //权限级别的定义
    Auth.USER = 8
    Auth.ADMIN = 16
  }
  get m() {
    return async (ctx, next) => {
      //httpBasicAuth
      const userToken = basicAuth(ctx.req)
      let errMsg = 'token不合法！'
      let decode
      if (!userToken || !userToken.name) {
        throw new Forbbiden(errMsg)
      }
      try {
        decode = jwt.verify(userToken.name, config.security.secretKey)
      } catch (error) {
        //token 不合法和token过期的两种情况
        if (error.name === 'TokenExpiredError') {
          errMsg = 'token已过期！'
        }
        throw new Forbbiden(errMsg)
      }
      //权限分级控制
      if (decode.scope < this.level) {
        throw new Forbbiden('权限不足！')
      }
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope
      }
      await next()
    }
  }

  static verifyToken(token) {
    try {
      jwt.verify(token, config.security.secretKey)
      return true
    } catch (error) {
      return false
    }
  }
}

module.exports = Auth