const fs = require('fs');
const path = require('path');
const { Resume, Seeker, Job, Company } = require('../models');
const { Op } = require('sequelize');

const uploadDir = 'D:/Test/招聘系统pro/backend/uploads/resumes/'; // 定义实际的上传目录，使其在所有函数中可用

// 上传简历
exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '未上传文件' });
  }
  const jobId = parseInt(req.body.job_id); // 只用前端传来的job_id

  // 解析用户身份，优先req.user，否则用x-user header
  const userHeader = req.headers['x-user'] ? Buffer.from(req.headers['x-user'], 'base64').toString('utf8') : '{}';
  const user = req.user || JSON.parse(userHeader);
  const seekerId = parseInt(user.relatedId); // 只信任登录用户的relatedId

  // 验证 job_id 和 seeker_id 是否为有效数字
  if (isNaN(jobId) || isNaN(seekerId)) {
    console.error('上传简历错误: job_id 或 seeker_id 无效. 原始 job_id:', req.body.job_id, '原始 seeker_id (from user):', user.relatedId);
    return res.status(400).json({ message: '请求参数无效：job_id 或 seeker_id 必须为有效数字。' });
  }

  const originalname = req.body.encodedOriginalname ? decodeURIComponent(req.body.encodedOriginalname) : req.file.originalname;
  const filename = req.file.filename;
  const filepath = `/uploads/resumes/${filename}`; // 定义保存路径

  try {
    // 检查是否已存在此岗位的简历
    const existingResume = await Resume.findOne({
      where: { job_id: jobId, seeker_id: seekerId }
    });

    if (existingResume) {
      // 如果存在，先删除旧文件
      const oldFilePath = path.join(uploadDir, existingResume.filename);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // 同步删除文件
        console.log(`旧简历文件已删除: ${oldFilePath}`);
      }
      // 删除旧的数据库记录
      await existingResume.destroy();
      console.log(`旧简历数据库记录已删除: resume_id ${existingResume.resume_id}`);
    }

    // 存储简历元数据
    await Resume.create({
      job_id: jobId,
      seeker_id: seekerId,
      filename,
      originalname,
      filepath, // 保存文件路径
      upload_time: new Date() // 明确设置上传时间
    });
    res.json({ message: '简历上传成功', code: 200, resumeUrl: filepath });
  } catch (err) {
    console.error('简历保存失败错误:', err.message); // 打印详细错误信息
    console.error(err.stack); // 打印堆栈跟踪
    res.status(500).json({ message: '简历保存失败', code: 500 });
  }
};

// 岗位简历列表（企业用）
exports.getResumesByJob = async (req, res) => {
  const { job_id } = req.query;
  const resumes = await Resume.findAll({
    where: { job_id },
    include: [{ model: Seeker, as: 'Seeker', attributes: ['name'] }],
    order: [['upload_time', 'DESC']]
  });
  res.json(resumes.map(r => ({
    resume_id: r.resume_id,
    seeker_id: r.seeker_id,
    seeker_name: r.Seeker ? r.Seeker.name : '',
    upload_time: r.upload_time,
    filename: r.filename,
    originalname: r.originalname,
    // filepath: r.filepath // Removed filepath as it's not in the database
  })));
};

