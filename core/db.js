const Sequelize = require('sequelize')
const {
  dbName,
  host,
  port,
  user,
  password
} = require('../config/config').database


const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  // logging: true,
  timezone: '+08:00',
  define: {
    //属性添加下划线
    underscored: true,
    timestamps: true,
    //执行destroy命令不会删除模型
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    freezeTableName: true
  }
})

sequelize.sync(
  // { alter: true }
  // { force: true } 
)


module.exports = {
  sequelize: sequelize
}