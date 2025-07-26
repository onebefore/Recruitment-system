const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize'); // 引入 Op
const { SuperAdmin, UserAuth, Company, Seeker, Job } = require('../models'); // 引入所有模型，修正模型名称

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 先查找user_auth表中的admin账号
    const userAuthAdmin = await UserAuth.findOne({ where: { username, role: 'admin' } });
    if (userAuthAdmin) {
      const isMatch = await bcrypt.compare(password, userAuthAdmin.password);
      if (!isMatch) {
        return res.status(400).json({ message: '密码不正确' });
      }
      // 登录成功，返回user_auth的user_id和role
      return res.status(200).json({ message: '管理员登录成功', admin: { id: userAuthAdmin.user_id, username: userAuthAdmin.username, role: userAuthAdmin.role } });
    }
    // fallback到super_admin表
    const admin = await SuperAdmin.findOne({ where: { username } });
    if (!admin) {
      return res.status(400).json({ message: '管理员不存在' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: '密码不正确' });
    }
    // 返回super_admin的id和username（不推荐用于消息系统）
    res.status(200).json({ message: '管理员登录成功', admin: { id: admin.id, username: admin.username, role: 'super_admin' } });
  } catch (error) {
    console.error('管理员登录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { query, role } = req.query; // 获取查询参数
    const whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }

    const includeClause = [
      { model: Company, as: 'Company', attributes: ['company_name', 'industry', 'logo_url'], required: false },
      { model: Seeker, as: 'Seeker', attributes: ['name', 'phone', 'avatar_url'], required: false }
    ];

    if (query) {
      // For search query, we need to apply it across UserAuth, Company, and Seeker models
      // This requires complex WHERE clauses or separate queries/post-filtering for more accuracy
      // For simplicity, we'll apply it to username in UserAuth and filter associated models after fetching.
      // A more robust solution for associated model searching would involve Sequelize.literal or subqueries.

      whereClause[Op.or] = [
        { username: { [Op.like]: `%${query}%` } },
        // Direct search on associated model attributes is complex with default include
        // We will handle company_name and seeker name filtering in post-processing for now
      ];
    }

    const users = await UserAuth.findAll({
      attributes: ['user_id', 'username', 'role', 'related_id'],
      where: whereClause, // 应用基本筛选条件
      include: includeClause
    });

    const formattedUsers = users.map(user => {
      let userInfo = { id: user.user_id, username: user.username, role: user.role, relatedId: user.related_id };
      if (user.role === 'company' && user.Company) {
        userInfo = { ...userInfo, ...user.Company.dataValues, name: user.Company.company_name, logo_url: user.Company.logo_url };
      } else if (user.role === 'seeker' && user.Seeker) {
        userInfo = { ...userInfo, ...user.Seeker.dataValues, avatar_url: user.Seeker.avatar_url };
      }
      return userInfo;
    }).filter(user => {
      // Post-filter for search query on associated model names
      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        return (user.username && user.username.toLowerCase().includes(lowerCaseQuery)) ||
               (user.name && user.name.toLowerCase().includes(lowerCaseQuery));
      }
      return true;
    });

    res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error('获取所有用户失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// exports.deleteUser = async (req, res) => {
//   const transaction = await db.sequelize.transaction(); // Use db.sequelize for transaction
//   try {
//     const { userId } = req.params;
//     const { role } = req.query; // Get role from query parameters

//     if (!userId || !role) {
//       await transaction.rollback();
//       return res.status(400).json({ message: '缺少用户ID或角色参数' });
//     }

//     const userAuth = await UserAuth.findByPk(userId); // Find user_auth record first
//     if (!userAuth) {
//       await transaction.rollback();
//       return res.status(404).json({ message: '用户未找到' });
//     }

//     let relatedEntityDeleted = 0;
//     if (role === 'seeker') {
//       relatedEntityDeleted = await Seeker.destroy({
//         where: { seeker_id: userAuth.related_id },
//         transaction
//       });
//     } else if (role === 'company') {
//       relatedEntityDeleted = await Company.destroy({
//         where: { company_id: userAuth.related_id },
//         transaction
//       });
//     }

//     // Delete from user_auth table
//     const userAuthDeleted = await UserAuth.destroy({
//       where: { user_id: userId },
//       transaction
//     });

//     if (userAuthDeleted === 0) {
//       await transaction.rollback();
//       return res.status(404).json({ message: '用户删除失败或用户不存在' });
//     }

//     await transaction.commit();
//     res.status(200).json({ message: '用户删除成功' });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('删除用户失败:', error);
//     res.status(500).json({ message: '服务器错误' });
//   }
// }; 

// 请将这段代码复制并粘贴到你的 backend/controllers/admin.js 文件中，
// 替换掉现有的 exports.deleteUser 函数。

exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { role } = req.query;

    console.log(`[deleteUser] Attempting to delete user. userId (from params): ${userId}, role (from query): ${role}`);

    if (!userId || !role) {
      await transaction.rollback();
      console.log('[deleteUser] Missing userId or role parameter, rolling back.');
      return res.status(400).json({ message: '缺少用户ID或角色参数' });
    }

    const userAuth = await UserAuth.findByPk(userId, { transaction });
    if (!userAuth) {
      await transaction.rollback();
      console.log('[deleteUser] UserAuth record not found, rolling back.');
      return res.status(404).json({ message: '用户未找到' });
    }
    console.log(`[deleteUser] Found UserAuth record. user_id: ${userAuth.user_id}, related_id: ${userAuth.related_id}, role: ${userAuth.role}`);

    let relatedEntityDeletedCount = 0;
    if (role === 'seeker') {
      console.log(`[deleteUser] Deleting seeker record with seeker_id: ${userAuth.related_id}`);
      relatedEntityDeletedCount = await Seeker.destroy({
        where: { seeker_id: userAuth.related_id },
        transaction
      });
      console.log(`[deleteUser] Seeker.destroy result: ${relatedEntityDeletedCount} rows deleted.`);
    } else if (role === 'company') {
      console.log(`[deleteUser] Deleting company record with company_id: ${userAuth.related_id}`);
      relatedEntityDeletedCount = await Company.destroy({
        where: { company_id: userAuth.related_id },
        transaction
      });
      console.log(`[deleteUser] Company.destroy result: ${relatedEntityDeletedCount} rows deleted.`);
    }

    // Delete from user_auth table
    console.log(`[deleteUser] Deleting UserAuth record with user_id: ${userId}`);
    const userAuthDeletedCount = await UserAuth.destroy({
      where: { user_id: userId },
      transaction
    });
    console.log(`[deleteUser] UserAuth.destroy result: ${userAuthDeletedCount} rows deleted.`);

    if (userAuthDeletedCount === 0) {
      await transaction.rollback();
      console.log('[deleteUser] UserAuth record not deleted, rolling back.');
      return res.status(404).json({ message: '用户删除失败或用户不存在' });
    }

    await transaction.commit();
    console.log('[deleteUser] Transaction committed successfully. User deleted.');
    res.status(200).json({ message: '用户删除成功' });
  } catch (error) {
    await transaction.rollback();
    console.log('[deleteUser] Transaction rolled back due to error:', error);
    console.error('删除用户失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取所有待审核职位（支持review_status参数：all、pending、approved、rejected）
exports.getPendingJobs = async (req, res) => {
  try {
    const { review_status, all, company_name } = req.query;
    let where = {};
    if (!all && review_status && review_status !== 'all') {
      where.review_status = review_status;
    }
    const include = [{
      model: Company,
      as: 'Company',
      attributes: ['company_name', 'logo_url'],
      where: company_name ? { company_name: { [Op.like]: `%${company_name}%` } } : undefined
    }];
    // all时不加筛选，返回全部
    const jobs = await Job.findAll({
      where,
      include: company_name ? include : [{ model: Company, as: 'Company', attributes: ['company_name', 'logo_url'] }]
    });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: '获取待审核职位失败', error: error.message });
  }
};

