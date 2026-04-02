<template>
  <div class="stardew-layout">
    <!-- 装饰元素 -->
    <div class="decorative-elements">
      <div class="floating-cloud" v-for="i in 3" :key="`cloud-${i}`" :style="{ animationDelay: `${i * 0.5}s` }"></div>
      <div class="floating-butterfly" v-for="i in 2" :key="`butterfly-${i}`" :style="{ animationDelay: `${i * 1}s` }"></div>
    </div>
    
    <div class="navbar">
      <div class="navbar-inner">
        <div class="brand-section">
          <div class="brand-logo">
            <div class="logo-character animated">
              <div class="logo-head">
                <div class="logo-hair"></div>
                <div class="logo-face">
                  <div class="logo-eyes">
                    <div class="logo-eye"></div>
                    <div class="logo-eye"></div>
                  </div>
                  <div class="logo-mouth"></div>
                </div>
              </div>
              <div class="logo-body"></div>
              <div class="logo-arms">
                <div class="logo-arm left"></div>
                <div class="logo-arm right"></div>
              </div>
            </div>
          </div>
          <div class="brand-text">
            <h1>心灵牧场</h1>
            <p>Mental Health AI</p>
          </div>
        </div>
        
        <div class="nav-section">
          <router-link to="/" class="nav-link" :class="{ 'active': $route.path === '/' }">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">首页</span>
            <div class="nav-decoration"></div>
          </router-link>
          <router-link to="/consultation" class="nav-link" v-if="isLoggedIn" :class="{ 'active': $route.path === '/consultation' }">
            <span class="nav-icon">💬</span>
            <span class="nav-text">AI咨询</span>
            <div class="nav-decoration"></div>
          </router-link>
          <router-link to="/emotion-diary" class="nav-link" v-if="isLoggedIn" :class="{ 'active': $route.path === '/emotion-diary' }">
            <span class="nav-icon">📔</span>
            <span class="nav-text">情绪日记</span>
            <div class="nav-decoration"></div>
          </router-link>
          <router-link to="/knowledge" class="nav-link" :class="{ 'active': $route.path === '/knowledge' }">
            <span class="nav-icon">📚</span>
            <span class="nav-text">知识库</span>
            <div class="nav-decoration"></div>
          </router-link>
        </div>
        
        <div class="auth-section">
          <div class="user-info" v-if="isLoggedIn">
            <div class="user-avatar animated">
              <div class="user-head"></div>
              <div class="user-hat"></div>
            </div>
            <span class="user-name">{{ userName }}</span>
            <button class="logout-btn animated" @click="logoutClick">
              <span class="btn-icon">🚪</span>
              <span>退出</span>
            </button>
          </div>
          <div class="auth-buttons" v-else>
            <router-link to="/auth/login" class="auth-link login animated">
              <span class="auth-icon">🔑</span>
              <span>登录</span>
            </router-link>
            <router-link to="/auth/register" class="auth-link register animated">
              <span class="auth-icon">✨</span>
              <span>注册</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <router-view />
    </div>
    
    <div class="footer">
      <div class="footer-inner">
        <div class="footer-farm">
          <div class="farm-elements">
            <div class="farm-crop" v-for="i in 5" :key="`crop-${i}`" :style="{ animationDelay: `${i * 0.3}s` }"></div>
            <div class="farm-fence"></div>
          </div>
        </div>
        <div class="footer-decor">
          <span>🌻</span>
          <span>🌸</span>
          <span>🌼</span>
          <span>🌺</span>
          <span>🌻</span>
        </div>
        <p class="footer-text">
          &copy; {{ new Date().getFullYear() }} 心灵牧场 - 一次温暖的对话，化孤独为慰藉 💝
        </p>
        <div class="footer-decor">
          <span>🌻</span>
          <span>🌺</span>
          <span>🌼</span>
          <span>🌸</span>
          <span>🌻</span>
        </div>
      </div>
    </div>
    
    <div class="pixel-border top"></div>
    <div class="pixel-border bottom"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoggedIn = ref(false)
const userName = computed(() => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    const user = JSON.parse(userInfo)
    return user.username || '用户'
  }
  return '用户'
})

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('token') !== null
})

