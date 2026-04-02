<template>
  <div class="pixel-home" @mousemove="handleMouseMove">
    <!-- 像素风格背景 -->
    <div class="pixel-background">
      <div class="pixel-sky"></div>
      <div class="pixel-sun"></div>
      <div class="pixel-cloud" v-for="i in 3" :key="`cloud-${i}`" :style="{ animationDelay: `${i * 1}s` }"></div>
      <div class="pixel-ground"></div>
      <div class="pixel-grass"></div>
      <div class="pixel-fence"></div>
      <div class="pixel-crop" v-for="i in 5" :key="`crop-${i}`" :style="{ left: `${20 + i * 15}%`, animationDelay: `${i * 0.3}s` }"></div>
      <div class="pixel-tree" style="left: 10%"></div>
      <div class="pixel-tree" style="right: 10%"></div>
    </div>
    
    <!-- 罗小黑风格的猫咪 -->
    <div 
      class="luo-xiao-hei" 
      :style="catStyle"
      :class="[`cat-${currentState}`, { 'facing-left': facingLeft }]"
    >
      <!-- 头部 -->
      <div class="cat-head">
        <!-- 耳朵 -->
        <div class="cat-ears">
          <div class="cat-ear left"></div>
          <div class="cat-ear right"></div>
        </div>
        <!-- 眼睛 -->
        <div class="cat-eyes">
          <div class="cat-eye left">
            <div class="cat-pupil" :style="eyeLeftStyle"></div>
          </div>
          <div class="cat-eye right">
            <div class="cat-pupil" :style="eyeRightStyle"></div>
          </div>
        </div>
        <!-- 鼻子和嘴巴 -->
        <div class="cat-nose"></div>
        <div class="cat-mouth" :class="`mouth-${currentEmotion}`"></div>
        <!-- 胡须 -->
        <div class="cat-whiskers">
          <div class="whisker left"></div>
          <div class="whisker left"></div>
          <div class="whisker right"></div>
          <div class="whisker right"></div>
        </div>
      </div>
      <!-- 身体 -->
      <div class="cat-body"></div>
      <!-- 尾巴 -->
      <div class="cat-tail" :class="`tail-${currentState}`"></div>
      <!-- 四肢 -->
      <div class="cat-legs">
        <div class="cat-leg front left" :class="`leg-${currentState}`"></div>
        <div class="cat-leg front right" :class="`leg-${currentState}`"></div>
        <div class="cat-leg back left" :class="`leg-${currentState}`"></div>
        <div class="cat-leg back right" :class="`leg-${currentState}`"></div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="home-content">
      <!-- 欢迎信息 -->
      <div class="welcome-section">
        <div class="pixel-speech-bubble">
          <div class="speech-content">
            <h2>你好！欢迎来到心灵牧场 🌟</h2>
            <p>移动鼠标，罗小黑会跟着你哦！</p>
            <p>我是你的AI朋友，在这里你可以：</p>
            <ul>
              <li>💬 与我聊天，分享你的心情</li>
              <li>📔 记录你的情绪日记</li>
              <li>🌱 培育你的情绪花园</li>
            </ul>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <StardewButton text="开始咨询" variant="primary" icon="💬" @click="navigateToConsultation" />
          <StardewButton text="情绪日记" variant="secondary" icon="📔" @click="navigateToDiary" />
          <StardewButton text="知识库" variant="success" icon="📚" @click="navigateToKnowledge" />
        </div>
      </div>
    </div>
    
    <!-- 装饰元素 -->
    <div class="decorative-elements">
      <div class="floating-heart" v-for="i in 5" :key="`heart-${i}`" :style="{ animationDelay: `${i * 0.5}s` }">💖</div>
      <div class="floating-star" v-for="i in 3" :key="`star-${i}`" :style="{ animationDelay: `${i * 0.8}s` }">⭐</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import StardewButton from '../components/StardewButton.vue'

const router = useRouter()

// 鼠标位置
const mouseX = ref(window.innerWidth / 2)
const mouseY = ref(window.innerHeight / 2)

// 猫咪目标位置
const targetX = ref(window.innerWidth / 2)
const targetY = ref(window.innerHeight / 2)

