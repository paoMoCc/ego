const Joi = require("joi");

// 分类名称
const cateName = Joi.string().required()
// 父节点id
const rootId = Joi.number()

// 添加分类
exports.addCate_schema = {
    body:{
        cateName,
        rootId
    }
}