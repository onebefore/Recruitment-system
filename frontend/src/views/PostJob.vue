<template>
  <div class="post-job-container">
    <h2>{{ isEditMode ? '编辑岗位' : '发布新岗位' }}</h2>
    <el-form :model="jobForm" label-width="120px">
      <el-form-item label="岗位名称" required>
        <el-input v-model="jobForm.position_name" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="最低薪资(k)" required>
        <el-input-number v-model="jobForm.min_salary" :min="0" />
      </el-form-item>
      <el-form-item label="最高薪资(k)" required>
        <el-input-number v-model="jobForm.max_salary" :min="jobForm.min_salary || 0" />
      </el-form-item>
      <el-form-item label="招聘人数" required>
        <el-input-number v-model="jobForm.hire_count" :min="1" />
      </el-form-item>
      <el-form-item label="工作地点" required>
        <el-input v-model="jobForm.location" placeholder="请输入工作地点" />
      </el-form-item>
      <el-form-item label="岗位状态" required>
        <el-select v-model="jobForm.status" placeholder="请选择岗位状态">
          <el-option label="招聘中" value="招聘中" />
          <el-option label="已结束" value="已结束" />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位要求" required>
        <el-input
          v-model="jobForm.requirements"
          type="textarea"
          :rows="4"
          placeholder="请输入详细的岗位要求"
        />
      </el-form-item>
      <el-form-item label="岗位描述">
        <el-input
          v-model="jobForm.description"
          type="textarea"
          :rows="4"
          placeholder="请输入岗位描述"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">{{ isEditMode ? '保存修改' : '发布岗位' }}</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import api from '../services/api';

const router = useRouter();
const route = useRoute(); // Use useRoute to get route parameters

const isEditMode = ref(false);
const jobId = ref(null);

const jobForm = ref({
  company_id: null,
  position_name: '',
  requirements: '',
  min_salary: 0,
  max_salary: 0,
  hire_count: 1,
  location: '',
  description: '',
  status: '招聘中',
});

// 获取当前登录企业的 company_id
const getCompanyId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const companyId = user?.company?.companyId || user?.company?.company_id || user?.companyId || user?.company_id;
  if (user && user.role === 'company' && companyId) {
    jobForm.value.company_id = companyId;
  } else {
    ElMessage.error('无法获取企业信息，请重新登录');
    router.push('/login');
  }
};

const fetchJobDetails = async () => {
  try {
    const res = await api.getJobById(jobId.value);
    if (res.data) {
      // Populate form with fetched data
      jobForm.value = {
        company_id: res.data.company_id,
        position_name: res.data.position_name,
        requirements: res.data.requirements,
        min_salary: res.data.min_salary,
        max_salary: res.data.max_salary,
        hire_count: res.data.hire_count,
        location: res.data.location,
        description: res.data.description,
        status: res.data.status,
      };
    }
  } catch (err) {
    console.error('获取岗位详情失败:', err);
    ElMessage.error('获取岗位详情失败，请稍后重试');
  }
};

// Lifecycle hook
onMounted(() => {
  if (route.params.id) {
    isEditMode.value = true;
    jobId.value = route.params.id;
    fetchJobDetails(); // Fetch job details if in edit mode
  }
  getCompanyId(); // Always get company ID for new posts or for validation
});

const handleSubmit = async () => {
  try {
    if (!jobForm.value.company_id) {
      ElMessage.error('企业信息缺失，无法发布/保存岗位');
      return;
    }
    if (jobForm.value.min_salary > jobForm.value.max_salary) {
      ElMessage.warning('最低薪资不能高于最高薪资');
      return;
    }

    let res;
    if (isEditMode.value) {
      res = await api.updateJob(jobId.value, jobForm.value);
      if (res.status === 200) {
        ElMessage.success('岗位信息更新成功！');
        router.push('/company');
      } else {
        ElMessage.error('岗位信息更新失败');
      }
    } else {
      res = await api.createJob(jobForm.value);
      if (res.status === 201) {
        ElMessage.success('岗位发布成功！');
        router.push('/company');
      } else {
        ElMessage.error('岗位发布失败');
      }
    }
  } catch (err) {
    console.error(isEditMode.value ? '更新岗位错误:' : '发布岗位错误:', err);
    ElMessage.error(isEditMode.value ? '更新岗位失败，请稍后重试' : '发布岗位失败，请稍后重试');
  }
};

const handleCancel = () => {
  router.push('/company');
};
</script>

<style scoped>
.post-job-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
}

.el-form-item {
  margin-bottom: 22px;
}
</style> 