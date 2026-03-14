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
  ThemeProvider 
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import theme from './theme';
import Home from './pages/Home';
import ActiveMonitors from './pages/ActiveMonitors';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>Loading...</Box>;
  return token ? children : <Navigate to="/login" />;
};

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" elevation={0} sx={{ background: 'linear-gradient(90deg, #1a237e 0%, #0d47a1 100%)' }}>
      <Toolbar>
        <SportsCricketIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Cricket Notifier
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/monitors">Monitors</Button>
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 'medium' }}>
                Hi, {user.name}
              </Typography>
              <Button color="secondary" variant="contained" size="small" onClick={logout} sx={{ borderRadius: 2 }}>
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

function AppContent() {
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7fa' }}>
      <NavBar />

      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: '#e0e0e0', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Cricket Ticket Notifier. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
