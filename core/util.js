const jwt = require('jsonwebtoken')
const config = require('../config/config')
/***
 * 
 */
const findMembers = function (instance, {
    prefix,
    specifiedType,
    filter
}) {
    // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null)
            return []

        let names = Reflect.ownKeys(instance)
        names = names.filter((name) => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name)
        })

        return [...names, ..._find(instance.__proto__)]
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true
            }
        }
        if (prefix)
            if (value.startsWith(prefix))
                return true
        if (specifiedType)
            if (instance[value] instanceof specifiedType)
                return true
    }

    return _find(instance)
}


// 调用generateToken方法
/**
 * 
 * @param {*} uid 用户在数据库中的id
 * @param {*} scope 我们赋予给用户的权限值 用来决定此用户的权限作用域。
 * 我们在配置文件中定义了token相关的2个配置项，一个是密钥，一个是过期时间，
 * 利用Jwt提供的sign方法生成token，第一个参数是对象，里面规定了我们要放进去的内容（用户的uid 和 权限），第二个参数是密钥，第三个参数是对象，里面定义了过期时间。
 * 最后这个方法返回一个token,这个token带有用户的id和权限值。
 */
const generateToken = function (uid, scope) {
    const secretKey = config.security.secretKey
    const expiresIn = config.security.expiresIn
    const token = jwt.sign({
        uid,
        scope
    }, secretKey, {
        expiresIn: expiresIn
    })
    return token
}

module.exports = {
    findMembers,
    generateToken,
}