// 猫咪当前位置
const catX = ref(window.innerWidth / 2)
const catY = ref(window.innerHeight / 2)

// 猫咪状态
const currentState = ref('idle') // idle, walking, running, pouncing
const currentEmotion = ref('happy') // happy, curious, sleepy, excited
const facingLeft = ref(false)

// 眼睛位置
const eyeLeftX = ref(0)
const eyeLeftY = ref(0)
const eyeRightX = ref(0)
const eyeRightY = ref(0)

// 动画帧ID
let animationFrameId = null
let idleAnimationId = null
let emotionChangeId = null

// 猫咪样式
const catStyle = computed(() => ({
  left: `${catX.value}px`,
  top: `${catY.value}px`
}))

// 眼睛样式
const eyeLeftStyle = computed(() => ({
  transform: `translate(${eyeLeftX.value}px, ${eyeLeftY.value}px)`
}))

const eyeRightStyle = computed(() => ({
  transform: `translate(${eyeRightX.value}px, ${eyeRightY.value}px)`
}))

// 处理鼠标移动
const handleMouseMove = (event) => {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
  
  // 平滑更新目标位置，避免频繁变化
  const distance = Math.sqrt(
    Math.pow(mouseX.value - catX.value, 2) + Math.pow(mouseY.value - catY.value, 2)
  )
  
  // 只有当距离足够远时才更新目标位置
  if (distance > 20) {
    // 使用缓动效果平滑更新目标位置
    targetX.value = targetX.value * 0.8 + mouseX.value * 0.2
    targetY.value = targetY.value * 0.8 + mouseY.value * 0.2
    
    // 根据距离决定状态
    if (distance > 100) {
      if (currentState.value !== 'running') {
        currentState.value = 'running'
        currentEmotion.value = 'excited'
      }
    } else if (distance > 30) {
      if (currentState.value !== 'walking') {
        currentState.value = 'walking'
        currentEmotion.value = 'curious'
      }
    } else {
      if (currentState.value !== 'pouncing') {
        currentState.value = 'pouncing'
        currentEmotion.value = 'happy'
      }
    }
  }
}

// 空闲动画
const idleAnimation = () => {
  if (currentState.value === 'idle') {
    // 随机小移动
    const randomX = Math.random() * 5 - 2.5
    const randomY = Math.random() * 3 - 1.5
    
    // 缓慢移动
    catX.value += randomX * 0.1
    catY.value += randomY * 0.1
    
    // 随机情绪变化
    if (Math.random() > 0.98) {
      const idleEmotions = ['happy', 'curious', 'sleepy']
      currentEmotion.value = idleEmotions[Math.floor(Math.random() * idleEmotions.length)]
    }
    
    // 随机状态变化
    if (Math.random() > 0.95) {
      currentState.value = 'walking'
      setTimeout(() => {
        currentState.value = 'idle'
      }, 2000)
    }
  }
  
  idleAnimationId = requestAnimationFrame(idleAnimation)
}

// 猫咪动画
const animateCat = () => {
  const dx = targetX.value - catX.value
  const dy = targetY.value - catY.value
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance > 5) {
    facingLeft.value = dx < 0
    
    // 使用缓动效果平滑移动
    const easing = 0.1
    catX.value += dx * easing
    catY.value += dy * easing
    
    // 根据距离动态调整状态
    if (distance > 100) {
      if (currentState.value !== 'running') {
        currentState.value = 'running'
        currentEmotion.value = 'excited'
      }
    } else if (distance > 30) {
      if (currentState.value !== 'walking') {
        currentState.value = 'walking'
        currentEmotion.value = 'curious'
      }
    } else if (distance > 5) {
      if (currentState.value !== 'pouncing') {
        currentState.value = 'pouncing'
        currentEmotion.value = 'happy'
      }
    }
    
    // 眼睛跟随 - 使用缓动效果
    const eyeTargetX = (dx / distance) * Math.min(distance / 20, 10)
    const eyeTargetY = (dy / distance) * Math.min(distance / 20, 10)
    eyeLeftX.value += (eyeTargetX - eyeLeftX.value) * 0.2
    eyeLeftY.value += (eyeTargetY - eyeLeftY.value) * 0.2
    eyeRightX.value += (eyeTargetX - eyeRightX.value) * 0.2
    eyeRightY.value += (eyeTargetY - eyeRightY.value) * 0.2
  } else if (distance <= 5) {
    // 到达目标
    if (currentState.value !== 'idle') {
      currentState.value = 'idle'
      currentEmotion.value = 'happy'
    }
    
    // 眼睛复位 - 使用缓动效果
    eyeLeftX.value += (0 - eyeLeftX.value) * 0.2
    eyeLeftY.value += (0 - eyeLeftY.value) * 0.2
    eyeRightX.value += (0 - eyeRightX.value) * 0.2
    eyeRightY.value += (0 - eyeRightY.value) * 0.2
  }
  
  animationFrameId = requestAnimationFrame(animateCat)
}

