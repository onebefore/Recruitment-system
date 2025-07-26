const { Job, Company } = require('../models');
const { Op } = require('sequelize');

// 获取所有岗位
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ where: { review_status: 'approved' } });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根据 ID 获取岗位
exports.getJobById = async (req, res) => {
  try {
    // 1. 查找岗位（不加审核状态限制）
    const job = await Job.findOne({
      where: { job_id: req.params.id },
      include: [{
        model: Company,
        as: 'Company',
        attributes: ['company_id', 'company_name', 'industry']
      }]
    });

    if (!job) return res.status(404).json({ message: '岗位未找到' });

    // 2. 判断是否为企业本人（前端需传递x-user-id和x-role header）
    const userId = req.headers['x-user-id'] || req.body.userId;
    const role = req.headers['x-role'] || req.body.role;
    if (role === 'company' && userId) {
      const UserAuth = require('../models').UserAuth;
      const userAuth = await UserAuth.findByPk(userId);
      if (userAuth && userAuth.role === 'company' && String(userAuth.related_id) === String(job.company_id)) {
        // 是企业本人，返回全部岗位
        const formattedJob = {
          job_id: job.job_id,
          company_id: job.company_id,
          position_name: job.position_name,
          min_salary: job.min_salary,
          max_salary: job.max_salary,
          hire_count: job.hire_count,
          location: job.location,
          description: job.description,
          requirements: job.requirements,
          publish_time: job.publish_time,
          status: job.status,
          review_status: job.review_status,
          reject_reason: job.reject_reason,
          company_name: job.Company ? job.Company.company_name : '',
          industry: job.Company ? job.Company.industry : ''
        };
        return res.json(formattedJob);
      }
    }

    // 3. 其他用户只能看审核通过的岗位
    if (job.review_status !== 'approved') {
      return res.status(403).json({ message: '无权查看该岗位' });
    }
    const formattedJob = {
      job_id: job.job_id,
      company_id: job.company_id,
      position_name: job.position_name,
      min_salary: job.min_salary,
      max_salary: job.max_salary,
      hire_count: job.hire_count,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      publish_time: job.publish_time,
      status: job.status,
      review_status: job.review_status,
      reject_reason: job.reject_reason,
      company_name: job.Company ? job.Company.company_name : '',
      industry: job.Company ? job.Company.industry : ''
    };
    res.json(formattedJob);
  } catch (err) {
    console.error('获取岗位详情错误:', err);
    res.status(500).json({ error: err.message });
  }
};

// 组合查询岗位
exports.searchJobs = async (req, res) => {
  const { 
    industry, 
    min_salary, 
    max_salary, 
    keyword,
    page = 1, 
    pageSize = 10,
    status
  } = req.query;
  
  const where = { review_status: 'approved' };
  const offset = (page - 1) * pageSize;

  // 状态筛选
  if (status) {
    where.status = status;
  }

  // 行业筛选
  if (industry) {
    where['$company.industry$'] = industry;
  }

  // 薪资范围筛选
  if (min_salary) {
    where.max_salary = {
      [Op.gte]: parseInt(min_salary)
    };
  }
  if (max_salary) {
    where.min_salary = {
      [Op.lte]: parseInt(max_salary)
    };
  }

  // 关键词搜索（岗位名称或公司名称）
  if (keyword) {
    where[Op.or] = [
      { position_name: { [Op.like]: `%${keyword}%` } },
      { '$company.company_name$': { [Op.like]: `%${keyword}%` } }
    ];
  }

  try {
    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [{
        model: Company,
        as: 'Company',
        attributes: ['company_name', 'industry'],
        required: true
      }],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['publish_time', 'DESC']],
      distinct: true
    });

    res.json({
      jobs: jobs.map(job => ({
        job_id: job.job_id,
        company_id: job.company_id,
        job_title: job.position_name,
        industry: job.Company ? job.Company.industry : '',
        salary_range: `${job.min_salary}k-${job.max_salary}k`,
        company_name: job.Company ? job.Company.company_name : '',
        location: job.location,
        requirements: job.requirements,
        description: job.description,
        created_at: job.publish_time
      })),
      total: count
    });
  } catch (err) {
    console.error('搜索岗位错误:', err);
    res.status(500).json({ error: err.message });
  }
};

// 发布新岗位
exports.createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, review_status: 'pending' };
    const newJob = await Job.create(jobData);
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 修改岗位信息
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: '岗位未找到' });
    const updateData = { ...req.body };
    if (job.review_status === 'rejected') {
      updateData.review_status = 'pending';
      updateData.reject_reason = null;
    }
    await job.update(updateData);
    res.json({ message: '岗位信息更新成功' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 删除岗位
exports.deleteJob = async (req, res) => {
  try {
    const deleted = await Job.destroy({
      where: { job_id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ message: '岗位未找到' });
    res.json({ message: '岗位删除成功' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 获取某个企业发布的所有岗位
exports.getJobsByCompany = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const { query } = req.query; // Get query parameter

    const whereClause = { company_id: companyId };

    if (query) {
      whereClause.position_name = { [Op.like]: `%${query}%` };
    }

    // 不加review_status限制，企业可见所有状态
    const jobs = await Job.findAll({
      where: whereClause,
      include: [{
        model: Company,
        as: 'Company',
        attributes: ['company_name', 'industry']
      }],
      order: [['publish_time', 'DESC']]
    });
    res.json(jobs);
  } catch (err) {
    console.error('获取企业岗位列表失败:', err);
    res.status(500).json({ error: err.message });
  }
};