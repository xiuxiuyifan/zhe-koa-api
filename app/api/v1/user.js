const Router = require('koa-router')
const { RegisterValidator } = require('../../validators/validator')
const User = require('../../models/user')
const { Success } = require('../../../core/http-exception')

const router = new Router({
  prefix: '/v1/user'
})


//接受那些参数？
//返回什么结果？
router.post('/register', async (ctx, next) => {
  const v = await new RegisterValidator().validate(ctx)

  const user = {
    email: v.get('body.email'),
    nickname: v.get('body.nickname'),
    password: v.get('body.password')
  }
  const r =  await User.create(user)
  throw new Success()
})

module.exports = router