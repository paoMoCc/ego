const Joi = require("joi");

// 分类id
const cateId = Joi.number().min(1).required()
// 商品名称
const proName = Joi.string().required()
// 价格  只允许两位小数
const price = Joi.number().precision(2).required()
// 库存  只允许整数
const stock = Joi.number().integer()
// 副标题
const subTitle = Joi.string()
// 详情
const detail = Joi.string()

exports.addPro_schema = {
    body:{
        cateId,
        proName,
        price,
        stock,
        subTitle,
        detail
    }
}
// 只允许数字、字母、中文字符
const keyWord = Joi.string().pattern(/^[\u4E00-\u9FA5A-Za-z0-9]+$/).required()
exports.searchPro_schema = {
    body:{
        keyWord
    }
}
