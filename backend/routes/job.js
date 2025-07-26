const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job');

// 说明：所有公开查询接口（如getAllJobs、getJobById、searchJobs）只返回审核通过（review_status=approved）的职位。

// 获取所有岗位 (通用接口)
router.get('/', jobController.getAllJobs);

// 获取某个企业发布的所有岗位
router.get('/company/:companyId/jobs', jobController.getJobsByCompany);

// 组合查询岗位
router.get('/search', jobController.searchJobs);

// 根据 ID 获取岗位 (通用接口，招聘方和求职者都可能用到)
router.get('/:id', jobController.getJobById);

// 发布新岗位
router.post('/job/create', jobController.createJob);

// 修改岗位信息
router.put('/job/:id/update', jobController.updateJob);

// 删除岗位
router.delete('/job/:id/delete', jobController.deleteJob);

module.exports = router;