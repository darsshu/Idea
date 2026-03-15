import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  CardMedia,
  Divider,
  useTheme,
  Container,
  Snackbar,
  Alert,
  IconButton,
  Stack,
  InputBase,
  Paper,
  Tooltip,
  Skeleton,
  Button,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuth } from '../context/AuthContext';
import ConfirmationDialog from '../components/ConfirmationDialog';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

const AddMonitor = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [events, setEvents] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchEvents();
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const fetchEvents = async () => {
    setFetching(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/events`);
      const processedEvents = res.data.map(evt => ({
        id: evt._id || evt.id,
        title: evt.title || 'Untitled Event',
        imageUrl: evt.imageUrl || '',
        eventUrl: evt.eventUrl || ''
      }));
      setEvents(processedEvents);
    } catch (err) {
      console.error('Failed to fetch events', err);
      setSnackbar({
        open: true,
        message: 'Failed to refresh matches. Please try again.',
        severity: 'error'
      });
    } finally {
      setFetching(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setConfirmOpen(true);
  };

  const confirmTrack = async () => {
    if (!selectedEvent) return;
    setConfirmOpen(false);
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const trackingEmail = user?.email || email;
      const trackingUrl = selectedEvent?.eventUrl;

      if (!trackingUrl || !trackingEmail) {
        setSnackbar({
          open: true,
          message: `Missing ${!trackingUrl ? 'Event Link' : 'Logged-in Email'}.`,
          severity: 'error'
        });
        return;
      }

      await axios.post(`${apiUrl}/api/monitor`, {
        url: trackingUrl,
        email: trackingEmail,
        matchName: selectedEvent.title
      });
      setSuccessOpen(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to start monitoring.',
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
      minHeight: '100vh',
      bgcolor: 'background.default',
      pb: 10,
    }}>
      <Fade in={true} timeout={800}>
        <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'rgba(25, 118, 210, 0.1)',
              display: 'flex'
            }}>
              <NotificationsActiveIcon sx={{ fontSize: { xs: 24, md: 30 }, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" sx={{
              fontWeight: 900,
              background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>
              Upcoming <span style={{ WebkitTextFillColor: 'initial', background: 'transparent' }}>Match</span>
            </Typography>
          </Box>

          {/* <Tooltip title="Refresh Data">
            <IconButton
              onClick={fetchMonitors}
              sx={{
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                transition: 'all 0.3s',
                '&:hover': { bgcolor: 'primary.main', color: 'white', transform: 'rotate(180deg)' }
              }}
            >
              <RefreshIcon size="small" />
            </IconButton>
          </Tooltip> */}
        </Box>
      </Fade>
      <Divider sx={{ mb: 2, opacity: 0.6 }} />


      {/* Main Content Area */}
      <Box sx={{ px: { xs: 0, md: 2 } }}>
        {/* Toolbar: Search and Filter */}


        {/* Matches Grid */}
        <Box sx={{ px: { xs: 2, md: 0 } }}>
          {fetching ? (
            <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
              {[...Array(6)].map((_, i) => (
                <Grid item key={i} xs={12} sm={6} md={6} lg={6} sx={{ width: isMobile ? '100%' : isTablet ? '40%' : '30%' }}>
                  <Card sx={{ borderRadius: 5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                    <Box sx={{ pt: '65%', position: 'relative' }}>
                      <Skeleton variant="rectangular" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                    </Box>
                    <CardContent sx={{ p: 2.5 }}>
                      <Skeleton variant="text" width="100%" height={28} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
                      <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 2 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : filteredEvents.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <Grid container spacing={3} sx={{ justifyContent: 'center', }}>
                {filteredEvents.map((event, index) => (
                  <Grid item key={event.id} xs={12} sm={6} md={6} lg={6} sx={{ height: '100%', width: isMobile ? '100%' : isTablet ? '40%' : '30%' }}>
                    <MotionBox
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <Card
                        onClick={() => handleSelectEvent(event)}
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: 5,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                            borderColor: 'primary.main',
                            '& .card-image': { transform: 'scale(1.08)' },
                          },
                        }}
                      >
                        {/* Aspect Ratio Box */}
                        <Box sx={{ position: 'relative', pt: '65%', overflow: 'hidden', }}>
                          <CardMedia
                            className="card-image"
                            component="img"
                            image={event.imageUrl}
                            alt={event.title}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.6s ease'
                            }}
                          />

                          {/* Live Tracker Overlay Badge */}
                          <Box sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            zIndex: 2,
                            backdropFilter: 'blur(10px)',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            px: 1.2,
                            py: 0.6,
                            borderRadius: 2,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          }}>
                            <Stack direction="row" spacing={0.8} alignItems="center">
                              <Box sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                animation: 'pulse-dot 1.5s infinite'
                              }} />
                              <Typography sx={{
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                color: 'primary.main',
                                letterSpacing: 0.5,
                                textTransform: 'uppercase'
                              }}>
                                LIVE TRACKER
                              </Typography>
                            </Stack>
                          </Box>
                        </Box>

                        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                          <Typography sx={{
                            fontWeight: 800,
                            mb: 1.5,
                            lineHeight: 1.4,
                            fontSize: '1rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '2.8em'
                          }}>
                            {event.title}
                          </Typography>

                          <Button
                            variant="outlined"
                            fullWidth
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 700,
                              textTransform: 'none',
                              borderColor: 'divider',
                              color: 'text.primary',
                              '&:hover': { border: 'none', bgcolor: 'primary.main', color: 'white' }
                            }}
                          >
                            Set Notification
                          </Button>
                        </CardContent>
                      </Card>
                    </MotionBox>
                  </Grid>
                ))}
              </Grid>
            </AnimatePresence>
          ) : (
            <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'action.hover', borderRadius: 6, border: '2px dashed', borderColor: 'divider' }}>
              <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>No Matches Found</Typography>
              <Typography variant="body2" color="text.secondary">Try searching for a different match</Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Confirmation Components */}
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmTrack}
        title="Activate Tracker"
        confirmText="Confirm & Start"
        cancelText="Cancel"
      >
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          We'll monitor the tickets for:
          <Box component="span" sx={{ fontWeight: 900, color: 'primary.main', display: 'block', mt: 1, fontSize: '1.3rem' }}>
            {selectedEvent?.title}
          </Box>
        </Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex' }}>
              <NotificationsActiveIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 800 }}>ALERT DESTINATION</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>{email}</Typography>
            </Box>
          </Stack>
        </Paper>
      </ConfirmationDialog>

      <ConfirmationDialog
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        onConfirm={() => setSuccessOpen(false)}
        type="success"
        confirmText="Go to Dashboard"
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>Tracking Active!</Typography>
          <Typography variant="body2" color="text.secondary">
            You'll receive an email as soon as tickets for <strong>{selectedEvent?.title}</strong> are available.
          </Typography>
        </Box>
      </ConfirmationDialog>

      {/* Styles & Animation Overlays */}
      {loading && (
        <Box sx={{
          position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3
        }}>
          <CircularProgress size={64} thickness={4} sx={{ color: 'white' }} />
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'white', letterSpacing: 1.5 }}>SETTING UP TRACKER...</Typography>
        </Box>
      )}

      <style>{`
        @keyframes pulse-dot {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 2s linear infinite;
        }
      `}</style>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ borderRadius: 4, fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMonitor;