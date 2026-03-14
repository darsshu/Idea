import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

const Home = () => {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/monitor', { url, email });
      setSnackbar({ 
        open: true, 
        message: 'Monitoring started successfully!', 
        severity: 'success' 
      });
      setUrl('');
      setEmail('');
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to start monitoring', 
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
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card elevation={3} sx={{ overflow: 'visible' }}>
        <Box 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            p: 3, 
            textAlign: 'center',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            position: 'relative'
          }}
        >
          <SportsCricketIcon sx={{ fontSize: 50, mb: 1 }} />
          <Typography variant="h4" gutterBottom>
            Start Monitoring
          </Typography>
          <Typography variant="body1">
            Get notified as soon as tickets become available!
          </Typography>
        </Box>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="BookMyShow Event URL"
                placeholder="https://in.bookmyshow.com/events/..."
                fullWidth
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                variant="outlined"
              />
              <TextField
                label="Your Email Address"
                placeholder="email@example.com"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Monitoring'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 2, border: '1px dashed #2e7d32' }}>
        <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
          How it works:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          1. Paste the link to the cricket match on BookMyShow.<br />
          2. Enter your email where you'd like to receive notifications.<br />
          3. We check the page every 60 seconds.<br />
          4. You get an email the moment "Sold Out" changes to "Book"!
        </Typography>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
