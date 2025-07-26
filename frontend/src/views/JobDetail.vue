<!-- TEST-UNIQUE-JOBDETAIL -->
<template>
  <div class="job-detail">
    <div class="header-container">
      <el-button @click="router.back()" class="back-button">
        <el-icon><ArrowLeft /></el-icon>返回
      </el-button>
      <h2 class="page-title">岗位详情</h2>
      <div class="header-buttons">
        <div v-if="role === 'seeker'">
          <el-upload
            action="/api/resume/resume"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            name="resume"
            :limit="1"
            :data="uploadData"
            :headers="uploadHeaders"
            :show-file-list="false"
            class="upload-button-container"
          >
            <el-button type="primary">{{ uploadButtonText }}</el-button>
          </el-upload>
          <el-button v-if="myResume" type="primary" style="margin-left: 12px;" @click="previewResume(myResume)">预览简历</el-button>
          <el-button v-if="myResume" type="primary" style="margin-left: 12px;" @click="downloadResumeFile(myResume)">下载我的简历</el-button>
          <!-- <el-button type="primary" style="margin-left: 12px;" @click="openResumeDialog">投简历</el-button> -->
          <el-button type="primary" style="margin-left: 12px;" @click="goToChat">立即沟通</el-button>
        </div>
      </div>
    </div>
    <el-descriptions :model="job" border>
      <el-descriptions-item label="岗位名称">{{ job.position_name }}</el-descriptions-item>
      <el-descriptions-item label="行业">{{ job.industry }}</el-descriptions-item>
      <el-descriptions-item label="薪资范围">{{ job.salary_range }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ job.status }}</el-descriptions-item>
      <el-descriptions-item label="工作地点">{{ job.location }}</el-descriptions-item>
      <el-descriptions-item label="发布时间">{{ formatDate(job.publish_time) }}</el-descriptions-item>
      <el-descriptions-item label="描述">
        <div style="white-space: pre-wrap;">{{ job.description }}</div>
      </el-descriptions-item>
      <el-descriptions-item label="岗位要求">
        <div style="white-space: pre-wrap;">{{ job.requirements }}</div>
      </el-descriptions-item>
    </el-descriptions>
    <div v-if="role === 'company'" style="margin-top: 24px;">
      <el-button type="primary" @click="editJob">编辑</el-button>
      <el-button type="primary" @click="deleteJob">删除</el-button>
    </div>

    <div v-if="role === 'company'" style="margin-top: 24px;">
      <h3>岗位简历列表</h3>
      <el-table :data="resumeList" style="width: 100%; margin-bottom: 20px">
        <el-table-column label="求职者姓名">
          <template #default="{ row }">
            <el-button type="text" @click="viewSeekerDetail(row)">{{ row.seeker_name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="upload_time" label="上传时间">
          <template #default="{ row }">{{ formatDate(row.upload_time) }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" @click="previewResume(row)">预览简历</el-button>
            <el-button size="small" type="primary" @click="downloadResumeFile(row)">下载简历</el-button>
            <el-button size="small" type="primary" @click="openChat(row)">在线沟通</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 聊天对话框 -->
    <el-dialog
      v-model="chatDialogVisible"
      :title="'与 ' + chatReceiverName + ' 沟通'"
      width="60%"
      destroy-on-close
    >
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
    </el-dialog>

    <el-dialog v-model="resumeDialogVisible" title="上传简历" width="40%" destroy-on-close>
      <el-upload
        class="upload-demo"
        drag
        action="/api/resume/resume"
        :data="uploadData"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue';

const router = useRouter();
const job = ref({});
const jobId = router.currentRoute.value.params.id;
const role = ref('');
const resumeList = ref([]); // 企业用
const myResume = ref(null); // 求职者用

// Chat related refs
const chatDialogVisible = ref(false);
const chatReceiverId = ref(null);
const chatReceiverName = ref('');
const newMessageContent = ref('');
const messages = ref([]);
const currentUserId = ref(null);
const currentSeekerId = ref(null);

const uploadButtonText = computed(() => {
  return myResume.value ? '更新简历' : '上传简历';
});

const currentUploadFile = ref(null);

const uploadHeaders = computed(() => {
  const user = localStorage.getItem('user');
  return user ? { 'x-user': btoa(unescape(encodeURIComponent(user))) } : {};
});

const uploadData = computed(() => {
  const data = {
    job_id: jobId
  };
  if (currentUploadFile.value) {
    data.encodedOriginalname = encodeURIComponent(currentUploadFile.value.name);
  }
  return data;
});

const resumeDialogVisible = ref(false);

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  // Include seconds if necessary, but for chat, often minutes are enough
  // const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const fetchJob = async () => {
  try {
    const res = await api.getJobById(jobId);
    if (res.data) {
      job.value = {
        ...res.data,
        salary_range: res.data.min_salary && res.data.max_salary ? `${res.data.min_salary}k-${res.data.max_salary}k` : '面议'
      };
    }
  } catch (err) {
    ElMessage.error('获取岗位信息失败');
  }
};

const fetchResumes = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const currentRole = user?.role || '';
  const relatedId = user?.relatedId;

  if (currentRole === 'company') {
    // 获取所有简历
    try {
      const res = await api.getResumesByJob(jobId);
      console.log('Resumes fetched for company:', res.data);
      resumeList.value = res.data;
    } catch (err) {
      ElMessage.error('获取简历列表失败');
      console.error('获取简历列表错误:', err);
    }
  } else if (currentRole === 'seeker' && !isNaN(parseInt(relatedId))) { // Ensure relatedId is parsed as number
    // 确保是求职者且有有效的 relatedId 才去获取自己的简历
    try {
      // 确保 jobId 也是数字，尽管它来自路由参数，但最好再次确认
      const currentJobId = parseInt(jobId);
      if (isNaN(currentJobId)) {
        console.error('Invalid jobId for fetching seeker resume:', jobId);
        ElMessage.error('岗位ID无效');
        return;
      }
      const res = await api.getMyResume(currentJobId);
      console.log('My resume fetched for seeker:', res.data);
      myResume.value = res.data;
    } catch (err) {
      myResume.value = null;
      console.error('获取我的简历错误:', err);
    }
  }
};

