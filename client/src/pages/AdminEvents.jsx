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
  Fade
} from '@mui/material';
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
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{ p: 0.8, borderRadius: 2, bgcolor: 'primary.main', display: 'flex', color: 'white' }}>
              <EventIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 1.5 }}>
              EVENT MANAGEMENT
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-1.5px', mb: 1 }}>
            Published <Box component="span" sx={{ color: 'primary.main' }}>Matches</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 600 }}>
            Configure the cricket matches available for users to track. Ensure all image URLs are high quality for the best experience.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider', 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2,
              minWidth: 180
            }}
          >
            <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(25, 118, 210, 0.1)', color: 'primary.main' }}>
              <StatsIcon />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1 }}>{events.length}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Active Events</Typography>
            </Box>
          </Paper>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ 
              borderRadius: 4, 
              px: 4, 
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(25, 118, 210, 0.25)',
              height: 64,
              flexGrow: { xs: 1, sm: 0 }
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
                <Box sx={{ width: '100%', pt: '56.25%', bgcolor: 'action.hover' }} />
                <Box sx={{ p: 4 }}>
                  <Box sx={{ width: '80%', height: 24, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }} />
                  <Box sx={{ width: '100%', height: 40, bgcolor: 'action.hover', borderRadius: 2 }} />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : events.length > 0 ? (
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} lg={4} key={event._id}>
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
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    borderColor: 'primary.main',
                    '& .delete-btn': { opacity: 1 }
                  }
                }}
              >
                <Box sx={{ position: 'relative', pt: '60%', overflow: 'hidden', bgcolor: 'action.hover' }}>
                  <CardMedia
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
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12,
                    zIndex: 2,
                    opacity: { xs: 1, md: 0 },
                    transition: 'opacity 0.2s ease',
                  }} className="delete-btn">
                    <Tooltip title="Remove Event">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(event._id);
                        }}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.95)', 
                          color: 'error.main',
                          backdropFilter: 'blur(4px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          '&:hover': { bgcolor: 'error.main', color: 'white' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 800, 
                    mb: 1, 
                    lineHeight: 1.3,
                    height: '2.6em', // Fixed height for 2 lines
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    fontSize: '1.05rem'
                  }}>
                    {event.title}
                  </Typography>
                  
                  <Box sx={{ mb: 2.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        mb: 0.5
                      }}
                    >
                      Booking URL
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="primary"
                      sx={{ 
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.8rem'
                      }}
                    >
                      {event.eventUrl}
                    </Typography>
                  </Box>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="medium"
                    startIcon={<LaunchIcon sx={{ fontSize: 18 }} />}
                    href={event.eventUrl}
                    target="_blank"
                    sx={{ 
                      mt: 'auto',
                      borderRadius: 2.5, 
                      fontWeight: 700, 
                      bgcolor: 'action.hover',
                      color: 'text.primary',
                      boxShadow: 'none',
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                    }}
                  >
                    Open Booking Page
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          py: 12, 
          px: 4,
          bgcolor: 'action.hover', 
          borderRadius: 8, 
          border: '2px dashed', 
          borderColor: 'divider' 
        }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: 'background.paper', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
          }}>
            <EventIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>No active events found</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Get started by creating your first match notification using the button below.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}
          >
            Create New Event
          </Button>
        </Box>
      )}

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

