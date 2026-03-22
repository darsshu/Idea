const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../services/notifier');
const crypto = require('crypto');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user
exports.register = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({ error: 'Please provide a mobile number' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({
            name,
            email,
            password,
            mobile,
            otp,
            otpExpires,
            isVerified: false
        });

        // Send OTP via Email and WhatsApp
        await sendOTP(email, mobile, otp);

        res.status(201).json({
            success: true,
            message: 'OTP sent to your email and WhatsApp. Please verify to complete registration.',
            email
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await User.findByIdAndUpdate(user._id, { otp, otpExpires });

        // Send OTP (send to mobile only if it exists)
        await sendOTP(user.email, user.mobile, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email and WhatsApp (if provided) for verification.',
            email: user.email,
            isVerified: user.isVerified
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email }).select('+otp +otpExpires');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        await User.findByIdAndUpdate(user._id, {
            isVerified: true,
            otp: undefined,
            otpExpires: undefined
        });

        const updatedUser = await User.findById(user._id);
        sendTokenResponse(updatedUser, 200, res);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get current logged in user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                walletBalance: user.walletBalance
            }
        });
};
