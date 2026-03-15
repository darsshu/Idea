import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Stack,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  InputAdornment,
  Fade
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  CameraAlt as CameraIcon,
  Security as SecurityIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      // Mocking update call as per standard pattern
      await axios.put(`${apiUrl}/api/user/profile`, {
        name: formData.name,
        email: formData.email
      });
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Failed to update profile', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setSnackbar({ open: true, message: 'New passwords do not match', severity: 'warning' });
      return;
    }
    
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await axios.put(`${apiUrl}/api/user/password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Password change failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Fade in={true} timeout={800}>
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                  fontWeight: 900,
                  boxShadow: '0 12px 30px rgba(25, 118, 210, 0.25)',
                  border: '4px solid white',
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  bgcolor: 'white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
                size="small"
              >
                <CameraIcon fontSize="small" color="primary" />
              </IconButton>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1px', mb: 1 }}>
              {user?.isAdmin ? 'Admin' : 'My'} <Box component="span" sx={{ color: 'primary.main' }}>Profile</Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Manage your personal information and account security
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Account Settings */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
                    <BadgeIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>Personal Information</Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 1 }}>Full Name</Typography>
                    <TextField
                      fullWidth
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 1 }}>Email Address</Typography>
                    <TextField
                      fullWidth
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        sx={{ 
                          borderRadius: 3, 
                          px: 4, 
                          fontWeight: 800,
                          textTransform: 'none',
                          boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)'
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Security Settings */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'secondary.main', color: 'white', display: 'flex' }}>
                    <SecurityIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>Account Security</Typography>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 1 }}>Current Password</Typography>
                    <TextField
                      fullWidth
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="secondary" sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} size="small">
                              {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 1 }}>New Password</Typography>
                    <TextField
                      fullWidth
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="secondary" sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} size="small">
                              {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 1 }}>Confirm New Password</Typography>
                    <TextField
                      fullWidth
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="secondary" sx={{ fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SecurityIcon />}
                        onClick={handleUpdatePassword}
                        disabled={loading}
                        sx={{ 
                          borderRadius: 3, 
                          px: 4, 
                          fontWeight: 800,
                          textTransform: 'none',
                          boxShadow: '0 8px 16px rgba(156, 39, 176, 0.2)'
                        }}
                      >
                        Update Password
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 4, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
