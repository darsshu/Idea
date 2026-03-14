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
  Grid,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [events, setEvents] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setShowContent(true);
    fetchEvents();
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/events`);
      console.log('Raw API Events Response:', res.data);
      // Standardize event object mapping
      const processedEvents = res.data.map(evt => ({
        id: evt._id || evt.id,
        title: evt.title || 'Untitled Event',
        imageUrl: evt.imageUrl || '',
        eventUrl: evt.eventUrl || ''
      }));
      console.log('Processed Events for UI:', processedEvents);
      setEvents(processedEvents);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleSelectEvent = (event) => {
    console.log('Event Card Clicked. Raw Data:', event);
    setSelectedEvent(event);
    setConfirmOpen(true);
  };

  const confirmTrack = async () => {
    if (!selectedEvent) return;
    setConfirmOpen(false);
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const trackingEmail = user?.email;
      const trackingUrl = selectedEvent?.eventUrl;

      console.log('Final Payload Check:', { trackingUrl, trackingEmail, selectedEvent });

      if (!trackingUrl || !trackingEmail) {
        setSnackbar({
          open: true,
          message: `Missing ${!trackingUrl ? 'Event Link' : 'Logged-in Email'}. Please re-select the event.`,
          severity: 'error'
        });
        return;
      }

      await axios.post(`${apiUrl}/api/monitor`, { url: trackingUrl, email: trackingEmail });
      setSuccessOpen(true);
    } catch (error) {
      console.error('Tracking Error:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to start monitoring. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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
      width: '100%',
      mx: 'auto',
      p: { xs: 2, md: 4 },
      position: 'relative',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Background animated gradient blobs */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '40vmax',
        height: '40vmax',
        bgcolor: 'primary.main',
        borderRadius: '50%',
        filter: 'blur(100px)',
        opacity: theme.palette.mode === 'dark' ? 0.2 : 0.08,
        animation: 'float 15s ease-in-out infinite',
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
        width: '35vmax',
        height: '35vmax',
        bgcolor: 'secondary.main',
        borderRadius: '50%',
        filter: 'blur(100px)',
        opacity: theme.palette.mode === 'dark' ? 0.2 : 0.08,
        animation: 'float 12s ease-in-out infinite reverse',
        zIndex: -1,
      }} />

      <Fade in={showContent} timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1, gap: 1 }}>
            <NotificationsActiveIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Match <span className="highlight" style={{ WebkitTextFillColor: 'initial', background: 'transparent' }}>Notification</span>
            </Typography>
          </Box>
          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontSize: '1.1rem'
          }}>
            Showing for Cricket Match <SportsCricketIcon color="error" fontSize="small" />
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '500px', mx: 'auto' }}>
            Never miss a ticket! Select an event below and get instantly <span className="highlight">notified</span> the second tickets go live.
          </Typography>
        </Box>
      </Fade>

      {/* Events Selection Grid */}
      {events.length > 0 && (
        <Fade in={showContent} style={{ transitionDelay: '200ms' }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, textAlign: 'center', fontSize: '1.1rem' }}>
              Select an Event to <span className="highlight">Track</span>
            </Typography>
            <Grid container spacing={2}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      border: url === event.eventUrl ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                      '&:hover': { transform: 'scale(1.03)', boxShadow: 10 }
                    }}
                    onClick={() => handleSelectEvent(event)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={event.imageUrl}
                      alt={event.title}
                    />
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight={700} align="center" noWrap>
                        {event.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
            p: 2,
            minWidth: { xs: '90%', sm: 400 },
            backgroundImage: 'linear-gradient(to bottom right, rgba(25, 118, 210, 0.05), rgba(156, 39, 176, 0.05))'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', pb: 1, display: 'flex', color: 'red', alignItems: 'center', gap: 1.5 }}>
          <NotificationsActiveIcon color="info" /> Confirm Tracking
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
            {selectedEvent?.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Would you like to start monitoring this event for ticket availability?
          </Typography>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 800, mb: 0.5 }}>
              Notifications sent to
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {email}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1.5 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{ fontWeight: 800, borderRadius: 3, px: 3, color: 'text.secondary' }}
          >
            Not Now
          </Button>
          <Button
            onClick={confirmTrack}
            variant="contained"
            sx={{
              fontWeight: 800,
              borderRadius: 3,
              px: 4,
              py: 1.2,
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)'
            }}
          >
            Start Tracking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        PaperProps={{ sx: { borderRadius: 5, p: 3, textAlign: 'center', maxWidth: 400 } }}
      >
        <DialogContent>
          <Box sx={{
            width: 80, height: 80, borderRadius: '50%', bgcolor: 'success.main',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 3, boxShadow: '0 10px 20px rgba(76, 175, 80, 0.3)'
          }}>
            <NotificationsActiveIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h5" fontWeight={900} gutterBottom>Awesome!</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            We've set up a monitor for <strong>{selectedEvent?.title}</strong>.
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, bgcolor: 'success.light', color: 'success.dark', p: 1, borderRadius: 2 }}>
            We will email you the moment tickets go live!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setSuccessOpen(false)}
            variant="contained"
            color="success"
            sx={{ fontWeight: 800, borderRadius: 3, px: 6, py: 1.5 }}
          >
            Great!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual section removed as per user request */}
      {/* Keeping loading state overlay if needed */}
      {loading && (
        <Box sx={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          color: 'white'
        }}>
          <CircularProgress color="inherit" />
          <Typography variant="h6" fontWeight={700}>Setting up your monitor...</Typography>
        </Box>
      )}

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

