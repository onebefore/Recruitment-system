<template>
  <div class="seeker-home-container">
    <!-- 顶部导航栏，右侧加头像和用户名 -->
    <div class="seeker-navbar">
      <div class="navbar-content">
        <span
          :class="['nav-link', 'main-title', $route.name === 'SeekerMain' ? 'active' : '']"
          @click="switchNav('home')"
        >好工作招聘系统</span>
        <span :class="['nav-link', $route.name === 'SeekerJobs' ? 'active' : '']" @click="switchNav('jobs')">职位</span>
        <span :class="['nav-link', $route.name === 'SeekerCompany' ? 'active' : '']" @click="switchNav('company')">公司</span>
        <span :class="['nav-link', $route.name === 'SeekerMessages' ? 'active' : '']" @click="switchNav('messages')">消息</span>
        <span :class="['nav-link', $route.name === 'AppliedResumes' ? 'active' : '']" @click="switchNav('resume')">简历</span>
        <div class="navbar-user">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link user-profile-display">
              <span class="username-display">{{ usernameDisplay }}</span>
              <el-avatar :size="36" :src="userAvatar" class="user-avatar"></el-avatar>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToPersonalCenter">个人中心</el-dropdown-item>
                <el-dropdown-item @click="goToAppliedResumes">已投简历</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 主内容区：切换聊天界面 -->
    <router-view />

    <!-- 申请岗位对话框 (包含聊天和上传简历) -->
    <el-dialog
      v-model="applyJobDialogVisible"
      :title="'申请岗位: ' + (selectedJobToApply ? selectedJobToApply.job_title : '') + ' (公司: ' + (selectedJobToApply ? selectedJobToApply.company_name : '') + ')'"
      width="60%"
      destroy-on-close
    >
      <div v-if="selectedJobToApply">
        <el-tabs type="border-card">
          <el-tab-pane label="在线沟通">
            <div class="chat-container">
              <div class="message-list">
                <div
                  v-for="msg in messages"
                  :key="msg.message_id"
                  :class="['message-item', msg.sender_id === currentUserId ? 'sent' : 'received']"
                >
                  <div class="message-content">{{ msg.content }}</div>
                  <div class="message-time">{{ formatDate(msg.sent_at) }}</div>
                </div>
              </div>
              <div class="message-input">
                <el-input
                  v-model="newMessageContent"
                  type="textarea"
                  :rows="3"
                  placeholder="输入消息..."
                ></el-input>
                <el-button type="primary" @click="sendMessage" style="margin-top: 10px;">发送</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="上传简历">
            <h4>上传简历</h4>
            <el-upload
              class="upload-demo"
              drag
              :action="'/api/resume/resume'"
              :data="uploadData"
              :on-success="handleResumeUploadSuccess"
              :before-upload="beforeResumeUpload"
              :limit="1"
              name="resume"
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { UploadFilled, Search, Location, Plus, ArrowDown } from '@element-plus/icons-vue';
import api from '../services/api';
import Messages from './Messages.vue';
import JobList from './JobList.vue';

const router = useRouter();
const jobs = ref([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const currentJob = ref(null);

const applyJobDialogVisible = ref(false);
const selectedJobToApply = ref(null);
const currentSeekerId = ref(null);
const companyUserId = ref(null);
const messages = ref([]);
const newMessageContent = ref('');
const currentUserId = ref(null);
const chatReceiverName = ref('');

const usernameDisplay = ref('游客');
const userAvatar = ref('/image/小猫猫.jpg'); // Default avatar

const backendBaseUrl = 'http://localhost:5000';

const activeNav = ref('home');

function getFullAvatarUrl(url) {
  if (!url) return '/image/小猫猫.jpg';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads') || url.startsWith('/avatars')) {
    return backendBaseUrl + url;
  }
  return url;
}

const loadUserProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    let avatar = '';
    if (user.seeker && user.seeker.avatar_url) {
      avatar = user.seeker.avatar_url;
    } else if (user.avatar_url) {
      avatar = user.avatar_url;
    } else if (user.logo_url) {
      avatar = user.logo_url;
    } else if (user.company && user.company.logo_url) {
      avatar = user.company.logo_url;
    }
    userAvatar.value = getFullAvatarUrl(avatar);
    usernameDisplay.value = user.username || '游客';
  } else {
    usernameDisplay.value = '游客';
    userAvatar.value = '/image/小猫猫.jpg';
  }
};

