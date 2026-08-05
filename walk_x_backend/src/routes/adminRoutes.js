const express = require('express');
const { getAdminStats, processWithdrawal } = require('../controllers/adminController');

const router = express.Router();

router.get('/stats', getAdminStats);
router.put('/withdrawals/:id', processWithdrawal);

module.exports = router;
