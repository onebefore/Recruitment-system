const { UserAuth, Company, Seeker } = require('../models');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

// 获取求职者个人信息
exports.getSeekerProfile = async (req, res) => {
  try {
    const { seekerId } = req.params;
    const parsedSeekerId = parseInt(seekerId, 10); // 将 seekerId 转换为整数
    console.log(`[getSeekerProfile] Received seekerId: ${seekerId}, type: ${typeof seekerId}, Parsed seekerId: ${parsedSeekerId}, type: ${typeof parsedSeekerId}`);

    // 检查解析后的 ID 是否有效
    if (isNaN(parsedSeekerId)) {
      return res.status(400).json({ message: '无效的求职者ID' });
    }

    const seeker = await Seeker.findByPk(parsedSeekerId);
    if (!seeker) {
      return res.status(404).json({ message: '求职者信息未找到' });
    }
    res.json(seeker);
  } catch (error) {
    console.error('获取求职者信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新求职者个人信息
exports.updateSeekerProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { seekerId } = req.params;
    const { username, userId, ...seekerData } = req.body; // Extract userId and username

    console.log(`[updateSeekerProfile] Received seekerId (from params): ${seekerId}`);
    console.log(`[updateSeekerProfile] Received req.body:`, req.body);
    console.log(`[updateSeekerProfile] Extracted userId (from body): ${userId}`);
    console.log(`[updateSeekerProfile] seekerData before update:`, seekerData);

    // 更新 UserAuth 表中的 username
    const userAuthUpdated = await UserAuth.update({ username }, {
      where: { user_id: userId, related_id: seekerId, role: 'seeker' },
      transaction
    });

    // 更新 Seeker 表中的其他信息
    const [seekerUpdated] = await Seeker.update(seekerData, {
      where: { seeker_id: seekerId },
      transaction
    });

    // If neither UserAuth nor Seeker table was updated, it means no actual change occurred.
    // This is not an error (like 404 Not Found), but a success with no-op.
    if (userAuthUpdated[0] === 0 && seekerUpdated === 0) { // Explicitly check for 0 affected rows
      await transaction.commit();
      return res.status(200).json({ message: '无信息更改，个人信息已是最新。' }); // Change status to 200 OK
    }

    await transaction.commit();
    res.json({ message: '个人信息更新成功' });
  } catch (error) {
    await transaction.rollback();
    console.error('更新求职者信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取企业个人信息
exports.getCompanyProfile = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: '企业信息未找到' });
    }
    res.json(company);
  } catch (error) {
    console.error('获取企业信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新企业个人信息
exports.updateCompanyProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { companyId } = req.params;
    const { username, userId, ...companyData } = req.body; // Extract userId and username

    console.log(`[updateCompanyProfile] Received companyId (from params): ${companyId}`);
    console.log(`[updateCompanyProfile] Received req.body:`, req.body);
    console.log(`[updateCompanyProfile] Extracted userId (from body): ${userId}`);

    // 更新 UserAuth 表中的 username
    const userAuthUpdated = await UserAuth.update({ username }, {
      where: { user_id: userId, related_id: companyId, role: 'company' },
      transaction
    });

    // 更新 Company 表中的其他信息
    const [companyUpdated] = await Company.update(companyData, {
      where: { company_id: companyId },
      transaction
    });

    // If neither UserAuth nor Company table was updated, it means no actual change occurred.
    if (userAuthUpdated[0] === 0 && companyUpdated === 0) { // Explicitly check for 0 affected rows
      await transaction.commit();
      return res.status(200).json({ message: '无信息更改，企业信息已是最新。' }); // Change status to 200 OK
    }

    await transaction.commit();
    res.json({ message: '企业信息更新成功' });
  } catch (error) {
    await transaction.rollback();
    console.error('更新企业信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;

    const userAuth = await UserAuth.findByPk(userId);
    if (!userAuth) {
      return res.status(404).json({ message: '用户未找到' });
    }

    const isMatch = await bcrypt.compare(oldPassword, userAuth.password);
    if (!isMatch) {
      return res.status(401).json({ message: '旧密码不正确' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userAuth.update({ password: hashedPassword }, { transaction });

    await transaction.commit();
    res.json({ message: '密码修改成功' });
  } catch (error) {
    await transaction.rollback();
    console.error('修改密码错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 