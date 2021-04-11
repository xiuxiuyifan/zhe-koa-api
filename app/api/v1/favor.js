const Router = require('koa-router')
const Auth = require('../../../middlewares/auth')
const { success } = require('../../lib/helper')
const { Art } = require('../../models/art')
const Favor = require('../../models/favor')
const { FavorParamsValidator } = require('../../validators/validator')

const router = new Router({
  prefix: '/v1/favor'
})

//
router.post('/like', new Auth().m, async (ctx, next) => {
  const v = await new FavorParamsValidator().validate(ctx)
  await Favor.like(v.get('body.artId'), v.get('body.type'), ctx.auth.uid)
  success()
})


router.post('/dislike', new Auth().m, async (ctx, next) =>{
  const v = await new FavorParamsValidator().validate(ctx)
  await Favor.dislike(v.get('body.artId'), v.get('body.type'), ctx.auth.uid)
  success()
})

module.exports = router