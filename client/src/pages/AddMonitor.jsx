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
  InputAdornment
} from '@mui/material';
import axios from 'axios';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import { useAuth } from '../context/AuthContext';

const AddMonitor = () => {
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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Fade in={showContent} timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800, color: 'text.primary' }}>
            Create New Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter the details of the match/event below to start tracking ticket availability.
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
              border: '1px solid',
              borderColor: 'divider',
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
                    sx={{ py: 2, fontSize: '1.1rem' }}
                  >
                    {loading ? 'Setting up...' : 'Start Monitoring Now'}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
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

export default AddMonitor;
