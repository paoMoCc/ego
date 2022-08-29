const Joi = require("joi");

const name = Joi.string().pattern(/[\u4e00-\u9fa5a-zA-Z]/).required()
const phone = Joi.string().pattern(/^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9]|9[0-3,5-9])\d{8}$/).required()
const area = Joi.string().pattern(/[\u4e00-\u9fa5|\-]/).required()
const detailAdd = Joi.string().pattern(/[\u4e00-\u9fa50-9a-zA-Z]/).required()

exports.addAddress_schema = {
    body:{
        name,
        phone,
        area,
        detailAdd
    }
}