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
  Paper
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
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-1.5px', color: 'text.primary', mb: 1 }}>
            Admin <Box component="span" sx={{ color: 'error.main' }}>Dashboard</Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Manage match notifications and system events
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Card sx={{ px: 3, py: 1.5, borderRadius: 4, bgcolor: 'rgba(211, 47, 47, 0.05)', border: '1px solid rgba(211, 47, 47, 0.1)' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'error.main', textTransform: 'uppercase' }}>Total Events</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{events.length}</Typography>
          </Card>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        {/* Form Section */}
        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 5,
              border: '1px solid',
              borderColor: 'divider',
              position: 'sticky',
              top: 100
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddPhotoAlternateIcon sx={{ color: 'error.main' }} /> Add New Event
            </Typography>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Event Title"
                  name="title"
                  fullWidth
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. India vs Pakistan"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <TextField
                  label="Image URL"
                  name="imageUrl"
                  fullWidth
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <TextField
                  label="Event URL"
                  name="eventUrl"
                  fullWidth
                  value={formData.eventUrl}
                  onChange={handleInputChange}
                  placeholder="https://match-center.com/..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddPhotoAlternateIcon />}
                  sx={{
                    borderRadius: 3,
                    py: 1.8,
                    fontWeight: 700,
                    boxShadow: '0 8px 16px rgba(211, 47, 47, 0.2)'
                  }}
                >
                  {loading ? 'Adding...' : 'Publish Event'}
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid>

        {/* List Section */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Active Events</Typography>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} key={event._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={event.imageUrl}
                    alt={event.title}
                  />
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" fontWeight={800} noWrap sx={{ mb: 0.5 }}>{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2, fontStyle: 'italic' }}>{event.eventUrl}</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(event._id)}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {events.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 10, textAlign: 'center', borderRadius: 5, border: '1px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
                  <Typography color="text.secondary">No events created yet.</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 3, fontWeight: 600 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminEvents;
