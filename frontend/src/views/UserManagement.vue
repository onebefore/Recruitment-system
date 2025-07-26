<template>
  <div class="admin-layout">
    <el-aside class="admin-sider">
      <el-menu :default-active="activeTab" class="admin-menu" @select="handleMenuSelect">
        <el-menu-item index="company">
          <i class="el-icon-office-building"></i>
          <span>企业管理</span>
        </el-menu-item>
        <el-menu-item index="seeker">
          <i class="el-icon-user"></i>
          <span>求职者管理</span>
        </el-menu-item>
        <el-menu-item index="jobs">
          <i class="el-icon-s-check"></i>
          <span>职位审核</span>
        </el-menu-item>
        <el-menu-item index="messages">
          <i class="el-icon-message"></i>
          <span>消息</span>
        </el-menu-item>
        <el-menu-item index="logout">
          <i class="el-icon-switch-button"></i>
          <span>退出登录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main class="admin-main">
      <div v-show="activeTab === 'company'">
        <div class="toolbar el-card is-always-shadow">
          <el-row :gutter="20" class="filter-row">
            <el-col :span="9">
              <el-input
                v-model="searchQuery"
                placeholder="搜索企业用户名或公司名称"
                clearable
                @keyup.enter="handleSearch"
                size="large"
              >
                <template #append>
                  <el-button @click="handleSearch" size="large" class="centered-button-text">搜索</el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-button @click="handleClear" size="large">清空</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="users.filter(u => u.role === 'company')" style="width: 100%" v-loading="loading">
          <template #empty>
            <div v-if="!loading" style="padding: 20px; text-align: center; color: #909399;">暂无数据</div>
          </template>
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column label="用户名" align="left">
            <template #default="scope">
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-avatar :src="scope.row.logo_url" size="32">
                  <span v-if="!scope.row.logo_url">无</span>
                </el-avatar>
                <el-button type="text" @click="handleEdit(scope.row)" class="username-button">{{ scope.row.username }}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="公司名称"></el-table-column>
          <el-table-column prop="industry" label="行业"></el-table-column>
        </el-table>
      </div>
      <div v-show="activeTab === 'seeker'">
        <div class="toolbar el-card is-always-shadow">
          <el-row :gutter="20" class="filter-row">
            <el-col :span="9">
              <el-input
                v-model="searchQuery"
                placeholder="搜索求职者用户名或姓名"
                clearable
                @keyup.enter="handleSearch"
                size="large"
              >
                <template #append>
                  <el-button @click="handleSearch" size="large" class="centered-button-text">搜索</el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :span="3">
              <el-button @click="handleClear" size="large">清空</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="users.filter(u => u.role === 'seeker')" style="width: 100%" v-loading="loading">
          <template #empty>
            <div v-if="!loading" style="padding: 20px; text-align: center; color: #909399;">暂无数据</div>
          </template>
          <el-table-column prop="id" label="ID" width="80"></el-table-column>
          <el-table-column label="用户名" align="left">
            <template #default="scope">
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-avatar :src="scope.row.avatar_url" size="32">
                  <span v-if="!scope.row.avatar_url">无</span>
                </el-avatar>
                <el-button type="text" @click="handleEdit(scope.row)" class="username-button">{{ scope.row.username }}</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
        </el-table>
      </div>
      <div v-show="activeTab === 'jobs'">
        <div class="job-filter-bar" style="display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin-bottom: 12px;">
          <el-tabs v-model="jobTab" @tab-click="handleJobTabChange" class="job-filter-tabs" tab-position="top">
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="待审核" name="pending"></el-tab-pane>
            <el-tab-pane label="已通过" name="approved"></el-tab-pane>
            <el-tab-pane label="已驳回" name="rejected"></el-tab-pane>
          </el-tabs>
          <el-input v-model="companyFilter" placeholder="筛选公司名称" clearable style="width: 220px;" @input="handleCompanyFilter" />
        </div>
        <el-table :data="filteredJobs" style="width: 100%" v-loading="jobLoading">
          <el-table-column prop="job_id" label="ID" width="80"></el-table-column>
          <el-table-column label="公司" min-width="180" align="left">
            <template #default="{ row }">
              <div style="display: flex; align-items: center; gap: 10px;">
                <el-avatar :src="row.Company && row.Company.logo_url ? row.Company.logo_url : ''" size="36" shape="circle" style="background:#f2f2f2;">
                  <span v-if="!(row.Company && row.Company.logo_url)">无</span>
                </el-avatar>
                <span style="font-weight: 500; color: #333;">{{ row.Company && row.Company.company_name ? row.Company.company_name : '未知公司' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="position_name" label="岗位名称"></el-table-column>
          <el-table-column prop="company_id" label="公司ID"></el-table-column>
          <el-table-column prop="min_salary" label="最低薪资"></el-table-column>
          <el-table-column prop="max_salary" label="最高薪资"></el-table-column>
          <el-table-column prop="review_status" label="审核状态">
            <template #default="{ row }">
              <el-tag v-if="row.review_status === 'pending'" type="warning">待审核</el-tag>
              <el-tag v-else-if="row.review_status === 'approved'" type="success">已通过</el-tag>
              <el-tag v-else-if="row.review_status === 'rejected'" type="danger">已驳回</el-tag>
              <el-tag v-else type="info">未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="jobTab !== 'rejected' && (!row || row.review_status !== 'rejected')" label="操作" width="180">
            <template #default="{ row }">
              <div style="display: flex; gap: 12px; justify-content: center; align-items: center;">
                <el-button v-if="row.review_status === 'pending'" type="success" size="small" @click="approveJob(row.job_id)">通过</el-button>
                <el-button v-if="row.review_status === 'pending' || row.review_status === 'approved'" type="danger" size="small" @click="rejectJob(row.job_id)">驳回</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="activeTab === 'messages'">
        <div class="message-layout">
          <!-- 左侧会话列表 -->
          <div class="session-list">
            <el-input v-model="msgSearch" placeholder="搜索" prefix-icon="el-icon-search" size="small" class="session-search"/>
            <el-scrollbar class="session-scroll">
              <div
                v-for="session in filteredSessions"
                :key="session.id"
                :class="['session-item', { active: session.id === activeSessionId }]"
                @click="selectSession(session.id)"
              >
                <el-avatar :src="session.avatar" size="medium"/>
                <div class="session-info">
                  <div class="session-title">{{ session.name }}</div>
                  <div class="session-last">{{ session.lastMessage }}</div>
                </div>
                <el-badge v-if="session.unread > 0" :value="session.unread" class="session-unread"/>
              </div>
            </el-scrollbar>
          </div>
          <!-- 右侧消息区 -->
          <div class="chat-area">
            <div class="chat-header">
              <span>{{ activeSession?.name }}</span>
            </div>
            <el-scrollbar class="chat-content">
              <div v-for="msg in activeSession?.messages" :key="msg.id" :class="['chat-msg', msg.isSelf ? 'self' : 'other']">
                <el-avatar :src="msg.avatar" size="medium"/>
                <div class="chat-bubble-wrapper">
                  <div class="chat-time">{{ formatTime(msg.time) }}</div>
                  <div class="chat-bubble">
                    <div class="chat-text">{{ msg.content }}</div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <div class="chat-input-bar">
              <el-input
                v-model="msgInput"
                type="textarea"
                :rows="2"
                placeholder="请输入消息"
                class="chat-input"
                @keyup.enter.native="sendMsg"
              />
              <div class="chat-actions">
                <!-- <el-button icon="el-icon-picture-outline" circle />
                <el-button icon="el-icon-folder" circle />
                <el-button icon="el-icon-microphone" circle /> -->
                <el-button type="primary" @click="sendMsg">发送</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '../services/api';

const router = useRouter();
const users = ref([]);
const searchQuery = ref('');
const filterRole = ref('');
const loading = ref(false);

const activeTab = ref('company');
const pendingJobs = ref([]);
const jobLoading = ref(false);
const jobTab = ref('pending');
const companyFilter = ref('');

const msgSearch = ref('');
const msgInput = ref('');
const activeSessionId = ref(1);
const msgSessions = ref([]);

// 获取当前登录用户信息
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

function getCurrentUserId() {
  return currentUser.userId || currentUser.id || (currentUser.seeker && currentUser.seeker.seeker_id) || currentUser.relatedId;
}

// 时间格式化函数
function formatTime(time) {
  if (!time) return '';
  const date = new Date(time);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

const fetchUsers = async () => {
  loading.value = true;
  try {
    const params = {
      query: searchQuery.value.trim(),
      role: filterRole.value,
    };
    const res = await api.getAllUsers(params);
    if (res.data && Array.isArray(res.data.users)) {
      users.value = res.data.users;
    } else {
      users.value = [];
      ElMessage.warning('获取用户数据格式不正确');
    }
  } catch (error) {
    console.error('获取用户列表失败:', error);
    ElMessage.error('获取用户列表失败，请稍后重试');
    users.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchJobsByStatus = async (status) => {
  jobLoading.value = true;
  try {
    let res;
    const params = {};
    if (!status || status === 'all') {
      params.all = true;
    } else {
      params.review_status = status;
    }
    if (companyFilter.value) {
      params.company_name = companyFilter.value.trim();
    }
    res = await api.getPendingJobs(params);
    if (res.data && Array.isArray(res.data.jobs)) {
      pendingJobs.value = res.data.jobs;
    } else {
      pendingJobs.value = [];
      ElMessage.warning('获取职位数据格式不正确');
    }
  } catch (error) {
    console.error('获取职位失败:', error);
    ElMessage.error('获取职位失败，请稍后重试');
    pendingJobs.value = [];
  } finally {
    jobLoading.value = false;
  }
};

const handleSearch = () => {
  fetchUsers();
};

const handleClear = () => {
  searchQuery.value = '';
  filterRole.value = '';
  fetchUsers();
};

const handleEdit = (row) => {
  if (!row.id) {
    ElMessage.error('无法编辑：缺少用户ID。');
    console.error('Missing id for user:', row);
    return;
  }
  router.push({ name: 'UserEdit', params: { id: row.id } });
};

const approveJob = async (jobId) => {
  try {
    await api.approveJob(jobId);
    ElMessage.success('职位审核通过');
    fetchJobsByStatus(jobTab.value);
  } catch (error) {
    ElMessage.error('审核失败');
  }
};

const rejectJob = async (jobId) => {
  try {
    const { value: reason } = await ElMessageBox.prompt('请输入驳回理由', '驳回岗位', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入理由',
      inputValidator: (val) => !!val || '理由不能为空',
      inputType: 'textarea',
    });
    await api.rejectJob(jobId, reason);
    ElMessage.success('职位已驳回');
    fetchJobsByStatus(jobTab.value);
  } catch (error) {
    if (error !== 'cancel') {
    ElMessage.error('驳回失败');
    }
  }
};

const handleMenuSelect = (key) => {
  if (key === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      localStorage.removeItem('user');
      router.push('/login');
    });
  } else {
    activeTab.value = key;
    localStorage.setItem('adminActiveTab', key);
  }
};

const handleJobTabChange = (tab) => {
  fetchJobsByStatus(tab.paneName);
};

const handleCompanyFilter = () => {
  fetchJobsByStatus(jobTab.value);
};

onMounted(() => {
  const savedTab = localStorage.getItem('adminActiveTab');
  if (savedTab) activeTab.value = savedTab;
  fetchUsers();
  fetchJobsByStatus(jobTab.value);
});

const filteredJobs = computed(() => pendingJobs.value);

const filteredSessions = computed(() => {
  if (!msgSearch.value) return msgSessions.value;
  return msgSessions.value.filter(s => s.name.includes(msgSearch.value));
});
const activeSession = computed(() => msgSessions.value.find(s => s.id === activeSessionId.value));

// 用users数据生成msgSessions，排除当前登录用户
watch(users, (val) => {
  // 调试输出，便于排查
  console.log('currentUser:', currentUser);
  console.log('users:', val);
  const currentId = getCurrentUserId();
  const currentUsername = currentUser.username;
  msgSessions.value = val
    .filter(u => u.id !== currentId && u.user_id !== currentId && u.username !== currentUsername)
    .map(u => ({
      id: u.id,
      name: u.username,
      avatar: u.logo_url || u.avatar_url || '',
      lastMessage: u.lastMessage || '',
      unread: 0,
      messages: []
    }));
  // 自动选中第一个会话并拉取消息
  if (msgSessions.value.length > 0) {
    selectSession(msgSessions.value[0].id);
  }
}, { immediate: true });

// 切换会话时拉取消息
async function selectSession(id) {
  activeSessionId.value = id;
  const currentId = getCurrentUserId();
  try {
    const res = await api.getMessages(currentId, id);
    const session = msgSessions.value.find(s => s.id === id);
    if (session) {
      session.messages = (res.data || []).map(msg => ({
        id: msg.message_id,
        nickname: msg.sender_id === currentId ? '我' : session.name,
        avatar: msg.sender_id === currentId ? (currentUser.avatar_url || currentUser.logo_url) : session.avatar,
        content: msg.content,
        time: msg.sent_at,
        isSelf: msg.sender_id === currentId
      }));
      session.unread = 0;
    }
  } catch (e) {
    ElMessage.error('获取消息失败');
  }
}

// 发送消息后自动刷新
async function sendMsg() {
  if (!msgInput.value.trim()) return;
  const currentId = getCurrentUserId();
  const sessionId = activeSessionId.value;
  try {
    await api.sendMessage({
      sender_id: currentId,
      receiver_id: sessionId,
      content: msgInput.value
    });
    msgInput.value = '';
    // 重新拉取消息
    selectSession(sessionId);
  } catch (e) {
    ElMessage.error('发送失败');
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f6fa;
}
.admin-sider {
  width: 200px;
  background: #fff;
  box-shadow: 2px 0 8px 0 rgba(0,0,0,0.04);
  border-radius: 0 12px 12px 0;
  padding-top: 32px;
}
.admin-menu {
  border-right: none;
  background: transparent;
}
.admin-menu .el-menu-item {
  font-size: 16px;
  height: 48px;
  border-radius: 8px;
  margin: 8px 12px;
  display: flex;
  align-items: center;
}
.admin-menu .el-menu-item.is-active {
  background: #e6f0ff;
  color: #409EFF;
}
.admin-menu .el-menu-item i {
  margin-right: 10px;
  font-size: 18px;
}
.admin-main {
  flex: 1;
  padding: 32px 24px;
}
.user-management-container {
  padding: 32px 24px;
  background: #f4f6fa;
  min-height: 100vh;
}
.toolbar {
  background-color: #fff;
  padding: 24px 24px 12px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.06);
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.el-col {
  display: flex;
  align-items: center;
}
.el-input,
.el-select,
.el-button {
  width: 100%;
}
.centered-button-text {
  display: flex;
  justify-content: center;
  align-items: center;
}
.username-button {
  width: 100%;
  text-align: left;
  justify-content: flex-start;
  color: #409EFF;
  font-weight: 500;
}
.el-table {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
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
.job-filter-tabs {
  margin-bottom: 16px;
}
.job-filter-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}
.message-layout {
  display: flex;
  height: 70vh;
  background: #f5f7fa;
}
.session-list {
  width: 260px;
  background: #fff;
  border-right: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
}
.session-search {
  margin: 16px;
  width: calc(100% - 32px);
}
.session-search .el-input {
  width: 100%;
  border-radius: 8px;
  background: #f5f6fa;
  height: 40px;
}
.session-search .el-input__wrapper {
  border-radius: 8px;
  background: #f5f6fa;
  min-height: 40px;
  box-shadow: none;
}
.session-scroll {
  flex: 1;
  overflow-y: auto;
}
.session-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
  background: transparent;
}
.session-item.active {
  background: #e6f7ff;
}
.session-info {
  flex: 1;
  margin-left: 10px;
  overflow: hidden;
}
.session-title {
  font-weight: 500;
  font-size: 15px;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.session-last {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.session-unread {
  margin-left: 8px;
}
.session-item .el-avatar {
  background: #f2f2f2;
}
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}
.chat-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #eaeaea;
  font-size: 18px;
  font-weight: 500;
  background: #fff;
  color: #222;
}
.chat-header span {
  font-weight: bold;
  font-size: 18px;
  margin-right: 10px;
}
.chat-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: transparent;
}
.chat-msg {
  display: flex;
  margin-bottom: 18px;
  align-items: flex-end;
}
.chat-msg.self {
  flex-direction: row-reverse;
}
.chat-bubble-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.chat-msg.self .chat-bubble-wrapper {
  align-items: flex-end;
}
.chat-time {
  font-size: 11px;
  color: #bbb;
  text-align: left;
  margin-bottom: 2px;
  margin-top: 0;
}
.chat-msg.self .chat-time {
  text-align: right;
}
.chat-bubble {
  max-width: 420px;
  background: #fff;
  border-radius: 18px 18px 18px 4px;
  padding: 10px 16px;
  margin: 0 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  position: relative;
  color: #222;
  font-size: 15px;
}
.chat-msg.self .chat-bubble {
  background: #e6f7ff;
  color: #222;
  border-radius: 18px 18px 4px 18px;
}
.chat-text {
  font-size: 15px;
  color: inherit;
  word-break: break-all;
}
.chat-msg .el-avatar {
  background: #fff;
  border: 2px solid #e6f7ff;
}
.chat-input-bar {
  display: flex;
  align-items: flex-end;
  padding: 12px 24px;
  background: #fff;
  border-top: 1px solid #eaeaea;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
}
.chat-input {
  flex: 1;
  margin-right: 12px;
}
.chat-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.chat-actions .el-button {
  background: #f5f7fa;
  border-radius: 50%;
  border: none;
}
.chat-actions .el-button--primary {
  background: #2186ff;
  color: #fff;
  border-radius: 20px;
  padding: 0 18px;
}
</style>