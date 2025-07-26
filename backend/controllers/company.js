const { Company } = require('../models');

exports.getCompanyDetail = async (req, res) => {
  try {
    const companyId = req.params.id;
    if (!companyId) {
      return res.status(400).json({ message: '公司ID缺失' });
    }

    const company = await Company.findByPk(companyId);

    if (!company) {
      return res.status(404).json({ message: '公司未找到' });
    }

    res.json(company);
  } catch (err) {
    console.error('获取公司详情错误:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCompanyList = async (req, res) => {
  try {
    const { keyword } = req.query;
    const where = {};
    if (keyword) {
      where[require('sequelize').Op.or] = [
        { company_name: { [require('sequelize').Op.like]: `%${keyword}%` } },
        { introduction: { [require('sequelize').Op.like]: `%${keyword}%` } }
      ];
    }
    const companies = await Company.findAll({ where });
    res.json(companies);
  } catch (err) {
    console.error('获取公司列表错误:', err);
    res.status(500).json({ error: err.message });
  }
}; 