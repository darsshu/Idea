const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

// @desc    Get wallet balance and transaction history
// @route   GET /api/wallet
// @access  Private
exports.getWalletData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('walletBalance');
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.json({
            balance: user.walletBalance,
            transactions
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Request a deposit
// @route   POST /api/wallet/deposit
// @access  Private
exports.requestDeposit = async (req, res) => {
    try {
        const { amount, utr } = req.body;

        if (!amount || !utr) {
            return res.status(400).json({ error: 'Please provide amount and UTR' });
        }

        const transaction = await Transaction.create({
            userId: req.user.id,
            type: 'deposit',
            amount,
            utr,
            status: 'pending',
            description: `Deposit via GPay/UPI (UTR: ${utr})`
        });

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Request a withdrawal
// @route   POST /api/wallet/withdraw
// @access  Private
exports.requestWithdrawal = async (req, res) => {
    try {
        const { amount, upiId } = req.body;

        if (!amount || !upiId) {
            return res.status(400).json({ error: 'Please provide amount and UPI ID' });
        }

        const user = await User.findById(req.user.id);

        if (user.walletBalance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Deduct balance immediately (hold)
        user.walletBalance -= amount;
        await user.save();

        const transaction = await Transaction.create({
            userId: req.user.id,
            type: 'withdrawal',
            amount,
            upiId,
            status: 'pending',
            description: `Withdrawal to ${upiId}`
        });

        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Admin: Verify and complete deposit
// @route   PUT /api/wallet/deposit/:id/verify
// @access  Private/Admin
exports.verifyDeposit = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction || transaction.type !== 'deposit') {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.status !== 'pending') {
            return res.status(400).json({ error: 'Transaction already processed' });
        }

        const { status } = req.body; // 'completed' or 'rejected'

        if (status === 'completed') {
            const user = await User.findById(transaction.userId);
            user.walletBalance += transaction.amount;
            await user.save();
            transaction.status = 'completed';
        } else if (status === 'rejected') {
            transaction.status = 'rejected';
        }

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Admin: Complete withdrawal
// @route   PUT /api/wallet/withdraw/:id/verify
// @access  Private/Admin
exports.verifyWithdrawal = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction || transaction.type !== 'withdrawal') {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.status !== 'pending') {
            return res.status(400).json({ error: 'Transaction already processed' });
        }

        const { status } = req.body; // 'completed' or 'rejected'

        if (status === 'completed') {
            transaction.status = 'completed';
        } else if (status === 'rejected') {
            // Refund balance
            const user = await User.findById(transaction.userId);
            user.walletBalance += transaction.amount;
            await user.save();
            transaction.status = 'rejected';
        }

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
};
