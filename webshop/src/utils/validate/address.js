// const name = Joi.string().pattern(/[\u4e00-\u9fa5a-zA-Z]/).required()
// const phone = Joi.string().pattern(/^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9]|9[0-3,5-9])\d{8}$/).required()
// const province = Joi.string().pattern(/[\u4e00-\u9fa5]/).required()
// const city = Joi.string().pattern(/[\u4e00-\u9fa5]/).required()
// const district = Joi.string().pattern(/[\u4e00-\u9fa5]/).required()
// const detailAdd = Joi.string().pattern(/[\u4e00-\u9fa50-9a-zA-Z]/).required()

// 验证Name
export function validName(value) {
    const name = /^[\u4e00-\u9fa5a-zA-Z]{2,10}$/
    return name.test(value)
}
// 验证phone
export function validPhone(value) {
    const phone = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9]|9[0-3,5-9])\d{8}$/
    return phone.test(value)
}
// 验证detailAdd
export function validDetailAdd(value) {
    const detailAdd = /[\u4e00-\u9fa50-9a-zA-Z]{5,50}/
    return detailAdd.test(value)
}