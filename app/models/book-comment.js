const { sequelize } = require("../../core/db");
const {Model, DataTypes} = require("sequelize")


class BookComment extends Model{

  static async addComment() {

  }

  //获取书籍对应的短评
  static async findBookComment() {

  }


}

BookComment.init({
  //
  book_id: DataTypes.INTEGER,
  //评论内容
  comment: {
    type: DataTypes.STRING(12)
  },
  //单条评论的点赞数量
  nums: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  tableName: 'book_comment'
})

module.exports = BookComment
