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
import SensorsIcon from '@mui/icons-material/Sensors';
import { Link as RouterLink } from 'react-router-dom';

const ActiveMonitors = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleDelete = async (id) => {
    if (window.confirm('Stop monitoring this event?')) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        await axios.delete(`${apiUrl}/api/monitor/${id}`);
        setMonitors(monitors.filter(m => (m._id || m.id) !== id));
      } catch (err) {
        setError('Failed to remove monitor.');
      }
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{
              fontWeight: 900,
              mb: 1,
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              History
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Tracking {monitors.length} active match ticket events
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={fetchMonitors}
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
                '&:hover': { bgcolor: 'primary.main', color: 'white', transform: 'rotate(180deg)' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      {error && (
        <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {monitors.length === 0 ? (
        <Fade in={true} timeout={1000}>
          <Card
            elevation={0}
            sx={{
              p: 8,
              textAlign: 'center',
              bgcolor: 'background.paper',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 6
            }}
          >
            <Box sx={{ mb: 3 }}>
              <SensorsIcon sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.5 }} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>No Monitors Active</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              You haven't started tracking any match yet. Head back to the home page to start!
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/"
              startIcon={<SportsCricketIcon />}
              size="large"
            >
              Start Tracking
            </Button>
          </Card>
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
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'stretch', md: 'center' },
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                      background: `linear-gradient(to bottom, ${getStatusColor(monitor.status)}, ${theme.palette.secondary.main})`,
                      opacity: 0.8
                    },
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'primary.main',
                      boxShadow: (theme) => theme.palette.mode === 'light' ? '0 20px 40px -10px rgba(0,0,0,0.1)' : '0 20px 40px -10px rgba(0,0,0,0.5)',
                    }
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    width: '100%',
                    p: { xs: 3, md: 4 },
                    pl: { xs: 4, md: 5 }, // Account for the colored bar on left
                    gap: { xs: 3, md: 4 }
                  }}>

                    {/* Column 1: Match Name and Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1 }}>
                      <Avatar
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          width: { xs: 48, md: 56 },
                          height: { xs: 48, md: 56 },
                          boxShadow: '0 8px 16px rgba(25,118,210,0.2)',
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'rotate(15deg) scale(1.1)' }
                        }}
                      >
                        <SportsCricketIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.3px', color: 'text.primary', mb: 0.5 }}>
                          {monitor.matchName}
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
                            '& .MuiChip-label': { px: 1.5 }
                          }}
                        />
                      </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />
                    <Divider sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }} />

                    {/* Column 2: Last Checked */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      minWidth: { md: '180px' },
                      py: { xs: 0, md: 1 }
                    }}>
                      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ position: 'absolute', width: 36, height: 36, borderRadius: '50%', bgcolor: 'primary.main', opacity: 0.1 }} />
                        <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary', zIndex: 1 }} />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Checked</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                          {new Date(monitor.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1 }} />
                    <Divider sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }} />

                    {/* Column 3: Actions */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      width: { xs: '100%', md: 'auto' }
                    }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<LaunchIcon sx={{ fontSize: 18 }} />}
                        href={monitor.url}
                        target="_blank"
                        sx={{
                          fontWeight: 800,
                          borderRadius: 3,
                          px: 3,
                          py: 1.2,
                          boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}40`,
                          '&:hover': {
                            boxShadow: (theme) => `0 8px 24px ${theme.palette.primary.main}60`,
                            transform: 'translateY(-2px)'
                          },
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
                          border: '2px solid',
                          borderColor: 'error.light',
                          borderRadius: 3,
                          p: 1.2,
                          '&:hover': { bgcolor: 'error.main', color: 'white', borderColor: 'error.main', transform: 'scale(1.1)' },
                          transition: 'all 0.2s',
                          bgcolor: 'background.paper',
                          zIndex: 10
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
    </Box>
  );
};

export default ActiveMonitors;
