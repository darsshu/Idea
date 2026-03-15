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
  Divider,
  InputAdornment,
  useMediaQuery,
  Fade,
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
    <Box sx={{ pb: 8, px: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 6,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{ p: 0.8, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', color: 'white' }}>
              <EventIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 1.5 }}>
              EVENT MANAGEMENT
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1.5px', fontSize: { xs: '2.2rem', md: '3rem' } }}>
            Published <Box component="span" sx={{ color: 'primary.main' }}>Matches</Box>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', md: 'auto' } }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'background.paper' }}>
            <StatsIcon color="primary" />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>{events.length}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Total Published</Typography>
            </Box>
          </Paper>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 4, px: 4, fontWeight: 800, textTransform: 'none', height: 64 }}
          >
            Create Event
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Events Grid */}
      {fetching ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 5 }} />
            </Grid>
          ))}
        </Grid>
      ) : events.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <Grid container spacing={3}>
            {events.map((event, index) => (
              <Grid item xs={12} sm={6} lg={4} key={event._id} sx={{ display: 'flex' }}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{ width: '100%', display: 'flex' }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 5,
                      overflow: 'hidden',
                      position: 'relative',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderColor: 'primary.main',
                        '& .delete-btn': { opacity: 1 }
                      }
                    }}
                  >
                    {/* Card Media Section */}
                    <Box sx={{ position: 'relative', pt: '60%' }}>
                      <CardMedia
                        component="img"
                        image={event.imageUrl}
                        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(255,255,255,0.9)', px: 1.5, py: 0.5, borderRadius: 2, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, color: 'success.main' }}>LIVE</Typography>
                      </Box>

                      {/* Delete Button */}
                      <IconButton
                        className="delete-btn"
                        onClick={() => handleDelete(event._id)}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          color: 'error.main',
                          opacity: isMobile ? 1 : 0,
                          transition: '0.2s',
                          '&:hover': { bgcolor: 'error.main', color: 'white' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.3, height: '2.6em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {event.title}
                      </Typography>

                      <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 3, borderStyle: 'dashed' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LinkIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                          <Typography variant="caption" noWrap sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            {event.eventUrl}
                          </Typography>
                        </Stack>
                      </Paper>

                      <Button
                        fullWidth
                        variant="contained"
                        href={event.eventUrl}
                        target="_blank"
                        startIcon={<LaunchIcon />}
                        sx={{ mt: 'auto', borderRadius: 3, py: 1.2, textTransform: 'none', fontWeight: 700 }}
                      >
                        Preview Match
                      </Button>
                    </CardContent>
                  </Card>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </AnimatePresence>
      ) : (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'grey.50', borderRadius: 8, border: '2px dashed', borderColor: 'divider' }}>
          <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>No Events Found</Typography>
          <Button onClick={() => setOpenDialog(true)} sx={{ mt: 2 }}>Create One Now</Button>
        </Box>
      )}

      {/* Dialog and Snackbar logic remains identical but with improved padding for mobile */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 5, p: { xs: 1, sm: 2 } } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Create New Event</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField fullWidth label="Event Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. India vs Australia" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField fullWidth label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
            <TextField fullWidth label="Target URL" name="eventUrl" value={formData.eventUrl} onChange={handleInputChange} placeholder="https://..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading} sx={{ borderRadius: 3, px: 4 }}>
            {loading ? <CircularProgress size={24} /> : 'Publish Now'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
      </Snackbar>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default AdminEvents;