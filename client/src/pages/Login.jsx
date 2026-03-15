import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link as MuiLink,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Fade,
    Grow
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import OTPVerification from '../components/OTPVerification';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const result = await login({ email, password });
        setIsSubmitting(false);

        if (result.success) {
            if (result.verified) {

                navigate('/');
            } else {
                setShowOTP(true);
            }
        }
    };

    const handleVerified = () => {
        navigate('/');
    };



    return (
        <Container maxWidth="xs" sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2
        }}>
            <Grow in={visible} timeout={800}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 3, md: 4 },
                            width: '100%',
                            borderRadius: 6,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Decorative background element */}
                        <Box sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 150,
                            height: 150,
                            bgcolor: 'primary.main',
                            opacity: 0.05,
                            borderRadius: '50%'
                        }} />

                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <SportsCricketIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1.5 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px', fontSize: '1.25rem' }}>
                                Welcome Back
                            </Typography>
                        </Box>

                        {error && (
                            <Fade in={!!error}>
                                <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        <Box sx={{ mt: 1 }}>
                            {showOTP ? (
                                <OTPVerification email={email} onVerified={handleVerified} />
                            ) : (
                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isSubmitting}
                                        size="large"
                                        sx={{
                                            mt: 3,
                                            mb: 2,
                                            py: 1.2,
                                            boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.3)'}`
                                        }}
                                    >
                                        {isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Continue to Dashboard'}
                                    </Button>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            New to Cricket Notifier?{' '}
                                            <MuiLink
                                                component={Link}
                                                to="/register"
                                                sx={{
                                                    textDecoration: 'none',
                                                    fontWeight: 700,
                                                    color: 'primary.main',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                Create an account
                                            </MuiLink>
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2, textAlign: 'center' }}>
                                        <MuiLink
                                            component={Link}
                                            to="/admin"
                                            sx={{
                                                textDecoration: 'none',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                color: 'text.secondary',
                                                '&:hover': { color: 'error.main' }
                                            }}
                                        >
                                            Admin Portal Access
                                        </MuiLink>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Grow>
        </Container>
    );
};

export default Login;
