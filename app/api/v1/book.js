const Router = require('koa-router')
const { HttpException, ParameterException } = require('../../../core/http-exception')
const router = new Router()

router.get('/api/books/:id', (ctx, next) => {
  const path = ctx.params
  const query = ctx.request.query
  const headers = ctx.request.header
  const body = ctx.request.body
  console.log(path)
  console.log(query)
  console.log(headers)
  console.log(body)
  abc
})

module.exports = router