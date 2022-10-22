const dayjs = require("dayjs")
// 格式化时间
function format(time){
    return dayjs(new Date(time)).format('YYYY-MM-DD')
}

module.exports = format