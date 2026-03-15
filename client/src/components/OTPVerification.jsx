import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Stack,
    Alert,
    Fade,
    useTheme
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const OTPVerification = ({ email, onVerified }) => {
    const theme = useTheme();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRefs = useRef([]);
    const { verifyOTP, error, setError } = useAuth();

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
        if (pastedData) {
            const newOtp = [...otp];
            pastedData.split('').forEach((char, index) => {
                if (index < 6) newOtp[index] = char;
            });
            setOtp(newOtp);
            // Focus last filled or next empty
            const nextIndex = pastedData.length < 6 ? pastedData.length : 5;
            inputRefs.current[nextIndex].focus();
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter a 6-digit OTP');
            return;
        }

        setIsSubmitting(true);
        const success = await verifyOTP(email, otpString);
        setIsSubmitting(false);
        if (success && onVerified) {
            onVerified();
        }
    };

    // Auto-submit when all 6 digits are filled
    useEffect(() => {
        if (otp.join('').length === 6) {
            handleSubmit();
        }
    }, [otp]);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <VerifiedUserIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}>
                    Verify Your Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    We've sent a 6-digit code to <strong>{email}</strong>
                </Typography>
            </Box>

            {error && (
                <Fade in={!!error}>
                    <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                </Fade>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={4}>
                    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, justifyContent: 'center' }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                style={{
                                    width: '45px',
                                    height: '55px',
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: `2px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
                                    backgroundColor: theme.palette.background.paper,
                                    color: theme.palette.text.primary,
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = theme.palette.primary.main}
                                onBlur={(e) => e.target.style.borderColor = error ? theme.palette.error.main : theme.palette.divider}
                            />
                        ))}
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        size="large"
                        sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            letterSpacing: '1px',
                            boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.3)' : 'rgba(0, 0, 0, 0.4)'}`
                        }}
                    >
                        {isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Verify & Continue'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Didn't receive the code?
                        </Typography>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => window.location.reload()}
                            sx={{ fontWeight: 700 }}
                        >
                            Try Again
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default OTPVerification;