// 随机情绪变化
const randomEmotionChange = () => {
  if (currentState.value === 'idle') {
    const emotions = ['happy', 'curious', 'sleepy', 'excited']
    currentEmotion.value = emotions[Math.floor(Math.random() * emotions.length)]
  }
  
  emotionChangeId = setTimeout(randomEmotionChange, 5000 + Math.random() * 10000)
}

const navigateToConsultation = () => {
  router.push('/consultation')
}

const navigateToDiary = () => {
  router.push('/emotion-diary')
}

const navigateToKnowledge = () => {
  router.push('/knowledge')
}

onMounted(() => {
  document.body.classList.add('page-loaded')
  animateCat()
  idleAnimation()
  randomEmotionChange()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (idleAnimationId) {
    cancelAnimationFrame(idleAnimationId)
  }
  if (emotionChangeId) {
    clearTimeout(emotionChangeId)
  }
})
</script>

<style lang="scss" scoped>
.pixel-home {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #87CEEB;
}

/* 像素风格背景 */
.pixel-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.pixel-sky {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%);
  border-bottom: 4px solid #5D4037;
}

.pixel-sun {
  position: absolute;
  top: 50px;
  right: 100px;
  width: 80px;
  height: 80px;
  background: #FFD700;
  border: 4px solid #5D4037;
  border-radius: 50%;
  box-shadow: 0 0 20px #FFD700;
  animation: sun-glow 3s ease-in-out infinite;
}

@keyframes sun-glow {
  0%, 100% {
    box-shadow: 0 0 20px #FFD700;
  }
  50% {
    box-shadow: 0 0 30px #FFD700;
  }
}

.pixel-cloud {
  position: absolute;
  top: 100px;
  width: 100px;
  height: 40px;
  background: white;
  border: 4px solid #5D4037;
  border-radius: 20px;
  animation: cloud-float 20s linear infinite;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: white;
    border: 4px solid #5D4037;
    border-radius: 50%;
  }
  
  &::before {
    top: -20px;
    left: 10px;
    width: 40px;
    height: 40px;
  }
  
  &::after {
    top: -15px;
    right: 10px;
    width: 50px;
    height: 50px;
  }
  
  &:nth-child(2) {
    left: 20%;
    top: 80px;
  }
  
  &:nth-child(3) {
    left: 50%;
    top: 120px;
  }
  
  &:nth-child(4) {
    left: 70%;
    top: 90px;
  }
}

@keyframes cloud-float {
  0% {
    transform: translateX(-150px);
  }
  100% {
    transform: translateX(calc(100vw + 150px));
  }
}

.pixel-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: #8D6E63;
  border-top: 4px solid #5D4037;
}

.pixel-grass {
  position: absolute;
  bottom: 40%;
  left: 0;
  right: 0;
  height: 20px;
  background: #4CAF50;
  border-top: 4px solid #5D4037;
  border-bottom: 4px solid #5D4037;
}

.pixel-fence {
  position: absolute;
  bottom: 30%;
  left: 0;
  right: 0;
  height: 40px;
  background: repeating-linear-gradient(90deg, 
    #8D6E63 0px, #8D6E63 20px,
    #5D4037 20px, #5D4037 24px);
  border-top: 4px solid #5D4037;
}

.pixel-crop {
  position: absolute;
  bottom: 35%;
  width: 20px;
  height: 30px;
  background: #4CAF50;
  border: 4px solid #5D4037;
  border-radius: 4px;
  animation: crop-grow 2s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -12px;
    left: -6px;
    width: 28px;
    height: 16px;
    background: #81C784;
    border: 2px solid #5D4037;
    border-radius: 50%;
  }
}

