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
// 搜索商品
export const searchPro = (keyword) => axios.post('/product/searchPro', keyword)
// 添加商品
export const addPro = (data) => axios.post('/product/addPro', data)


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
export const getOrder = (type) => axios({ url: '/order/getOrder', method: 'post', data: { type } })
// 取消订单 传递一个数组
export const cancelOrder = (cancelOrderIds) => axios({ url: '/order/cancelOrder', method: 'post', data: { cancelOrderIds } })
// 发货
export const sendPro = (data) => axios.post('/order/sendPro', data, qs.stringify(data, { indices: false }))
// 收货
export const receivePro = (orderId) => axios({ url: '/order/receivePro', method: 'post', data: { orderId } })
// 删除订单
export const delOrder = (data) => axios.post('/order/delOrder', data, qs.stringify(data, { indices: false }))


// payInfo

// 支付&下单（不管结果如何都会下单）
export const pay = (data) => axios({ url: '/payinfo/pay', method: 'post', data })
// 重新支付
export const repay = (data) => axios({ url: '/payinfo/repay', method: 'post', data })
// 获取支付信息
export const getPayinfo = (data) => axios({ url: '/payinfo/getPayinfo', method: 'get', data })
//立即购买
export const buyNow = (data) => axios({ url: '/payinfo/buyNow', method: 'post', data })


// comment

// 评价
export const evaluate = (data) => axios({ url: '/comment/eval', method: 'post', data })
// 删除评价
export const delComment = (commentId) => axios({ url: '/comment/delComment', method: 'delete', data: { commentId } })
// 获取评价
export const getComment = (proId) => axios({ url: '/comment/getComment', method: 'post', data: { proId } })


// admin

// 根据角色获取后台展示数据
export const getBackendData = (data) => axios({ url: '/admin/getData', method: 'post', data })
// 根据角色获取/筛选所有商品(带分页功能)
export const fetchList = (data) => axios({ url: '/admin/fetchList', method: 'post', data })
// 下架或重新上架商品
export const changeProState = (data) => axios.post('/admin/changeProStatus', data, qs.stringify(data, { indices: false }))
// 删除商品
export const delPro = (proIds) => axios({ url: '/admin/delPro', method: 'delete', params: { proIds }, paramsSerializer: params => qs.stringify(params, { indices: false }) })
// 修改库存
export const changeProStock = (data) => axios({ url: '/admin/changeProStock', method: 'post', data })
// 根据商品id获取商品信息
export const getProById = (proId) => axios({ url: '/admin/getProById', method: 'post', data:{proId} })
// 修改商品信息
export const updatePro = (data) => axios({ url: '/admin/updatePro', method: 'post', data })
// 根据rootId获取分类信息
export const getCateByRootId = (data) => axios({ url: '/admin/getCateByRootId', method: 'post', data })
// 删除分类 
export const delCate = (cateId) => axios({ url: '/admin/delCate', method: 'delete', data: { cateId } })
// 修改分类 
export const updateCate = (data) => axios({ url: '/admin/updateCate', method: 'post', data })
// 根据id获取分类
export const getCateByCateId = (cateId) => axios({ url: '/admin/getCateByCateId', method: 'post', data: { cateId } })
// 获取订单
export const getOrderData = (data) => axios({ url: '/admin/getOrderData', method: 'post', data })
// 获取订单
export const getOrderById = (orderId) => axios({ url: '/admin/getOrderById', method: 'post', data: { orderId } })
// 获取未审核的商品
export const getUncheckedPro = (data) => axios({ url: '/admin/getUncheckedPro', method: 'post', data })
// 审核商品
export const checkPro = (data) => axios.post('/admin/checkPro', data, qs.stringify(data, { indices: false }))
// 获取未审核的分类
export const getUncheckedCate = (data) => axios({ url: '/admin/getUncheckedCate', method: 'post', data })
// 审核分类
export const checkCate = (data) => axios.post('/admin/checkCate', data, qs.stringify(data, { indices: false }))
// 获取所有用户
export const getAllUser = (data) => axios({ url: '/admin/getAllUser', method: 'post', data })
// 删除用户
export const delUser = (userIds) => axios({ url: '/admin/delUser', method: 'delete', params: { userIds }, paramsSerializer: params => qs.stringify(params, { indices: false }) })
// 封禁用户
export const banUser = (data) => axios.post('/admin/banUser', data, qs.stringify(data, { indices: false }))
// 修改用户权限 
export const changeRole = (data) => axios({ url: '/admin/changeRole', method: 'post', data })

