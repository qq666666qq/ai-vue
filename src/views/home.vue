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
    
    <!-- 跟随鼠标的像素角色 -->
    <div 
      class="pixel-character mouse-follow" 
      ref="characterRef"
      :style="characterStyle"
      :class="{ 'is-walking': isWalking, 'facing-left': facingLeft }"
    >
      <div class="character-head">
        <div class="character-hair"></div>
        <div class="character-face">
          <div class="character-eyes">
            <div class="character-eye"></div>
            <div class="character-eye"></div>
          </div>
          <div class="character-mouth"></div>
        </div>
      </div>
      <div class="character-body"></div>
      <div class="character-arms">
        <div class="character-arm left"></div>
        <div class="character-arm right"></div>
      </div>
      <div class="character-legs">
        <div class="character-leg left"></div>
        <div class="character-leg right"></div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="home-content">
      <!-- 欢迎信息 -->
      <div class="welcome-section">
        <div class="pixel-speech-bubble">
          <div class="speech-content">
            <h2>你好！欢迎来到心灵牧场 🌟</h2>
            <p>移动鼠标，我会跟着你走哦！</p>
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
const characterRef = ref(null)

const mouseX = ref(window.innerWidth / 2)
const mouseY = ref(window.innerHeight / 2)
const characterX = ref(window.innerWidth / 2)
const characterY = ref(window.innerHeight / 2)
const isWalking = ref(false)
const facingLeft = ref(false)
let animationFrameId = null

const characterStyle = computed(() => ({
  left: `${characterX.value}px`,
  top: `${characterY.value}px`
}))

const handleMouseMove = (event) => {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}

const animateCharacter = () => {
  const dx = mouseX.value - characterX.value
  const dy = mouseY.value - characterY.value
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance > 10) {
    isWalking.value = true
    facingLeft.value = dx < 0
    
    const speed = Math.min(distance * 0.05, 8)
    characterX.value += (dx / distance) * speed
    characterY.value += (dy / distance) * speed
  } else {
    isWalking.value = false
  }
  
  animationFrameId = requestAnimationFrame(animateCharacter)
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
  animateCharacter()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
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

/* 像素角色 - 原始静态版本 */
.pixel-character.animated {
  position: relative;
  width: 120px;
  height: 180px;
  margin-bottom: 40px;
  animation: character-bounce 2s ease-in-out infinite;
}

@keyframes character-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 像素角色 - 跟随鼠标版本 */
.pixel-character.mouse-follow {
  position: fixed;
  width: 80px;
  height: 120px;
  z-index: 100;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: transform 0.1s ease;
}

.pixel-character.mouse-follow.facing-left {
  transform: translate(-50%, -50%) scaleX(-1);
}

.pixel-character.mouse-follow .character-head {
  width: 40px;
  height: 40px;
}

.pixel-character.mouse-follow .character-body {
  width: 32px;
  height: 40px;
}

.pixel-character.mouse-follow .character-arms {
  top: 50px;
  left: -14px;
  width: 108px;
}

.pixel-character.mouse-follow .character-arm {
  width: 12px;
  height: 28px;
}

.pixel-character.mouse-follow .character-legs {
  left: 18px;
  width: 44px;
}

.pixel-character.mouse-follow .character-leg {
  width: 12px;
  height: 28px;
}

/* 走路动画 */
.pixel-character.mouse-follow.is-walking .character-leg.left {
  animation: walk-left 0.3s ease-in-out infinite;
}

.pixel-character.mouse-follow.is-walking .character-leg.right {
  animation: walk-right 0.3s ease-in-out infinite;
}

@keyframes walk-left {
  0%, 100% {
    transform: rotate(0deg) translateY(0);
  }
  50% {
    transform: rotate(20deg) translateY(-5px);
  }
}

@keyframes walk-right {
  0%, 100% {
    transform: rotate(0deg) translateY(-5px);
  }
  50% {
    transform: rotate(-20deg) translateY(0);
  }
}

.character-head {
  position: relative;
  width: 60px;
  height: 60px;
  background: #FFCC80;
  border: 4px solid #5D4037;
  border-radius: 50% 50% 45% 45%;
  margin: 0 auto 8px;
}

.character-hair {
  position: absolute;
  top: -8px;
  left: 8px;
  width: 40px;
  height: 24px;
  background: #8D6E63;
  border: 3px solid #5D4037;
  border-radius: 50% 50% 30% 30%;
}

.character-face {
  position: absolute;
  top: 20px;
  left: 10px;
  width: 40px;
  height: 30px;
}

.character-eyes {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  margin-bottom: 4px;
}

.character-eye {
  width: 8px;
  height: 8px;
  background: #3E2723;
  border: 2px solid #5D4037;
  border-radius: 50%;
}

.character-mouth {
  width: 12px;
  height: 6px;
  background: #D84315;
  border: 2px solid #5D4037;
  border-radius: 0 0 8px 8px;
  margin: 0 auto;
}

.character-body {
  width: 48px;
  height: 60px;
  background: #42A5F5;
  border: 4px solid #5D4037;
  border-radius: 8px 8px 6px 6px;
  margin: 0 auto 8px;
}

.character-arms {
  position: absolute;
  top: 76px;
  left: -20px;
  width: 160px;
  display: flex;
  justify-content: space-between;
}

.character-arm {
  width: 16px;
  height: 40px;
  background: #FFCC80;
  border: 4px solid #5D4037;
  border-radius: 8px;
  animation: arm-wave 2s ease-in-out infinite;
}

.character-arm.left {
  transform-origin: right center;
}

.character-arm.right {
  transform-origin: left center;
  animation-delay: 1s;
}

@keyframes arm-wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(30deg);
  }
}

.character-legs {
  position: absolute;
  bottom: 0;
  left: 28px;
  width: 64px;
  display: flex;
  justify-content: space-between;
}

.character-leg {
  width: 16px;
  height: 40px;
  background: #FF5722;
  border: 4px solid #5D4037;
  border-radius: 8px 8px 0 0;
  animation: leg-walk 2s ease-in-out infinite;
}

.character-leg.left {
  animation-delay: 1s;
}

@keyframes leg-walk {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(10deg);
  }
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
  .pixel-character {
    width: 100px;
    height: 150px;
  }
  
  .character-head {
    width: 50px;
    height: 50px;
  }
  
  .character-body {
    width: 40px;
    height: 50px;
  }
  
  .character-arms {
    left: -15px;
    width: 130px;
  }
  
  .character-arm {
    width: 12px;
    height: 32px;
  }
  
  .character-legs {
    left: 24px;
    width: 52px;
  }
  
  .character-leg {
    width: 12px;
    height: 32px;
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