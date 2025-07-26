<template>
  <div class="login-bg">
    <div class="login-container">
      <el-card class="login-card">
        <div class="login-title">招聘系统登录</div>
        <el-form :model="loginForm" ref="loginFormRef" label-width="70px" class="login-form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" autocomplete="off" size="large" clearable prefix-icon="el-icon-user" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password" autocomplete="off" size="large" clearable prefix-icon="el-icon-lock" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" size="large" style="width: 100%; letter-spacing: 2px;">登录</el-button>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;">
            <el-button @click="goToRegister" type="text" style="width: 100%; color: #2186ff;">没有账号？立即注册</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import api from '../services/api';

const router = useRouter();
const loginForm = ref({ username: '', password: '' });
const loginFormRef = ref(null);

const handleLogin = async () => {
  // 登录前清除旧user，防止脏数据影响
  localStorage.removeItem('user');
  try {
    const res = await api.login(loginForm.value);
    if (res.data && res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      const user = res.data.user;
      if (user.role === 'admin') {
        router.push('/admin/users');
      } else if (user.role === 'company') {
        router.push('/company');
      } else if (user.role === 'seeker') {
        router.push('/seeker');
      } else {
        ElMessage.error('未知用户角色');
      }
    } else {
      ElMessage.error(res.data.message || '登录失败');
    }
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '登录失败');
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0f7ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-card {
  width: 100%;
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(33,134,255,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.04);
  padding: 36px 32px 28px 32px;
  background: #fff;
  border: none;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #2186ff;
  text-align: center;
  margin-bottom: 32px;
  letter-spacing: 2px;
}

.login-form {
  margin-top: 0;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-input__wrapper {
  border-radius: 10px !important;
  box-shadow: 0 2px 8px rgba(33,134,255,0.06);
}

.el-button--primary {
  background: linear-gradient(90deg, #2186ff 0%, #6ec1ff 100%);
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: background 0.2s;
}

.el-button--primary:hover {
  background: linear-gradient(90deg, #1867c0 0%, #4fa3e3 100%);
}

.el-button[type="text"] {
  font-size: 15px;
  color: #2186ff;
  text-align: center;
  width: 100%;
  margin-top: -10px;
}
</style>