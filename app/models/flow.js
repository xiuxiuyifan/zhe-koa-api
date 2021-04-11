const { Model, DataTypes } = require("sequelize");
const { sequelize} = require("../../core/db");

class Flow extends Model {

}

Flow.init({
  //期刊序号
  index: DataTypes.INTEGER,
  //句子、音乐、电影 表中的主键
  art_id: DataTypes.INTEGER,
  //期刊的类型
  //  100 句子
  //  200 电影
  //  300 音乐
  type: DataTypes.INTEGER
}, {
  sequelize: sequelize,
  tableName: 'flow'
})

module.exports = Flow