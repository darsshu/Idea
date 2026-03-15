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
  Stack,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  InputAdornment,
  Grow
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
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
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Grow in={visible} timeout={800}>
        <Container maxWidth="lg" sx={{ pt: { xs: 1, md: 0 }, pb: { xs: 1, md: 0 } }}>
          {/* Header */}
          <Box sx={{ mb: { xs: 1, md: 1 }, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: { xs: 1, md: 1 } }}>
              <Avatar
                sx={{
                  width: { xs: 80, md: 90 },
                  height: { xs: 80, md: 90 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '3.5rem', md: '2.5rem' },
                  fontWeight: 900,
                  boxShadow: (theme) => `0 12px 30px ${theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.25)' : 'rgba(0, 0, 0, 0.4)'}`,
                  border: '4px solid',
                  borderColor: 'background.paper',
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  bgcolor: 'background.paper',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                size="small"
              >
                <CameraIcon fontSize="small" color="action" />
              </IconButton>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px', }}>
              {user?.isAdmin ? 'Admin' : 'My'} Profile
            </Typography>

          </Box>

          <Grid container justifyContent="center">
            {/* Main Content Column */}
            <Grid item xs={12} md={10} lg={8}>
              <Stack spacing={{ xs: 3, md: 2 }}>
                {/* Account Settings */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 3 },
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

                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: { xs: 4, md: 2 }, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex' }}>
                      <BadgeIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Personal Information</Typography>
                  </Stack>

                  <Box component="form" onSubmit={handleUpdateProfile} noValidate sx={{ maxWidth: 600, mx: 'auto', position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ justifyContent: "center" }}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: { xs: 4, md: 2 }, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                          py: 1.2,
                          px: 4,
                          boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'light' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.3)'}`
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                {/* Security Settings */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 3 },
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
                    bgcolor: 'secondary.main',
                    opacity: 0.05,
                    borderRadius: '50%'
                  }} />

                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: { xs: 4, md: 2 }, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'secondary.main', color: 'secondary.contrastText', display: 'flex' }}>
                      <SecurityIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Account Security</Typography>
                  </Stack>

                  <Box component="form" onSubmit={handleUpdatePassword} noValidate sx={{ mx: 'auto', position: 'relative', zIndex: 1 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ justifyContent: "center" }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          autoComplete="current-password"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          autoComplete="new-password"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon color="action" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: { xs: 4, md: 2 }, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={loading}
                        sx={{
                          py: 1.2,
                          px: 4,
                          boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'light' ? 'rgba(156, 39, 176, 0.2)' : 'rgba(0, 0, 0, 0.3)'}`
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Grow>

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
