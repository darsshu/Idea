import React from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
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
  CircularProgress,
  Stack,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Home from './pages/Home';
import AddMonitor from './pages/AddMonitor';
import ActiveMonitors from './pages/ActiveMonitors';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminEvents from './pages/AdminEvents';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
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

const AdminRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </Box>
  );
  return token && user?.role === 'admin' ? children : <Navigate to="/" />;
};

const NavBar = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const colorMode = useColorMode();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(18,18,18,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>
          
          {/* Logo Section */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Box sx={{ 
              p: 1.2, 
              borderRadius: 3, 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              mr: 2,
              color: 'white',
              boxShadow: '0 4px 15px rgba(25,118,210,0.3)'
            }}>
              <SportsCricketIcon sx={{ fontSize: 26 }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                color: 'text.primary',
                letterSpacing: '-0.3px',
                fontSize: '1.1rem',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              CRICKET<span style={{ color: theme.palette.primary.main }}>NOTIFIER</span>
            </Typography>
          </Box>

          {/* Navigation Links (Center) */}
          {user && (
            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <Button component={Link} to="/" sx={{ color: 'text.primary', fontWeight: 600, px: 2, py: 1, borderRadius: 8, '&:hover': { bgcolor: 'action.hover' } }}>Home</Button>
              <Button component={Link} to="/add-monitor" sx={{ color: 'text.primary', fontWeight: 600, px: 2, py: 1, borderRadius: 8, '&:hover': { bgcolor: 'action.hover' } }}>Upcoming Match</Button>
              <Button component={Link} to="/monitors" sx={{ color: 'text.primary', fontWeight: 600, px: 2, py: 1, borderRadius: 8, '&:hover': { bgcolor: 'action.hover' } }}>History</Button>
              {user.role === 'admin' && (
                <Button component={Link} to="/admin/events" sx={{ color: 'text.primary', fontWeight: 600, px: 2, py: 1, borderRadius: 8, '&:hover': { bgcolor: 'action.hover' } }}>Admin</Button>
              )}
            </Stack>
          )}

          {/* Actions / User Profile (Right) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={colorMode.toggleColorMode} sx={{ color: 'text.primary', bgcolor: 'action.hover', width: 40, height: 40 }}>
              {theme.palette.mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>

            {user ? (
              <>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    cursor: 'pointer', 
                    p: 0.5, 
                    pr: 2.5, 
                    borderRadius: 8, 
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' } 
                  }} 
                  onClick={handleMenu}
                >
                  <Avatar sx={{ width: 32, height: 32, background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, fontSize: '0.875rem', fontWeight: 700, color: 'white' }}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                  <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600, color: 'text.primary' }}>
                    {user.name}
                  </Typography>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{ elevation: 4, sx: { mt: 1.5, minWidth: 180, borderRadius: 3, padding: 1, border: '1px solid', borderColor: 'divider' } }}
                >
                  <MenuItem component={Link} to="/monitors" onClick={handleClose} sx={{ borderRadius: 2, mb: 0.5, py: 1.5, fontWeight: 500 }}>History</MenuItem>
                  <MenuItem component={Link} to="/add-monitor" onClick={handleClose} sx={{ borderRadius: 2, mb: 1, py: 1.5, fontWeight: 500, display: { md: 'none' } }}>Upcoming Match</MenuItem>
                  <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 1 }} />
                  <MenuItem onClick={() => { handleClose(); logout(); }} sx={{ borderRadius: 2, color: 'error.main', py: 1.5, fontWeight: 600 }}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" spacing={1.5}>
                <Button component={Link} to="/login" sx={{ color: 'text.primary', fontWeight: 600, borderRadius: 8, px: 3, py: 1 }}>Log In</Button>
                <Button component={Link} to="/register" variant="contained" color="primary" sx={{ borderRadius: 8, px: 3, py: 1, fontWeight: 700, boxShadow: '0 4px 14px rgba(25,118,210,0.4)', '&:hover': { boxShadow: '0 6px 20px rgba(25,118,210,0.6)' } }}>Sign Up</Button>
              </Stack>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function AppContent() {
  const theme = useTheme();
  const location = useLocation();
  
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
      {/* Conditionally hide NavBar for admin routes */}
      {!location.pathname.startsWith('/admin') && <NavBar />}

      <Box component="main" sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        width: '100%',
      }}>
        <Routes>
          <Route path="/login" element={
            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, flexGrow: 1, display: 'flex' }}><Login /></Container>
          } />
          <Route path="/register" element={
            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, flexGrow: 1, display: 'flex' }}><Register /></Container>
          } />
          <Route path="/admin" element={
            <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 } }}><AdminLogin /></Container>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/monitors" element={
            <PrivateRoute>
              <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
                <ActiveMonitors />
              </Container>
            </PrivateRoute>
          } />
          <Route path="/add-monitor" element={
            <PrivateRoute>
              <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
                <AddMonitor />
              </Container>
            </PrivateRoute>
          } />
          
          {/* Admin Routes with Layout */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="*" element={<Navigate to="events" />} />
                </Routes>
              </AdminLayout>
            </AdminRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>

      {/* Conditionally hide Footer for admin routes */}
      {!location.pathname.startsWith('/admin') && (
        <Box 
          component="footer" 
          sx={{ 
            pt: 5,
            pb: 4, 
            px: 2, 
            mt: 'auto', 
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            position: 'relative',
            zIndex: 2
          }}
        >
          <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, opacity: 0.9 }}>
              <SportsCricketIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              <Typography variant="body2" sx={{ fontWeight: 800, letterSpacing: '-0.3px' }}>CRICKET<Box component="span" sx={{color: 'primary.main'}}>NOTIFIER</Box></Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
              © {new Date().getFullYear()} All rights reserved. Built with Passion for Fans.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button size="small" sx={{ color: 'text.secondary', fontWeight: 600, minWidth: 'auto', p: 0, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}>Terms</Button>
              <Button size="small" sx={{ color: 'text.secondary', fontWeight: 600, minWidth: 'auto', p: 0, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}>Privacy</Button>
              <Button size="small" sx={{ color: 'text.secondary', fontWeight: 600, minWidth: 'auto', p: 0, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}>Contact</Button>
            </Stack>
          </Container>
        </Box>
      )}
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
