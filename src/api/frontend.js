import service from '@/util/request'

// 注册接口
export function register(data) {
  return service({
    url: '/user/add',
    method: 'post',
    data
  });
}

export function startSession(data) {
  return service({
    url: '/psychological-chat/session/start',
    method: 'post',
    data
  });
}

export function getSessionList(params) {
  return service({
    url: '/psychological-chat/sessions',
    method: 'get',
    params
  });
}
export function deleteSession(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}`,
    method: 'delete',
  });
}

// 获取会话消息
export function getSessionMessages(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: 'get',
  });
}
//获取会话情绪分析结果
export function getSessionEmotion(sessionId) {
  return service({
    url: `/psychological-chat/session/${sessionId}/emotion`,
    method: 'get',
  });
}
