const { flatten } = require('loadsh')
const { Model, DataTypes, Op } = require("sequelize");
const { sequelize } = require("../../core/db");
const { LikeError, DisLikeError, NotFound } = require("../../core/http-exception");

const { Art } = require('./art')

class Favor extends Model {
  static async like(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id: artId,
        type,
        uid
      }
    })
    if (favor) {
      throw new LikeError()
    }
    //向点赞表里面插入一条数据，并且给art 各个类型里面的fav_num 加 1
    return sequelize.transaction(async (t) => {
      await Favor.create({
        art_id: artId,
        type,
        uid
      }, { transaction: t })
      const art = await Art.findArt(artId, type)
      if(!art) {
        throw new NotFound('未找到书籍')
      }
      await art.increment('fav_num', { by: 1, transaction: t })
    })
  }

  static async dislike(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id: artId,
        type,
        uid
      }
    })
    if (!favor) {
      throw new DisLikeError()
    }

    return sequelize.transaction(async (t) => {
      await favor.destroy({
        force: true
      }, { transaction: t })
      const art = await Art.findArt(artId, type)
      await art.decrement('fav_num', { by: 1, transaction: t })
    })
  }

  static async userLikeIt(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        art_id: artId,
        type,
        uid
      }
    })
    return favor ? true : false
  }

  static async getArtDetail(artId, type, uid) {
    const art = await Art.findArt(artId, type)
    if (!art) {
      throw new NotFound()
    }
    //在查找这个主题有没有被这个用户喜欢过
    const likeStatus = await Favor.userLikeIt(artId, type, uid)
    return {
      ...art.dataValues,
      like_status: likeStatus
    }
  }
  static async getFavorDetail(artId, type, uid) {
    const art = await Art.findArt(artId, type)
    if (!art) {
      throw new NotFound()
    }
    //在查找这个主题有没有被这个用户喜欢过
    const likeStatus = await Favor.userLikeIt(artId, type, uid)
    return {
      fav_num: art.fav_num,
      like_status: likeStatus
    }
  }

  static async getUserFavors(uid) {
    const arts = await Favor.findAll({
      where: {
        uid,
        type: {
          //type !== 400
          [Op.not]: 400
        }
      }
    })

    if (!arts) {
      throw new NotFound()
    }

    const artsToMap = (arts) => {
      let map = {
        100: [],
        200: [],
        300: []
      }
      arts.forEach((item) => {
        map[item.type].push(item.art_id)
      })
      return map
    }
    return artsToMap(arts)
  }

  //查询用户所有的点赞期刊。 多组查询
  static async findUserFavorArts(uid) {
    let maps = await Favor.getUserFavors(uid)
    let favorsArt = []
    for (let key in maps) {
      let arts = await Art.findArts(maps[key], parseInt(key))
      favorsArt.push(arts)
    }
    return flatten(favorsArt)
  }
}

Favor.init({
  //用户id
  uid: DataTypes.INTEGER,
  //句子、音乐、电影 表中的主键
  art_id: DataTypes.INTEGER,
  //期刊的类型
  type: DataTypes.INTEGER
}, {
  sequelize: sequelize,
  tableName: 'favor'
})

module.exports = Favor