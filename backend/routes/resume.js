const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const resumeController = require('../controllers/resume');

// 设置上传目录
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'D:/Test/招聘系统pro/backend/uploads/resumes/';
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating upload directory:', err);
        return cb(err);
      }
    cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 上传简历
router.post('/resume', upload.single('resume'), resumeController.uploadResume);

// 岗位简历列表（企业用）
router.get('/list', resumeController.getResumesByJob);

// 求职者获取自己上传的简历
router.get('/my', resumeController.getMyResume);

// 下载简历
router.get('/download/:resume_id', resumeController.downloadResume);

// 获取求职者投递的简历列表
router.get('/applied-by-seeker/:seekerId', resumeController.getAppliedResumesBySeeker);

// 获取求职者已投递的简历列表
router.get('/applied/:seekerId', resumeController.getAppliedResumes);

module.exports = router;