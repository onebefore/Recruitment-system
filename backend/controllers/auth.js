'use strict';
const UserAuth = require('../models').UserAuth;
const Company = require('../models').Company;
const Seeker = require('../models').Seeker;
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 查找用户
    const user = await UserAuth.findOne({
      where: { username },
      include: [
        { model: Company, as: 'Company', attributes: ['company_id', 'company_name', 'logo_url'] },
        { model: Seeker, as: 'Seeker', attributes: ['seeker_id', 'name', 'avatar_url'] }
      ]
    });
    
    // 验证用户是否存在及密码是否正确
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    
    // 更新最后登录时间
    user.last_login = new Date();
    await user.save();
    
    // 返回用户信息
    res.json({ 
      message: '登录成功', 
      user: {
        userId: user.user_id,
        username: user.username,
        role: user.role,
        relatedId: user.related_id,
        lastLogin: user.last_login,
        avatar_url: user.Seeker ? user.Seeker.avatar_url : (user.Company ? user.Company.logo_url : null),
        company: user.Company ? {
          company_id: user.Company.company_id,
          company_name: user.Company.company_name,
          logo_url: user.Company.logo_url
        } : null,
        seeker: user.Seeker ? {
          seeker_id: user.Seeker.seeker_id,
          name: user.Seeker.name,
          avatar_url: user.Seeker.avatar_url
        } : null
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.registerCompany = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { company_name, phone, username, password, address, industry } = req.body;
    
    // 创建企业信息
    const company = await Company.create({
      company_name,
      phone,
      address,
      industry
    }, { transaction });
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户认证信息
    await UserAuth.create({
      username,
      password: hashedPassword,
      role: 'company',
      related_id: company.company_id
    }, { transaction });
    
    await transaction.commit();
    
    res.json({ 
      message: '企业注册成功', 
      company: { 
        company_name, 
        phone,
        address,
        industry
      } 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('企业注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

exports.registerSeeker = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    console.log('registerSeeker req.body:', req.body); // 调试输出
    const { name, phone, username, password, gender, birth_date, highest_degree } = req.body;
    
    // 创建求职者信息
    const seeker = await Seeker.create({
      name,
      phone,
      gender,
      birth_date,
      highest_degree
    }, { transaction });
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户认证信息
    await UserAuth.create({
      username,
      password: hashedPassword,
      role: 'seeker',
      related_id: seeker.seeker_id
    }, { transaction });
    
    await transaction.commit();
    
    res.json({ 
      message: '求职者注册成功', 
      seeker: { 
        name, 
        phone,
        gender,
        birth_date,
        highest_degree
      } 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('求职者注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 根据 company_id 获取企业用户认证信息 (用于聊天)
exports.getCompanyAuthByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const userAuth = await UserAuth.findOne({
      where: { related_id: companyId, role: 'company' },
      attributes: ['user_id', 'username']
    });

    if (!userAuth) {
      return res.status(404).json({ message: '未找到对应的企业用户认证信息' });
    }

    res.json(userAuth);
  } catch (error) {
    console.error('根据 company_id 获取企业用户认证信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 根据 seeker_id 获取求职者用户认证信息 (用于聊天)
exports.getSeekerAuthBySeekerId = async (req, res) => {
  try {
    const seekerId = parseInt(req.params.seekerId); // 确保 seekerId 为整数

    console.log('Backend getSeekerAuthBySeekerId: Raw req.params.seekerId:', req.params.seekerId);
    console.log('Backend getSeekerAuthBySeekerId: Parsed seekerId:', seekerId);

    if (isNaN(seekerId)) {
      console.error('获取求职者用户认证信息错误: seekerId 转换后无效. 原始 seekerId:', req.params.seekerId);
      return res.status(400).json({ message: '请求参数无效：seekerId 必须为有效数字。' });
    }

    const userAuth = await UserAuth.findOne({
      where: { related_id: seekerId, role: 'seeker' },
      attributes: ['user_id', 'username']
    });

    if (!userAuth) {
      console.log('未找到对应的求职者用户认证信息，seekerId:', seekerId);
      return res.status(404).json({ message: '未找到对应的求职者用户认证信息' });
    }

    res.json(userAuth);
  } catch (error) {
    console.error('根据 seeker_id 获取求职者用户认证信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};