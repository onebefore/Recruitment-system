const { Message, UserAuth } = require('../models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body;

    // 简单的验证
    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ message: '发送者ID、接收者ID和内容不能为空' });
    }

    // 检查 sender_id 和 receiver_id 是否存在于 UserAuth 表中（可选但推荐）
    const [senderExists, receiverExists] = await Promise.all([
      UserAuth.findByPk(sender_id),
      UserAuth.findByPk(receiver_id)
    ]);

    if (!senderExists || !receiverExists) {
      return res.status(404).json({ message: '发送者或接收者用户不存在' });
    }

    const newMessage = await Message.create({
      sender_id,
      receiver_id,
      content,
      sent_at: new Date(),
    });

    // socket.io推送
    const io = req.app.get('io');
    const userSocketMap = req.app.get('userSocketMap');
    if (userSocketMap && userSocketMap.has(receiver_id)) {
      userSocketMap.get(receiver_id).emit('new_message', newMessage);
    }

    res.status(201).json({ message: '消息发送成功', message: newMessage });
  } catch (err) {
    console.error('发送消息错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.query;

    // 简单的验证
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ message: '发送者ID和接收者ID不能为空' });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: sender_id, receiver_id: receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id }, // 也要获取对方发过来的消息
        ],
      },
      order: [['sent_at', 'ASC']], // 按时间升序排列
      include: [
        { model: UserAuth, as: 'Sender', attributes: ['username'] },
        { model: UserAuth, as: 'Receiver', attributes: ['username'] },
      ] // 包含发送者和接收者的用户信息
    });

    res.json(messages);
  } catch (err) {
    console.error('获取消息列表错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 设置消息为已读
exports.markAsRead = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.body;
    if (!sender_id || !receiver_id) {
      return res.status(400).json({ message: '发送者ID和接收者ID不能为空' });
    }
    await Message.update(
      { is_read: 1 },
      {
        where: {
          sender_id,
          receiver_id,
          is_read: 0
        }
      }
    );
    res.json({ message: '消息已标记为已读' });
  } catch (err) {
    console.error('设置消息已读错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取与我有关的所有会话列表（每个会话只返回最后一条消息及未读数）
exports.getSessionList = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'user_id不能为空' });
    // 查询所有与我有关的消息
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: user_id },
          { receiver_id: user_id }
        ]
      },
      order: [['sent_at', 'DESC']]
    });
    // 以对方id分组，取每组最新一条
    const sessionMap = {};
    messages.forEach(msg => {
      const otherId = msg.sender_id == user_id ? msg.receiver_id : msg.sender_id;
      if (!sessionMap[otherId]) {
        sessionMap[otherId] = msg;
      }
    });
    // 统计每个会话的未读数
    const unreadMap = {};
    messages.forEach(msg => {
      const otherId = msg.sender_id == user_id ? msg.receiver_id : msg.sender_id;
      if (msg.receiver_id == user_id && msg.is_read == 0) {
        unreadMap[otherId] = (unreadMap[otherId] || 0) + 1;
      }
    });
    // 返回格式：[{otherId, lastMessage, unreadCount}]
    const sessionList = Object.keys(sessionMap).map(otherId => ({
      otherId,
      lastMessage: sessionMap[otherId],
      unreadCount: unreadMap[otherId] || 0
    }));
    res.json(sessionList);
  } catch (err) {
    console.error('获取会话列表错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};