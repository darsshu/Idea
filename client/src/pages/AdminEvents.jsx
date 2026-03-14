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
  Zoom
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const AdminEvents = () => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ title: '', imageUrl: '', eventUrl: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
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
      setSnackbar({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/api/events`, cleanedData);
      setSnackbar({ open: true, message: 'Event added successfully', severity: 'success' });
      setFormData({ title: '', imageUrl: '', eventUrl: '' });
      setOpenDialog(false);
      fetchEvents();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || 'Failed to add event', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${apiUrl}/api/events/${id}`);
      setSnackbar({ open: true, message: 'Event deleted successfully', severity: 'success' });
      fetchEvents();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete event', severity: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-1.5px', color: 'text.primary', mb: 1 }}>
            Manage <Box component="span" sx={{ color: 'error.main' }}>Events</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Create and manage match notifications for your users
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Card sx={{ px: 3, py: 1.5, borderRadius: 4, bgcolor: 'rgba(211, 47, 47, 0.05)', border: '1px solid rgba(211, 47, 47, 0.1)', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'error.main', textTransform: 'uppercase' }}>Total Active</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{events.length}</Typography>
          </Card>
          
          <Tooltip title="Add New Event" TransitionComponent={Zoom}>
            <Button
              variant="contained"
              color="error"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ 
                borderRadius: 3, 
                px: 3, 
                py: 1.5, 
                fontWeight: 700,
                boxShadow: '0 8px 20px rgba(211, 47, 47, 0.3)',
                '&:hover': { boxShadow: '0 12px 25px rgba(211, 47, 47, 0.4)' }
              }}
            >
              Add Event
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {/* Active Events List */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          Active Events <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
        </Typography>
        
        <Grid container spacing={3}>
          {events.length > 0 ? (
            events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card
                  sx={{
                    borderRadius: 5,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                      borderColor: 'error.light'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.imageUrl}
                      alt={event.title}
                      sx={{ transition: '0.5s', '&:hover': { transform: 'scale(1.05)' } }}
                    />
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      zIndex: 2
                    }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(event._id)}
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.9)', 
                          color: 'error.main',
                          backdropFilter: 'blur(4px)',
                          '&:hover': { bgcolor: 'error.main', color: 'white' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5, lineHeight: 1.3 }}>{event.title}</Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                        display: 'block', 
                        mb: 2, 
                        fontStyle: 'italic',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {event.eventUrl}
                    </Typography>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="inherit"
                      size="small"
                      href={event.eventUrl}
                      target="_blank"
                      sx={{ borderRadius: 2, fontWeight: 600, borderColor: 'divider' }}
                    >
                      View Link
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 6, border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>No events created yet.</Typography>
                <Typography variant="body2" color="text.disabled">Click the "Add Event" button to get started.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Add Event Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 5, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '-0.5px' }}>
            New <Box component="span" sx={{ color: 'error.main' }}>Event</Box>
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)} size="small" sx={{ bgcolor: 'action.hover' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details below to publish a new notification for this event.
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Event Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. India vs Australia - 1st T20I"
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              label="Image URL"
              name="imageUrl"
              fullWidth
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/banner.jpg"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              label="Event URL"
              name="eventUrl"
              fullWidth
              value={formData.eventUrl}
              onChange={handleInputChange}
              placeholder="https://match-center.live/..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddPhotoAlternateIcon />}
            sx={{ 
              borderRadius: 3, 
              px: 4, 
              py: 1.2, 
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(211, 47, 47, 0.3)'
            }}
          >
            {loading ? 'Publishing...' : 'Publish Event'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 600 }}>{snackbar.message}</Alert>
      </Snackbar>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
          }
        `}
      </style>
    </Box>
  );
};

export default AdminEvents;
