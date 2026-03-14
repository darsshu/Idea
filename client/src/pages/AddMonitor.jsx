import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Snackbar, 
  Alert,
  CircularProgress,
  Fade,
  Slide,
  Zoom,
  InputAdornment,
  useTheme
} from '@mui/material';
import axios from 'axios';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useAuth } from '../context/AuthContext';

const AddMonitor = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [urlError, setUrlError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const validateForm = () => {
    let isValid = true;
    
    // URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!url.trim()) {
      setUrlError('BookMyShow URL is required');
      isValid = false;
    } else if (!urlPattern.test(url)) {
      setUrlError('Please enter a valid URL');
      isValid = false;
    } else {
      setUrlError('');
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await axios.post(`${apiUrl}/api/monitor`, { url, email });
      setSnackbar({ 
        open: true, 
        message: 'Monitoring started successfully! We will notify you.', 
        severity: 'success' 
      });
      setUrl('');
      setUrlError('');
      // Keep email since they might want to add another one with same email
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to start monitoring. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ 
      maxWidth: 900, 
      mx: 'auto', 
      mt: 1, 
      p: 2,
      position: 'relative',
      minHeight: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      {/* Background animated gradient blobs */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '300px',
        height: '300px',
        bgcolor: 'primary.main',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: theme.palette.mode === 'dark' ? 0.3 : 0.1,
        animation: 'float 10s ease-in-out infinite',
        zIndex: -1,
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        }
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '250px',
        height: '250px',
        bgcolor: 'secondary.main',
        borderRadius: '50%',
        filter: 'blur(80px)',
        opacity: theme.palette.mode === 'dark' ? 0.3 : 0.1,
        animation: 'float 8s ease-in-out infinite reverse',
        zIndex: -1,
      }} />

      <Fade in={showContent} timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1, gap: 1 }}>
            <NotificationsActiveIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h2" sx={{ 
              fontWeight: 900, 
              background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              textShadow: theme.palette.mode === 'dark' ? '0px 4px 20px rgba(25, 118, 210, 0.4)' : '0px 4px 20px rgba(25, 118, 210, 0.2)',
              letterSpacing: '-1px'
            }}>
              Match Notification
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}>
            Showing for Cricket Match <SportsCricketIcon color="error" />
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}>
            Never miss a ticket! Enter the match details below and get instantly notified the second tickets go live.
          </Typography>
        </Box>
      </Fade>

      <Zoom in={showContent} style={{ transitionDelay: showContent ? '300ms' : '0ms' }}>
        <Box>
          <Card 
            elevation={24} 
            sx={{ 
              p: { xs: 2, sm: 4, md: 4 }, 
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 4,
              background: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 20px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            {/* Glossy top highlight */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            }} />

            <CardContent sx={{ p: '0 !important' }}>
              <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={4}>
                  <TextField
                    label="Match URL (BookMyShow etc.)"
                    placeholder="https://in.bookmyshow.com/events/..."
                    fullWidth
                    required
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (urlError) setUrlError('');
                    }}
                    error={!!urlError}
                    helperText={urlError}
                    variant="outlined"
                    autoComplete="off"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        transition: '0.3s',
                        '&:hover': {
                          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                         <InputAdornment position="start">
                           <Box sx={{ p: 1, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
                             <LinkIcon color={urlError ? "error" : "primary"} />
                           </Box>
                         </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Email for Notifications"
                    placeholder="your@email.com"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    error={!!emailError}
                    helperText={emailError}
                    variant="outlined"
                    autoComplete="email"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        transition: '0.3s',
                        '&:hover': {
                          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}>
                            <EmailIcon color={emailError ? "error" : "primary"} />
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large" 
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SportsCricketIcon />}
                      sx={{ 
                        py: 2, 
                        px: 4,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        textTransform: 'none',
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        boxShadow: '0 8px 16px rgba(33, 150, 243, 0.3)',
                        transition: 'all 0.3s ease',
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: '250px',
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.02)',
                          boxShadow: '0 12px 20px rgba(33, 150, 243, 0.4)',
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                        },
                        '&:active': {
                          transform: 'translateY(1px)',
                        }
                      }}
                    >
                      {loading ? 'Setting up Monitor...' : 'Track Ticket Availability'}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Zoom>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%', 
            borderRadius: 2,
            alignItems: 'center',
            '& .MuiAlert-message': {
              fontSize: '1.05rem',
              fontWeight: 500
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMonitor;

