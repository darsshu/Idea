import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    Fade,
    Grow,
    useTheme,
    Link as MuiLink
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminLogin = () => {
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, error, loading } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login({ email, password });
        if (success) {
            navigate('/admin/events');
        }
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
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Decorative background element */}
                        <Box sx={{
                            position: 'absolute',
                            top: -50,
                            right: -50,
                            width: 150,
                            height: 150,
                            bgcolor: 'error.main',
                            opacity: 0.05,
                            borderRadius: '50%'
                        }} />

                        <Box sx={{ mb: 2, textAlign: 'center' }}>
                            <Box sx={{
                                display: 'inline-flex',
                                p: 1.5,
                                borderRadius: 4,
                                bgcolor: 'rgba(211, 47, 47, 0.1)',
                                mb: 1.5
                            }}>
                                <AdminPanelSettingsIcon sx={{ fontSize: 32, color: 'error.main' }} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-1px' }}>
                                Admin Portal
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
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Admin Email"
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
                                label="Admin Password"
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
                                color="error"
                                disabled={loading}
                                size="medium"
                                sx={{
                                    mt: 2,
                                    mb: 1,
                                    py: 1.4,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    boxShadow: '0 8px 16px rgba(211, 47, 47, 0.2)'
                                }}
                            >
                                {loading ? <CircularProgress size={26} color="inherit" /> : 'Log In to Admin Panel'}
                            </Button>
                        </Box>

                        <Box sx={{ mt: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2, textAlign: 'center' }}>
                            <MuiLink
                                component={Link}
                                to="/login"
                                sx={{
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    color: 'text.secondary',
                                    '&:hover': { color: 'primary.main' }
                                }}
                            >
                                ← Back to User Login
                            </MuiLink>
                        </Box>
                    </Paper>
                </Box>
            </Grow>
        </Container>
    );
};

export default AdminLogin;
