<template>
  <div class="stardew-layout">
    <div class="navbar">
      <div class="navbar-inner">
        <div class="brand-section">
          <div class="brand-logo">
            <div class="logo-character">
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
          </router-link>
          <router-link to="/consultation" class="nav-link" v-if="isLoggedIn" :class="{ 'active': $route.path === '/consultation' }">
            <span class="nav-icon">💬</span>
            <span class="nav-text">AI咨询</span>
          </router-link>
          <router-link to="/emotion-diary" class="nav-link" v-if="isLoggedIn" :class="{ 'active': $route.path === '/emotion-diary' }">
            <span class="nav-icon">📔</span>
            <span class="nav-text">情绪日记</span>
          </router-link>
          <router-link to="/knowledge" class="nav-link" :class="{ 'active': $route.path === '/knowledge' }">
            <span class="nav-icon">📚</span>
            <span class="nav-text">知识库</span>
          </router-link>
        </div>
        
        <div class="auth-section">
          <div class="user-info" v-if="isLoggedIn">
            <div class="user-avatar">
              <div class="user-head"></div>
            </div>
            <span class="user-name">{{ userName }}</span>
            <button class="logout-btn" @click="logoutClick">
              <span class="btn-icon">🚪</span>
              <span>退出</span>
            </button>
          </div>
          <div class="auth-buttons" v-else>
            <router-link to="/auth/login" class="auth-link login">
              <span class="auth-icon">🔑</span>
              <span>登录</span>
            </router-link>
            <router-link to="/auth/register" class="auth-link register">
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
}

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
  height: 70px;
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
}

.brand-text {
  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: white;
    text-shadow: 2px 2px 0 #2E7D32;
    letter-spacing: 1px;
  }
  
  p {
    margin: 2px 0 0;
    font-size: 10px;
    color: #E8F5E9;
    letter-spacing: 0.5px;
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
  
  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #5D4037;
  }
  
  .btn-icon {
    font-size: 16px;
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
}

.footer {
  background: linear-gradient(180deg, #5D4037 0%, #3E2723 100%);
  border-top: 4px solid #8D6E63;
  padding: 20px 0;
}

.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
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
}

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
}

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
}
</style>
