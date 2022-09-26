const express = require("express")
const cors = require("cors")

const userRouter = require('./router/user')
const userInfoRouter = require('./router/userInfo')
const cateRouter = require("./router/cate")
const productRouter = require("./router/product")
const cartRouter = require("./router/cart")
const addressRouter = require("./router/address")
const orderRouter = require("./router/order")
const payinfoRouter = require("./router/payinfo")
const commentRouter = require("./router/comment")
const adminRouter = require("./router/admin")

const app = express()
// 注册解析body中间件
const bodyParser = require("body-parser")
const joi = require("joi")
const config = require('./config')
//导入解析token的中间件
const { expressjwt: jwt, expressjwt } = require("express-jwt");
// 解决跨域问题
app.use(cors())
// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

const db = require("./db")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// 注册一个全局中间件封装res.send()为res.cc()简化代码
app.use(function (req, res, next) {
    // status = 200 为成功； status = 100 为失败； 默认将 status 的值设置为 100，方便处理失败的情况
    res.cc = function (err, status = 100) {
        res.send({
            // 
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证                  除了用户接口，获取分类，根据分类获取全部商品，获取全部在售商品，搜索商品
app.use(expressjwt({ secret: config.jwtSecretKey,algorithms: ['HS256'] }).unless({ path: [/^\/user\/|\/cate\/getCate|\/product\/getPro|\/product\/getAllPro|\/product\/searchPro|\/userAvatars\/|\/productImgs\/|\/comment\/getComment/] }))

// 配置路由,以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/user', userRouter)
app.use('/my',userInfoRouter)
app.use('/cate',cateRouter)
app.use('/product',productRouter)
app.use('/cart',cartRouter)
app.use('/address',addressRouter)
app.use('/order',orderRouter)
app.use('/payinfo',payinfoRouter)
app.use('/comment',commentRouter)
app.use('/admin',adminRouter)


// 共享静态资源
app.use(express.static(__dirname+"/public"))
// 在 `app.js` 的全局错误级别中间件中，捕获验证失败的错误，并把验证失败的结果响应给客户端：
app.use(function (err,req,res,next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误   
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！',401)
    // 其他未知错误
    res.cc(err)
})

app.listen(8081, function () {
    console.log("app running at http://127.0.0.1:8081");
})