const openChat = async (resumeRow) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'company' || !user.userId) {
    ElMessage.warning('请先以企业身份登录');
    router.push('/login');
    return;
  }
  try {
    const res = await api.getSeekerUserBySeekerId(resumeRow.seeker_id);
    if (res.data && res.data.user_id) {
      // 跳转到消息界面并自动打开与该求职者的会话
      router.push({ path: '/company/messages', query: { userId: res.data.user_id } });
    } else {
      ElMessage.error('无法获取求职者联系信息');
    }
  } catch (err) {
    console.error('获取求职者用户ID错误:', err);
    ElMessage.error('无法开始沟通，请稍后重试');
  }
};

const fetchMessages = async () => {
  if (!currentUserId.value || !chatReceiverId.value) {
    console.warn('无法获取消息：currentUserId 或 chatReceiverId 缺失', currentUserId.value, chatReceiverId.value);
    return;
  }
  try {
    const res = await api.getMessages(currentUserId.value, chatReceiverId.value);
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
  if (!currentUserId.value || !chatReceiverId.value) {
    ElMessage.error('无法发送消息，用户信息或接收方信息缺失');
    console.error('发送消息失败：currentUserId 或 chatReceiverId 缺失', currentUserId.value, chatReceiverId.value);
    return;
  }

  try {
    await api.sendMessage({
      sender_id: currentUserId.value,
      receiver_id: chatReceiverId.value,
      content: newMessageContent.value,
    });
    newMessageContent.value = ''; // Clear input
    await fetchMessages(); // Refresh messages after sending
  } catch (err) {
    console.error('发送消息错误:', err);
    ElMessage.error('消息发送失败');
  }
};

onMounted(() => {
  fetchJob();
  // 获取角色
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('User object from localStorage:', user);
  role.value = user?.role || '';
  // 兼容所有字段
  const uid = user?.userId || user?.id || user?.user_id;
  const rid = user?.relatedId || user?.related_id;
  if (user && user.role === 'seeker') {
    role.value = user.role;
    currentSeekerId.value = rid;
    currentUserId.value = uid;
  } else if (user && user.role === 'company') {
    role.value = user.role;
    currentUserId.value = uid;
  }
  console.log('Resolved role:', role.value, 'currentUserId:', currentUserId.value, 'currentSeekerId:', currentSeekerId.value);
  fetchResumes();
});

const editJob = () => {
  console.log('Edit button clicked! Job ID:', jobId);
  router.push({ name: 'PostJob', params: { id: jobId } });
};

const deleteJob = async () => {
  if (confirm('确定要删除该岗位吗？')) {
    try {
      await api.deleteJob(jobId);
      ElMessage.success('删除成功');
      router.push('/company');
    } catch (err) {
      ElMessage.error('删除岗位失败');
    }
  }
};

const handleUploadSuccess = (response, file) => {
  if (response.message === '简历上传成功') {
    ElMessage.success('简历上传成功!');
    fetchResumes(); // Refresh myResume status
  } else {
    ElMessage.error('简历上传失败: ' + response.message);
  }
};

const beforeUpload = async (file) => {
  const isPdfOrWord = file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isPdfOrWord) {
    ElMessage.error('上传简历只能是 PDF 或 Word 格式!');
  }
  if (!isLt5M) {
    ElMessage.error('上传简历大小不能超过 5MB!');
  }

  currentUploadFile.value = file; // Store the file for uploadData computed prop

  // Check for existing resume and ask for confirmation to overwrite
  if (myResume.value) {
    try {
      await ElMessageBox.confirm(
        '您已投递过此岗位的简历，是否要上传新简历并覆盖原文件？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      );
      return true; // User confirmed, proceed with upload
    } catch (error) {
      ElMessage.info('已取消上传');
      return false; // User cancelled, stop upload
    }
  }
  return true; // No existing resume, proceed with upload
};

const viewSeekerDetail = (row) => {
  router.push(`/seeker-detail/${row.seeker_id}`);
};

const previewResume = (resume) => {
  console.log('Attempting to preview resume. Resume object:', resume);
  if (resume && resume.filename) {
    const fullPath = `http://localhost:5000/resumes_static/${resume.filename}`;
    window.open(fullPath, '_blank');
  } else {
    ElMessage.error('简历文件信息无效，无法预览。');
  }
};

const downloadResumeFile = (resume) => {
  if (resume && resume.resume_id) {
    const downloadUrl = `http://localhost:5000/api/resume/download/${resume.resume_id}`;
    window.open(downloadUrl, '_blank'); // Open in new tab, browser will handle download based on Content-Disposition
  } else {
    ElMessage.error('简历信息无效，无法下载。');
  }
};

// 获取企业user_id并跳转到消息页面
async function goToChat() {
  alert('goToChat triggered');
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('user:', user, 'role:', user?.role, 'currentUserId:', currentUserId.value);
  if (!user || user.role !== 'seeker' || !currentUserId.value) {
    ElMessage.warning('请先以求职者身份登录');
    router.push('/login');
    return;
  }
  try {
    // 1. 通过job.company_id查找user_auth表中role为company且related_id为company_id的user_id
    const res = await api.getAllUsers({ role: 'company' });
    if (res.data && Array.isArray(res.data.users)) {
      const companyUser = res.data.users.find(u => u.relatedId == job.value.company_id);
      if (companyUser) {
        // 根据当前用户角色跳转到不同的消息页面
        let rolePath = '';
        if (user.role === 'admin') rolePath = '/admin/messages';
        else if (user.role === 'company') rolePath = '/company/messages';
        else if (user.role === 'seeker') rolePath = '/seeker/messages';
        router.push({ path: rolePath, query: { userId: companyUser.id } });
      } else {
        ElMessage.error('未找到企业聊天账号');
      }
    } else {
      ElMessage.error('获取企业用户失败');
    }
  } catch (e) {
    ElMessage.error('获取企业用户失败');
  }
}

function openResumeDialog() {
  resumeDialogVisible.value = true;
}
</script>

<style scoped>
.job-detail {
  padding: 20px;
  background-color: #fff;
  min-height: 100vh;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative; /* 为绝对定位的按钮组提供定位上下文 */
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

.header-buttons {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  gap: 10px; /* 按钮之间的间距 */
  align-items: center;
}

.upload-button-container {
  display: inline-block; /* 确保 el-upload 作为一个块级元素与其他按钮并排 */
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* Ensure ElTable links are normal font weight */
:deep(.el-table .el-link) {
  font-weight: normal;
}

:deep(.el-table .el-button--text) {
  padding: 0;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px; /* Adjust as needed */
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.message-list {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  word-wrap: break-word;
}

.message-item.sent {
  align-self: flex-end;
  background-color: #a0cfff; /* El-Button primary color */
  color: #fff;
}

.message-item.received {
  align-self: flex-start;
  background-color: #f0f2f5;
  color: #333;
}

.message-content {
  font-size: 14px;
}

.message-time {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 4px;
  align-self: flex-end;
}

.message-item.received .message-time {
  align-self: flex-start;
}

.message-input {
  padding: 10px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
}
</style>