// 审核通过职位
exports.approveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const [updated] = await Job.update({ review_status: 'approved' }, { where: { job_id: jobId } });
    if (!updated) return res.status(404).json({ message: '职位未找到' });
    res.status(200).json({ message: '职位审核通过' });
  } catch (error) {
    res.status(500).json({ message: '职位审核失败', error: error.message });
  }
};

// 审核驳回职位
exports.rejectJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { reason } = req.body;
    // 更新岗位状态和驳回原因
    const [updated] = await Job.update({ review_status: 'rejected', reject_reason: reason }, { where: { job_id: jobId } });
    if (!updated) return res.status(404).json({ message: '职位未找到' });

    // 获取岗位及公司信息
    const job = await Job.findByPk(jobId);
    if (job) {
      const company = await Company.findByPk(job.company_id);
      if (company) {
        // 查找公司发布者user_auth
        const userAuth = await UserAuth.findOne({ where: { related_id: company.company_id, role: 'company' } });
        if (userAuth) {
          // 查找一个管理员账号作为消息发送者
          const adminUser = await UserAuth.findOne({ where: { role: 'admin' } });
          const adminUserId = adminUser ? adminUser.user_id : null;
          if (!adminUserId) {
            return res.status(500).json({ message: '未找到管理员账号，无法发送系统消息' });
          }
          await require('../models').Message.create({
            sender_id: adminUserId,
            receiver_id: userAuth.user_id,
            content: `您的岗位"${job.position_name}"被驳回，理由：${reason || '无'}`,
            sent_at: new Date()
          });
        }
      }
    }
    res.status(200).json({ message: '职位已驳回' });
  } catch (error) {
    res.status(500).json({ message: '职位驳回失败', error: error.message });
  }
};