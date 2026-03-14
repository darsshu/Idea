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
  Grow,
  Stack
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, error, loading } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register({ name, email, password });
        if (success) {
            navigate('/');
        }
    };

    return (
        <Container maxWidth="sm">
            <Grow in={visible} timeout={800}>
                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: { xs: 4, md: 6 }, 
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

                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <SportsCricketIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.5px' }}>
                                Create Account
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Join the community of smart cricket fans
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
                            <Stack spacing={2.5}>
                                <TextField
                                    required
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    name="name"
                                    autoComplete="name"
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
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
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password (min 6 characters)"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="new-password"
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
                                    disabled={loading}
                                    size="large"
                                    sx={{ 
                                        mt: 2, 
                                        py: 1.2, 
                                        boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.3)'}`
                                    }}
                                >
                                    {loading ? <CircularProgress size={26} color="inherit" /> : 'Create My Account'}
                                </Button>
                            </Stack>

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <MuiLink 
                                        component={Link} 
                                        to="/login" 
                                        sx={{ 
                                            textDecoration: 'none', 
                                            fontWeight: 700,
                                            color: 'primary.main',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        Sign in instead
                                    </MuiLink>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Grow>
        </Container>
    );
};

export default Register;
