function isThisType(value) {
  for (let key in this) {
    if (value === this[key]) {
      return true
    }
  }
  return false
}


const LoginType = {
  USER_MINI_PROGRAM: 100,
  USER_EMAIL: 101,
  USER_MOBILE: 102,
  ADMIN_EMAIL: 200,
  isThisType
}

const ArtType = {
  100: '句子',
  200: '电影',
  300: '音乐',
  400: '书籍'
}

module.exports = {
  LoginType,
  ArtType
}