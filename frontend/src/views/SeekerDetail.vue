<template>
  <div class="seeker-detail">
    <div class="header-container">
      <el-button @click="router.back()" class="back-button">
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <h2 class="page-title">求职者详情</h2>
      <div class="placeholder"></div>
    </div>
    <el-descriptions :model="seeker" border>
      <el-descriptions-item label="姓名">{{ seeker.name }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ seeker.gender }}</el-descriptions-item>
      <el-descriptions-item label="出生日期">{{ seeker.birth_date }}</el-descriptions-item>
      <el-descriptions-item label="电话">{{ seeker.phone }}</el-descriptions-item>
      <el-descriptions-item label="户籍所在地">{{ seeker.hometown }}</el-descriptions-item>
      <el-descriptions-item label="最高学历">{{ seeker.highest_degree }}</el-descriptions-item>
      <el-descriptions-item label="专业">{{ seeker.major }}</el-descriptions-item>
      <el-descriptions-item label="学位">{{ seeker.degree }}</el-descriptions-item>
      <el-descriptions-item label="毕业院校">{{ seeker.school }}</el-descriptions-item>
      <el-descriptions-item label="技能">{{ seeker.skills }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();
const seeker = ref({});
const seekerId = router.currentRoute.value.params.id;

const fetchSeekerDetail = async () => {
  try {
    const res = await api.getSeekerProfile(seekerId); // Corrected API call
    if (res.data) {
      seeker.value = res.data;
    } else {
      ElMessage.error('未找到求职者信息');
    }
  } catch (err) {
    console.error('获取求职者信息失败:', err);
    ElMessage.error('获取求职者信息失败，请稍后重试');
  }
};

onMounted(() => {
  fetchSeekerDetail();
});
</script>

<style scoped>
.seeker-detail {
  padding: 20px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}


.page-title {
  flex-grow: 1;
  text-align: center;
  margin: 0;
}

.placeholder {
  width: 70px; /* Adjust based on the actual width of your back button */
}
</style> 