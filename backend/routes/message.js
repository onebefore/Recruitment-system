const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message');

// 发送消息
router.post('/', messageController.sendMessage);

// 获取聊天记录
router.get('/', messageController.getMessages);

// 设置消息为已读
router.post('/read', messageController.markAsRead);

// 获取与我有关的所有会话列表
router.get('/sessions', messageController.getSessionList);

module.exports = router;