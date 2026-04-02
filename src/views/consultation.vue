<template>
  <div class="stardew-consultation">
    <!-- 农场背景 -->
    <div class="farm-background">
      <div class="sky">
        <div class="sun"></div>
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
      <div class="land">
        <div class="grass"></div>
        <div class="fence"></div>
        <div class="crops">
          <div class="crop" v-for="i in 8" :key="i"></div>
        </div>
        <div class="barn"></div>
        <div class="tree tree-1"></div>
        <div class="tree tree-2"></div>
      </div>
    </div>
    
    <!-- 装饰元素 -->
    <div class="decorations">
      <div class="floating-heart" v-for="i in 5" :key="i"></div>
      <div class="sparkle" v-for="i in 8" :key="i"></div>
    </div>
    
    <div class="game-container">
      <div class="left-panel">
        <!-- NPC卡片 -->
        <div class="npc-card">
          <div class="npc-avatar" :class="{ 'talking': isAiTyping, 'waving': !isAiTyping }">
            <div class="npc-head">
              <div class="npc-hair"></div>
              <div class="npc-face">
                <div class="npc-eyes">
                  <div class="npc-eye"></div>
                  <div class="npc-eye"></div>
                </div>
                <div class="npc-mouth" :class="{ 'talking': isAiTyping, 'smile': !isAiTyping }"></div>
              </div>
            </div>
            <div class="npc-body">
              <div class="npc-arm left"></div>
              <div class="npc-arm right"></div>
            </div>
            <div class="npc-legs">
              <div class="npc-leg left"></div>
              <div class="npc-leg right"></div>
            </div>
          </div>
          <div class="npc-info">
            <h3>小暖</h3>
            <div class="status-badge">
              <span class="status-dot"></span>
              在线服务中
            </div>
            <div class="speech-bubble small" v-if="!isAiTyping">
              <div class="bubble-content">
                <p>你好！有什么可以帮助你的吗？</p>
              </div>
              <div class="bubble-tail"></div>
            </div>
          </div>
        </div>

        <!-- 情绪花园卡片 -->
        <div class="emotion-garden-card">
          <div class="garden-header">
            <span class="garden-icon">🌻</span>
            <span>情绪花园</span>
          </div>
          <div class="emotion-display">
            <div class="emotion-circle" :style="{ background: getEmotionColor(currentEmotion.emotionScore) }">
              <span class="emotion-label">{{ currentEmotion.primaryEmotion }}</span>
              <span class="emotion-score">{{ currentEmotion.emotionScore }}</span>
            </div>
            <div class="emotion-plant" :class="getEmotionPlant(currentEmotion.emotionScore)"></div>
          </div>
          <div class="emotion-status">
            <span class="status-label">今日心情</span>
            <span class="status-value" :class="{ 'negative': currentEmotion.isNegative }">
              {{ currentEmotion.isNegative ? '需要关注' : '很不错' }}
            </span>
          </div>
          <div class="risk-indicator">
            <div class="risk-dots">
              <span class="risk-dot" v-for="i in 3" :key="i" 
                    :class="{ 'active': getIntensityClass(currentEmotion.emotionScore) >= i }"></span>
            </div>
            <span class="risk-text">{{ getRiskTest(currentEmotion.riskLevel) }}</span>
          </div>
          <div class="suggestion-box" v-if="currentEmotion.suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
          </div>
          <div class="action-list" v-if="currentEmotion.improvementSuggestions.length > 0">
            <div class="action-title">🌱 治愈行动</div>
            <div class="action-item" v-for="(action, index) in currentEmotion.improvementSuggestions" :key="index">
              <span class="action-icon">✨</span>
              {{ action }}
            </div>
          </div>
        </div>

        <!-- 会话记录卡片 -->
        <div class="session-list-card">
          <div class="card-header">
            <span>📜 会话记录</span>
            <el-button class="new-session-btn" @click="createNewFrontendSession" size="small">
              <el-icon><Plus /></el-icon>
              新对话
            </el-button>
          </div>
          <div class="session-items">
            <div class="session-item" v-for="item in sessionList" :key="item.id" 
                 @click="handleSessionClick(item)"
                 :class="{ 'active': currentSession?.sessionId === 'session_' + item.id }">
              <div class="session-title">{{ item.sessionTitle }}</div>
              <div class="session-meta">
                <span>{{ item.startedAt }}</span>
                <span class="session-count">💬 {{ item.messageCount || 0 }}</span>
              </div>
              <el-button class="delete-btn" text size="small" @click.stop="handleDeleteSession(item.id)">
                <el-icon><DeleteFilled /></el-icon>
              </el-button>
            </div>
            <div class="empty-session" v-if="sessionList.length === 0">
              <span>🌾 还没有会话记录</span>
              <p>开始一段新的对话吧！</p>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-panel">
        <div class="chat-header">
          <div class="header-info">
            <div class="npc-mini-avatar" :class="{ 'talking': isAiTyping }">
              <div class="mini-head"></div>
              <div class="mini-body"></div>
            </div>
            <div class="header-text">
              <h2>小暖的农场咨询室</h2>
              <p>在这个温馨的农场里，我们一起度过美好时光</p>
            </div>
            <div class="header-decoration">
              <div class="flower"></div>
              <div class="flower"></div>
            </div>
          </div>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <!-- 欢迎消息 -->
          <div class="welcome-message" v-if="messages.length === 0">
            <div class="welcome-npc">
              <div class="npc-avatar-large">
                <div class="npc-head-large">
                  <div class="npc-hair-large"></div>
                  <div class="npc-face-large">
                    <div class="npc-eyes-large">
                      <div class="npc-eye-large"></div>
                      <div class="npc-eye-large"></div>
                    </div>
                    <div class="npc-mouth-large smile"></div>
                  </div>
                </div>
                <div class="npc-body-large">
                  <div class="npc-arm-large left"></div>
                  <div class="npc-arm-large right"></div>
                </div>
                <div class="npc-legs-large">
                  <div class="npc-leg-large left"></div>
                  <div class="npc-leg-large right"></div>
                </div>
              </div>
              <div class="welcome-animals">
                <div class="chicken"></div>
                <div class="dog"></div>
              </div>
            </div>
            <div class="speech-bubble welcome">
              <div class="bubble-content">
                <p>欢迎来到小暖的农场！我是你的AI心理健康助手小暖。在这里，我们可以像朋友一样聊天，分享你的心情和烦恼。今天你感觉怎么样？有什么想要告诉我吗？</p>
              </div>
              <div class="bubble-tail"></div>
            </div>
          </div>

          <!-- 聊天消息 -->
          <div v-for="msg in messages" :key="msg.id" 
               class="message-row"
               :class="msg.senderType === 1 ? 'user-row' : 'npc-row'">
            <div class="npc-mini" v-if="msg.senderType === 2">
              <div class="mini-avatar-npc" :class="{ 'talking': isAiTyping && msg === messages[messages.length - 1] }">
                <div class="mini-head-npc"></div>
                <div class="mini-body-npc"></div>
              </div>
            </div>
            
            <div class="speech-bubble" :class="msg.senderType === 1 ? 'user' : 'npc'">
              <div class="bubble-content">
                <div v-if="msg.senderType === 2 && isAiTyping && !msg.content" class="typing-dots">
                  <span></span><span></span><span></span>
                </div>
                <div v-else-if="msg.isError" class="error-text">
                  😢 {{ msg.content }}
                </div>
                <MarkdownRenderer v-else-if="msg.senderType === 2" :content="msg.content" :is-ai-message="true" />
                <p v-else v-html="formatMessageContent(msg.content)"></p>
              </div>
              <div class="bubble-tail" v-if="msg.senderType === 1"></div>
              <div class="bubble-tail npc-tail" v-else></div>
            </div>
            
            <div class="user-mini" v-if="msg.senderType === 1">
              <div class="mini-avatar-user">
                <div class="mini-head-user"></div>
                <div class="mini-body-user"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="input-wrapper">
            <el-input
              v-model="userMessage"
              type="textarea"
              :rows="3"
              :disabled="isAiTyping"
              @keydown="handleKeyDown"
              placeholder="在这个农场里，你想和小暖说些什么呢..."
              class="stardew-input"
              maxlength="500"
              show-word-limit
            />
            <div class="input-hint">
              <span>🌾 Enter 发送 | Shift+Enter 换行</span>
            </div>
          </div>
          <el-button 
            class="send-btn" 
            :disabled="!userMessage.trim() || isAiTyping || userMessage.length > 500"
            @click="sendMessage">
            <span class="btn-icon">🚜</span>
            <span class="btn-text">发送</span>
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 像素边框 -->
    <div class="pixel-border top"></div>
    <div class="pixel-border bottom"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus';
