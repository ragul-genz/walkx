const express = require('express');
const { convertStepsToCoins, requestWithdrawal } = require('../controllers/walletController');

const router = express.Router();

router.post('/convert', convertStepsToCoins);
router.post('/withdraw', requestWithdrawal);

module.exports = router;
