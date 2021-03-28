const Router = require('koa-router')

const router = new Router()

router.get('/api/classic', (ctx, next) => {
  ctx.body = {
    code: 200,
    data: [1, 2, 3, 4]
  }
})

module.exports = router