<template>
  <div class="login-box">
    <div class="header">
     <el-icon color="#333">
      <Back></Back>
     </el-icon>
      返回首页
    </div>
    <div class="title-box">
      <h1>登录您的账户</h1>
      <p>请输入您的登录信息</p>
    </div>
    <el-form :model="formData" ref="loginForm" :rules="rules">
      <el-form-item label="用户名或邮箱" prop="username" label-position="top">
        <el-input size="large" v-model="formData.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" label-position="top">
        <el-input size="large" v-model="formData.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <div class="footer">
        <el-button type="primary" size="large" @click="handleLogin(loginForm)">登录账户</el-button>
        <div class="tips">
          还没有账户？<el-link type="primary" href="auth/register">去注册</el-link>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { login } from '@/api/admin';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
const formData = reactive({
  username: '',
  password: ''
})
const loginForm = ref();
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})
const handleLogin = async (formEl) => {
  if (!formEl) return
  try {
    await formEl.validate((valid, fields) => {
    if (valid) {
        login(formData).then(data => {
          if (!data.token){
            ElMessage.error('登录失败');
            return;
          }
          localStorage.setItem('token', data.token);
          localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
          // 根据用户类型跳转不同页面
          if (data.userInfo.userType === 2) {
            router.push('/back/dataAnalysis');
          } else {
          }
        })
      }
    })
  } catch (error) {
    console.error(error);
  }
}
</script>
<style lang="scss" scoped>
.login-box {
  height: 100%;
  width: 380px;
  .header {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #333;
  }
  .title-box {
    text-align: center;
    margin-bottom: 30px;
    h1 {
      margin: 80px 0 14px;
    }
    p {
      font-size: 16px;
      color: #666;
    }
  }
  .footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-button {
      width: 100%;
      margin: 30px 0 20px;
    }
    .tips {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>