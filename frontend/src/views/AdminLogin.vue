<template>
  <div class="admin-login-container">
    <h2>管理员登录</h2>
    <el-form :model="adminLoginForm" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="adminLoginForm.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="adminLoginForm.password" type="password" show-password />
      </el-form-item>
      <el-button type="primary" @click="handleAdminLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { ElMessage } from 'element-plus';

const router = useRouter();
const adminLoginForm = ref({
  username: '',
  password: '',
});

const handleAdminLogin = async () => {
  try {
    // 调用后端管理员登录接口
    const res = await api.post('/api/admin/login', adminLoginForm.value);
    if (res.data && res.data.admin) {
      localStorage.setItem('user', JSON.stringify(res.data.admin));
      ElMessage.success('管理员登录成功！');
      router.push('/admin/users');
    } else {
      ElMessage.error(res.data.message || '管理员登录失败');
    }
  } catch (err) {
    ElMessage.error((err.response && err.response.data && err.response.data.message) || '管理员登录失败，请重试');
  }
};
</script>

<style scoped>
.admin-login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
}

.admin-login-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style> 