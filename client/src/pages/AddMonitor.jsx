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
      {/* Refined Hero Section */}
      <Box sx={{
        position: 'relative',
        pt: { xs: 4, md: 6 },
        pb: { xs: 4, md: 6 },
        mb: 6,
        borderRadius: { xs: 0, md: 6 },
        overflow: 'hidden',
        background: theme.palette.mode === 'light'
          ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(255, 255, 255, 0) 100%)'
          : 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(0, 0, 0, 0) 100%)',
        border: '1px solid',
        borderColor: 'divider',
      }}>
        {/* Abstract blur circles */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          filter: 'blur(80px)',
          opacity: 0.12,
          zIndex: 0
        }} />

        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <MotionBox
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{
                    p: 1.2,
                    borderRadius: 2.5,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)'
                  }}>
                    <NotificationsActiveIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 1.5 }}>
                    CRICKET TICKET MONITORING
                  </Typography>
                </Stack>

                <Typography variant="h2" sx={{
                  fontWeight: 900,
                  letterSpacing: '-1.5px',
                  mb: 2,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '3.75rem' },
                }}>
                  Upcoming <Box component="span" sx={{
                    color: 'primary.main',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>Matches</Box>
                </Typography>

              </MotionBox>
            </Grid>

            {/* Quick Stats Card */}
            {/* <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 6,
                  bgcolor: theme.palette.mode === 'light' ? 'white' : 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  textAlign: 'center',
                  minWidth: 220,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                }}
              >
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  bgcolor: 'primary.50',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <EventAvailableIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>
                  {fetching ? '...' : events.length}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Active Matches
                </Typography>
              </Paper>
            </Grid> */}
          </Grid>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ px: { xs: 0, md: 2 } }}>
        {/* Toolbar: Search and Filter */}
        <Box sx={{ mb: 4, px: { xs: 2, md: 0 } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Paper
              elevation={0}
              sx={{
                p: '4px 16px',
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', sm: 400 },
                borderRadius: 4,
                bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'border-color 0.2s',
                '&:focus-within': { borderColor: 'primary.main' }
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <InputBase
                sx={{ ml: 1, flex: 1, fontWeight: 600, fontSize: '0.95rem' }}
                placeholder="Search for a match..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <Box sx={{ fontSize: '0.7rem', fontWeight: 800, color: 'text.secondary' }}>CLEAR</Box>
                </IconButton>
              )}
            </Paper>

            <Stack direction="row" spacing={1.5}>
              <Tooltip title="Refresh List">
                <IconButton
                  onClick={fetchEvents}
                  disabled={fetching}
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    width: 44,
                    height: 44,
                    '&:hover': { bgcolor: 'primary.main', color: 'white' }
                  }}
                >
                  <RefreshIcon sx={{ fontSize: 20 }} className={fetching ? 'spin-animation' : ''} />
                </IconButton>
              </Tooltip>
              <IconButton sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', width: 44, height: 44 }}>
                <FilterListIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {/* Matches Grid */}
        <Box sx={{ px: { xs: 2, md: 0 } }}>
          {fetching ? (
            <Grid container spacing={3}>
              {[...Array(8)].map((_, i) => (
                <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                  <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 5, mb: 1.5 }} />
                  <Skeleton variant="text" width="90%" height={28} />
                  <Skeleton variant="text" width="60%" height={20} />
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