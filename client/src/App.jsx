import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Button, 
  Box, 
  CssBaseline, 
  IconButton,
  useTheme,
  CircularProgress
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Home from './pages/Home';
import AddMonitor from './pages/AddMonitor';
import ActiveMonitors from './pages/ActiveMonitors';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeContextProvider, useColorMode } from './context/ThemeContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </Box>
  );
  return token ? children : <Navigate to="/login" />;
};

const NavBar = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const colorMode = useColorMode();

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <SportsCricketIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 800, 
              color: 'text.primary', 
              textDecoration: 'none',
              letterSpacing: '-0.5px'
            }}
          >
            CRICKET<span style={{ color: theme.palette.primary.main }}>NOTIFIER</span>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {user ? (
              <>
                <Button color="inherit" component={Link} to="/" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>Home</Button>
                <Button color="inherit" component={Link} to="/add-monitor" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>Add Monitor</Button>
                <Button color="inherit" component={Link} to="/monitors" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>My Monitors</Button>
                <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' }, fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Button 
                    color="primary" 
                    variant="contained" 
                    size="small" 
                    onClick={logout} 
                    sx={{ boxShadow: 'none' }}
                  >
                    Logout
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button variant="contained" component={Link} to="/register">Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function AppContent() {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease'
      }}
    >
      <NavBar />

      <Container component="main" maxWidth={false} sx={{ mt: 6, mb: 6, flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/monitors" element={
            <PrivateRoute>
              <ActiveMonitors />
            </PrivateRoute>
          } />
          <Route path="/add-monitor" element={
            <PrivateRoute>
              <AddMonitor />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>

      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          px: 2, 
          mt: 'auto', 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper' 
        }}
      >
        <Container maxWidth={false}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Cricket Ticket Notifier. Built with Passion for Fans.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
