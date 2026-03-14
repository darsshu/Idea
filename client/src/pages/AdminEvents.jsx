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
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';

const AdminEvents = () => {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', imageUrl: '', eventUrl: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const apiUrl = import.meta.env.VITE_API_URL || '';

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
      fetchEvents();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add event', severity: 'error' });
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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4, textAlign: 'center' }}>
        Admin Panel - Manage Events
      </Typography>

      <Card sx={{ maxWidth: 600, mx: 'auto', mb: 6, p: 2, borderRadius: 4, elevation: 8 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>Add New Event</Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Event Title"
                name="title"
                fullWidth
                value={formData.title}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Image URL"
                name="imageUrl"
                fullWidth
                value={formData.imageUrl}
                onChange={handleInputChange}
                variant="outlined"
              />
              <TextField
                label="Event URL"
                name="eventUrl"
                fullWidth
                value={formData.eventUrl}
                onChange={handleInputChange}
                variant="outlined"
              />
              <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AddPhotoAlternateIcon />}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                Add Event
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Existing Events</Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card sx={{ borderRadius: 3, position: 'relative', overflow: 'hidden', height: '100%' }}>
              <CardMedia
                component="img"
                height="160"
                image={event.imageUrl}
                alt={event.title}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} noWrap>{event.title}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>{event.eventUrl}</Typography>
                <IconButton 
                  onClick={() => handleDelete(event._id)}
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': { bgcolor: 'error.light', color: 'white' }
                  }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminEvents;
