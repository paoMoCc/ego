const Joi = require("joi");


const proId = Joi.number().integer().min(1).required()

const quantity = Joi.number().integer().min(1)

const productImgs = Joi.string().required()

//加入购物车 
exports.addCart_schema = {
    body:{
        proId,
        quantity,
        productImgs
    }
}
// 修改购物车中商品数量
exports.changeQuantity_schema = {
    body:{
        proId,
        quantity
    }
}
