module.exports = {
  //区分当前的开发环境
  enviroment: 'dev',
  database: {
    dbName: 'zhe',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456'
  },
  security: {
    secretKey: 'dhgfjasfgashj',
    //一个小时   两个小时是上线以后比较合适的
    expiresIn: 60 * 60 * 60
  },
  wx: {
    appId: 'wxa76581e957b602ed',
    appSecret: '2522996e33e64aef2713aff0b35a9bb3',
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session',
  },
}