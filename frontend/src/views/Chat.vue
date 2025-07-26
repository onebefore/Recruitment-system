<template>
  <div class="chat-container">
    <h2>聊天室</h2>
    <div class="chat-messages" ref="chatBox">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <strong>{{ msg.sender_id === currentUser.id ? '我' : '对方' }}:</strong>
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <div class="chat-input">
      <el-input v-model="newMessage" placeholder="输入消息..." @keyup.enter="sendMessage" />
      <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const messages = ref([]);
const newMessage = ref('');
const chatBox = ref(null);
const currentUser = JSON.parse(localStorage.getItem('user'));
const receiverId = ref(router.currentRoute.value.params.receiver_id);

const fetchMessages = async () => {
  try {
    const res = await api.getMessages(currentUser.id, receiverId.value);
    messages.value = res.data;
  } catch (err) {
    alert('获取聊天记录失败');
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  try {
    await api.sendMessage({
      sender_id: currentUser.id,
      receiver_id: receiverId.value,
      content: newMessage.value
    });
    newMessage.value = '';
    fetchMessages();
  } catch (err) {
    alert('发送消息失败');
  }
};

onMounted(() => {
  fetchMessages();
  // 模拟自动滚动到底部
  setInterval(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  }, 1000);
});
</script>

<style scoped>
.chat-container {
  padding: 20px;
}
.chat-messages {
  height: 400px;
  border: 1px solid #eaeaea;
  padding: 10px;
  overflow-y: auto;
  margin-bottom: 10px;
}
.message {
  margin: 5px 0;
}
.chat-input {
  display: flex;
}
.chat-input .el-input {
  flex: 1;
}
</style>