<template>
  <div class="message-container">
    <div class="message-layout">
      <!-- 左侧会话列表 -->
      <div class="session-list">
        <div class="session-search">
          <el-input v-model="msgSearch" placeholder="搜索" prefix-icon="el-icon-search" size="small" />
          <el-select v-model="userTypeFilter" size="small" style="margin-left:8px;width:100px;">
            <el-option label="全部" value="all" />
            <el-option label="管理员" value="admin" />
            <el-option label="企业" value="company" />
            <el-option label="求职者" value="seeker" />
          </el-select>
        </div>
        <el-scrollbar class="session-scroll">
          <div
            v-for="session in filteredSessions"
            :key="session.id"
            :class="['session-item', { active: session.id === activeSessionId } ]"
            @click="selectSession(session.id)"
          >
            <el-badge v-if="session.unread > 0" :value="session.unread" class="session-unread">
              <el-avatar :src="session.avatar" size="medium" />
            </el-badge>
            <el-avatar v-else :src="session.avatar" size="medium" />
            <div class="session-info">
              <div class="session-title">{{ session.name }}</div>
              <div class="session-last">{{ session.lastMessage }}</div>
            </div>
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
              <div class="chat-time">{{ formatTime(msg.sent_at) }}</div>
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
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, defineExpose } from 'vue';
import api from '../services/api';
import { ElMessage } from 'element-plus';
import { io as socketIoClient } from 'socket.io-client';
import { useRoute } from 'vue-router';

const msgSearch = ref('');
const msgInput = ref('');
const activeSessionId = ref(null);
const msgSessions = ref([]);
const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const users = ref([]);
const userTypeFilter = ref('all');
let socket = null;
const route = useRoute();
const sessionSelectedByUserId = ref(false);

function getCurrentUserId() {
  return currentUser.userId || currentUser.id || (currentUser.seeker && currentUser.seeker.seeker_id) || currentUser.relatedId;
}

// 拉取所有用户（会话列表）
async function fetchUsers() {
  try {
    const res = await api.getAllUsers({});
    console.log('getAllUsers', res.data);
    if (res.data && Array.isArray(res.data.users)) {
      users.value = res.data.users;
    } else {
      users.value = [];
    }
  } catch (e) {
    users.value = [];
  }
}

// 修正头像 URL 拼接
const backendBaseUrl = 'http://localhost:5000';

function getFullAvatarUrl(url) {
  if (!url) return '';
  if (url.startsWith('/uploads') || url.startsWith('/avatars')) {
    return backendBaseUrl + url;
  }
  return url;
}

function getCurrentUserAvatar() {
  if (currentUser.company && currentUser.company.logo_url) {
    return getFullAvatarUrl(currentUser.company.logo_url);
  }
  if (currentUser.seeker && currentUser.seeker.avatar_url) {
    return getFullAvatarUrl(currentUser.seeker.avatar_url);
  }
  if (currentUser.logo_url) {
    return getFullAvatarUrl(currentUser.logo_url);
  }
  if (currentUser.avatar_url) {
    return getFullAvatarUrl(currentUser.avatar_url);
  }
  return '';
}

// 修正 msgSessions 头像
watch(users, async (val) => {
  const currentId = getCurrentUserId();
  const currentUsername = currentUser.username;
  msgSessions.value = val
    .filter(u => u.id !== currentId && u.user_id !== currentId && u.username !== currentUsername)
    .map(u => ({
      id: u.id,
      name: u.username,
      avatar: getFullAvatarUrl(u.logo_url || u.avatar_url || ''),
      lastMessage: '',
      unread: 0,
      messages: [],
      type: u.role
    }));
  await nextTick();
}, { immediate: true });

watch(
  () => [msgSessions.value.length, route.query.userId],
  async ([len, userId]) => {
    if (len > 0) {
      await nextTick();
      if (userId) {
        // 每次 userId 变化都重置锁
        sessionSelectedByUserId.value = false;
        const target = msgSessions.value.find(s => String(s.id) === String(userId));
        if (target) {
          selectSession(target.id);
          sessionSelectedByUserId.value = true;
        }
      } else if (!activeSessionId.value) {
        selectSession(msgSessions.value[0].id);
      }
    }
  },
  { immediate: true }
);

