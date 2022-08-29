// 导入验证规则包
const joi = require('joi');

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名验证规则
const userName = joi.string().alphanum().min(2).max(10).required()
// 密码验证规则
const passWord = joi.string().pattern(/^[\S]{6,12}$/).required()
// 电话号码
// ^:代表起始，即手机号码只能以1为开头
// 3[0-9]：代表手机号码第二位可以是3，第三位可以是0-9中任意一个数字
// 5[0-3,5-9]：代表手机号码第二位也可以是5，第三位是0-3和5-9中的任意一个数字
// 在这里，以3开头的，以5开头的，以8开头,以及以9开头的四种情况，我们用“|”来将他们隔开
// \d：匹配一个数字字符，等价于 [0-9]
// $:终止符，代表不可以再有第12位了
const phone = joi.string().pattern(/^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9]|9[0-3,5-9])\d{8}$/).required()
// 角色:0-管理员,1-商家,2-普通用户
const role = joi.number().integer().min(0).max(2).required()
// 用户昵称：以汉字或字母开头，有2-8位数字，字母，下划线，汉字组成
const nickName = joi.string().pattern(/^[\u4e00-\u9fa5a-zA-Z][0-9a-zA-Z_\u4e00-\u9fa5]{1,7}/).required()
// 性别：性别：2-未知，1-男，0-女；默认未知
const sex = joi.number().min(0).max(2).required()
// 个人介绍
const introduce = joi.string()
// 用户头像
// dataUri() 指的是如下格式的字符串数据(base64)：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

// 登陆注册规则对象
exports.reg_login_schema = {
    // 需要对req.body中的数据验证
    body: {
        userName,
        passWord,
        role,
    },
    // params
    // query
}
// 修改用户基本信息规则对象
exports.updateUserInfo_schema = {
    body: {
        phone,
        nickName,
        sex,
        introduce
    }
}
// 重置密码规则对象
exports.updatePassWord_schema = {
    body: {
        // 使用 password 这个规则，验证 req.body.oldPwd 的值
        oldPassWord: passWord,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPassWord: joi.not(joi.ref('oldPassWord')).concat(passWord),
    }
}