import { DeleteFilled, Plus } from '@element-plus/icons-vue';
import { startSession, getSessionList, deleteSession, getSessionMessages, getSessionEmotion } from '@/api/frontend';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const messagesContainer = ref(null)
const messages = ref([])
const userMessage = ref('')
const isAiTyping = ref(false)
const currentSession = ref(null)
const sessionList = ref([])

const currentEmotion = ref({
  primaryEmotion: '中性',
  emotionScore: 50,
  isNegative: false,
  suggestion: '情绪状态平稳',
  riskLevel: '0',
  improvementSuggestions: [],
  riskDescription: '',
})

const createNewFrontendSession = () => {
  const createNewSession = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',
    sessionTitle: '新对话',
  }
  currentSession.value = createNewSession
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const getEmotionColor = (score) => {
  if (score >= 70) return 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)'
  if (score >= 50) return 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)'
  if (score >= 30) return 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)'
  return 'linear-gradient(135deg, #E57373 0%, #F44336 100%)'
}

const fetchSessionEmotion = (sessionId) => {
  const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`
  getSessionEmotion(id).then(res => {
    currentEmotion.value = res
  })
}

const getIntensityClass = (score) => {
  if (score >= 61) return 3
  if (score >= 31) return 2
  return 1
}

const getRiskTest = (riskLevel) => {
  switch (riskLevel) {
    case '0': return '正常'
    case '1': return '关注'
    case '2': return '预警'
    case '3': return '危机'
    default: return '未知'
  }
}

const getEmotionPlant = (score) => {
  if (score >= 70) return 'flower'
  if (score >= 50) return 'sapling'
  if (score >= 30) return 'seed'
  return 'wilted'
}

const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

const sendMessage = () => {
  if (!userMessage.value.trim()) return
  if (isAiTyping.value) {
    ElMessage.error('小暖正在输入中，请稍后');
    return;
  }
  const message = userMessage.value.trim()
  userMessage.value = ''
  
  if (currentSession.value.status === 'TEMP') {
    startNewMessage(message)
  } else {
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createdAt: new Date().toISOString()
    })
    scrollToBottom()
    startAIResponse(currentSession.value.sessionId, message)
  }
}

const startNewMessage = (message) => {
  const sessionParams = {
    initialMessage: message,
  }
  if (currentSession.value.sessionTitle === '新对话') {
    sessionParams.sessionTitle = `小暖的对话_${new Date().toLocaleString()}`
  } else {
    sessionParams.sessionTitle = currentSession.value.sessionTitle
  }
  
  startSession(sessionParams).then(res => {
    const sesssionData = {
      sessionId: res.sessionId,
      status: res.status,
      sessionTitle: sessionParams.sessionTitle,
    }
    if (currentSession.value && currentSession.value.status === 'TEMP') {
      Object.assign(currentSession.value, sesssionData)
    } else {
      currentSession.value = sesssionData
    }
    getSessionPage()
    messages.value.push({
      id: Date.now(),
      senderType: 1,
      content: message,
      createdAt: new Date().toISOString()
    })
    scrollToBottom()
    startAIResponse(currentSession.value.sessionId, message)
  })
}

const startAIResponse = (sessionId, userMessage) => {
  if (isAiTyping.value) {
    ElMessage.error('小暖正在输入中，请稍后');
    return
  }

  isAiTyping.value = true

  const aiMessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    senderType: 2,
    content: '',
    createdAt: new Date().toISOString()
  }
  messages.value.push(aiMessage)
  scrollToBottom()
  
  const controller = new AbortController();

  fetchEventSource('/api/psychological-chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Token: localStorage.getItem('token'),
      accept: 'text/event-stream',
    },
    body: JSON.stringify({
      sessionId,
      userMessage,
    }),
    signal: controller.signal,
    onopen: (response) => {
      if (response.headers.get('Content-Type') !== 'text/event-stream') {
        ElMessage.error('服务器返回非事件流格式')
        controller.abort()
        return
      }
    },
    onmessage: (event) => {
      const raw = event.data.trim()
      if (!raw) return
      const eventName = event.event
      const aiMessage = messages.value[messages.value.length - 1]
      
      if (eventName === 'done') {
        isAiTyping.value = false
        controller.abort()
        fetchSessionEmotion(currentSession.value.sessionId)
        scrollToBottom()
        return
      }
      
      const payload = JSON.parse(raw)
      const ok = String(payload.code) === '200'
      if (ok && payload.data && payload.data.content) {
        aiMessage.content += payload.data.content
        scrollToBottom()
      } else if (!ok) {
        handleError(payload.message || '服务器错误')
      }
    },
    onerror: (err) => {
      handleError('AI回复失败，请重试')
      throw err
    },
    onclose: () => {
      fetchSessionEmotion(currentSession.value.sessionId)
    }
  })
}

const handleError = (error) => {
  const aiMessage = messages.value[messages.value.length - 1]
  if (aiMessage) {
    aiMessage.content = "AI回复失败，请重试"
    aiMessage.isError = true
  }
  isAiTyping.value = false
  ElMessage.error("AI回复失败，请重试")
}

const getSessionPage = () => {
  getSessionList({
    pageNum: 1,
    pageSize: 10,
  }).then(res => {
    sessionList.value = res.records
  })
}

const handleSessionClick = (item) => {
  getSessionMessages(item.id).then(res => {
    messages.value = res
    scrollToBottom()
  })
  fetchSessionEmotion(item.id)
  const sessionData = {
    sessionId: "session_" + item.id,
    status: "ACTIVE",
    sessionTitle: item.sessionTitle,
  }
  currentSession.value = sessionData
}

const handleDeleteSession = (sessionId) => {
  deleteSession(sessionId).then(res => {
    ElMessage.success('删除成功')
    getSessionPage()
  })
}

const formatMessageContent = (content) => {
  return content.replace(/\n/g, '<br>')
}

onMounted(() => {
  getSessionPage()
  createNewFrontendSession()
})
</script>

<style lang="scss" scoped>
.stardew-consultation {
  position: relative;
  min-height: calc(100vh - 70px);
  background: linear-gradient(180deg, #87CEEB 0%, #B3E5FC 40%, #C8E6C9 70%, #81C784 100%);
  overflow: hidden;
}

.sky-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  pointer-events: none;
}

.sun-mini {
  position: absolute;
  top: 20px;
  right: 50px;
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #FFD54F 0%, #FFC107 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px #FFD54F;
  animation: sunPulse 3s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.1); opacity: 1; }
}

.cloud-mini {
  position: absolute;
  background: white;
  border-radius: 30px;
  opacity: 0.8;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 50%;
  }
}

.cloud-m1 {
  top: 30px;
  left: 15%;
  width: 60px;
  height: 25px;
  animation: cloudFloat 12s ease-in-out infinite;
  
  &::before { width: 30px; height: 30px; top: -15px; left: 10px; }
  &::after { width: 20px; height: 20px; top: -8px; left: 30px; }
}

.cloud-m2 {
  top: 60px;
  left: 50%;
  width: 70px;
  height: 28px;
  animation: cloudFloat 15s ease-in-out infinite 2s;
  
  &::before { width: 35px; height: 35px; top: -18px; left: 15px; }
  &::after { width: 25px; height: 25px; top: -10px; left: 40px; }
}

@keyframes cloudFloat {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(40px); }
}

.game-container {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 70px);
}

.left-panel {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.npc-card {
  background: linear-gradient(180deg, #FFF8E1 0%, #FFECB3 100%);
  border: 4px solid #5D4037;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 4px 4px 0 #5D4037;
}

.npc-avatar {
  display: inline-block;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
  
  &.talking {
    animation: npcBounce 0.5s ease-in-out infinite;
  }
}

@keyframes npcBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.npc-head {
  position: relative;
  width: 60px;
  height: 60px;
  background: #FFCC80;
  border-radius: 50% 50% 45% 45%;
  border: 3px solid #5D4037;
  margin: 0 auto;
}

.npc-hair {
  position: absolute;
  top: -10px;
  left: 5px;
  width: 50px;
  height: 30px;
  background: #8D6E63;
  border-radius: 50% 50% 30% 30%;
  border: 2px solid #5D4037;
}

.npc-face {
  position: absolute;
  top: 25px;
  left: 8px;
  width: 44px;
}

.npc-eyes {
  display: flex;
  justify-content: space-between;
  padding: 0 5px;
  margin-bottom: 5px;
}

.npc-eye {
  width: 8px;
  height: 10px;
  background: #3E2723;
  border-radius: 50%;
  
  &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
    margin-top: 2px;
    margin-left: 2px;
  }
}

.npc-mouth {
  width: 15px;
  height: 6px;
  background: #D84315;
  border-radius: 0 0 8px 8px;
  margin: 0 auto;
  
  &.talking {
    animation: mouthMove 0.3s ease-in-out infinite;
  }
}

@keyframes mouthMove {
  0%, 100% { height: 6px; }
  50% { height: 12px; }
}

.npc-body {
  width: 45px;
  height: 50px;
  background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
  border: 3px solid #5D4037;
  border-radius: 8px 8px 4px 4px;
  margin: -3px auto 0;
}

.npc-info {
  h3 {
    font-size: 20px;
    color: #5D4037;
    margin: 0 0 8px 0;
    font-weight: 700;
  }
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #C8E6C9;
  border: 2px solid #4CAF50;
  border-radius: 20px;
  font-size: 12px;
  color: #2E7D32;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4CAF50;
  border-radius: 50%;
  animation: dotPulse 1.5s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.emotion-garden-card {
  background: linear-gradient(180deg, #FCE4EC 0%, #F8BBD9 100%);
  border: 4px solid #5D4037;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 4px 4px 0 #5D4037;
}

.garden-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #5D4037;
  margin-bottom: 15px;
}

.garden-icon {
  font-size: 20px;
}

.emotion-display {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.emotion-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid #5D4037;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 0 #5D4037;
}

.emotion-label {
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.emotion-score {
  font-size: 20px;
  font-weight: 800;
  color: white;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.emotion-status {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
}

.status-label {
  color: #6D4C41;
}

.status-value {
  font-weight: 700;
  color: #4CAF50;
  
  &.negative {
    color: #F44336;
  }
}

.risk-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}

.risk-dots {
  display: flex;
  gap: 4px;
}

.risk-dot {
  width: 10px;
  height: 10px;
  background: #E0E0E0;
  border: 2px solid #5D4037;
  border-radius: 50%;
  
  &.active {
    background: #FF9800;
  }
}

.risk-text {
  font-size: 12px;
  color: #5D4037;
  font-weight: 600;
}

.suggestion-box {
  background: white;
  border: 2px solid #5D4037;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  gap: 8px;
}

.suggestion-icon {
  font-size: 18px;
}

.suggestion-text {
  font-size: 12px;
  color: #5D4037;
  line-height: 1.4;
}

.action-list {
  background: white;
  border: 2px solid #5D4037;
  border-radius: 8px;
  padding: 10px;
}

.action-title {
  font-size: 13px;
  font-weight: 700;
  color: #5D4037;
  margin-bottom: 8px;
}

.action-item {
  font-size: 11px;
  color: #6D4C41;
  padding: 4px 0;
  border-bottom: 1px dashed #E0E0E0;
  
  &:last-child {
    border-bottom: none;
  }
}

.session-list-card {
  flex: 1;
  background: white;
  border: 4px solid #5D4037;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 4px 4px 0 #5D4037;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: linear-gradient(180deg, #C8E6C9 0%, #A5D6A7 100%);
  border-bottom: 3px solid #5D4037;
  font-weight: 700;
  color: #2E7D32;
}

.new-session-btn {
  background: #4CAF50 !important;
  border: 2px solid #2E7D32 !important;
  color: white !important;
  
  &:hover {
    background: #66BB6A !important;
  }
}

.session-items {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.session-item {
  position: relative;
  padding: 12px;
  margin-bottom: 8px;
  background: #FFF8E1;
  border: 2px solid #8D6E63;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #FFECB3;
    transform: translateX(3px);
  }
  
  &.active {
    background: #C8E6C9;
    border-color: #4CAF50;
  }
}

.session-title {
  font-size: 13px;
  font-weight: 600;
  color: #5D4037;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.session-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #8D6E63;
}

.session-count {
  color: #4CAF50;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #F44336 !important;
  
  &:hover {
    color: #D32F2F !important;
  }
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border: 4px solid #5D4037;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #5D4037;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%);
  padding: 15px 20px;
  border-bottom: 3px solid #5D4037;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.npc-mini-avatar {
  width: 45px;
  height: 45px;
  background: #FFCC80;
  border: 3px solid #5D4037;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-head {
  width: 25px;
  height: 25px;
  background: #8D6E63;
  border-radius: 50% 50% 30% 30%;
}

.header-text {
  h2 {
    margin: 0;
    font-size: 22px;
    color: white;
    text-shadow: 2px 2px 0 #2E7D32;
  }
  
  p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #E8F5E9;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(180deg, #FFFDE7 0%, #FFF9C4 100%);
  min-height: 400px;
  max-height: calc(100vh - 280px);
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
}

.npc-avatar-large {
  margin-bottom: 20px;
}

.npc-head-large {
  position: relative;
  width: 100px;
  height: 100px;
  background: #FFCC80;
  border-radius: 50% 50% 45% 45%;
  border: 4px solid #5D4037;
  margin: 0 auto;
}

.npc-hair-large {
  position: absolute;
  top: -15px;
  left: 10px;
  width: 80px;
  height: 50px;
  background: #8D6E63;
  border-radius: 50% 50% 30% 30%;
  border: 3px solid #5D4037;
}

.npc-face-large {
  position: absolute;
  top: 40px;
  left: 15px;
  width: 70px;
}

.npc-eyes-large {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  margin-bottom: 10px;
}

.npc-eye-large {
  width: 14px;
  height: 16px;
  background: #3E2723;
  border-radius: 50%;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 4px;
    width: 5px;
    height: 5px;
    background: white;
    border-radius: 50%;
  }
}

.npc-mouth-large {
  width: 25px;
  height: 10px;
  background: #D84315;
  border-radius: 0 0 15px 15px;
  margin: 0 auto;
  
  &.smile {
    width: 35px;
    height: 18px;
    border-radius: 0 0 20px 20px;
  }
}

.npc-body-large {
  width: 70px;
  height: 80px;
  background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
  border: 4px solid #5D4037;
  border-radius: 12px 12px 6px 6px;
  margin: -5px auto 0;
}

.speech-bubble {
  position: relative;
  max-width: 70%;
  padding: 15px 20px;
  border-radius: 20px;
  border: 3px solid #5D4037;
  box-shadow: 3px 3px 0 #5D4037;
  
  &.welcome {
    background: white;
    max-width: 500px;
  }
  
  &.user {
    background: linear-gradient(180deg, #81C784 0%, #66BB6A 100%);
    border-radius: 20px 20px 5px 20px;
  }
  
  &.npc {
    background: white;
    border-radius: 20px 20px 20px 5px;
  }
}

.bubble-content {
  font-size: 15px;
  line-height: 1.6;
  color: #3E2723;
  
  p {
    margin: 0;
  }
}

.bubble-tail {
  position: absolute;
  bottom: 10px;
  width: 15px;
  height: 15px;
  background: inherit;
  border: 3px solid #5D4037;
  
  .welcome & {
    display: none;
  }
  
  .user & {
    right: -8px;
    background: #66BB6A;
    border-left: none;
    border-top: none;
    transform: rotate(45deg);
  }
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  
  &.user-row {
    flex-direction: row-reverse;
  }
}

.mini-avatar-npc, .mini-avatar-user {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #5D4037;
  flex-shrink: 0;
}

.mini-avatar-npc {
  background: #FFCC80;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.talking {
    animation: avatarBounce 0.4s ease-in-out infinite;
  }
}

@keyframes avatarBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.mini-head-npc {
  width: 22px;
  height: 22px;
  background: #8D6E63;
  border-radius: 50% 50% 30% 30%;
}

.mini-avatar-user {
  background: linear-gradient(180deg, #90CAF9 0%, #64B5F6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-head-user {
  width: 22px;
  height: 22px;
  background: #5D4037;
  border-radius: 50%;
}

.typing-dots {
  display: flex;
  gap: 5px;
  padding: 5px 0;
  
  span {
    width: 10px;
    height: 10px;
    background: #8D6E63;
    border-radius: 50%;
    animation: typingDot 1s ease-in-out infinite;
    
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes typingDot {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-8px); opacity: 1; }
}

.error-text {
  color: #C62828;
  font-weight: 500;
}

.chat-input-area {
  display: flex;
  gap: 15px;
  padding: 15px 20px;
  background: #FFF8E1;
  border-top: 3px solid #5D4037;
}

.input-wrapper {
  flex: 1;
}

.stardew-input {
  :deep(.el-textarea__inner) {
    background: white;
    border: 3px solid #5D4037 !important;
    border-radius: 12px;
    font-family: inherit;
    font-size: 15px;
    padding: 12px 15px;
    resize: none;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,0.1);
    
    &:focus {
      border-color: #4CAF50 !important;
    }
  }
}

.input-hint {
  font-size: 11px;
  color: #8D6E63;
  margin-top: 5px;
}

.send-btn {
  width: 80px;
  background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%) !important;
  border: 3px solid #2E7D32 !important;
  border-radius: 12px;
  color: white !important;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 3px 3px 0 #2E7D32;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  
  &:hover:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #2E7D32;
  }
  
  &:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #2E7D32;
  }
  
  &:disabled {
    background: #E0E0E0 !important;
    border-color: #BDBDBD !important;
    box-shadow: 3px 3px 0 #BDBDBD;
    color: #9E9E9E !important;
  }
  
  .btn-icon {
    font-size: 20px;
  }
}

.pixel-border {
  position: absolute;
  left: 0;
  right: 0;
  height: 8px;
  background: repeating-linear-gradient(90deg, 
    #5D4037 0px, #5D4037 8px,
    #8D6E63 8px, #8D6E63 16px);
  z-index: 100;
  
  &.top { top: 0; }
  &.bottom { bottom: 0; }
}
</style>