// 求职者获取自己上传的简历
exports.getMyResume = async (req, res) => {
  const jobId = parseInt(req.query.job_id); // 确保 job_id 为整数
  // 对 x-user 请求头进行 Base64 解码，然后再解析 JSON
  const userHeader = req.headers['x-user'] ? Buffer.from(req.headers['x-user'], 'base64').toString('utf8') : '{}';
  const user = req.user || JSON.parse(userHeader);

  console.log('Backend getMyResume: User object received:', user);
  console.log('Backend getMyResume: user.role:', user.role, 'typeof user.role:', typeof user.role);
  console.log('Backend getMyResume: user.relatedId:', user.relatedId, 'typeof user.relatedId:', typeof user.relatedId);

  // 确保用户是求职者且相关ID存在
  if (!user || user.role !== 'seeker' || !user.relatedId) {
    if (!user) {
      console.log('尝试获取我的简历：用户对象为空或无效。');
    } else if (user.role !== 'seeker') {
      console.log('尝试获取我的简历：用户角色不是求职者。当前角色:', user.role);
    } else if (!user.relatedId) {
      console.log('尝试获取我的简历：用户相关ID缺失或无效。');
    }
    return res.status(403).json({ message: '无权限访问：只有求职者可以查看自己的简历' });
  }

  const seekerId = parseInt(user.relatedId); // 确保 seeker_id 为整数

  // 检查转换后的ID是否为NaN
  if (isNaN(jobId) || isNaN(seekerId)) {
    console.error('获取我的简历错误：job_id 或 seeker_id 转换后无效。原始job_id:', req.query.job_id, '转换后jobId:', jobId, '原始relatedId:', user.relatedId, '转换后seekerId:', seekerId);
    return res.status(400).json({ message: '请求参数无效：job_id 或 seeker_id 必须为有效数字。' });
  }

  console.log('尝试查找简历，jobId:', jobId, 'seekerId:', seekerId); // 打印查询前的值

  try {
    const resume = await Resume.findOne({
      where: { job_id: jobId, seeker_id: seekerId },
      order: [['upload_time', 'DESC']]
    });
    
    if (!resume) {
      console.log(`未找到 jobId: ${jobId}, seekerId: ${seekerId} 的简历`); // Add log for not found
      return res.status(404).json({ message: '未上传简历' });
    }

    console.log('获取到的简历对象:', resume.toJSON()); // Log the full resume object
    console.log('简历的 filepath 字段:', resume.filepath); // Log the specific filepath field

    res.json({
      resume_id: resume.resume_id,
      upload_time: resume.upload_time,
      filename: resume.filename,
      originalname: resume.originalname,
      // filepath: resume.filepath // Removed filepath as it's not in the database
    });
  } catch (err) {
    console.error('获取我的简历错误:', err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 下载简历
exports.downloadResume = (req, res) => {
  const { resume_id } = req.params;
  Resume.findByPk(resume_id).then(r => {
    if (!r) return res.status(404).json({ message: '简历不存在' });
    
    const filePath = path.join(uploadDir, r.filename); // 使用实际的上传目录和文件名
    console.log('Attempting to download file from:', filePath); // Add this log
    
    if (!fs.existsSync(filePath)) {
      console.error('文件未找到 at:', filePath); // Add this log for missing files
      return res.status(404).json({ message: '文件未找到' });
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('文件读取失败:', err);
        if (!res.headersSent) {
          return res.status(500).json({ message: '文件读取失败' });
        }
        return; 
      }

      // Explicitly set headers to force download and prevent caching
      res.writeHead(200, {
        'Content-Type': 'application/pdf', // Assuming PDF. Could be dynamic based on originalname extension
        'Content-Disposition': `attachment; filename="${encodeURIComponent(r.originalname)}"`, 
        'Content-Length': data.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.end(data); // Send the buffer and end the response
      console.log('文件传输完成 (via buffer)');
    });

  }).catch(err => {
    console.error('下载简历错误:', err);
    if (!res.headersSent) {
      res.status(500).json({ message: '服务器错误' });
    }
  });
};

// 获取求职者投递的简历列表
exports.getAppliedResumesBySeeker = async (req, res) => {
  try {
    const seekerId = req.params.seekerId;
    const resumes = await Resume.findAll({
      where: { seeker_id: seekerId },
      include: [{
        model: Job,
        as: 'Job', // Make sure this matches the association alias in your models
        attributes: ['job_id', 'position_name', 'location', 'min_salary', 'max_salary', 'status', 'publish_time'],
        include: [{
          model: Company,
          as: 'company', // Make sure this matches the association alias in your models
          attributes: ['company_name']
        }]
      }],
      order: [['upload_time', 'DESC']]
    });

    res.json(resumes.map(resume => ({
      resume_id: resume.resume_id,
      job_id: resume.job_id,
      seeker_id: resume.seeker_id,
      originalname: resume.originalname,
      upload_time: resume.upload_time,
      position_name: resume.Job ? resume.Job.position_name : null,
      company_name: (resume.Job && resume.Job.company) ? resume.Job.company.company_name : null,
      location: resume.Job ? resume.Job.location : null,
      salary_range: (resume.Job && resume.Job.min_salary && resume.Job.max_salary) ? `${resume.Job.min_salary}k-${resume.Job.max_salary}k` : '面议',
      status: resume.Job ? resume.Job.status : null,
      publish_time: resume.Job ? resume.Job.publish_time : null,
    })));
  } catch (err) {
    console.error('获取求职者投递简历列表失败:', err);
    res.status(500).json({ message: '获取求职者投递简历列表失败' });
  }
};

// 获取求职者已投递的简历列表
exports.getAppliedResumes = async (req, res) => {
  try {
    const { seekerId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    const { rows: resumes, count } = await Resume.findAndCountAll({
      where: { seeker_id: seekerId },
      attributes: ['resume_id', 'job_id', 'seeker_id', 'filename', 'originalname', 'upload_time'], // Explicitly list attributes, exclude filepath
      include: [
        {
          model: Job,
          as: 'Job',
          required: false,
          include: [
            {
              model: Company,
              as: 'Company',
              required: false,
              attributes: ['company_id', 'company_name']
            }
          ],
          attributes: ['job_id', 'position_name', 'min_salary', 'max_salary', 'location', 'publish_time']
        }
      ],
      order: [['upload_time', 'DESC']],
      limit: parseInt(pageSize),
      offset: (parseInt(page) - 1) * parseInt(pageSize)
    });

    const formattedResumes = resumes.map(resume => {
      const job = resume.Job || {};
      const company = job.Company || {};
      
      return {
        resume_id: resume.resume_id,
        job: {
          job_id: job.job_id,
          job_title: job.position_name,
          salary_range: (job.min_salary && job.max_salary) ? `${job.min_salary}k-${job.max_salary}k` : '面议',
          location: job.location,
          publish_time: job.publish_time
        },
        company: {
          company_id: company.company_id,
          company_name: company.company_name
        },
        upload_time: resume.upload_time,
        filename: resume.filename,
        originalname: resume.originalname
      };
    });

    res.json({
      resumes: formattedResumes,
      total: count,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    console.error('Error fetching applied resumes:', error);
    res.status(500).json({ message: '获取已投简历列表失败' });
  }
};