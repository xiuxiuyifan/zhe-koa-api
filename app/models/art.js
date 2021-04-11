const { Movie, Sentence, Music } = require('./classic')
const {Op} = require('sequelize')


class Art {

  //根据artId 和type 查找对应的主题
  static async findArt(artId, type) {
    let finder = {
      where: {
        id: artId,
        type
      }
    }
    let art
    switch (type) {
      case 100:
        art = await Sentence.findOne(finder)
        break
      case 200:
        art = await Movie.findOne(finder)
        break
      case 300:
        art = await Music.findOne(finder)
        break
      case 400:
        //解决循环引用
        const Book = require('./book')
        art = await Book.findOne(finder)
        break
    }
    return art
  }


  //查询一组主题

  static async findArts(artIds, type) {
    let finder = {
      where: {
        id: {
          [Op.in]: artIds
        },
        type
      }
    }
    let arts
    switch (type) {
      case 100:
        arts = await Sentence.findOne(finder)
        break
      case 200:
        arts = await Movie.findOne(finder)
        break
      case 300:
        arts = await Music.findOne(finder)
        break
    }
    return arts
  }
}

module.exports = {
  Art
}