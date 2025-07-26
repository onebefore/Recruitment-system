<template>
  <el-container class="common-layout">
    <el-aside width="200px" class="company-aside">
      <el-menu :default-active="activeMenu" class="company-menu" @select="handleMenuSelect">
        <el-menu-item index="jobs">已发布岗位</el-menu-item>
        <el-menu-item index="messages">消息</el-menu-item>
        <el-menu-item index="postJob">发布新岗位</el-menu-item>
        <el-menu-item index="personalCenter">个人中心</el-menu-item>
        <el-menu-item index="logout">退出登录</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="main-header">
        <div class="header-left">
          <h2>{{ userInfo.username }}</h2>
        </div>
        <div class="header-center" v-if="activeMenu === 'jobs'">
          <el-input
            v-model="searchQuery"
            placeholder="搜索职位"
            :prefix-icon="Search"
            clearable
            @keyup.enter="handleSearch"
          ></el-input>
          <el-button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</el-button>
        </div>
        <div class="header-right">
          <el-avatar :key="userInfo.avatar_url || 'default-avatar'" :src="userInfo.avatar_url" class="user-avatar" v-if="userInfo.avatar_url"></el-avatar>
          <el-avatar key="fallback-avatar" class="user-avatar" v-else>{{ userInfo.username ? userInfo.username.charAt(0) : 'U' }}</el-avatar>
        </div>
      </el-header>
      <el-main>
        <div v-if="activeMenu === 'jobs'">
          <el-table :data="jobs" style="width: 100%; margin-top: 20px">
            <el-table-column label="岗位名称">
              <template #default="{ row }">
                <el-button type="text" @click="viewJobDetail(row)">{{ row.position_name }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="location" label="工作地点"></el-table-column>
            <el-table-column prop="salary_range" label="薪资范围"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="review_status" label="审核状态">
              <template #default="{ row }">
                <el-tag v-if="row.review_status === 'pending'" type="warning">待审核</el-tag>
                <el-tag v-else-if="row.review_status === 'approved'" type="success">已通过</el-tag>
                <el-tag v-else-if="row.review_status === 'rejected'" type="danger">已驳回</el-tag>
                <el-tag v-else type="info">未知</el-tag>
                <div v-if="row.review_status === 'rejected' && row.reject_reason" style="color:#d9001b;font-size:13px;margin-top:2px;">驳回原因：{{ row.reject_reason }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else-if="activeMenu === 'messages'" class="messages-main-layout">
          <Messages ref="messagesRef" />
        </div>
        <div v-else-if="activeMenu === 'postJob'">
          <PostJob />
        </div>
        <div v-else-if="activeMenu === 'personalCenter'">
          <PersonalCenter />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'; // Import ElMessage and ElMessageBox for error handling and confirmation
import api from '../services/api';
import { Search } from '@element-plus/icons-vue'; // Import Search icon
import Messages from './Messages.vue';
import PostJob from './PostJob.vue';
import { getCurrentInstance } from 'vue';
import PersonalCenter from './PersonalCenter.vue';

const router = useRouter();
const jobs = ref([]);
const searchQuery = ref(''); // New ref for search query
const userInfo = ref({}); // New ref for user info
const activeMenu = ref('jobs');
const instance = getCurrentInstance();
const messagesRef = ref(null);

const backendBaseUrl = 'http://127.0.0.1:5000'; // Define backend base URL

const fetchJobs = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'company' || !user.company || !(user.company.companyId || user.company.company_id)) {
      ElMessage.warning('请先以企业身份登录');
      router.push('/login');
      return;
    }
    userInfo.value = {
      username: user.username,
      avatar_url: user.role === 'company' && user.company && (user.company.logoUrl || user.company.logo_url)
        ? `${backendBaseUrl}${user.company.logoUrl || user.company.logo_url}?t=${Date.now()}`
        : (user.role === 'seeker' && user.seeker && (user.seeker.avatarUrl || user.seeker.avatar_url)
          ? `${backendBaseUrl}${user.seeker.avatarUrl || user.seeker.avatar_url}?t=${Date.now()}`
          : null)
    };

    const companyId = user.company.companyId || user.company.company_id;
    const params = {
      companyId: companyId,
      query: searchQuery.value // Pass search query to API
    };
    const res = await api.getJobsByCompany(params);
    jobs.value = res.data.map(job => ({
      ...job,
      salary_range: job.min_salary && job.max_salary ? `${job.min_salary}k-${job.max_salary}k` : '面议' // 组合薪资范围
    }));
  } catch (err) {
    console.error('获取岗位列表失败:', err);
    ElMessage.error('获取岗位列表失败，请稍后重试');
  }
};

const handleSearch = () => {
  fetchJobs(); // Re-fetch jobs with the current search query
};

onMounted(() => {
  fetchJobs();
});

const goToPostJob = () => {
  router.push('/post-job');
};

const goToPersonalCenter = () => {
  router.push('/personal-center');
};

const logout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '退出确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    localStorage.removeItem('user');
    router.push('/login');
    ElMessage.success('已成功退出登录');
  }).catch(() => {
    // 用户取消，无操作
  });
};

function handleMenuSelect(index) {
  if (index === 'logout') {
    logout();
  } else {
    activeMenu.value = index;
  }
}

const viewJobDetail = (job) => {
  router.push(`/job/${job.job_id}`);
};

watch(activeMenu, (val) => {
  if (val === 'messages' && messagesRef.value && messagesRef.value.refreshAllSessionsUnread) {
    messagesRef.value.refreshAllSessionsUnread();
  }
});
</script>

<style scoped>
.common-layout {
  height: 100vh;
  background: #f4f6fa;
}
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 0 32px;
  height: 64px;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
}
.header-left h2 {
  margin: 0;
  font-size: 22px;
  color: #333;
  font-weight: 600;
}
.header-center {
  display: flex;
  align-items: center;
  flex-grow: 2;
  justify-content: center;
}
.header-center .el-input {
  width: 320px;
  margin-right: 12px;
}
.header-center .el-input .el-input__wrapper {
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 5px 15px;
}
.header-center .el-button {
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 8px 20px;
}
.header-right {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.user-info-trigger {
  display: flex;
  align-items: center;
}
.user-avatar {
  margin-left: 8px;
  margin-right: 0;
}
.el-main {
  padding: 32px 24px 0 24px;
}
.el-table {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.06);
  margin-bottom: 16px;
}
.el-table th, .el-table td {
  font-size: 15px;
  padding: 12px 8px;
}
.el-table th {
  background: #f7f8fa;
  color: #666;
  font-weight: 600;
}
.el-tag {
  font-size: 13px;
  border-radius: 8px;
  padding: 2px 12px;
}
.el-button {
  border-radius: 8px;
  font-size: 14px;
}
.company-aside {
  background: #fff;
  min-height: 100vh;
  border-right: 1px solid #e6e6e6;
  box-shadow: 2px 0 8px 0 rgba(0,0,0,0.03);
  padding-top: 0;
}
.company-menu {
  border: none;
  font-size: 16px;
  padding-top: 32px;
}
.company-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  border-radius: 8px;
  margin: 8px 0;
  font-weight: 500;
}
.company-menu .el-menu-item.is-active {
  background: #f0f7ff;
  color: #2186ff;
}
.messages-main-layout {
  height: calc(100vh - 120px);
  padding: 0;
}
</style>