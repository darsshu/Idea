import React, { useState, useEffect, useMemo } from 'react';
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
  Tooltip
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
import ConfirmationDialog from '../components/ConfirmationDialog';
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
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${apiUrl}/api/events/${deleteId}`);
      setSnackbar({ open: true, message: 'Event removed successfully', severity: 'success' });
      fetchEvents();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete event', severity: 'error' });
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 3
        }}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{
              p: 0.8,
              borderRadius: 2,
              bgcolor: 'rgba(25, 118, 210, 0.1)',
              display: 'flex'
            }}>
              <EventIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            </Box>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: 1 }}>
              EVENT MANAGEMENT
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{
            fontWeight: 900,
            letterSpacing: '-1.5px',
            fontSize: { xs: '1.75rem', md: '3rem' },
            background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Published <Box component="span" sx={{ WebkitTextFillColor: 'initial', background: 'transparent' }}>Matches</Box>
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: { xs: 1.5, sm: 2 },
          width: { xs: '100%', sm: 'auto' },
          alignItems: 'center'
        }}>


          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 3,
              px: { xs: 2, sm: 4 },
              fontWeight: 800,
              flex: 1,
              textTransform: 'none',
              height: { xs: 48, sm: 60 },
              fontSize: { xs: '0.85rem', sm: '1rem' },
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
              '&:hover': {
                boxShadow: '0 12px 24px rgba(25, 118, 210, 0.3)',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s'
            }}
          >
            Create Event
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 3,
              cursor: 'default',
              px: { xs: 2, sm: 4 },
              fontWeight: 800,
              flex: 1,
              textTransform: 'none',
              height: { xs: 48, sm: 60 },
              fontSize: { xs: '0.85rem', sm: '1rem' },
              whiteSpace: 'nowrap',
              // boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)',

            }}
          >
            Total Events: {events.length}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 6, opacity: 0.6 }} />

      <AnimatePresence mode="popLayout">
        <Grid container spacing={3} sx={{ justifyContent: 'center', }}>
          {events.map((event, index) => (
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

                    {/* Delete Action Overlay */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(event._id || event.id);
                      }}
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        backdropFilter: "blur(12px)",
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        color: "error.main",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        "&:hover": {
                          bgcolor: "error.main",
                          color: "white",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.3s ease",
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>

                    {/* Live Tracker Overlay Badge */}

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


                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </AnimatePresence>

      {/* Styled Components & Animations */}
      <style>{`
        @keyframes pulse-dot {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Create Event Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 6,
            p: { xs: 1, sm: 2 },
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>Create New Event</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>MATCH NOTIFICATION SETUP</Typography>
          </Box>
          <IconButton onClick={() => setOpenDialog(false)} size="small" sx={{ bgcolor: 'action.hover' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 0.5 }}>Match Title</Typography>
              <TextField
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. India vs Australia - Semi Final"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 0.5 }}>Banner Image URL</Typography>
              <TextField
                fullWidth
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://images.com/match.jpg"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, px: 0.5 }}>Booking Target URL</Typography>
              <TextField
                fullWidth
                name="eventUrl"
                value={formData.eventUrl}
                onChange={handleInputChange}
                placeholder="https://tickets.com/book"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 1 }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit" sx={{ fontWeight: 700, mr: 2 }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 3,
              px: 6,
              py: 1.5,
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(25, 118, 210, 0.25)'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Publish Now'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Match Event?"
        message="This action will remove the match from the public listing. This cannot be undone."
        confirmText="Delete Event"
        type="danger"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminEvents;