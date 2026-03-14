import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Fade,
  Slide,
  Grid,
  Paper,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SpeedIcon from '@mui/icons-material/Speed';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Home = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const features = [
    { icon: <LinkIcon color="primary" />, title: 'Paste URL', desc: 'Copy link from BookMyShow' },
    { icon: <SpeedIcon color="primary" />, title: 'Real-time', desc: 'Checks Every 60 Seconds' },
    { icon: <NotificationsActiveIcon color="primary" />, title: 'Instantly', desc: 'Email Alert on Availability' },
  ];

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      <Fade in={showContent} timeout={1000}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3
            }}
          >
            Never Miss a Match
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 500, mb: 5, lineHeight: 1.6 }}>
            Automated ticket monitoring for your favorite cricket matches and events. 
            We continuously check for ticket availability so you don't have to.
          </Typography>
          <Button 
            component={Link} 
            to="/add-monitor" 
            variant="contained" 
            color="primary"
            size="large" 
            startIcon={<AddCircleOutlineIcon />}
            sx={{ py: 1.5, px: 4, borderRadius: 2, fontSize: '1.1rem' }}
          >
            Create Monitor Form
          </Button>
        </Box>
      </Fade>

      <Slide direction="up" in={showContent} timeout={800}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  height: '100%',
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                  }
                }}
              >
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 2, 
                  borderRadius: '50%', 
                  bgcolor: (theme) => theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark', 
                  color: 'white',
                  mb: 3,
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Slide>

      <Fade in={showContent} timeout={1500}>
        <Box sx={{ mt: 10, textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            How it works
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
            Our platform allows you to submit any BookMyShow event URL. We then run automated background checks every minute to monitor the event's ticket availability status. The moment tickets go on sale or become available from cancellations, our notification engine immediately dispatches an alert to your submitted email address, ensuring you're always the first to know and book. 
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default Home;
