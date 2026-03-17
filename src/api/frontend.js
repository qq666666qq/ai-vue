import service from '@/util/request'

// 注册接口
export function register(data) {
  return service({
    url: '/user/add',
    method: 'post',
    data
  });
}