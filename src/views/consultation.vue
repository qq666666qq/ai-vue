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
      <StardewSidePanel 
        :is-ai-typing="isAiTyping"
        :current-emotion="currentEmotion"
        :session-list="sessionList"
        :current-session="currentSession"
        @create-new-session="createNewFrontendSession"
        @session-click="handleSessionClick"
        @delete-session="handleDeleteSession"
      />


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
import { startSession, getSessionList, deleteSession, getSessionMessages, getSessionEmotion } from '@/api/frontend';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import StardewSidePanel from '@/components/StardewSidePanel.vue'
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

const fetchSessionEmotion = (sessionId) => {
  const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`
  getSessionEmotion(id).then(res => {
    currentEmotion.value = res
  })
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

/* 农场背景 */
.farm-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, #87CEEB 0%, #B3E5FC 100%);
}

.sun {
  position: absolute;
  top: 30px;
  right: 100px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #FFD54F 0%, #FFC107 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px #FFD54F;
  animation: sunPulse 4s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% { transform: scale(1); opacity: 0.9; }
  50% { transform: scale(1.1); opacity: 1; }
}

.cloud {
  position: absolute;
  background: white;
  border-radius: 40px;
  opacity: 0.8;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 50%;
  }
}

.cloud-1 {
  top: 50px;
  left: 10%;
  width: 100px;
  height: 40px;
  animation: cloudFloat 15s ease-in-out infinite;
  
  &::before { width: 50px; height: 50px; top: -25px; left: 15px; }
  &::after { width: 30px; height: 30px; top: -12px; left: 50px; }
}

.cloud-2 {
  top: 80px;
  left: 40%;
  width: 120px;
  height: 45px;
  animation: cloudFloat 18s ease-in-out infinite 2s;
  
  &::before { width: 60px; height: 60px; top: -30px; left: 20px; }
  &::after { width: 40px; height: 40px; top: -15px; left: 60px; }
}

.cloud-3 {
  top: 40px;
  left: 70%;
  width: 90px;
  height: 35px;
  animation: cloudFloat 12s ease-in-out infinite 1s;
  
  &::before { width: 45px; height: 45px; top: -20px; left: 10px; }
  &::after { width: 25px; height: 25px; top: -10px; left: 45px; }
}

@keyframes cloudFloat {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(60px); }
}

.land {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(180deg, #C8E6C9 0%, #81C784 100%);
}

.grass {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: #4CAF50;
  border-top: 3px solid #388E3C;
}

.fence {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  height: 40px;
  background: repeating-linear-gradient(90deg, 
    #8D6E63 0px, #8D6E63 10px,
    transparent 10px, transparent 30px);
  border-top: 2px solid #5D4037;
  border-bottom: 2px solid #5D4037;
}

.crops {
  position: absolute;
  bottom: 60px;
  left: 10%;
  right: 10%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 80px;
}

.crop {
  width: 20px;
  height: 40px;
  background: #4CAF50;
  border-radius: 10px 10px 0 0;
  border: 2px solid #2E7D32;
  position: relative;
  
  &::after {
    content: '🌽';
    position: absolute;
    top: -20px;
    left: -10px;
    font-size: 24px;
  }
}

.barn {
  position: absolute;
  bottom: 60px;
  right: 15%;
  width: 100px;
  height: 80px;
  background: #8D6E63;
  border: 3px solid #5D4037;
  border-radius: 8px;
  
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 30px;
    width: 40px;
    height: 20px;
    background: #5D4037;
    border-radius: 4px 4px 0 0;
  }
}

.tree {
  position: absolute;
  bottom: 60px;
  width: 60px;
  height: 100px;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    width: 20px;
    height: 40px;
    background: #8D6E63;
    border: 2px solid #5D4037;
  }
  
  &::after {
    content: '🌳';
    position: absolute;
    top: 0;
    left: -10px;
    font-size: 60px;
  }
}

.tree-1 {
  left: 15%;
}

.tree-2 {
  right: 30%;
}

/* 装饰元素 */
.decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 5;
}

.floating-heart {
  position: absolute;
  font-size: 20px;
  color: #F44336;
  animation: floatHeart 3s ease-in-out infinite;
  
  &:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
  &:nth-child(2) { top: 30%; right: 15%; animation-delay: 1s; }
  &:nth-child(3) { top: 60%; left: 20%; animation-delay: 0.5s; }
  &:nth-child(4) { top: 70%; right: 25%; animation-delay: 1.5s; }
  &:nth-child(5) { top: 40%; left: 30%; animation-delay: 0.8s; }
}

@keyframes floatHeart {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
  50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
}

.sparkle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 10px white;
  animation: sparkle 2s ease-in-out infinite;
  
  &:nth-child(1) { top: 15%; left: 20%; animation-delay: 0s; }
  &:nth-child(2) { top: 25%; right: 10%; animation-delay: 0.3s; }
  &:nth-child(3) { top: 45%; left: 15%; animation-delay: 0.6s; }
  &:nth-child(4) { top: 55%; right: 30%; animation-delay: 0.9s; }
  &:nth-child(5) { top: 75%; left: 25%; animation-delay: 1.2s; }
  &:nth-child(6) { top: 85%; right: 20%; animation-delay: 1.5s; }
  &:nth-child(7) { top: 35%; left: 40%; animation-delay: 0.4s; }
  &:nth-child(8) { top: 65%; right: 45%; animation-delay: 1.1s; }
}

@keyframes sparkle {
  0%, 100% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
}

/* 游戏容器 */
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

/* 聊天面板 */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border: 4px solid #5D4037;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #5D4037;
  overflow: hidden;
  position: relative;
}

.chat-header {
  background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%);
  padding: 15px 20px;
  border-bottom: 3px solid #5D4037;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.npc-mini-avatar {
  width: 50px;
  height: 70px;
  position: relative;
  
  &.talking {
    animation: npcBounce 0.5s ease-in-out infinite;
  }
  
  .mini-head {
    width: 30px;
    height: 30px;
    background: #8D6E63;
    border-radius: 50% 50% 30% 30%;
    border: 2px solid #5D4037;
    margin: 0 auto;
  }
  
  .mini-body {
    width: 25px;
    height: 35px;
    background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
    border: 2px solid #5D4037;
    border-radius: 8px 8px 4px 4px;
    margin: -2px auto 0;
  }
}

.header-text {
  h2 {
    margin: 0;
    font-size: 24px;
    color: white;
    text-shadow: 2px 2px 0 #2E7D32;
    font-family: 'Comic Sans MS', cursive, sans-serif;
  }
  
  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: #E8F5E9;
  }
}

.header-decoration {
  display: flex;
  gap: 10px;
  
  .flower {
    width: 20px;
    height: 20px;
    font-size: 20px;
    animation: flowerFloat 2s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 1s; }
  }
}

@keyframes flowerFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(180deg, #FFFDE7 0%, #FFF9C4 100%);
  min-height: 400px;
  max-height: calc(100vh - 280px);
  position: relative;
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  text-align: center;
}

.welcome-npc {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
  
  .npc-avatar-large {
    position: relative;
    height: 150px;
    
    .npc-head-large {
      position: relative;
      width: 100px;
      height: 100px;
      background: #FFCC80;
      border-radius: 50% 50% 45% 45%;
      border: 4px solid #5D4037;
      margin: 0 auto;
      z-index: 2;
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
      position: relative;
      z-index: 1;
      
      .npc-arm-large {
        position: absolute;
        width: 15px;
        height: 35px;
        background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
        border: 2px solid #5D4037;
        border-radius: 8px;
        
        &.left {
          left: -12px;
          top: 10px;
          transform: rotate(-30deg);
        }
        
        &.right {
          right: -12px;
          top: 10px;
          transform: rotate(30deg);
        }
      }
    }
    
    .npc-legs-large {
      position: relative;
      width: 70px;
      margin: -3px auto 0;
      
      .npc-leg-large {
        position: absolute;
        width: 15px;
        height: 40px;
        background: #8D6E63;
        border: 2px solid #5D4037;
        border-radius: 8px 8px 4px 4px;
        
        &.left {
          left: 15px;
          top: 0;
        }
        
        &.right {
          right: 15px;
          top: 0;
        }
      }
    }
  }
  
  .welcome-animals {
    display: flex;
    flex-direction: column;
    gap: 20px;
    
    .chicken {
      width: 40px;
      height: 40px;
      font-size: 40px;
      animation: chickenWalk 2s ease-in-out infinite;
    }
    
    .dog {
      width: 50px;
      height: 50px;
      font-size: 50px;
      animation: dogWag 2s ease-in-out infinite;
    }
  }
}

@keyframes chickenWalk {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(10px) rotate(5deg); }
  75% { transform: translateX(-10px) rotate(-5deg); }
}

@keyframes dogWag {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

.speech-bubble {
  position: relative;
  max-width: 70%;
  padding: 15px 20px;
  border-radius: 20px;
  border: 3px solid #5D4037;
  box-shadow: 3px 3px 0 #5D4037;
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
  &.welcome {
    background: white;
    max-width: 500px;
    padding: 20px 25px;
  }
  
  &.user {
    background: linear-gradient(180deg, #81C784 0%, #66BB6A 100%);
    border-radius: 20px 20px 5px 20px;
    color: white;
  }
  
  &.npc {
    background: white;
    border-radius: 20px 20px 20px 5px;
  }
  
  &.small {
    max-width: 150px;
    padding: 8px 12px;
    font-size: 12px;
  }
}

.bubble-content {
  font-size: 15px;
  line-height: 1.6;
  color: #3E2723;
  
  p {
    margin: 0;
  }
  
  .user & {
    color: white;
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
  
  &.npc-tail {
    left: -8px;
    background: white;
    border-right: none;
    border-top: none;
    transform: rotate(-45deg);
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

.npc-mini, .user-mini {
  display: flex;
  align-items: flex-end;
}

.mini-avatar-npc, .mini-avatar-user {
  width: 50px;
  height: 60px;
  position: relative;
  flex-shrink: 0;
  
  &.talking {
    animation: avatarBounce 0.4s ease-in-out infinite;
  }
}

@keyframes avatarBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.mini-avatar-npc {
  .mini-head-npc {
    width: 25px;
    height: 25px;
    background: #8D6E63;
    border-radius: 50% 50% 30% 30%;
    border: 2px solid #5D4037;
    margin: 0 auto;
  }
  
  .mini-body-npc {
    width: 20px;
    height: 30px;
    background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
    border: 2px solid #5D4037;
    border-radius: 6px 6px 3px 3px;
    margin: -2px auto 0;
  }
}

.mini-avatar-user {
  .mini-head-user {
    width: 25px;
    height: 25px;
    background: #5D4037;
    border-radius: 50%;
    border: 2px solid #3E2723;
    margin: 0 auto;
  }
  
  .mini-body-user {
    width: 20px;
    height: 30px;
    background: linear-gradient(180deg, #90CAF9 0%, #64B5F6 100%);
    border: 2px solid #5D4037;
    border-radius: 6px 6px 3px 3px;
    margin: -2px auto 0;
  }
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
  align-items: flex-end;
}

.input-wrapper {
  flex: 1;
}

.stardew-input {
  :deep(.el-textarea__inner) {
    background: white;
    border: 3px solid #5D4037 !important;
    border-radius: 12px;
    font-family: 'Comic Sans MS', cursive, sans-serif;
    font-size: 15px;
    padding: 12px 15px;
    resize: none;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,0.1);
    min-height: 80px;
    
    &:focus {
      border-color: #4CAF50 !important;
    }
  }
}

.input-hint {
  font-size: 11px;
  color: #8D6E63;
  margin-top: 5px;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

.send-btn {
  width: 90px;
  height: 80px;
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
  font-family: 'Comic Sans MS', cursive, sans-serif;
  
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
    font-size: 24px;
  }
  
  .btn-text {
    font-size: 14px;
  }
}

/* 像素边框 */
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

/* 响应式设计 */
@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    padding: 10px;
  }
  
  .chat-panel {
    min-height: 500px;
  }
  
  .chat-messages {
    max-height: 400px;
  }
  
  .speech-bubble {
    max-width: 85%;
  }
}
</style>
