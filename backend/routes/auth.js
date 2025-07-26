const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// 登录接口
router.post('/login', authController.login);

// 注册企业接口
router.post('/register/company', authController.registerCompany);

// 注册求职者接口
router.post('/register/seeker', authController.registerSeeker);

// 根据 company_id 获取企业用户认证信息 (用于聊天)
router.get('/company-user/:companyId', authController.getCompanyAuthByCompanyId);

// 根据 seeker_id 获取求职者用户认证信息 (用于聊天)
router.get('/seeker-user/:seekerId', authController.getSeekerAuthBySeekerId);

module.exports = router;