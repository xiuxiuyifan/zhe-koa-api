const Router = require('koa-router')
const { HttpException, ParameterException } = require('../../../core/http-exception')
const Book = require('../../models/book')
const { TestValidator, BookSearch } = require('../../validators/validator')
const router = new Router({
  prefix: '/v1/book'
})

router.get('/', async (ctx, next) => {
  const books = await Book.getAll()
  ctx.body = books
})


router.get('/search', async (ctx, next) => {
  const v = await new BookSearch().validate(ctx)
  const books = await Book.searchWrold(v.get('query.q'))
  ctx.body = books
})

module.exports = router