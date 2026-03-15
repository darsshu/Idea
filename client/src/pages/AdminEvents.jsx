import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Zoom,
  Divider,
  InputAdornment,
  useMediaQuery,
  Fade,
  Avatar,
  Skeleton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  AddLink as LinkIcon,
  Close as CloseIcon,
  EventNote as EventIcon,
  Image as ImageIcon,
  Analytics as StatsIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import axios from 'axios';

const AdminEvents = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLaptop = useMediaQuery(theme.breakpoints.down('lg'));

  const MotionBox = motion(Box);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: '', imageUrl: '', eventUrl: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${apiUrl}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
      setSnackbar({ open: true, message: 'Failed to load events', severity: 'error' });
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedData = {
      title: formData.title.trim(),
      imageUrl: formData.imageUrl.trim(),
      eventUrl: formData.eventUrl.trim()
    };

    if (!cleanedData.title || !cleanedData.imageUrl || !cleanedData.eventUrl) {
      setSnackbar({ open: true, message: 'Please fill all fields', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/events`, cleanedData);
      setSnackbar({ open: true, message: 'Event published successfully', severity: 'success' });
      setFormData({ title: '', imageUrl: '', eventUrl: '' });
      setOpenDialog(false);
      fetchEvents();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Failed to publish event', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event? This action cannot be undone.')) return;
    try {
      await axios.delete(`${apiUrl}/api/events/${id}`);
      setSnackbar({ open: true, message: 'Event removed', severity: 'success' });
      fetchEvents();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete event', severity: 'error' });
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 6,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on desktop
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        {/* Left Section: Title and Icon */}
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                p: 0.8,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                color: 'white',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
              }}
            >
              <EventIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 900,
                color: 'primary.main',
                letterSpacing: 1.5,
                lineHeight: 1,
              }}
            >
              EVENT MANAGEMENT
            </Typography>
          </Stack>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: '-1.5px',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } // Fluid typography
            }}
          >
            Published <Box component="span" sx={{ color: 'primary.main' }}>Matches</Box>
          </Typography>
        </Box>

        {/* Right Section: Stats and Action Button */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="stretch" // Ensures Paper and Button are the same height
          sx={{
            width: { xs: '100%', sm: 'auto' },
            height: { sm: 64 }, // Fixed height on larger screens
          }}
        >
          {/* Stats Paper */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex', // Visible on all but smallest screens, or keep 'none' if preferred
              alignItems: 'center',
              gap: 2,
              minWidth: { xs: 'auto', md: 160 },
              flexGrow: { xs: 1, sm: 0 },
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                bgcolor: 'rgba(25, 118, 210, 0.1)',
                color: 'primary.main',
                display: 'flex',
              }}
            >
              <StatsIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>
                {events.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Total
              </Typography>
            </Box>
          </Paper>

          {/* Action Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 4,
              px: { xs: 2, sm: 4 },
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 8px 24px rgba(25, 118, 210, 0.25)',
              flexGrow: { xs: 2, sm: 0 },
              whiteSpace: 'nowrap',
              '&:hover': {
                boxShadow: '0 12px 30px rgba(25, 118, 210, 0.35)',
              }
            }}
          >
            Create Event
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ mb: 6, opacity: 0.6 }} />

      {/* Events Grid */}
      {fetching ? (
        <Grid container spacing={4}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 6, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Box sx={{ width: '100%', pt: '65%', bgcolor: 'action.hover' }}>
                  <Skeleton variant="rectangular" sx={{ width: '100%', height: '100%' }} />
                </Box>
                <Box sx={{ p: 3 }}>
                  <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" height={24} sx={{ mb: 3 }} />
                  <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 3 }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : events.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <Grid container spacing={4}>
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} lg={4} key={event._id}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                        borderColor: 'primary.main',
                        '& .card-image': { transform: 'scale(1.1)' },
                        '& .delete-overlay': { opacity: 1 }
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '65%', overflow: 'hidden', bgcolor: 'action.hover' }}>
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
                          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />

                      {/* Status Badge */}
                      <Box sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 2,
                        backdropFilter: 'blur(10px)',
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        px: 1.5,
                        py: 0.7,
                        borderRadius: 2.5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: 'success.main', letterSpacing: 1, textTransform: 'uppercase' }}>
                          PUBLISHED
                        </Typography>
                      </Box>

                      {/* Delete Overlay */}
                      <Box className="delete-overlay" sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(4px)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: 3
                      }}>
                        <Tooltip title="Delete Match Event">
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(event._id);
                            }}
                            sx={{
                              borderRadius: 3,
                              fontWeight: 800,
                              textTransform: 'none',
                              px: 3,
                              py: 1,
                              boxShadow: '0 4px 15px rgba(211, 47, 47, 0.4)'
                            }}
                          >
                            Delete Event
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{
                        fontWeight: 900,
                        mb: 2,
                        lineHeight: 1.4,
                        fontSize: '1.1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.8em',
                        color: 'text.primary'
                      }}>
                        {event.title}
                      </Typography>

                      <Box sx={{
                        mb: 3,
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                        border: '1px dashed',
                        borderColor: 'divider'
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Target URL
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LinkIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'primary.main' }}>
                            {event.eventUrl}
                          </Typography>
                        </Stack>
                      </Box>

                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<LaunchIcon sx={{ fontSize: 18 }} />}
                        href={event.eventUrl}
                        target="_blank"
                        sx={{
                          mt: 'auto',
                          borderRadius: 3,
                          fontWeight: 800,
                          textTransform: 'none',
                          borderWidth: 2,
                          '&:hover': { borderWidth: 2, bgcolor: theme.palette.primary.main, color: 'white' }
                        }}
                      >
                        Preview Event
                      </Button>
                    </CardContent>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      ) : (
        <Box sx={{
          textAlign: 'center',
          py: 15,
          px: 4,
          bgcolor: 'background.paper',
          borderRadius: 8,
          border: '2px dashed',
          borderColor: 'divider',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.02)'
        }}>
          <Box sx={{
            width: 100,
            height: 100,
            borderRadius: 4,
            bgcolor: 'rgba(25, 118, 210, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 4,
            transform: 'rotate(-10deg)'
          }}>
            <EventIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>No Published Matches</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 500, mx: 'auto', fontWeight: 500, lineHeight: 1.6 }}>
            The list is currently empty. Use the dashboard to create and publish new cricket match notifications for your users.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 4,
              px: 6,
              py: 2,
              fontWeight: 800,
              boxShadow: '0 10px 30px rgba(25, 118, 210, 0.3)'
            }}
          >
            Create Your First Event
          </Button>
        </Box>
      )}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
      `}</style>

      {/* Create Event Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          sx: { borderRadius: 6, p: 2, border: '1px solid', borderColor: 'divider' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-1px' }}>
              Create <Box component="span" sx={{ color: 'primary.main' }}>Event</Box>
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
              Match Notification Setup
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDialog(false)} sx={{ bgcolor: 'action.hover' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 1 }}>Match Title</Typography>
              <TextField
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. India vs Pakistan - World Cup 2024"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color="primary" sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 1 }}>Banner Image Content</Typography>
              <TextField
                name="imageUrl"
                fullWidth
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Paste the link to the match image..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon color="primary" sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 1 }}>Booking Link (URL)</Typography>
              <TextField
                name="eventUrl"
                fullWidth
                value={formData.eventUrl}
                onChange={handleInputChange}
                placeholder="Paste the official booking page link..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon color="primary" sx={{ fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontWeight: 700, color: 'text.secondary', mr: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              borderRadius: 4,
              py: 2,
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.25)'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Publish Notification'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 4, fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminEvents;

