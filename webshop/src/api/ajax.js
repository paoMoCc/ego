//对于axios进行二次封装
import axios from "axios";
import nprogress from "nprogress";
//在当前模块中引入store
import store from '@/store';
//如果出现进度条没有显示：一定是你忘记了引入样式了
import "nprogress/nprogress.css";
//底下的代码也是创建axios实例
let requests = axios.create({
  //基础路径
  baseURL: "http://127.0.0.1:8081",
  //请求不能超过10S
  timeout: 10000,
});

//请求拦截器----在项目中发请求（请求没有发出去）可以做一些事情
requests.interceptors.request.use((config) => {
  //现在的问题是config是什么?配置对象
  //可以让进度条开始动
  nprogress.start();
  //需要携带token带给服务器
  if(store.state.user.token){
    config.headers.Authorization = store.state.user.token;
  }
  if(config.url.indexOf('/order/cancelOrder') !== -1 || config.url.indexOf('/payinfo/pay') !== -1 || config.url.indexOf('/payinfo/repay') !== -1){
    config.headers['Content-Type']="application/json";
    config.data=JSON.stringify(config.data);  
  }
  if(config.url.indexOf('/my/uploadAvatar') !== -1){
    config.headers['Content-Type']='multipart/form-data';
  }
  return config;
});

//响应拦截器----当服务器手动请求之后，做出响应（相应成功）会执行的
requests.interceptors.response.use(
  (res) => {
    //进度条结束
    nprogress.done();
    //相应成功做的事情
    return res.data;
  },
  (err) => {
    alert("服务器响应数据失败");
    console.log(err);
  }
);
//最终需要对外暴露（不对外暴露外面模块没办法使用）
//这里的代码是暴露一个axios实例
export default requests;
