const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job');

// 获取所有岗位 (求职者主页)
router.get('/jobs', jobController.searchJobs); // 实际上这里是搜索，但文档中是获取所有岗位

// 组合查询岗位 (求职者搜索功能)
router.get('/job/search', jobController.searchJobs);

module.exports = router; 