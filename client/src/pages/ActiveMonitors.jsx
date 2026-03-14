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
        setMonitors(monitors.filter(m => m.id !== id));
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
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>My Monitors</Typography>
            <Typography variant="body1" color="text.secondary">
              Managing {monitors.length} active ticket trackers
            </Typography>
          </Box>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={fetchMonitors} 
              sx={{ 
                bgcolor: 'background.paper', 
                border: '1px solid', 
                borderColor: 'divider',
                '&:hover': { bgcolor: 'primary.main', color: 'white' }
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
            <Grid item xs={12} md={6} key={monitor.id}>
              <Grow in={true} timeout={500 + (index * 100)}>
                <Card 
                  elevation={0}
                  sx={{ 
                    position: 'relative',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: (theme) => `0 12px 24px -10px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.5)'}`
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main', 
                          width: 48, 
                          height: 48,
                          boxShadow: '0 4px 10px rgba(46, 125, 50, 0.3)'
                        }}
                      >
                        <SportsCricketIcon />
                      </Avatar>
                      <Chip 
                        label={monitor.status} 
                        sx={{ 
                          bgcolor: `${getStatusColor(monitor.status)}20`, 
                          color: getStatusColor(monitor.status),
                          fontWeight: 700,
                          border: `1px solid ${getStatusColor(monitor.status)}40`,
                          px: 1
                        }} 
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}>
                      {monitor.matchName || 'Match Details Syncing...'}
                    </Typography>

                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Last Checked: <strong>{new Date(monitor.lastChecked).toLocaleTimeString()}</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LinkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          color="primary" 
                          sx={{ 
                            textOverflow: 'ellipsis', 
                            overflow: 'hidden', 
                            whiteSpace: 'nowrap',
                            maxWidth: '250px',
                            fontWeight: 500
                          }}
                        >
                          {monitor.url}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  
                  <CardActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: 'background.default', opacity: 0.9 }}>
                    <Button 
                      size="small" 
                      color="primary" 
                      startIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                      href={monitor.url}
                      target="_blank"
                      sx={{ fontWeight: 700 }}
                    >
                      Visit Event
                    </Button>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(monitor.id)}
                      sx={{ '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
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
