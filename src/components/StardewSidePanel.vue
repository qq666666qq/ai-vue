<template>
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
</template>

<script setup>
import { DeleteFilled, Plus } from '@element-plus/icons-vue';

const props = defineProps({
  isAiTyping: {
    type: Boolean,
    default: false
  },
  currentEmotion: {
    type: Object,
    default: () => ({
      primaryEmotion: '中性',
      emotionScore: 50,
      isNegative: false,
      suggestion: '情绪状态平稳',
      riskLevel: '0',
      improvementSuggestions: [],
      riskDescription: ''
    })
  },
  sessionList: {
    type: Array,
    default: () => []
  },
  currentSession: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['createNewSession', 'sessionClick', 'deleteSession']);

const createNewFrontendSession = () => {
  emit('createNewSession');
};

const handleSessionClick = (item) => {
  emit('sessionClick', item);
};

const handleDeleteSession = (sessionId) => {
  emit('deleteSession', sessionId);
};

const getEmotionColor = (score) => {
  if (score >= 70) return 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)';
  if (score >= 50) return 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)';
  if (score >= 30) return 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)';
  return 'linear-gradient(135deg, #E57373 0%, #F44336 100%)';
};

const getIntensityClass = (score) => {
  if (score >= 61) return 3;
  if (score >= 31) return 2;
  return 1;
};

const getRiskTest = (riskLevel) => {
  switch (riskLevel) {
    case '0': return '正常';
    case '1': return '关注';
    case '2': return '预警';
    case '3': return '危机';
    default: return '未知';
  }
};

const getEmotionPlant = (score) => {
  if (score >= 70) return 'flower';
  if (score >= 50) return 'sapling';
  if (score >= 30) return 'seed';
  return 'wilted';
};
</script>

<style lang="scss" scoped>
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
  position: relative;
}

.npc-avatar {
  display: inline-block;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
  position: relative;
  height: 120px;
  
  &.talking {
    animation: npcBounce 0.5s ease-in-out infinite;
  }
  
  &.waving {
    animation: npcWave 2s ease-in-out infinite;
  }
}

@keyframes npcBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes npcWave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-10deg); }
}

.npc-head {
  position: relative;
  width: 60px;
  height: 60px;
  background: #FFCC80;
  border-radius: 50% 50% 45% 45%;
  border: 3px solid #5D4037;
  margin: 0 auto;
  z-index: 2;
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
  
  &.smile {
    width: 20px;
    height: 8px;
    border-radius: 0 0 12px 12px;
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
  position: relative;
  z-index: 1;
}

.npc-arm {
  position: absolute;
  width: 12px;
  height: 25px;
  background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
  border: 2px solid #5D4037;
  border-radius: 6px;
  
  &.left {
    left: -10px;
    top: 10px;
    transform: rotate(-30deg);
  }
  
  &.right {
    right: -10px;
    top: 10px;
    transform: rotate(30deg);
  }
}

.npc-legs {
  position: relative;
  width: 45px;
  margin: -3px auto 0;
}

.npc-leg {
  position: absolute;
  width: 12px;
  height: 30px;
  background: #8D6E63;
  border: 2px solid #5D4037;
  border-radius: 6px 6px 3px 3px;
  
  &.left {
    left: 5px;
    top: 0;
  }
  
  &.right {
    right: 5px;
    top: 0;
  }
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
  margin-bottom: 10px;
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

.speech-bubble.small {
  position: absolute;
  top: 10px;
  right: 10px;
  max-width: 150px;
  padding: 8px 12px;
  font-size: 12px;
  background: white;
  border: 2px solid #5D4037;
  border-radius: 15px;
  box-shadow: 2px 2px 0 #5D4037;
  
  .bubble-tail {
    position: absolute;
    bottom: -6px;
    left: 20px;
    width: 10px;
    height: 10px;
    background: white;
    border: 2px solid #5D4037;
    border-left: none;
    border-top: none;
    transform: rotate(45deg);
  }
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
  justify-content: space-around;
  align-items: center;
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

.emotion-plant {
  width: 40px;
  height: 40px;
  position: relative;
  
  &.seed {
    background: #8D6E63;
    border-radius: 50%;
    border: 2px solid #5D4037;
  }
  
  &.sapling {
    background: #4CAF50;
    width: 8px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #2E7D32;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: -8px;
      left: -12px;
      width: 20px;
      height: 12px;
      background: #81C784;
      border-radius: 6px;
      border: 2px solid #2E7D32;
    }
  }
  
  &.flower {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 15px;
      width: 10px;
      height: 20px;
      background: #4CAF50;
      border-radius: 5px;
      border: 2px solid #2E7D32;
    }
    
    &::after {
      content: '🌸';
      position: absolute;
      top: 0;
      left: 5px;
      font-size: 24px;
    }
  }
  
  &.wilted {
    background: #BDBDBD;
    width: 8px;
    height: 15px;
    border-radius: 4px;
    border: 2px solid #757575;
    position: relative;
    transform: rotate(-15deg);
  }
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
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:last-child {
    border-bottom: none;
  }
}

.action-icon {
  font-size: 10px;
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
  font-size: 12px !important;
  padding: 4px 8px !important;
  
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

.empty-session {
  text-align: center;
  padding: 30px 10px;
  color: #8D6E63;
  
  span {
    font-size: 16px;
    display: block;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 12px;
    margin: 0;
  }
}
</style>