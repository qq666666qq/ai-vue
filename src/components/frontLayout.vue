<template>
  <div class="frontend-layout">
    <div class="navbar-container"> 
        <div class="brand-section">
            <el-image style="width: 50px; height: 50px;"  :src="iconUrl" alt="品牌logo" class="brand-logo" />
            <h1 class="brand-name">心理健康ai系统</h1>
        </div>
        <div class="nav-section">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/consultation" class="nav-link" v-if="isLoggedIn">AI咨询</router-link>
            <router-link to="/emotion-diary" class="nav-link" v-if="isLoggedIn">情绪日记</router-link>
            <router-link to="/knowledge" class="nav-link" >知识库</router-link>
            <el-button  class="logout-btn" v-if="isLoggedIn" @click="logoutClick">退出登录</el-button>
            <template v-else>
                <router-link to="/auth/login" class="nav-link">登录</router-link>
                <router-link to="/auth/register" class="nav-link">
                    <el-button type="primary">注册</el-button>
                </router-link>
            </template>
        </div>
    </div>
    <div class="main-content">
        <router-view />
    </div>
    <div class="footer-container">
        <div class="footer-bottom">
            <p>
                &copy; {{ new Date().getFullYear() }} 心理健康ai系统. All rights reserved.
            </p>
        </div>
    </div> 
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const iconUrl = new URL('@/assets/images/logo.png', import.meta.url).href

const isLoggedIn = ref(false)

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
.frontend-layout {
  background-color: #fff;
  min-height: 100vh;    /* 让页面撑满屏幕 */
  display: flex;
  flex-direction: column;

  .navbar-container {
    max-width: 1200px;
    height: 70px;        /* 固定导航高度，不要 100% */
    margin: 0 auto;
    padding: 0 20px;     /* 左右内边距更美观 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .brand-section {
      display: flex;
      align-items: center;
      gap: 10px;

      .brand-logo {
        width: 50px;
        height: 50px;
      }
      .brand-name {
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;

      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        text-decoration: none;

        &:hover {
          color: #4A90E2;
        }
      }

      /* 让导航里的按钮和文字统一垂直居中 */
      :deep(.el-button) {
        margin: 0;
        display: inline-flex;
        align-items: center;
      }
    }
  }

  /* 内容区域自动撑开 */
  .main-content {
    flex: 1;
    width: 100%;
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    margin-top: auto;

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>