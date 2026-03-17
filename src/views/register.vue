<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>注册账户</h2>
        <p>创建您的账户</p>
      </div>
    </div>
    <div class="form-container">
      <el-form :model="formData" ref="registerForm" :rules="rules" label-position="left" label-width="110px">
        <el-form-item prop="username">
          <template #label>
            <div class="label-wrapper">
              <span class="star">*</span>
              <span class="label-text">用户名</span>
            </div>
          </template>
          <el-input size="default" v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <template #label>
            <div class="label-wrapper">
              <span class="star">*</span>
              <span class="label-text">密码</span>
            </div>
          </template>
          <el-input size="default" v-model="formData.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <template #label>
            <div class="label-wrapper">
              <span class="star">*</span>
              <span class="label-text">确认密码</span>
            </div>
          </template>
          <el-input size="default" v-model="formData.confirmPassword" placeholder="请再次输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <template #label>
            <div class="label-wrapper">
              <span class="star">*</span>
              <span class="label-text">邮箱</span>
            </div>
          </template>
          <el-input size="default" v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <template #label>
            <div class="label-wrapper">
              <span class="star-empty"></span>
              <span class="label-text">昵称</span>
            </div>
          </template>
          <el-input size="default" v-model="formData.nickname" placeholder="请输入昵称（选填）"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <template #label>
            <div class="label-wrapper">
              <span class="star-empty"></span>
              <span class="label-text">手机号</span>
            </div>
          </template>
          <el-input size="default" v-model="formData.phone" placeholder="请输入手机号（选填）"></el-input>
        </el-form-item>
        <el-form-item prop="gender">
          <template #label>
            <div class="label-wrapper">
              <span class="star">*</span>
              <span class="label-text">性别</span>
            </div>
          </template>
          <el-select size="default" v-model="formData.gender" placeholder="请选择性别" style="width: 100%;">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
            <el-option label="保密" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="age">
          <template #label>
            <div class="label-wrapper">
              <span class="star">*</span>
              <span class="label-text">年龄</span>
            </div>
          </template>
          <el-input-number size="default" v-model="formData.age" :min="1" :max="150" placeholder="请输入年龄" style="width: 100%;"></el-input-number>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" size="default" @click="handleRegister(registerForm)">注册账户</el-button>
        </div>
        <div class="footer">
          已有账户？<el-link type="primary" href="auth/login">去登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { register } from '@/api/frontend';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const registerForm = ref();

const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  nickname: '',
  phone: '',
  gender: '',
  age: ''
});

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const validateEmail = (rule, value, callback) => {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value && !emailReg.test(value)) {
    callback(new Error('请输入正确的邮箱格式'));
  } else {
    callback();
  }
};

const validatePhone = (rule, value, callback) => {
  const phoneReg = /^1[3-9]\d{9}$/;
  if (value && !phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号格式'));
  } else {
    callback();
  }
};

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  nickname: [],
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ]
});

const handleRegister = async (formEl) => {
  if (!formEl) return
  try {
    await formEl.validate((valid, fields) => {
      if (valid) {
        const data = { ...formData };
        delete data.confirmPassword;
        register(data).then(res => {
          ElMessage.success('注册成功');
          router.push('/auth/login');
        }).catch(() => {
          ElMessage.error('注册失败');
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
:deep(.el-form-item__label::before) {
  display: none;
}
.label-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
}
.star {
  color: #f56c6c;
  width: 16px;
  flex-shrink: 0;
  text-align: center;
  margin-right: 4px;
}
.star-empty {
  width: 16px;
  flex-shrink: 0;
  text-align: center;
  margin-right: 4px;
}
.label-text {
  text-align: right;
}
.container {
  width: 450px;
  margin: 0 auto;
  padding-top: 60px;
  .title {
    .title-text {
      text-align: center;
      h2 {
        font-size: 32px;
        margin-bottom: 8px;
      }
      p {
        font-size: 16px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 40px;
    .btn {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      :deep(.el-button) {
        width: 100%;
        padding: 12px 0;
        font-size: 16px;
      }
    }
    .footer {
      padding: 24px 0;
      text-align: center;
    }
  }
}
</style>
