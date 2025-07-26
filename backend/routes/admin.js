const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.post('/login', adminController.adminLogin);
router.get('/users', adminController.getAllUsers);
router.delete('/users/:userId', adminController.deleteUser);

// 职位审核相关
router.get('/jobs/pending', adminController.getPendingJobs);
router.post('/jobs/:jobId/approve', adminController.approveJob);
router.post('/jobs/:jobId/reject', adminController.rejectJob);

module.exports = router; 