const Router = require('koa-router')
const { attempt } = require('lodash')
const { NotFound } = require('../../../core/http-exception')
const Auth = require('../../../middlewares/auth')
const { Art } = require('../../models/art')
const Favor = require('../../models/favor')
const Flow = require('../../models/flow')
const { FavorParamsValidator, ClassicDetailValidator, ClassicValidator } = require('../../validators/validator')

const router = new Router({
  prefix: '/v1/classic'
})

//获取最新一期期刊
router.get('/latest', new Auth().m, async (ctx, next) => {
  //查找最新一期期刊
  const flow = await Flow.findOne({
    order: [
      ['index', 'DESC']
    ]
  })

  //再根据最新一期的期刊查出对应实体的信息
  const art = await Art.findArt(flow.art_id, flow.type)
  art.setDataValue('index', flow.index)
  ctx.body = art
})

//获取下一期期刊
router.get('/:index/next', new Auth().m, async (ctx, next) => {
  const v = await new ClassicValidator().validate(ctx)

  //查找出下一期期刊的信息
  const flow = await Flow.findOne({
    where: {
      index: v.get("path.index") + 1
    }
  })
  if (!flow) {
    throw new NotFound()
  }

  //去实体表实体表中查找
  const art = await Art.findArt(flow.art_id, flow.type)
  art.setDataValue('index', flow.index)
  ctx.body = art
})

//获取上一期期刊

router.get('/:index/previous', new Auth().m, async (ctx, next) => {
  const v = await new ClassicValidator().validate(ctx)
  //查找出下一期期刊的信息
  const flow = await Flow.findOne({
    where: {
      index: v.get("path.index") - 1
    }
  })
  if (!flow) {
    throw new NotFound()
  }

  //去实体表实体表中查找
  const art = await Art.findArt(flow.art_id, flow.type)
  art.setDataValue('index', flow.index)
  ctx.body = art
})


//获取期刊的点赞信息
router.get('/:type/:artId/favor', new Auth().m, async (ctx, next) => {
  const v = await new FavorParamsValidator().validate(ctx)
  const type = parseInt(v.get('path.type'))
  const id = parseInt(v.get('path.artId'))
  const art = await Favor.getFavorDetail(id, type, ctx.auth.uid)
  ctx.body = art
})


router.get('/:type/:artId/detail', new Auth().m, async (ctx, next) => {
  const v = await new ClassicDetailValidator().validate(ctx)
  const type = parseInt(v.get('path.type'))
  const id = parseInt(v.get('path.artId'))
  const art = await Favor.getArtDetail(id, type, ctx.auth.uid)
  ctx.body = art
})

//获取用户所有点赞信息
router.get('/favor', new Auth().m, async (ctx, next) => {
  const favorArts = await Favor.findUserFavorArts(ctx.auth.uid)
  ctx.body = favorArts
})

module.exports = router