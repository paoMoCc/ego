//统一管理项目接口的模块
//引入二次封装的axios（带有请求、响应的拦截器）
import axios from "./ajax";
import qs from 'qs'

// user

// 登录
export const userLogin = (data) => axios.post('/user/login', data)
// 注册
export const userRegist = (data) => axios.post('/user/regist', data)
// 获取用户信息
export const getUserInfo = () => axios.get('/my/userInfo')
// 更新用户信息
export const updateUserInfo = (data) => axios.post('/my/userInfo', data)
// 修改密码
export const resetPassWord = (data) => axios.post('/my/updatePassWord', data)
// 修改头像
export const updateAvatar = (data) => axios.post('/my/uploadAvatar', data)


// category

// 添加分类
export const addCate = (data) => axios.post('/cate/addCate', data)
// 获取全部分类
export const getCate = () => axios.get('/cate/getCate')


// product

// 获取分类id获取商品
export const getProByCateId = (data) => axios({ url: '/product/getPro', method: 'post', data: data })
// 获取所有在售商品
export const getAllPro = () => axios.get('/product/getAllPro')
// 获取我出售的商品
export const getMyPro = () => axios.get('/product/getMyPro')
// 搜索商品
export const searchPro = (keyword) => axios.post('/product/searchPro', keyword)
// 添加商品
export const addPro = (data) => axios.post('/product/addPro', data)
// 下架或重新上架我的商品
export const changeProState = (data) => axios.post('/product/changeProStatus', data)
// 删除商品
export const delPro = (proId) => axios.delete('/product/changeProStatus', proId)


// cart

// 添加至购物车
export const addToCart = (data) => axios({ url: '/cart/addToCart', method: 'post', data: data })
// 移出购物车
export const removeFromCart = (carId) => axios({ url: '/cart/removeFromCart', method: 'delete', data: { carId } })
// 移出购物车(传递数组参数)
export const removeFromCart2 = (carId) => axios({ url: '/cart/removeFromCart', method: 'delete', params: { carId }, paramsSerializer: params => qs.stringify(params, { indices: false }) })
// 修改商品数量
export const changeQuantity = (data) => axios({ url: '/cart/changeQuantity', method: 'post', data: data })
// 获取购物车内商品
export const getCartPro = () => axios({ url: '/cart/getCartPro', method: 'get' })


// address

// 获取地址
export const getAddress = () => axios({ url: '/address/getAddress', method: 'get' })
// 新增地址  
export const addAddress = (data) => axios({ url: '/address/addAddress', method: 'post', data: data })
// 修改地址
export const updateAddress = (data) => axios({ url: '/address/updateAddress', method: 'post', data: data })
// 删除地址
export const deleteAddress = (addressId) => axios({ url: '/address/deleteAddress', method: 'delete', data: { addressId } })


// order

// 获取订单
export const getOrder = (type) => axios({ url: '/order/getOrder', method: 'get', data: { type } })
// 取消订单 传递一个数组
export const cancelOrder = (cancelOrderIds) => axios({url: '/order/cancelOrder', method: 'post', data: {cancelOrderIds}})
// 发货
export const sendPro = (orderId) => axios({ url: '/order/sendPro', method: 'post', data: { orderId } })
// 收货
export const receivePro = (orderId) => axios({ url: '/order/receivePro', method: 'post', data: { orderId } })


// payInfo

// 支付&下单（不管结果如何都会下单）
export const pay = (data) => axios({ url: '/payinfo/pay', method: 'post', data })
// 重新支付
export const repay = (data) => axios({ url: '/payinfo/repay', method: 'post', data })
// 获取支付信息
export const getPayinfo = (data) => axios({ url: '/payinfo/getPayinfo', method: 'get', data })


// comment

// 评价
export const evaluate = (data) => axios({ url: '/comment/eval', method: 'post', data })
// 删除评价
export const delComment = (commentId) => axios({ url: '/comment/delComment', method: 'delete', data: { commentId } })
// 获取评价
export const getComment = (proId) => axios({ url: '/comment/getComment', method: 'get', data: { proId } })
