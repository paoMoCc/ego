// @param value


// 验证userName
export function validUserName(value) {
    const userName = /^[a-zA-Z0-9]{2,10}$/
    return userName.test(value)
}

// 验证passWord
export function validPassWord(value) {
    const passWord = /^[\S]{6,12}$/
    return passWord.test(value)
}

// 验证phone
export function validPhone(value) {
    const phone = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9]|9[0-3,5-9])\d{8}$/
    return phone.test(value)
}

// 验证昵称
export function validNickName(value) {
    const nickName = /^[\u4e00-\u9fa5a-zA-Z][0-9a-zA-Z_\u4e00-\u9fa5]{1,7}/
    return nickName.test(value)
}
