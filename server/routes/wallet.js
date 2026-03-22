const express = require('express');
const router = express.Router();
const { 
    getWalletData, 
    requestDeposit, 
    requestWithdrawal, 
    verifyDeposit, 
    verifyWithdrawal 
} = require('../controllers/wallet.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getWalletData);
router.post('/deposit', protect, requestDeposit);
router.post('/withdraw', protect, requestWithdrawal);

// Admin routes
router.put('/deposit/:id/verify', protect, authorize('admin'), verifyDeposit);
router.put('/withdraw/:id/verify', protect, authorize('admin'), verifyWithdrawal);

module.exports = router;
