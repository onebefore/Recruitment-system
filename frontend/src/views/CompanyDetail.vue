<template>
  <div class="company-detail-page">
    <el-button type="link" @click="goBack" class="back-button">
      <el-icon><ArrowLeft /></el-icon> 返回
    </el-button>
    <el-card class="company-detail-card">
      <template #header>
        <div class="card-header">
          <img v-if="companyLogoUrl" :src="companyLogoUrl" alt="Company Logo" class="company-logo" />
          <span>{{ companyDetails ? companyDetails.company_name : '公司详情' }}</span>
        </div>
      </template>

      <div v-if="companyDetails" class="company-content">
        <el-descriptions :column="1" border class="company-info-descriptions">
          <el-descriptions-item label="公司名称">{{ companyDetails.company_name }}</el-descriptions-item>
          <el-descriptions-item label="行业">{{ companyDetails.industry }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ companyDetails.address }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ companyDetails.phone }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">公司简介</el-divider>
        <div class="company-introduction">
          <p>{{ companyDetails.introduction }}</p>
        </div>
      </div>
      <div v-else class="loading-placeholder">
        <p>正在加载公司信息...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { ElMessage, ElCard, ElDescriptions, ElDescriptionsItem, ElDivider } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const companyId = ref(null);
const companyDetails = ref(null);

const backendBaseUrl = 'http://localhost:5000';

const companyLogoUrl = computed(() => {
  if (companyDetails.value && companyDetails.value.logo_url) {
    return `${backendBaseUrl}${companyDetails.value.logo_url}`;
  }
  return '';
});

const fetchCompanyDetails = async () => {
  try {
    companyId.value = route.params.id;
    if (companyId.value) {
      const res = await api.getCompanyDetail(companyId.value);
      if (res.data) {
        companyDetails.value = res.data;
        console.log('Fetched company details:', res.data);
      } else {
        ElMessage.error('获取公司详情失败');
      }
    }
  } catch (err) {
    console.error('获取公司详情错误:', err);
    ElMessage.error('获取公司详情失败，请稍后重试');
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchCompanyDetails();
});
</script>

<style scoped>
.company-detail-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  margin-bottom: 20px;
  z-index: 10;
}

.company-detail-card {
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 50px;
}

.card-header {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.company-logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}

.company-content {
  padding: 20px 0;
}

.company-info-descriptions {
  margin-bottom: 30px;
}

.company-introduction {
  line-height: 1.8;
  color: #555;
  font-size: 15px;
  text-align: left;
  text-indent: 2em;
}

.loading-placeholder {
  text-align: center;
  padding: 50px;
  color: #909399;
}

.el-descriptions__label {
  font-weight: bold;
  color: #333;
}
</style> 