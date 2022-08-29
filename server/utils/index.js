const dayjs = require("dayjs")
// 获取当前时间
const getCurrentTime = dayjs(new Date()).format('YYYY-MM-DD HH-mm-ss')

module.exports = getCurrentTime