const logoutClick = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  router.push('/auth/login')
}
</script>

<style lang="scss" scoped>
.stardew-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #E3F2FD 0%, #E8F5E9 50%, #FFF8E1 100%);
  position: relative;
  overflow: hidden;
}

/* 装饰元素 */
.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  z-index: 1;
}

.floating-cloud {
  position: absolute;
  top: 20px;
  width: 80px;
  height: 30px;
  background: white;
  border-radius: 50px;
  animation: cloud-float 15s linear infinite;
  
  &:nth-child(1) {
    left: 10%;
  }
  
  &:nth-child(2) {
    left: 40%;
    top: 40px;
    width: 60px;
    height: 25px;
  }
  
  &:nth-child(3) {
    left: 70%;
    top: 30px;
    width: 70px;
    height: 28px;
  }
}

.floating-butterfly {
  position: absolute;
  top: 80px;
  font-size: 20px;
  animation: butterfly-fly 8s ease-in-out infinite;
  
  &:nth-child(1) {
    left: 20%;
  }
  
  &:nth-child(2) {
    left: 60%;
  }
}

@keyframes cloud-float {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100vw);
  }
}

@keyframes butterfly-fly {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-5px) rotate(-5deg);
  }
}

/* 导航栏 */
.navbar {
  background: linear-gradient(180deg, #81C784 0%, #4CAF50 100%);
  border-bottom: 4px solid #5D4037;
  box-shadow: 0 4px 0 #5D4037;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  .logo-character {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: bounce 2s ease-in-out infinite;
  }
  
  .logo-head {
    position: relative;
    width: 40px;
    height: 40px;
    background: #FFCC80;
    border-radius: 50% 50% 45% 45%;
    border: 3px solid #5D4037;
  }
  
  .logo-hair {
    position: absolute;
    top: -6px;
    left: 4px;
    width: 32px;
    height: 20px;
    background: #8D6E63;
    border-radius: 50% 50% 30% 30%;
    border: 2px solid #5D4037;
  }
  
  .logo-face {
    position: absolute;
    top: 16px;
    left: 6px;
    width: 28px;
  }
  
  .logo-eyes {
    display: flex;
    justify-content: space-between;
    padding: 0 3px;
    margin-bottom: 3px;
  }
  
  .logo-eye {
    width: 5px;
    height: 6px;
    background: #3E2723;
    border-radius: 50%;
  }
  
  .logo-mouth {
    width: 10px;
    height: 5px;
    background: #D84315;
    border-radius: 0 0 6px 6px;
    margin: 0 auto;
  }
  
  .logo-body {
    width: 28px;
    height: 30px;
    background: linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%);
    border: 3px solid #5D4037;
    border-radius: 6px 6px 4px 4px;
    margin-top: -2px;
  }
  
  .logo-arms {
    position: absolute;
    top: 40px;
    width: 60px;
    display: flex;
    justify-content: space-between;
  }
  
  .logo-arm {
    width: 12px;
    height: 20px;
    background: #FFCC80;
    border: 2px solid #5D4037;
    border-radius: 6px;
    animation: wave 2s ease-in-out infinite;
  }
  
  .logo-arm.left {
    transform-origin: right center;
  }
  
  .logo-arm.right {
    transform-origin: left center;
    animation-delay: 1s;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

.brand-text {
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    color: white;
    text-shadow: 2px 2px 0 #2E7D32;
    letter-spacing: 1px;
    animation: text-glow 3s ease-in-out infinite;
  }
  
  p {
    margin: 2px 0 0;
    font-size: 10px;
    color: #E8F5E9;
    letter-spacing: 0.5px;
  }
}

@keyframes text-glow {
  0%, 100% {
    text-shadow: 2px 2px 0 #2E7D32;
  }
  50% {
    text-shadow: 2px 2px 10px rgba(255, 255, 255, 0.5);
  }
}

.nav-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 14px;
  border-radius: 10px;
  border: 3px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &.active {
    background: white;
    color: #2E7D32;
    border-color: #5D4037;
    box-shadow: 2px 2px 0 #5D4037;
  }
  
  .nav-icon {
    font-size: 18px;
  }
  
  .nav-decoration {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 10px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10"><path d="M0,10 Q5,0 10,10 Q15,0 20,10" fill="none" stroke="%235D4037" stroke-width="2"/></svg>') no-repeat center;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &.active .nav-decoration {
    opacity: 1;
  }
}

