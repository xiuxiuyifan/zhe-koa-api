const Router = require('koa-router')
const { LoginType } = require('../../lib/enum')
const { TokenValidator, NotEmptyValidator } = require('../../validators/validator')
const User = require('../../models/user')
const { ParameterException } = require('../../../core/http-exception')
const { generateToken } = require('../../../core/util')
const Auth = require('../../../middlewares/auth')
const WXManager = require('../../services/wx')

const router = new Router({
  prefix: '/v1/token'
})

router.post('/', async (ctx, next) => {
  const v = await new TokenValidator().validate(ctx)
  let token
  //三种登录方式区分
  switch (v.get('body.type')) {
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.get('body.account'), v.get('body.secret'))
      break
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(v.get('body.account'))
      break
    default:
      throw new ParameterException('没有对应的处理函数')
  }
  ctx.body = {
    token
  }
})


router.post('/verify', async (ctx, next) => {
  const v = await new NotEmptyValidator().validate(ctx)
  const token = Auth.verifyToken(v.get('body.token'))
  ctx.body = {
    token
  }
})


async function emailLogin(account, secret) {
  const user = await User.verifyEmailLogin(account, secret)
  //按照角色信息给用户分配权限
  return generateToken(user.id, Auth.USER)
}

module.exports = router