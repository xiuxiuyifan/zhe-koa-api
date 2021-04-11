const { default: axios } = require('axios')
const config = require('../../config/config')
const { AuthFailed } = require('../../core/http-exception')
const { generateToken } = require('../../core/util')
const Auth = require('../../middlewares/auth')
const User = require('../models/user')

class WXManager {
  static async codeToToken(code) {

    let url = `${config.wx.loginUrl}`

    const result = await axios.get(url, {
      params: {
        appid: config.wx.appId,
        secret: config.wx.appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    })


    //axios  http response status not equal 200
    if (result.status !== 200) {
      throw new AuthFailed('openid获取失败！')
    }
    const errorCode = result.data.errcode
    if (errorCode && errorCode !== 0) {
      throw new AuthFailed('openid获取失败！' + errorCode)
    }
    //排除一切异常之后

    //在数据库中查找openid是否已经注册？ 
    //  已注册  根据  uid 和  权限信息生成token 
    //  未注册  根据openid创建用户    走已注册的逻辑
    const openid = result.data.openid
    let user = await User.getUserByOPenid(openid)

    if (!user) {
      user = await User.registerByOpenid(openid)
    }
    return generateToken(user.id, Auth.USER)
  }
}

module.exports = WXManager