import React from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Upcoming Match', icon: <EventIcon />, path: '/add-monitor' },
    { text: 'History', icon: <HistoryIcon />, path: '/monitors' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/admin/events' });
  }

  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: 'white'
      }}>
        <SportsCricketIcon />
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem' }}>NOTIFIER</Typography>
      </Box>
      <Divider />
      <List sx={{ p: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={handleDrawerToggle}
              selected={location.pathname === item.path}
              sx={{
                // borderRadius: 2,
                py: 1.5,
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'primary.main',
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  border: "none",
                  transform: 'scale(1.1)',
                  '& .MuiListItemIcon-root': { color: 'primary.main' }
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  color: 'primary.main',
                  fontWeight: 800,
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.12)' }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {user && (
        <Box sx={{ p: 1.5 }}>
          <ListItemButton
            onClick={() => { logout(); handleDrawerToggle(); }}
            sx={{ borderRadius: 2, color: 'error.main', py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700 }} />
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(18,18,18,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        zIndex: theme.zIndex.drawer + 1,
        width: '100%',
        top: 0,
        left: 0
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64, justifyContent: 'space-between' }}>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1, display: { md: 'none' }, color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}

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
          </Box>

          {/* Navigation Links (Center) */}
          {user && (
            <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {[
                { text: 'Home', path: '/' },
                { text: 'Upcoming Match', path: '/add-monitor' },
                { text: 'History', path: '/monitors' },
                ...(user.role === 'admin' ? [{ text: 'Admin', path: '/admin/events' }] : [])
              ].map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    disableRipple
                    sx={{
                      color: isActive ? "primary.main" : "text.primary",
                      fontWeight: isActive ? 800 : 600,
                      px: 2,
                      py: 1,
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                      background: "transparent",
                      position: "relative",
                      textTransform: "none",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",

                      "&:hover": {
                        background: "transparent",   // removes white hover box
                        boxShadow: "none",
                        color: "secondary.main",
                        transform: "scale(1.2)",
                      },

                      "&:focus": {
                        outline: "none",
                      },

                      "&:focus-visible": {
                        outline: "none",
                      },

                      "& .MuiTouchRipple-root": {
                        display: "none", // removes ripple
                      },

                      "&::after": isActive
                        ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "20%",
                          right: "20%",
                          height: "3px",
                          borderRadius: "10px",
                          background: (theme) =>
                            `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        }
                        : {},
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
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
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderRadius: '0 20px 20px 0' },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

function AppContent() {
  const { loading } = useAuth();
  const theme = useTheme();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.palette.mode === 'light' ? '#f8faff' : '#0a0a0a',
          gap: 3
        }}
      >
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: 'primary.main',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }}
          />
          <SportsCricketIcon
            sx={{
              position: 'absolute',
              fontSize: 24,
              color: 'primary.main',
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.5, transform: 'scale(0.8)' },
                '50%': { opacity: 1, transform: 'scale(1.1)' }
              }
            }}
          />
        </Box>
        <Stack alignItems="center" spacing={1}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '2px',
              color: 'text.primary',
              opacity: 0.8
            }}
          >
            NOTIFIER
          </Typography>
          <Box sx={{ width: 100, height: 2, bgcolor: 'primary.main', borderRadius: 1, opacity: 0.3 }} />
        </Stack>
      </Box>
    );
  }

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
      {/* Conditionally hide NavBar for auth and admin routes */}
      {!['/login', '/register', '/admin'].some(path => location.pathname.startsWith(path)) && <NavBar />}

      <Box 
        component="main" 
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          // Add padding top only when NavBar is present (not on auth/admin pages)
          pt: !['/login', '/register', '/admin'].some(path => location.pathname.startsWith(path)) ? '64px' : 0
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route path="/monitors" element={
            <PrivateRoute>
              <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 6 } }}>
                <ActiveMonitors />
              </Container>
            </PrivateRoute>
          } />
          <Route path="/add-monitor" element={
            <PrivateRoute>
              <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
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

      {/* Conditionally hide Footer for auth and admin routes */}
      {!['/login', '/register', '/admin'].some(path => location.pathname.startsWith(path)) && (
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
              <Typography variant="body2" sx={{ fontWeight: 800, letterSpacing: '-0.3px' }}>CRICKET<Box component="span" sx={{ color: 'primary.main' }}>NOTIFIER</Box></Typography>
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
