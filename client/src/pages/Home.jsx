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
  Grid,
  Paper,
  InputAdornment
} from '@mui/material';
import axios from 'axios';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const features = [
    { icon: <LinkIcon color="primary" />, title: 'Paste URL', desc: 'Copy link from BookMyShow' },
    { icon: <SpeedIcon color="primary" />, title: 'Real-time', desc: 'Checks Every 60 Seconds' },
    { icon: <NotificationsActiveIcon color="primary" />, title: 'Instantly', desc: 'Email Alert on Availability' },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Fade in={showContent} timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Never Miss a Match
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 500 }}>
            Automated ticket monitoring for your favorite cricket matches.
            Set it once, and let us do the rest.
          </Typography>
        </Box>
      </Fade>

      <Slide direction="up" in={showContent} timeout={800}>
        <Box>
          <Card 
            elevation={0} 
            sx={{ 
              p: { xs: 2, md: 4 }, 
              mb: 6,
              position: 'relative',
              overflow: 'visible',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                background: (theme) => theme.palette.mode === 'light' 
                  ? 'rgba(46, 125, 50, 0.05)' 
                  : 'rgba(74, 222, 128, 0.05)',
                borderRadius: '24px',
                zIndex: -1
              }
            }}
          >
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <TextField
                    label="BookMyShow Event URL"
                    placeholder="https://in.bookmyshow.com/events/..."
                    fullWidth
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon color="action" />
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
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    size="large" 
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SportsCricketIcon />}
                    sx={{ 
                      py: 2, 
                      fontSize: '1.1rem',
                      boxShadow: (theme) => theme.palette.mode === 'light'
                        ? '0 10px 20px rgba(46, 125, 50, 0.2)'
                        : '0 10px 20px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {loading ? 'Setting up...' : 'Start Monitoring Now'}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    height: '100%',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'inline-flex', 
                    p: 1.5, 
                    borderRadius: 3, 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    mb: 2,
                    opacity: 0.9
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Slide>

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
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
