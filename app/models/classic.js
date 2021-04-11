const { sequelize } = require('../../core/db')

const { DataTypes, Model } = require("sequelize");

const classicFields = {
  //封面
  image: DataTypes.STRING,
  //内容
  content: DataTypes.STRING,
  //发布时间
  pubdate: DataTypes.DATEONLY,
  //点赞数量
  fav_num: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  //标题
  title: DataTypes.STRING,
  //类型
  type: DataTypes.INTEGER
}

class Movie extends Model {
}

Movie.init(classicFields, {
  sequelize: sequelize,
  tableName: 'movie'
})

class Sentence extends Model {
}

Sentence.init(classicFields, {
  sequelize: sequelize,
  tableName: 'sentence'
})

class Music extends Model {
}

Music.init({
  url: DataTypes.STRING,
  ...classicFields
}, {
  sequelize: sequelize,
  tableName: 'music'
})

module.exports = {
  Sentence,
  Movie,
  Music
}