<template>
  <div>
    <div class="frontLayout">frontLayout
        <div class="navbar-container"> 
            <div class="brand-section">
                <el-image width="50px" height="50px" src="/logo.png" alt="品牌logo" class="brand-name" />
                <h1 class="brand-name">心理健康ai系统</h1>
                <div class="nav-section">
                    <router-link to="/" class="nav-link">首页</router-link>
                    <router-link to="/consultation" class="nav-link" v-if="isLoggedIn.">AI咨询</router-link>
                    <router-link to="/emotion-diary" class="nav-link" v-if="isLoggedIn">情绪日记</router-link>
                    <router-link to="/knowledge" class="nav-link" >知识库</router-link>
                    <el-button type="primary" class="nav-link" v-if="isLoggedIn" @click="logoutClick">退出登录</el-button>
                    <template v-else>
                        <router-link to="auth/login" class="nav-link">登录</router-link>
                        <router-link to="auth/register" class="nav-link">注册
                            <el-button type="primary" class="nav-link">注册</el-button>
                        </router-link>
                    </template>
                </div>
            </div>
        </div>
        <div class="main-container"> </div>
        <div class="footer-container"> </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const iconUrl = new URL('@/assets/images/logo.png', import.meta.url).href

const isLoggedIn = ref(false)

onMounted(() => {
    isLoggedIn.value = localStorage.getItem('token') !== null
}) 
</script>
<style lang="scss" scoped>
.frontend-layout {
        background-color: #fff;
        .navbar-container {
            max-width: 1200px;
            height: 100%;
            margin: 0 auto;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .brand-section {
                display: flex;
                align-items: center;
                .brand-name {
                    margin-left: 10px;
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
                    &:hover {
                        color: #4A90E2;
                    }
                }
            }
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