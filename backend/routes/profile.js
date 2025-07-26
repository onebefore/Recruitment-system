const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');

// 获取和更新求职者个人信息
router.get('/seeker/:seekerId', profileController.getSeekerProfile);
router.put('/seeker/:seekerId', profileController.updateSeekerProfile);

// 获取和更新企业个人信息
router.get('/company/:companyId', profileController.getCompanyProfile);
router.put('/company/:companyId', profileController.updateCompanyProfile);

// 修改密码
router.put('/password/:userId', profileController.changePassword);

module.exports = router; 