@keyframes crop-grow {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.1);
  }
}

.pixel-tree {
  position: absolute;
  bottom: 35%;
  width: 60px;
  height: 80px;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    width: 20px;
    height: 40px;
    background: #8D6E63;
    border: 4px solid #5D4037;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
    background: #4CAF50;
    border: 4px solid #5D4037;
    border-radius: 50%;
  }
}

/* 罗小黑风格的猫咪 */
.luo-xiao-hei {
  position: fixed;
  width: 120px;
  height: 80px;
  z-index: 100;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: transform 0.1s ease;
}

.luo-xiao-hei.facing-left {
  transform: translate(-50%, -50%) scaleX(-1);
}

/* 头部 */
.cat-head {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 30px;
  background: #212121;
  border: 2px solid #000;
  border-radius: 50% 50% 40% 40%;
  z-index: 2;
  
  /* 耳朵 */
  .cat-ears {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    display: flex;
    justify-content: space-between;
    
    .cat-ear {
      width: 12px;
      height: 16px;
      background: #212121;
      border: 2px solid #000;
      border-radius: 50% 50% 0 0;
      
      &.left {
        transform: rotate(-30deg);
      }
      
      &.right {
        transform: rotate(30deg);
      }
    }
  }
  
  /* 眼睛 */
  .cat-eyes {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 28px;
    display: flex;
    justify-content: space-between;
    
    .cat-eye {
      width: 10px;
      height: 10px;
      background: white;
      border: 1px solid #000;
      border-radius: 50%;
      position: relative;
      
      .cat-pupil {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 6px;
        height: 6px;
        background: #000;
        border-radius: 50%;
        transition: transform 0.1s ease;
      }
    }
  }
  
  /* 鼻子 */
  .cat-nose {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 4px;
    background: #FF6B6B;
    border-radius: 50%;
  }
  
  /* 嘴巴 */
  .cat-mouth {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 4px;
    
    &.mouth-happy {
      background: transparent;
      border-bottom: 2px solid #000;
      border-radius: 0 0 10px 10px;
    }
    
    &.mouth-curious {
      background: transparent;
      border-bottom: 2px solid #000;
      border-radius: 0 0 8px 8px;
    }
    
    &.mouth-sleepy {
      background: transparent;
      border-top: 2px solid #000;
      border-radius: 8px 8px 0 0;
    }
    
    &.mouth-excited {
      background: transparent;
      border-bottom: 2px solid #000;
      border-radius: 0 0 12px 12px;
      animation: excited-mouth 0.5s ease-in-out infinite;
    }
  }
  
  /* 胡须 */
  .cat-whiskers {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    
    .whisker {
      position: absolute;
      width: 12px;
      height: 1px;
      background: #000;
      
      &.left {
        left: 0;
        transform-origin: right center;
      }
      
      &.right {
        right: 0;
        transform-origin: left center;
      }
      
      &:nth-child(1) {
        top: 0;
        transform: rotate(-15deg);
      }
      
      &:nth-child(2) {
        top: 2px;
        transform: rotate(-5deg);
      }
      
      &:nth-child(3) {
        top: 0;
        transform: rotate(15deg);
      }
      
      &:nth-child(4) {
        top: 2px;
        transform: rotate(5deg);
      }
    }
  }
}

/* 身体 */
.cat-body {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 40px;
  background: #212121;
  border: 2px solid #000;
  border-radius: 50% 50% 40% 40%;
  z-index: 1;
}

/* 尾巴 */
.cat-tail {
  position: absolute;
  top: 30px;
  right: 10px;
  width: 30px;
  height: 8px;
  background: #212121;
  border: 2px solid #000;
  border-radius: 10px;
  transform-origin: left center;
  
  &.tail-idle {
    animation: tail-wag 2s ease-in-out infinite;
  }
  
  &.tail-walking {
    animation: tail-walk 1s ease-in-out infinite;
  }
  
  &.tail-running {
    animation: tail-run 0.5s ease-in-out infinite;
  }
  
  &.tail-pouncing {
    animation: tail-pounce 0.3s ease-in-out infinite;
  }
}

