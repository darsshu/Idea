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

  const formatPerfectTime = (dateString) => {
    if (!dateString) return 'Never checked';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Relative time part
    let relativeTime = '';
    if (diffInSeconds < 60) relativeTime = 'Just now';
    else if (diffInSeconds < 3600) relativeTime = `${Math.floor(diffInSeconds / 60)}m ago`;
    else if (diffInSeconds < 86400) relativeTime = `${Math.floor(diffInSeconds / 3600)}h ago`;
    else relativeTime = `${Math.floor(diffInSeconds / 86400)}d ago`;

    // Exact time part
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const dateOptions = { day: '2-digit', month: 'short' };

    const timeStr = date.toLocaleTimeString([], timeOptions);
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `${timeStr} `;
    }

    const dateStr = date.toLocaleDateString([], dateOptions);
    return `${dateStr}, ${timeStr} (${relativeTime})`;
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
    <Box
      sx={{

        py: 4,
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
        <Stack spacing={2} sx={{ width: '100%' }}>
          {monitors.map((monitor, index) => (
            <Grow in={true} key={monitor._id || monitor.id} timeout={500 + (index * 100)}>
              <Card
                elevation={0}
                sx={{
                  width: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 4,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    transform: 'scale(1.005)',
                    boxShadow: theme.palette.mode === 'light' ? '0 12px 40px rgba(0,0,0,0.08)' : '0 12px 40px rgba(0,0,0,0.5)',
                    borderColor: getStatusColor(monitor.status),
                  }
                }}
              >
                <Box sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'stretch', md: 'center' },
                  width: '100%',
                }}>
                  {/* Status Indicator Bar */}
                  <Box sx={{
                    width: { xs: '100%', md: '8px' },
                    height: { xs: '8px', md: 'auto' },
                    alignSelf: 'stretch',
                    bgcolor: getStatusColor(monitor.status),
                    opacity: 0.8
                  }} />

                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    p: { xs: 2.5, md: 3 },
                    gap: { xs: 3, md: 4 }
                  }}>

                    {/* Left: Info Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1, minWidth: 0 }}>
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          width: { xs: 52, md: 60 },
                          height: { xs: 52, md: 60 },
                          boxShadow: '0 8px 16px rgba(25,118,210,0.2)',
                          flexShrink: 0
                        }}
                      >
                        <SportsCricketIcon fontSize="large" sx={{ fontSize: { xs: 28, md: 32 } }} />
                      </Avatar>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          noWrap
                          title={monitor.matchName}
                          sx={{
                            fontWeight: 800,
                            lineHeight: 1.2,
                            color: 'text.primary',
                            mb: 1,
                            fontSize: { xs: '0.75rem', sm: '1rem', md: '1.75rem' },
                            letterSpacing: '-0.3px'
                          }}
                        >
                          {monitor.matchName || 'Cricket Match Event'}
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Chip
                            size="small"
                            label={monitor.status}
                            sx={{
                              bgcolor: `${getStatusColor(monitor.status)}15`,
                              color: getStatusColor(monitor.status),
                              fontWeight: 800,
                              border: `1px solid ${getStatusColor(monitor.status)}40`,
                              height: 24,
                              px: 0.5,
                              '& .MuiChip-label': { px: 1.5 }
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <LinkIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.7 }} noWrap>
                              {new URL(monitor.url).hostname}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>

                    {/* Middle: Stats/Time */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'row', md: 'column' },
                      alignItems: { xs: 'center', md: 'flex-start' },
                      gap: { xs: 4, md: 0.5 },
                      px: { md: 4 },
                      borderLeft: { md: `1px solid ${theme.palette.divider}` },
                      minWidth: { md: 180 }
                    }}>
                      <Typography variant="caption" color="text.disabled" sx={{
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '0.7rem',
                        mb: { md: 0.5 }
                      }}>
                        Last Updated
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.85rem' }}>
                          {formatPerfectTime(monitor.lastChecked)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right: Actions */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      width: { xs: '100%', md: 'auto' }
                    }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LaunchIcon />}
                        href={monitor.url}
                        target="_blank"
                        fullWidth
                        sx={{
                          fontWeight: 800,
                          borderRadius: 3,
                          px: 4,
                          py: 1.2,
                          textTransform: 'none',
                          boxShadow: '0 4px 14px rgba(25,118,210,0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(25,118,210,0.4)',
                          }
                        }}
                      >
                        View Event
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(monitor._id || monitor.id)}
                        sx={{
                          bgcolor: 'error.lighter',
                          borderRadius: 3,
                          p: 1.5,
                          color: 'error.main',
                          border: '1px solid currentColor',
                          '&:hover': { bgcolor: 'error.main', color: 'white' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grow>
          ))}
        </Stack>
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
