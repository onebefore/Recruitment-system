<template>
  <el-container class="main-layout">
    <el-header class="search-header">
      <div class="top-nav-bar">
        <div class="nav-left">
          <span class="nav-item active">推荐</span>
          <span class="nav-item">Java(广州)</span>
          <span class="nav-item">前端/移动开发</span>
        </div>
        <div class="main-search-wrapper">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索职位、公司"
            clearable
            class="main-search-input"
          >
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
            <template #suffix>
              <span class="map-text"><el-icon><Location /></el-icon> 地图</span>
            </template>
            <template #append>
              <el-button type="primary" @click="handleSearch" class="search-button">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>
      <div class="filter-row">
        <el-dropdown trigger="click" @command="handleFilterChange('job_type', $event)">
          <el-button class="filter-button">
            {{ searchForm.job_type || '求职类型' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in jobTypeOptions" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleSalaryFilterChange">
          <el-button class="filter-button">
            {{ displaySalaryRange || '薪资待遇' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in salaryRangeOptions" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleFilterChange('experience', $event)">
          <el-button class="filter-button">
            {{ searchForm.experience || '工作经验' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in experienceOptions" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleFilterChange('education', $event)">
          <el-button class="filter-button">
            {{ searchForm.education || '学历要求' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in educationOptions" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleFilterChange('company_industry', $event)">
          <el-button class="filter-button">
            {{ searchForm.company_industry || '公司行业' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in companyIndustryOptions" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleFilterChange('company_size', $event)">
          <el-button class="filter-button">
            {{ searchForm.company_size || '公司规模' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in companySizeOptions" :key="item.value" :command="item.value">{{ item.label }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button link type="info" @click="resetFilters" class="clear-filters-button">清空</el-button>
      </div>
    </el-header>
    <el-container class="content-container">
      <el-aside width="40%" class="job-list-aside">
        <el-table 
          :data="jobs" 
          style="width: 100%" 
          v-loading="loading"
          @row-click="handleRowClick"
          highlight-current-row
          :row-class-name="({row}) => row.job_id === currentJob?.job_id ? 'current-row' : ''"
        >
          <el-table-column prop="job_title" label="岗位名称" align="left" header-align="left">
            <template #default="{ row }">
              <el-link type="primary">{{ row.job_title }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="company_name" label="公司名称" align="left" header-align="left"></el-table-column>
          <el-table-column prop="salary_range" label="薪资范围" align="left" header-align="left"></el-table-column>
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
      </el-aside>
      <el-main class="job-detail-main">
        <div v-if="currentJob" class="job-detail-wrapper">
          <div class="job-detail-content">
            <h3>{{ currentJob.job_title }} 
              <el-button size="small" type="primary" @click="openResumeDialog(currentJob)" style="margin-left: 20px;" v-if="isSeeker">投简历</el-button>
              <el-button size="small" type="primary" @click="applyJob(currentJob)" style="margin-left: 10px;">立即沟通</el-button>
            </h3>
            <div class="job-info">
              <p><strong>公司名称：</strong><el-link type="primary" @click="goToCompanyDetail(currentJob.company_id)">{{ currentJob.company_name }}</el-link></p>
              <p><strong>行业：</strong>{{ currentJob.industry }}</p>
              <p><strong>薪资范围：</strong>{{ currentJob.salary_range }}</p>
              <p><strong>工作地点：</strong>{{ currentJob.location }}</p>
              <p><strong>发布日期：</strong>{{ formatDate(currentJob.created_at) }}</p>
            </div>
            <div class="job-description">
              <h4>职位描述</h4>
              <p>{{ currentJob.description }}</p>
            </div>
            <div class="job-requirements">
              <h4>任职要求</h4>
              <p>{{ currentJob.requirements }}</p>
            </div>
          </div>
        </div>
        <div v-else class="no-job-selected">
          <p>请在左侧选择一个岗位查看详情</p>
        </div>
      </el-main>
    </el-container>
    <el-dialog v-model="resumeDialogVisible" title="上传简历" width="40%" destroy-on-close>
      <el-upload
        class="upload-demo"
        drag
        action="/api/resume/resume"
        :data="uploadData"
        :on-success="handleResumeUploadSuccess"
        :before-upload="beforeResumeUpload"
        :limit="1"
        name="resume"
        :headers="uploadHeaders"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            仅支持 PDF/Word 文件，且大小不超过 5MB。
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Search, Location, ArrowDown, UploadFilled } from '@element-plus/icons-vue';
import api from '../services/api';

const router = useRouter();
const jobs = ref([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const currentJob = ref(null);

const jobTypeOptions = [
  { value: '不限', label: '不限' },
  { value: '全职', label: '全职' },
  { value: '兼职', label: '兼职' },
  { value: '实习', label: '实习' },
];
const salaryRangeOptions = [
  { value: '不限', label: '不限' },
  { value: '5k-10k', label: '5k-10k', min: 5, max: 10 },
  { value: '10k-15k', label: '10k-15k', min: 10, max: 15 },
  { value: '15k-20k', label: '15k-20k', min: 15, max: 20 },
  { value: '20k-25k', label: '20k-25k', min: 20, max: 25 },
  { value: '25k-30k', label: '25k-30k', min: 25, max: 30 },
  { value: '30k以上', label: '30k以上', min: 30, max: null },
];
const experienceOptions = [
  { value: '不限', label: '不限' },
  { value: '在校/应届', label: '在校/应届' },
  { value: '1-3年', label: '1-3年' },
  { value: '3-5年', label: '3-5年' },
  { value: '5-10年', label: '5-10年' },
  { value: '10年以上', label: '10年以上' },
];
const educationOptions = [
  { value: '不限', label: '不限' },
  { value: '大专', label: '大专' },
  { value: '本科', label: '本科' },
  { value: '硕士', label: '硕士' },
  { value: '博士', label: '博士' },
];
const companyIndustryOptions = [
  { value: '不限', label: '不限' },
  { value: '互联网', label: '互联网' },
  { value: '金融', label: '金融' },
  { value: '教育', label: '教育' },
  { value: '医疗', label: '医疗' },
  { value: '制造业', label: '制造业' },
  { value: '房地产', label: '房地产' },
  { value: '其他', label: '其他' },
];
const companySizeOptions = [
  { value: '不限', label: '不限' },
  { value: '0-50人', label: '0-50人' },
  { value: '50-200人', label: '50-200人' },
  { value: '200-500人', label: '200-500人' },
  { value: '500-1000人', label: '500-1000人' },
  { value: '1000人以上', label: '1000人以上' },
];

const searchForm = ref({
  keyword: '',
  industry: '',
  min_salary: null,
  max_salary: null,
  location: '',
  job_type: '',
  experience: '',
  education: '',
  company_industry: '',
  company_size: ''
});

const displaySalaryRange = computed(() => {
  if (searchForm.value.min_salary === null && searchForm.value.max_salary === null) {
    return '';
  } else if (searchForm.value.min_salary !== null && searchForm.value.max_salary !== null) {
    return `${searchForm.value.min_salary}k-${searchForm.value.max_salary}k`;
  } else if (searchForm.value.min_salary !== null) {
    return `${searchForm.value.min_salary}k以上`;
  } else if (searchForm.value.max_salary !== null) {
    return `${searchForm.value.max_salary}k以下`;
  }
  return '';
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const fetchJobs = async (params = {}) => {
  loading.value = true;
  try {
    const response = await api.searchJobs({
      ...params,
      page: currentPage.value,
      pageSize: pageSize.value
    });
    if (response.data) {
      jobs.value = response.data.jobs || [];
      total.value = response.data.total || 0;
      if (jobs.value.length > 0 && !currentJob.value) {
        currentJob.value = jobs.value[0];
      }
    } else {
      ElMessage.error('获取岗位列表失败');
    }
  } catch (err) {
    ElMessage.error('获取岗位列表失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = (filterName, value) => {
  if (value === '不限') {
    searchForm.value[filterName] = '';
  } else {
    searchForm.value[filterName] = value;
  }
  handleSearch();
};

const handleSalaryFilterChange = (value) => {
  if (value === '不限') {
    searchForm.value.min_salary = null;
    searchForm.value.max_salary = null;
  } else {
    const selectedRange = salaryRangeOptions.find(option => option.value === value);
    if (selectedRange) {
      searchForm.value.min_salary = selectedRange.min;
      searchForm.value.max_salary = selectedRange.max;
    }
  }
  handleSearch();
};

const handleSearch = () => {
  currentPage.value = 1;
  const searchParams = {
    keyword: searchForm.value.keyword,
    industry: searchForm.value.company_industry,
    min_salary: searchForm.value.min_salary,
    max_salary: searchForm.value.max_salary,
    location: searchForm.value.location,
    job_type: searchForm.value.job_type,
    experience: searchForm.value.experience,
    education: searchForm.value.education,
    company_size: searchForm.value.company_size,
    status: '招聘中'
  };
  fetchJobs(searchParams);
};

const resetFilters = () => {
  searchForm.value = {
    keyword: searchForm.value.keyword,
    industry: '',
    min_salary: null,
    max_salary: null,
    location: '',
    job_type: '',
    experience: '',
    education: '',
    company_industry: '',
    company_size: ''
  };
  handleSearch();
};

const handlePageChange = (page) => {
  currentPage.value = page;
  const searchParams = {
    keyword: searchForm.value.keyword,
    industry: searchForm.value.industry,
    min_salary: searchForm.value.min_salary,
    max_salary: searchForm.value.max_salary,
    location: searchForm.value.location,
    job_type: searchForm.value.job_type,
    experience: searchForm.value.experience,
    education: searchForm.value.education,
    company_industry: searchForm.value.company_industry,
    company_size: searchForm.value.company_size
  };
  fetchJobs(searchParams);
};

const handleRowClick = (row) => {
  currentJob.value = row;
};

const emit = defineEmits(['switchToMessages']);

const applyJob = async (job) => {
  try {
    const res = await api.getCompanyUserByCompanyId(job.company_id);
    if (res.data && res.data.user_id) {
      router.push({ path: '/seeker/messages', query: { userId: res.data.user_id } });
      emit('switchToMessages');
    } else {
      ElMessage.error('无法获取企业联系信息');
    }
  } catch (err) {
    ElMessage.error('申请失败，无法与企业沟通');
  }
};

const goToCompanyDetail = (companyId) => {
  router.push({ name: 'CompanyDetail', params: { id: companyId } });
};

const resumeDialogVisible = ref(false);
const currentUploadFile = ref(null);
const isSeeker = computed(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user && user.role && user.role.toLowerCase() === 'seeker';
});
function openResumeDialog(job) {
  currentJob.value = job;
  resumeDialogVisible.value = true;
}
function handleResumeUploadSuccess(response, file) {
  if (response.message === '简历上传成功') {
    ElMessage.success('简历上传成功！');
    resumeDialogVisible.value = false;
  } else {
    ElMessage.error('简历上传失败');
  }
}
function beforeResumeUpload(file) {
  const isPdfOrWord = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isPdfOrWord) {
    ElMessage.error('上传简历只能是 PDF 或 Word 格式!');
  }
  if (!isLt5M) {
    ElMessage.error('上传简历大小不能超过 5MB!');
  }
  currentUploadFile.value = file;
  return isPdfOrWord && isLt5M;
}
const uploadHeaders = computed(() => {
  const user = localStorage.getItem('user');
  return user ? { 'x-user': btoa(unescape(encodeURIComponent(user))) } : {};
});
const uploadData = computed(() => {
  const data = {
    job_id: currentJob.value ? currentJob.value.job_id : null
  };
  if (currentUploadFile.value) {
    data.encodedOriginalname = encodeURIComponent(currentUploadFile.value.name);
  }
  return data;
});

onMounted(() => {
  handleSearch();
});
</script>

<style scoped>
/* 复制 SeekerHome.vue 相关样式，可根据需要精简 */
.main-layout {
  flex-grow: 1;
  overflow: hidden;
}
.search-header {
  background-color: #fff;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  min-height: 120px;
}
.top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  height: 60px;
  box-sizing: border-box;
}
.nav-left {
  display: flex;
  gap: 20px;
}
.nav-item {
  cursor: pointer;
  font-weight: bold;
  color: #606266;
  padding: 5px 0;
  position: relative;
}
.nav-item.active {
  color: #409eff;
}
.nav-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 3px;
  background-color: #409eff;
}
.main-search-wrapper {
  flex-grow: 1;
  max-width: 600px;
  margin: 0 20px;
}
.main-search-input {
  width: 100%;
}
.map-text {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
  cursor: pointer;
  white-space: nowrap;
  padding-right: 10px;
}
.search-button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0 20px;
  height: 40px;
  background-color: var(--el-color-primary) !important;
  color: #fff !important;
  border: 1px solid var(--el-color-primary) !important;
}
.filter-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  gap: 15px;
  flex-wrap: wrap;
  background-color: #fcfcfc;
  border-bottom: 1px solid #e0e0e0;
  padding-left: 20px;
  box-sizing: border-box;
}
.filter-button {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 15px;
  font-size: 14px;
  color: #606266;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  min-width: 90px;
  justify-content: center;
}
.clear-filters-button {
  margin-left: auto;
  color: #909399;
}
.content-container {
  height: calc(100vh - var(--el-header-height));
  overflow: hidden;
}
.job-list-aside {
  background-color: #fff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}
.el-table {
  flex-grow: 1;
  margin: 0 !important;
  padding: 0 !important;
}
.el-table__header-wrapper, .el-table__body-wrapper {
  margin-left: 0 !important;
  padding-left: 0 !important;
}
.el-table th.el-table__cell, .el-table td.el-table__cell {
  text-align: left !important;
  padding-left: 0px !important;
}
.el-table th.el-table__cell > .cell,
.el-table td.el-table__cell > .cell {
  text-align: left !important;
  padding-left: 0px !important;
  width: 100% !important;
  box-sizing: border-box;
}
.pagination {
  margin-top: auto;
  padding-top: 20px;
  justify-content: flex-end;
}
.job-detail-main {
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}
.job-detail-wrapper {
  max-width: 800px;
  width: 100%;
}
.job-detail-content h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 20px;
}
.job-info p,
.job-description p,
.job-requirements p {
  margin-bottom: 10px;
  line-height: 1.8;
  text-align: left;
}
.job-description,
.job-requirements {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}
.no-job-selected {
  text-align: center;
  padding: 50px;
  color: #909399;
}
</style> 