/* 四肢 */
.cat-legs {
  position: absolute;
  top: 45px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 25px;
  z-index: 0;
  
  .cat-leg {
    position: absolute;
    width: 12px;
    height: 20px;
    background: #212121;
    border: 2px solid #000;
    border-radius: 10px 10px 0 0;
    transform-origin: top center;
    
    &.front {
      top: 0;
    }
    
    &.back {
      top: 5px;
    }
    
    &.left {
      left: 10px;
    }
    
    &.right {
      right: 10px;
    }
    
    &.leg-walking.left {
      animation: walk-leg-left 0.5s ease-in-out infinite;
    }
    
    &.leg-walking.right {
      animation: walk-leg-right 0.5s ease-in-out infinite;
    }
    
    &.leg-running.left {
      animation: run-leg-left 0.3s ease-in-out infinite;
    }
    
    &.leg-running.right {
      animation: run-leg-right 0.3s ease-in-out infinite;
    }
    
    &.leg-pouncing {
      animation: pounce-leg 0.3s ease-in-out infinite;
    }
  }
}

/* 动画效果 */
@keyframes excited-mouth {
  0%, 100% {
    transform: translateX(-50%) scaleX(1);
  }
  50% {
    transform: translateX(-50%) scaleX(1.2);
  }
}

@keyframes tail-wag {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }
  75% {
    transform: rotate(-15deg);
  }
}

@keyframes tail-walk {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

@keyframes tail-run {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(30deg);
  }
}

@keyframes tail-pounce {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(45deg);
  }
}

@keyframes walk-leg-left {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(30deg);
  }
}

@keyframes walk-leg-right {
  0%, 100% {
    transform: rotate(30deg);
  }
  50% {
    transform: rotate(0deg);
  }
}

@keyframes run-leg-left {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(45deg);
  }
}

@keyframes run-leg-right {
  0%, 100% {
    transform: rotate(45deg);
  }
  50% {
    transform: rotate(0deg);
  }
}

@keyframes pounce-leg {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

/* 主内容区 */
.home-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 0 20px;
}

/* 欢迎信息 */
.welcome-section {
  text-align: center;
  max-width: 600px;
}

.pixel-speech-bubble {
  background: white;
  border: 4px solid #5D4037;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 4px 4px 0 #5D4037;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid white;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 24px solid transparent;
    border-right: 24px solid transparent;
    border-top: 24px solid #5D4037;
  }
}

.speech-content h2 {
  font-size: 24px;
  font-weight: 800;
  color: #5D4037;
  margin-bottom: 16px;
  text-shadow: 2px 2px 0 #E8F5E9;
}

.speech-content p {
  font-size: 16px;
  color: #3E2723;
  margin-bottom: 16px;
}

.speech-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    font-size: 14px;
    color: #5D4037;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 装饰元素 */
.decorative-elements {
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
  animation: float 3s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 20%;
    left: 10%;
  }
  
  &:nth-child(2) {
    top: 30%;
    right: 15%;
  }
  
  &:nth-child(3) {
    top: 60%;
    left: 20%;
  }
  
  &:nth-child(4) {
    top: 70%;
    right: 25%;
  }
  
  &:nth-child(5) {
    top: 40%;
    left: 60%;
  }
}

.floating-star {
  position: absolute;
  font-size: 16px;
  animation: float 4s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 15%;
    right: 10%;
  }
  
  &:nth-child(2) {
    top: 50%;
    left: 15%;
  }
  
  &:nth-child(3) {
    top: 75%;
    right: 30%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .luo-xiao-hei {
    width: 100px;
    height: 60px;
  }
  
  .cat-head {
    width: 32px;
    height: 24px;
  }
  
  .cat-body {
    width: 48px;
    height: 32px;
  }
  
  .cat-tail {
    width: 24px;
    height: 6px;
  }
  
  .cat-legs {
    width: 56px;
    height: 20px;
  }
  
  .cat-leg {
    width: 10px;
    height: 16px;
  }
  
  .speech-content h2 {
    font-size: 20px;
  }
  
  .speech-content p {
    font-size: 14px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>