// Options for new filters
const locationOptions = [
  { value: '不限', label: '不限' },
  { value: '抚州', label: '抚州' },
  { value: '南昌', label: '南昌' },
  { value: '上海', label: '上海' },
  { value: '北京', label: '北京' },
];

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

// Computed property for displaying salary range in filter button
const displaySalaryRange = computed(() => {
  if (searchForm.value.min_salary === null && searchForm.value.max_salary === null) {
    return ''; // Default placeholder will be shown
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
      console.log('Fetched jobs data:', response.data.jobs);
      console.log('Total jobs:', response.data.total);
      if (jobs.value.length > 0 && !currentJob.value) {
        currentJob.value = jobs.value[0];
      }
    } else {
      ElMessage.error('获取岗位列表失败');
    }
  } catch (err) {
    console.error('获取岗位列表错误:', err);
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

const searchJobs = (event) => {
  event.preventDefault();
  handleSearch();
};

const resetFilters = () => {
  searchForm.value = {
    keyword: searchForm.value.keyword, // Keep keyword
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

const applyJob = async (job) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId || user?.id || user?.user_id;
  if (!user || (user.role && user.role.toLowerCase() !== 'seeker') || !userId) {
    ElMessage.warning('请先以求职者身份登录');
    router.push('/login');
    return;
  }
  selectedJobToApply.value = job;
  currentSeekerId.value = userId;
  currentUserId.value = userId;
  chatReceiverName.value = job.company_name;
  try {
    const res = await api.getCompanyUserByCompanyId(job.company_id);
    if (res.data && res.data.user_id) {
      companyUserId.value = res.data.user_id;
      // 根据当前用户角色跳转到不同的消息页面
      let rolePath = '';
      if (user.role === 'admin') rolePath = '/admin/messages';
      else if (user.role === 'company') rolePath = '/company/messages';
      else if (user.role === 'seeker') rolePath = '/seeker/messages';
      router.push({ path: rolePath, query: { userId: companyUserId.value } });
      applyJobDialogVisible.value = false;
      return;
    } else {
      ElMessage.error('无法获取企业联系信息');
    }
  } catch (err) {
    console.error('获取企业用户ID错误:', err);
    ElMessage.error('申请失败，无法与企业沟通');
  }
};

const fetchMessages = async () => {
  if (!currentUserId.value || !companyUserId.value) {
    console.warn('无法获取消息：currentUserId 或 companyUserId 缺失', currentUserId.value, companyUserId.value);
    return;
  }
  try {
    const res = await api.getMessages(currentUserId.value, companyUserId.value);
    messages.value = res.data;
  } catch (err) {
    console.error('获取消息列表错误:', err);
    ElMessage.error('获取消息列表失败');
  }
};

const sendMessage = async () => {
  if (!newMessageContent.value.trim()) {
    ElMessage.warning('消息内容不能为空');
    return;
  }
  if (!currentUserId.value || !companyUserId.value) {
    ElMessage.error('无法发送消息，用户信息或接收方信息缺失');
    console.error('发送消息失败：currentUserId 或 companyUserId 缺失', currentUserId.value, companyUserId.value);
    return;
  }

  try {
    await api.sendMessage({
      sender_id: currentUserId.value,
      receiver_id: companyUserId.value,
      content: newMessageContent.value,
    });
    newMessageContent.value = '';
    await fetchMessages();
  } catch (err) {
    console.error('发送消息错误:', err);
    ElMessage.error('消息发送失败');
  }
};

const handleResumeUploadSuccess = (response, file) => {
  if (response.message === '简历上传成功') {
    ElMessage.success('简历上传成功！');
  } else {
    ElMessage.error('简历上传失败');
  }
};

const currentUploadFile = ref(null);

const uploadData = computed(() => {
  const data = {
    job_id: selectedJobToApply.value ? selectedJobToApply.value.job_id : null,
    seeker_id: currentSeekerId.value
  };
  if (currentUploadFile.value) {
    data.encodedOriginalname = encodeURIComponent(currentUploadFile.value.name);
  }
  return data;
});

const beforeResumeUpload = (file) => {
  const isPdfOrWord = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isPdfOrWord) {
    ElMessage.error('上传简历只能是 PDF 或 Word 格式!');
  }
  if (!isLt5M) {
    ElMessage.error('上传简历大小不能超过 5MB!');
  }
  currentUploadFile.value = file; // Store the file for uploadData computed prop
  return isPdfOrWord && isLt5M;
};

const goToCompanyDetail = (companyId) => {
  router.push({ name: 'CompanyDetail', params: { id: companyId } });
};

const goToPersonalCenter = () => {
  router.push('/personal-center');
};

const goToAppliedResumes = () => {
  router.push('/applied-resumes');
};

const logout = () => {
  localStorage.removeItem('user');
  router.push('/login');
};

function switchNav(tab) {
  if (tab === 'messages') {
    router.push({ name: 'SeekerMessages' });
  } else if (tab === 'jobs') {
    router.push({ name: 'SeekerJobs' });
  } else if (tab === 'company') {
    router.push({ name: 'SeekerCompany' });
  } else if (tab === 'home') {
    router.push({ path: '/seeker' });
  } else if (tab === 'resume') {
    router.push({ name: 'AppliedResumes' });
  }
}

const openResumeDialog = (job) => {
  selectedJobToApply.value = job;
  applyJobDialogVisible.value = true;
};

onMounted(() => {
  loadUserProfile(); // Load user profile data when component is mounted
  handleSearch(); // 修改此处，确保初始加载也应用筛选
});

// If SeekerHome.vue is wrapped in <keep-alive>, this will ensure data refreshes when returning
onActivated(() => {
  loadUserProfile();
});
</script>

<style scoped>
.seeker-home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

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
  /* Ensure header can expand but has a sensible minimum to accommodate both rows */
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

.user-profile-display {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username-display {
  font-size: 15px;
  color: #333;
  margin-right: 4px;
}

.user-avatar {
  border: 1px solid #eaeaea;
  margin-right: 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  gap: 15px;
  flex-wrap: wrap;
  background-color: #fcfcfc; /* Very light background for nav bar style */
  border-bottom: 1px solid #e0e0e0; /* Subtle bottom border */
  padding-left: 20px; /* Ensure left alignment with the rest of the header content */
  box-sizing: border-box; /* Include padding in total dimensions */
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
  min-width: 90px; /* Minimum width to ensure consistent button size */
  justify-content: center; /* Center content within button */
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
  border-right: 1px solid #e0e0e0; /* Add a subtle right border as a separator */
  display: flex;
  flex-direction: column;
}

.el-table {
  flex-grow: 1; /* Make the table grow and push pagination to the bottom */
  margin: 0 !important;
  padding: 0 !important;
}

/* Ensure table header and body wrappers are flush */
.el-table__header-wrapper, .el-table__body-wrapper {
  margin-left: 0 !important;
  padding-left: 0 !important;
}

/* Ensure individual cells are left aligned and have no extra padding */
.el-table th.el-table__cell, .el-table td.el-table__cell {
  text-align: left !important;
  padding-left: 0px !important;
}

/* Ensure the content inside the cells is also left-aligned */
.el-table th.el-table__cell > .cell,
.el-table td.el-table__cell > .cell {
  text-align: left !important;
  padding-left: 0px !important;
  width: 100% !important; /* Make the content wrapper take full width */
  box-sizing: border-box; /* Include padding in total width */
}

.pagination {
  margin-top: auto; /* Push pagination to the bottom */
  padding-top: 20px; /* Add some padding above it */
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
  max-width: 800px; /* Adjust as needed */
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
  text-align: left; /* Ensure text within content blocks is left-aligned */
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

/* Chat styles */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.message-list {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  flex-direction: column; /* Ensure content and time stack vertically */
  margin-bottom: 10px;
}

.message-item.sent {
  justify-content: flex-end; /* This was causing horizontal alignment, now will be vertical with column */
  align-items: flex-end; /* Aligns the entire message bubble (content + time) to the right */
}

.message-item.received {
  justify-content: flex-start; /* This was causing horizontal alignment, now will be vertical with column */
  align-items: flex-start; /* Aligns the entire message bubble (content + time) to the left */
}

.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  word-wrap: break-word;
}

.message-item.sent .message-content {
  background-color: #e1ffc7;
  color: #333;
}

.message-item.received .message-content {
  background-color: #f0f0f0;
  color: #333;
}

.message-time {
  font-size: 0.8em;
  color: #999;
  margin-top: 4px;
  /* Removed text-align: right; and width: 100%; as they are now handled by parent's align-items and specific rules below */
}

.message-item.sent .message-time {
  text-align: right;
}

.message-item.received .message-time {
  text-align: left;
}

.message-input {
  padding: 10px;
  border-top: 1px solid #ebeef5;
}

/* Specific adjustments for Element Plus components */
.el-dropdown {
  vertical-align: top;
}

.el-dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}

.el-input__wrapper {
  padding-left: 10px;
}

.el-input__inner {
  padding-right: 0;
}

.el-input-group__append {
  background-color: var(--el-color-primary) !important;
  color: #fff !important;
  border-color: var(--el-color-primary) !important;
}

.el-input-group__append .el-button {
  color: #fff !important;
}

.el-upload-dragger {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.el-icon--upload {
  font-size: 67px;
  color: #c0c4cc;
  line-height: 50px;
}
.el-upload__text em {
  color: var(--el-color-primary);
  font-style: normal;
}

.el-table .current-row > td {
  background-color: var(--el-color-primary-light-9) !important;
}

.el-table .el-table__cell {
  padding-left: 0px !important; /* Remove left padding to shift content further left */
}

.el-table th.el-table__cell > .cell,
.el-table .el-table__cell .cell {
  text-align: left !important;
  padding-left: 0px !important; /* Ensure content itself has no left padding */
}

.el-table td.el-table__cell, .el-table th.el-table__cell {
  text-align: left !important;
}

.el-table__header-wrapper th.el-table__cell,
.el-table__body-wrapper td.el-table__cell {
  padding-left: 0px !important;
}

.el-table__header-wrapper,
.el-table__body-wrapper {
  margin-left: 0 !important;
  padding-left: 0 !important;
}

.el-table .el-link {
  padding: 0 !important;
  margin: 0 !important;
  display: block; /* Ensure it takes full width to align content */
  text-align: left !important;
}

/* REMOVING DUPLICATE STYLES BELOW THIS LINE */

/*
.main-search-input .el-input-group__append {
  background-color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
}

.main-search-input .el-input-group__append .el-button {
  background-color: var(--el-color-primary) !important;
  color: #fff !important;
  border-color: var(--el-color-primary) !important;
}
*/

.seeker-navbar {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  padding: 0;
  height: 54px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 32px;
  justify-content: flex-start;
  width: 100%;
}
.nav-link {
  font-size: 17px;
  color: #333;
  padding: 0 12px;
  cursor: pointer;
  height: 54px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-bottom 0.2s;
}
.nav-link.active {
  color: #2186ff;
  border-bottom: 2px solid #2186ff;
  font-weight: bold;
  background: #f5f8ff;
}
.navbar-user {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.main-title {
  font-size: 2rem;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  font-weight: bold;
  letter-spacing: 2px;
  color: #00bfa5;
  margin-right: 40px;
  margin-left: 8px;
  transition: color 0.2s;
}
.main-title.active {
  color: #2186ff;
  text-shadow: 0 2px 8px rgba(33,134,255,0.08);
}
</style>