const filteredSessions = computed(() => {
  let sessions = msgSessions.value;
  if (userTypeFilter.value !== 'all') {
    sessions = sessions.filter(s => s.type === userTypeFilter.value);
  }
  if (!msgSearch.value) return sessions;
  return sessions.filter(s => s.name.includes(msgSearch.value));
});
const activeSession = computed(() => msgSessions.value.find(s => s.id === activeSessionId.value));

// 修正消息头像
async function fetchMessages(sessionId) {
  const session = msgSessions.value.find(s => s.id === sessionId);
  if (!session) return;
  try {
    const res = await api.getMessages(getCurrentUserId(), sessionId);
    if (Array.isArray(res.data)) {
      session.messages = res.data.map(msg => ({
        id: msg.id,
        sent_at: msg.sent_at,
        content: msg.content,
        isSelf: msg.sender_id === getCurrentUserId(),
        avatar: msg.sender_id === getCurrentUserId()
          ? getCurrentUserAvatar() || session.avatar
          : getFullAvatarUrl(
              (msg.Sender && (msg.Sender.logo_url || msg.Sender.avatar_url)) || session.avatar
            ),
        is_read: msg.is_read
      }));
      if (session.messages.length > 0) {
        session.lastMessage = session.messages[session.messages.length - 1].content;
      }
      session.unread = session.messages.filter(
        m => !m.isSelf && m.is_read === 0
      ).length;
    }
  } catch (e) {
    // ignore
  }
}

function selectSession(id) {
  if (activeSessionId.value === id) return;
  activeSessionId.value = id;
  const session = msgSessions.value.find(s => s.id === id);
  if (session) session.unread = 0;
  // 标记消息为已读
  api.markMessagesRead(id, getCurrentUserId());
  fetchMessages(id);
}

async function sendMsg() {
  if (!msgInput.value.trim() || !activeSessionId.value) return;
  try {
    await api.sendMessage({
      sender_id: getCurrentUserId(),
      receiver_id: activeSessionId.value,
      content: msgInput.value
    });
    msgInput.value = '';
    fetchMessages(activeSessionId.value);
  } catch (e) {
    ElMessage.error('消息发送失败');
  }
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

onMounted(() => {
  fetchUsers().then(() => {
    setTimeout(() => {
      console.log('onMounted: msgSessions', msgSessions.value);
      if (msgSessions.value.length > 0) {
        selectSession(msgSessions.value[0].id);
      }
    }, 500);
  });
  socket = socketIoClient('http://localhost:5000'); // 端口改为 5000
  socket.on('connect', () => {
    socket.emit('login', getCurrentUserId());
  });
  socket.on('new_message', (msg) => {
    // 如果是当前会话，自动刷新
    if (
      activeSessionId.value === msg.sender_id ||
      activeSessionId.value === msg.receiver_id
    ) {
      fetchMessages(activeSessionId.value);
    }
  });
});
onBeforeUnmount(() => {
  if (socket) socket.disconnect();
});

// 批量刷新所有会话未读数
async function refreshAllSessionsUnread() {
  for (const session of msgSessions.value) {
    await fetchMessages(session.id);
  }
}
defineExpose({ refreshAllSessionsUnread });
</script>

<style scoped>
.message-container {
  height: 100%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.message-layout {
  display: flex;
  height: 100%;
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
}
.session-list {
  width: 240px;
  background: #fff;
  border-right: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.session-search {
  margin: 16px 16px 8px 16px;
  display: flex;
}
.session-search .el-input,
.session-search .el-input__wrapper,
.session-search .el-input__inner {
  width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box;
  border-radius: 8px;
}
.session-scroll {
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
}
.session-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
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
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
  min-width: 0;
  position: relative;
  height: 100%;
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
}
.chat-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f9fafb;
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
  position: sticky;
  bottom: 0;
  z-index: 2;
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