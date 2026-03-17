import axios from 'axios';
import { ElMessage } from 'element-plus';
import { el } from 'element-plus/es/locales.mjs';
// 创建axios实例
const service = axios.create({
  baseURL: '/api', // api的base_url
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 统一添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  },
  error => {
    // 错误提示
    return Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  response => {
    const { data, config } = response;
    if (data.code === '200') {
      return data.data;
    } else {
      if (data.code === '-1') {
        if (!config.url.includes('/login') && !config.url.includes('/user/add')) {
          ElMessage.error(data.msg || '登录过期，请重新登录');
          // 清除token
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          window.location.href = '/auth/login';
        } else {
          ElMessage.error(data.msg || '操作失败');
          return Promise.reject(data.msg || '操作失败');
        }
      } else {
        ElMessage.error(data.msg || '操作失败');
        return Promise.reject(data.msg || '操作失败');
      }
    }
  },
  error => {
    // 对响应错误做点什么
    ElMessage.error(error.message || '网络请求失败');
    return Promise.reject(error);
  }
);
export default service;
