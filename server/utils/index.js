const dayjs = require("dayjs")
// 获取当前时间
let getCurrentTime = dayjs(new Date()).format('YYYY-MM-DD HH-mm-ss')

module.exports = getCurrentTime