.auth-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(180deg, #FFCC80 0%, #FFB74D 100%);
  border: 3px solid #5D4037;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s ease-in-out infinite;
  
  .user-hat {
    position: absolute;
    top: -8px;
    width: 20px;
    height: 12px;
    background: #E91E63;
    border: 2px solid #5D4037;
    border-radius: 50% 50% 0 0;
  }
}

.user-head {
  width: 18px;
  height: 18px;
  background: #5D4037;
  border-radius: 50%;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-shadow: 1px 1px 0 #2E7D32;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(180deg, #FFB74D 0%, #FF9800 100%);
  border: 3px solid #5D4037;
  border-radius: 10px;
  color: #E65100;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 2px 2px 0 #5D4037;
  animation: pulse 2s ease-in-out infinite;
  
  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #5D4037;
  }
  
  .btn-icon {
    font-size: 16px;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.auth-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  border-radius: 10px;
  border: 3px solid #5D4037;
  transition: all 0.15s ease;
  animation: pulse 2s ease-in-out infinite;
  
  .auth-icon {
    font-size: 16px;
  }
  
  &.login {
    background: white;
    color: #5D4037;
    box-shadow: 2px 2px 0 #5D4037;
    
    &:hover {
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0 #5D4037;
    }
  }
  
  &.register {
    background: linear-gradient(180deg, #FFD54F 0%, #FFC107 100%);
    color: #E65100;
    box-shadow: 2px 2px 0 #5D4037;
    
    &:hover {
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0 #5D4037;
    }
  }
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 10;
}

/* 页脚 */
.footer {
  background: linear-gradient(180deg, #5D4037 0%, #3E2723 100%);
  border-top: 4px solid #8D6E63;
  padding: 20px 0;
  position: relative;
}

.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-farm {
  margin-bottom: 15px;
  height: 40px;
  position: relative;
  overflow: hidden;
}

.farm-elements {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 15px;
  position: relative;
}

.farm-crop {
  width: 20px;
  height: 30px;
  background: linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%);
  border: 2px solid #5D4037;
  border-radius: 5px 5px 0 0;
  position: relative;
  animation: crop-grow 3s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 25px;
    height: 15px;
    background: #81C784;
    border-radius: 50%;
  }
}

.farm-fence {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: repeating-linear-gradient(90deg, 
    #8D6E63 0px, #8D6E63 10px,
    #5D4037 10px, #5D4037 12px);
}

@keyframes crop-grow {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.1);
  }
}

.footer-decor {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 18px;
  animation: sway 3s ease-in-out infinite;
  
  span {
    animation: float 2s ease-in-out infinite;
    
    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.2}s;
      }
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes sway {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

.footer-text {
  margin: 10px 0;
  font-size: 14px;
  color: #D7CCC8;
  text-shadow: 1px 1px 0 #3E2723;
}

/* 像素边框 */
.pixel-border {
  position: fixed;
  left: 0;
  right: 0;
  height: 8px;
  background: repeating-linear-gradient(90deg, 
    #5D4037 0px, #5D4037 8px,
    #8D6E63 8px, #8D6E63 16px);
  z-index: 1001;
  
  &.top { top: 0; }
  &.bottom { bottom: 0; }
}

/* 响应式设计 */
@media (max-width: 900px) {
  .navbar-inner {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 15px;
    gap: 10px;
  }
  
  .nav-section {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .nav-link {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .brand-text h1 {
    font-size: 18px;
  }
  
  .decorative-elements {
    height: 150px;
  }
  
  .floating-cloud {
    width: 60px;
    height: 25px;
  }
  
  .floating-butterfly {
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .navbar-inner {
    padding: 10px;
  }
  
  .brand-logo .logo-character {
    transform: scale(0.8);
  }
  
  .brand-text h1 {
    font-size: 16px;
  }
  
  .nav-link {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .auth-link {
    padding: 8px 14px;
    font-size: 12px;
  }
  
  .logout-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>
