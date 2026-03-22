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
// 创建或或更新情绪日记
export function createOrUpdateEmotionDiary(data) {
  return service({
    url: '/emotion-diary',
    method: 'post',
    data
  });
}
// 查询知识文章列表
export function getKnowledgeList(params) {
  return service({
    url: '/knowledge/article/page',
    method: 'get',
    params
  });
}
// 查询知识文章详情
export function getKnowledgeDetail(id) {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'get'
  });
}
