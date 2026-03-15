import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Fade,
  Grow,
  Button,
  useTheme,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LinkIcon from '@mui/icons-material/Link';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import HistoryIcon from '@mui/icons-material/History';
import SensorsIcon from '@mui/icons-material/Sensors';
import { Link as RouterLink } from 'react-router-dom';
import ConfirmationDialog from '../components/ConfirmationDialog';

const ActiveMonitors = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [monitorToDelete, setMonitorToDelete] = useState(null);
  const theme = useTheme();

  const fetchMonitors = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await axios.get(`${apiUrl}/api/monitors`);
      setMonitors(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to fetch monitors. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 60000); // Refresh every 1m
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id) => {
    setMonitorToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!monitorToDelete) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      await axios.delete(`${apiUrl}/api/monitor/${monitorToDelete}`);
      setMonitors(monitors.filter(m => (m._id || m.id) !== monitorToDelete));
      setError(null);
    } catch (err) {
      setError('Failed to remove monitor.');
    } finally {
      setMonitorToDelete(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return theme.palette.success.main;
      case 'Sold Out': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  if (loading && monitors.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', gap: 2 }}>
        <CircularProgress thickness={5} size={60} />
        <Typography variant="h6" color="text.secondary">Fetching your monitors...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Fade in={true} timeout={800}>
        <Box sx={{ width: '100%', mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'rgba(25, 118, 210, 0.1)',
              display: 'flex'
            }}>
              <HistoryIcon sx={{ fontSize: { xs: 24, md: 30 }, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" sx={{
              fontWeight: 900,
              background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px'
            }}>
              Tracked <span style={{ WebkitTextFillColor: 'initial', background: 'transparent' }}>History</span>
            </Typography>
          </Box>

          <Tooltip title="Refresh Data">
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
          </Tooltip>
        </Box>
      </Fade>

      <Divider sx={{ mb: 2, opacity: 0.6 }} />

      {monitors.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 600, opacity: 0.8 }}>
          Tracking <span style={{ color: theme.palette.primary.main }}>{monitors.length} active</span> match ticket events
        </Typography>
      )}

      {error && (
        <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {monitors.length === 0 ? (
        <Fade in={true} timeout={1000}>
          <Box
            sx={{
              py: 10,
              px: 3,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              borderRadius: 6,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              mt: 4
            }}
          >
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              <SensorsIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.5px' }}>
              No Data Found
            </Typography>


          </Box>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {monitors.map((monitor, index) => (
            <Grid item xs={12} key={monitor._id || monitor.id}>
              <Grow in={true} timeout={500 + (index * 100)}>
                <Card
                  elevation={0}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '6px',
                      height: '100%',
                      background: getStatusColor(monitor.status),
                      opacity: 0.9
                    },
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: theme.palette.mode === 'light' ? '0 10px 30px rgba(0,0,0,0.06)' : '0 10px 30px rgba(0,0,0,0.4)',
                      borderColor: getStatusColor(monitor.status),
                    }
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    width: '100%',
                    p: 2.5,
                    pl: 3.5, // Space for the left colored bar
                    gap: { xs: 2.5, md: 4 }
                  }}>

                    {/* Column 1: Icon, Match Name, and Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1, minWidth: 0, width: '100%' }}>
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          width: { xs: 48, md: 54 },
                          height: { xs: 48, md: 54 },
                          boxShadow: '0 4px 12px rgba(25,118,210,0.15)',
                          flexShrink: 0
                        }}
                      >
                        <SportsCricketIcon fontSize="medium" />
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography
                          variant="h6"
                          noWrap
                          title={monitor.matchName || 'Cricket Match Event'}
                          sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: 'text.primary',
                            mb: 0.5,
                            width: '100%',
                            fontSize: '1rem'
                          }}
                        >
                          {monitor.matchName || 'Cricket Match Event'}
                        </Typography>
                        <Chip
                          size="small"
                          label={monitor.status}
                          sx={{
                            bgcolor: `${getStatusColor(monitor.status)}15`,
                            color: getStatusColor(monitor.status),
                            fontWeight: 800,
                            border: `1px solid ${getStatusColor(monitor.status)}40`,
                            px: 1,
                            height: 24,
                            '& .MuiChip-label': { px: 1.5 },
                            marginTop: '2px'
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Column 2: Last Checked */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      flexShrink: 0,
                      borderLeft: { md: `1px solid ${theme.palette.divider}` },
                      borderTop: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
                      pt: { xs: 2, md: 0 },
                      pl: { md: 4 },
                      width: { xs: '100%', md: 'auto' }
                    }}>
                      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ position: 'absolute', width: 32, height: 32, borderRadius: '50%', border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.default' }} />
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary', zIndex: 1 }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.65rem' }}>
                          Last Checked
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.85rem' }}>
                          {new Date(monitor.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Column 3: Actions */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      flexShrink: 0,
                      width: { xs: '100%', md: 'auto' },
                      pl: { md: 2 }
                    }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                        href={monitor.url}
                        target="_blank"
                        disableElevation
                        sx={{
                          fontWeight: 800,
                          borderRadius: 2,
                          px: 2.5,
                          py: 0.8,
                          transition: 'all 0.2s',
                          flex: { xs: 1, md: 'none' }
                        }}
                      >
                        Visit
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(monitor._id || monitor.id)}
                        aria-label="Delete Monitor"
                        sx={{
                          border: '1px solid',
                          borderColor: 'error.light',
                          borderRadius: 2,
                          p: '6px',
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.main', color: 'white', borderColor: 'error.main' },
                          transition: 'all 0.2s'
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                  </Box>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Stop Monitoring?"
        message="Are you sure you want to stop tracking this match? You will no longer receive notifications for it."
        confirmText="Stop Monitoring"
        cancelText="Keep Tracking"
        type="danger"
      />
    </Box>
  );
};

export default ActiveMonitors;
