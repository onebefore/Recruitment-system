<template>
  <div class="applied-resumes-container">
    <div class="header-container">
      <el-button @click="goBack" class="back-button">
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <h2 class="page-title">已投简历</h2>
      <div class="placeholder"></div>
    </div>

    <el-table
      :data="appliedResumes"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="job.job_title" label="岗位名称" min-width="150">
        <template #default="{ row }">
          <el-link type="primary" @click="viewJobDetail(row.job.job_id)">{{ row.job.job_title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="company.company_name" label="公司名称" min-width="150">
        <template #default="{ row }">
          <el-link type="primary" @click="viewCompanyDetail(row.company.company_id)">{{ row.company.company_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="job.salary_range" label="薪资范围" width="120"></el-table-column>
      <el-table-column prop="job.location" label="工作地点" width="120"></el-table-column>
      <el-table-column prop="upload_time" label="投递时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.upload_time) }}
        </template>
      </el-table-column>
      <el-table-column label="预览简历" width="110">
        <template #default="{ row }">
          <el-button type="primary" link @click="previewResume(row)">预览</el-button>
        </template>
      </el-table-column>
      <el-table-column label="下载简历" width="110">
        <template #default="{ row }">
          <el-button type="primary" link @click="downloadResume(row)">下载</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewResume(row)">查看简历</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-pagination
      v-if="total > 0"
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';
import api from '../services/api';

const router = useRouter();
const appliedResumes = ref([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const backendBaseUrl = window.location.origin.includes('localhost') ? 'http://localhost:5000' : window.location.origin;

const fetchAppliedResumes = async () => {
  loading.value = true;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.relatedId) {
      ElMessage.warning('请先登录');
      router.push('/login');
      return;
    }

    const response = await api.getAppliedResumes(user.relatedId, {
      page: currentPage.value,
      pageSize: pageSize.value
    });

    if (response.data) {
      appliedResumes.value = response.data.resumes || [];
      total.value = response.data.total || 0;
    }
  } catch (error) {
    console.error('获取已投简历列表失败:', error);
    ElMessage.error('获取已投简历列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchAppliedResumes();
};

const viewJobDetail = (jobId) => {
  router.push({ name: 'JobDetail', params: { id: jobId } });
};

const viewCompanyDetail = (companyId) => {
  router.push({ name: 'CompanyDetail', params: { id: companyId } });
};

const viewResume = (resume) => {
  window.open(`${api.getBaseUrl()}/uploads/resumes/${resume.filename}`, '_blank');
};

const goBack = () => {
  router.back();
};

function getResumeFileUrl(row) {
  if (row.filename) {
    return `${backendBaseUrl}/uploads/resumes/${row.filename}`;
  }
  return '';
}

function previewResume(row) {
  const url = getResumeFileUrl(row);
  if (url) {
    window.open(url, '_blank');
  } else {
    ElMessage.error('简历文件不存在');
  }
}

function downloadResume(row) {
  if (!row.resume_id) {
    ElMessage.error('简历ID不存在');
    return;
  }
  const url = `${backendBaseUrl}/api/resume/download/${row.resume_id}`;
  window.open(url, '_blank');
}

onMounted(() => {
  fetchAppliedResumes();
});
</script>

<style scoped>
.applied-resumes-container {
  padding: 20px;
  background-color: #fff;
  min-height: 100vh;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-title {
  flex-grow: 1;
  text-align: center;
  margin: 0;
}

.placeholder {
  width: 70px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table .el-link) {
  font-weight: normal;
}

:deep(.el-table .el-button--link) {
  padding: 0;
}
</style> 