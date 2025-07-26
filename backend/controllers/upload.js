const { Company } = require('../models');
const path = require('path');

const uploadAvatar = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '未选择文件' });
    }

    // Construct the URL for the uploaded file.
    // Assuming your server serves static files from /uploads, which maps to the 'uploads' directory.
    // The URL should be relative to the base URL of your API.
    const fileUrl = `/uploads/avatars/${req.file.filename}`;

    res.status(200).json({ success: true, message: '头像上传成功', url: fileUrl });
  } catch (error) {
    console.error('头像上传错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，头像上传失败' });
  }
};

const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: '未选择文件' });
    }

    // Assuming the user's relatedId (companyId) is available in req.user after authentication
    const companyId = req.body.relatedId; // Or req.user.relatedId if passed via auth

    if (!companyId) {
      return res.status(400).json({ success: false, message: '缺少企业ID' });
    }

    const fileUrl = `/uploads/avatars/${req.file.filename}`; // Assuming logos are also stored in avatars folder
    const fullPath = path.join(__dirname, '../uploads/avatars', req.file.filename); // Get full path

    console.log('Company Logo uploaded to:', fullPath); // Log the full path

    // Update the company_info table with the new logo_url
    const [updated] = await Company.update({ logo_url: fileUrl }, {
      where: { company_id: companyId }
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: '未找到对应企业，无法更新Logo' });
    }

    res.status(200).json({ success: true, message: '公司Logo上传成功', filePath: fileUrl });
  } catch (error) {
    console.error('公司Logo上传错误:', error);
    res.status(500).json({ success: false, message: '服务器错误，公司Logo上传失败' });
  }
};

module.exports = {
  uploadAvatar,
  uploadCompanyLogo,
}; 