const { Model, DataTypes, Op, Sequelize , QueryTypes} = require("sequelize");
const { sequelize } = require("../../core/db");
const Favor = require("./favor");

class Book extends Model {
  //查询所有热门书籍，并返回对应喜欢的数量
  static async getAll() {

    //获取到所有的书籍，并按照index正序
    const books = await Book.findAll({
      order: ['index']
    })
    const ids = []
    books.forEach((book) => {
      ids.push(book.id)
    })

    //再去favor 表中查询点过赞的书籍的数量

    const favors = await Favor.findAll({
      where: {
        type: 400,
        art_id: {
          [Op.in]: ids
        }
      },
      group: ['art_id'],
      attributes: ['art_id', [Sequelize.fn('COUNT', '*'), 'count']]
    })

    books.forEach((book) => {
      let count = 0
      favors.forEach((favor) => {
        if (favor.art_id === book.id) {
          count = favor.get('count')
        }
      })
      book.setDataValue('count', count)
    })
    return books
  }

  static async searchWrold(q) {
    let sql = 'SELECT * FROM `book` WHERE CONCAT(IFNULL(`title`, ""), IFNULL(`author`, "")) LIKE "%' + q + '%"'
    const books = await sequelize.query(sql, { type: QueryTypes.SELECT })
    return books
  }
}

Book.init({
  //序号
  index: DataTypes.INTEGER,
  //封面
  image: DataTypes.STRING,
  //作者: ,
  author: DataTypes.STRING,
  //书名
  title: DataTypes.STRING,
  //类型
  type: {
    type: DataTypes.INTEGER,
    defaultValue: 400
  },
  //点赞数量
  fav_num: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
}, {
  sequelize: sequelize,
  tableName: 'book'
})

module.exports = Book

