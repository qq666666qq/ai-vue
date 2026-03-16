import service from '@/util/request';

// 登录接口
export function login(data) {
  return service({
    url: '/user/login',
    method: 'post',
    data
  });
}
// 分类接口
export function getCategoryTree() {
  return service({
    url: '/knowledge/category/tree',
    method: 'get',
  });
}
// 分页列表
export function getKnowledgeArticleList(params) {
  return service({
    url: '/knowledge/article/page',
    method: 'get',
    params
  });
}
// 文件上传
export function uploadFile(file,uuid) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('businessType', 'ARTICLE');
  formData.append('businessField', 'cover');
  formData.append('businessId', uuid);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  return service({
    url: '/file/upload',
    method: 'post',
    data: formData,
    config
  });
}
// 创建文章
export function addKnowledgeArticle(data) {
  return service({
    url: '/knowledge/article',
    method: 'post',
    data
  });
}
// 更新文章
export function updateKnowledgeArticle(id,data) {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'PUT',
    data
  });
}
// 文章详情
export function getArticleDetail(id) {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'get'
  });
}
// 删除文章
export function deleteArticle(id) {
  return service({
    url: `/knowledge/article/${id}`,
    method: 'delete'
  });
}
// 更新文章状态
export function updateArticleStatus(id,data) {
  return service({
    url: `/knowledge/article/${id}/status`,
    method: 'PUT',
    data
  });
}




// 咨询记录
export function getSessionList(params) {
  return service({
    url: '/psychological-chat/sessions',
    method: 'get',
    params
  });
}

// 会话消息列表
export function getMessageList(sessionId) {
  return service({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: 'get'
  });
}





// 情绪日志
export function getMoodJournalList(params) {
  return service({
    url: '/emotion-diary/admin/page',
    method: 'get',
    params
  });
}
// 删除情绪日志
export function deleteMoodJournal(id) {
  return service({
    url: `/emotion-diary/admin/${id}`,
    method: 'delete'
  });
}



// 统计
export function getOverview() {
  return service({
    url: '/data-analytics/overview',
    method: 'get'
  });
}

// 退出登录
export function logout() {
  return service({
    url: '/user/logout',
    method: 'post'
  });
}






