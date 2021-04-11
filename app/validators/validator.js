const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const User = require('../models/user')
const { LoginType, ArtType } = require('../lib/enum');

class TestValidator extends LinValidator {
  constructor() {
    super()
    this.id = [
      new Rule("isInt", "必须为正整数", { min: 1 })
    ];
  }
}


class RegisterValidator extends LinValidator {
  constructor() {
    super()
    this.email = [new Rule('isEmail', 'email格式不正确！')]
    this.nickname = [new Rule('isLength', '昵称在2-32个字符之间', {
      min: 2,
      max: 32
    })]
    this.password = [
      new Rule('isLength', '密码长度在6-16位之间', { min: 6, max: 16 }),
      new Rule('matches', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
    ]
    this.password1 = this.password
  }
  validatePassword(vals) {
    const password = vals.body.password
    const password1 = vals.body.password1
    if (password !== password1) {
      throw new Error('两次输入密码不行同！')
    }
  }

  async validateEmail(vals) {
    //验证数据库中是否存在email
    const email = vals.body.email
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (user) {
      throw new Error('该邮箱已注册！')
    }
  }
}

class TokenValidator extends LinValidator {
  constructor() {
    super()
    this.account = [
      new Rule('isLength', '不符合账号规则', {
        min: 6,
        max: 32
      })
    ]

    this.secret = [
      //可以传也可以不传
      new Rule('isOptional'),
      new Rule('isLength', '至少6个字符', {
        min: 6,
        max: 128
      })
    ]
  }

  validateType(vals) {
    if (!vals.body.type) {
      throw new Error('type不能为空')
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error('type类型不正确')
    }
  }
}

class NotEmptyValidator extends LinValidator {
  constructor() {
    super()
    this.token = [
      new Rule('isLength', '不允许为空', { min: 1 })
    ]
  }
}

function checkArtType(vals) {
  if (!vals.body.type) {
    throw new Error('type不能为空')
  }
  if (!ArtType[vals.body.type]) {
    throw new Error('type类型不正确')
  }
}

function checkArtTypeInPath(vals) {
  if (!vals.path.type) {
    throw new Error('type不能为空')
  }
  if (!ArtType[vals.path.type]) {
    throw new Error('type类型不正确')
  }
}

class FavorParamsValidator extends LinValidator {
  constructor() {
    super()
    this.artId = [
      new Rule('isLength', '不允许为空', { min: 1 })
    ]
    this.validateType = checkArtType
  }
}


class ClassicDetailValidator extends LinValidator {
  constructor() {
    super()
    this.artId = [
      new Rule('isLength', '不允许为空', { min: 1 })
    ]
    this.validateType = checkArtTypeInPath
  }
}

class BookSearch extends LinValidator {
  constructor() {
    super()
    this.q = [
      new Rule('isLength', '参数不能为空', { min: 1, max: 32 })
    ]
  }
}

class ClassicValidator extends LinValidator {
  constructor() {
    super()
    this.index = [new Rule('isInt', '必须为正整数', { min: 0 })]
  }
}

module.exports = {
  TestValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  FavorParamsValidator,
  ClassicDetailValidator,
  BookSearch,
  ClassicValidator
}