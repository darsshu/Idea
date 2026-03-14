import React from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  Typography, 
  Stack, 
  Divider,
  useTheme 
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  NotificationsActive as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ p: 3, borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
      <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}.main`, color: 'white', display: 'flex' }}>
        {icon}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
    <Divider sx={{ my: 2, opacity: 0.5 }} />
    <Stack direction="row" alignItems="center" spacing={1}>
      <TrendingUpIcon sx={{ color: 'success.main', fontSize: 20 }} />
      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
        {trend}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
        since last week
      </Typography>
    </Stack>
  </Card>
);

const AdminDashboard = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-1px', mb: 1 }}>
          System Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Welcome back, Admin. Here's what's happening today.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Events" 
            value="24" 
            icon={<EventIcon />} 
            color="primary" 
            trend="+12%" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Users" 
            value="1,284" 
            icon={<PeopleIcon />} 
            color="secondary" 
            trend="+5.4%" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Notifications" 
            value="8,402" 
            icon={<NotificationsIcon />} 
            color="error" 
            trend="+18%" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="System Load" 
            value="24%" 
            icon={<SpeedIcon />} 
            color="info" 
            trend="-2%" 
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ p: 4, borderRadius: 5, border: '1px solid', borderColor: 'divider', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
            <Stack spacing={2} alignItems="center">
              <AnalyticsIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.secondary" fontWeight={700}>Activity Analytics Coming Soon</Typography>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: 5, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>Recent System Logs</Typography>
            <Stack spacing={2}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: i % 2 === 0 ? 'success.main' : 'warning.main' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={700}>System Backup #{i}42</Typography>
                    <Typography variant="caption" color="text.secondary">Completed 12 minutes ago</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
