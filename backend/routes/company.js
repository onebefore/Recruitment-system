const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company');

router.get('/:id', companyController.getCompanyDetail);
router.get('/', companyController.getCompanyList);

module.exports = router; 