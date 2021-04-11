const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const { sequelize } = require('../../core/db')


class User extends Model {
  static async verifyEmailLogin(account, secret) {
    /**
     * 1. 查询邮箱是否存在
     * 2. 检查邮箱对应的密码是否相等
     */
    const user = await User.findOne({
      where: {
        email: account
      }
    })
    if (!user) {
      throw new Error('该邮箱未注册！')
    }
    if (!bcrypt.compareSync(secret, user.password)) {
      throw new Error('密码不正确！')
    }
    return user
  }

  static async getUserByOPenid(openid) {
    const user = await User.findOne({
      where: {
        openid
      }
    })
    return user
  }

  static async registerByOpenid(openid) {
    return await User.create({
      openid
    })
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickname: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING(128),
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    set(val) {
      //给密码加盐
      const salt = bcrypt.genSaltSync(10)
      const password = bcrypt.hashSync(val, salt)
      this.setDataValue('password', password)
    }
  },
  openid: {
    type: DataTypes.STRING(64),
    unique: true
  }
}, {
  sequelize: sequelize
})


module.exports = User