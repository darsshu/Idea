import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  IconButton,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/Delete';

const ActiveMonitors = () => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/monitors`);
      setMonitors(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch monitors. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this monitor?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/monitor/${id}`);
        setMonitors(monitors.filter(m => m.id !== id));
      } catch (err) {
        setError('Failed to delete monitor.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'success';
      case 'Sold Out': return 'error';
      default: return 'warning';
    }
  };

  if (loading && monitors.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Active Monitors</Typography>
        <IconButton onClick={fetchMonitors} color="primary" title="Refresh">
          <RefreshIcon />
        </IconButton>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {monitors.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No active monitors found. Start one on the Home page!</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Match / URL</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Checked</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monitors.map((monitor) => (
                <TableRow key={monitor.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {monitor.matchName || 'Detecting match name...'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {monitor.url}
                    </Typography>
                  </TableCell>
                  <TableCell>{monitor.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={monitor.status} 
                      color={getStatusColor(monitor.status)} 
                      size="small" 
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(monitor.lastChecked).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Link href={monitor.url} target="_blank" rel="noopener noreferrer">
                        <IconButton size="small" color="primary" title="Open Link">
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </Link>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDelete(monitor.id)}
                        title="Delete Monitor"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ActiveMonitors;
