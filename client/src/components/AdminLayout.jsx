import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
  Breadcrumbs,
  Chip,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  NotificationsActive as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  ArrowForwardIos as ArrowIcon,
  Person
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Events Management', icon: <EventIcon />, path: '/admin/events' },
    { text: 'Admin Profile', icon: <Person />, path: '/admin/profile' },
  ];

  const secondaryMenuItems = [
    { text: 'Return to Homepage', icon: <HomeIcon />, path: '/' },
  ];

  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.paper',
      borderRight: '1px solid',
      borderColor: 'divider'
    }}>
      {/* Brand Header */}
      <Box sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 80
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            p: 1.2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 3,
            display: 'flex',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)'
          }}>
            <AdminIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1, mb: 0.2 }}>
              ADMIN
            </Typography>

          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small">
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ opacity: 0.6, mx: 2 }} />

      {/* Navigation List */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        <Typography variant="overline" sx={{ px: 2, mb: 1.5, display: 'block', fontWeight: 800, color: 'text.secondary', opacity: 0.8 }}>
          MANAGEMENT
        </Typography>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 3,
                py: 1.5,
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '& .MuiListItemText-primary': { color: 'white' },
                  '&:hover': { bgcolor: 'primary.dark' }
                },
                '&:hover:not(.Mui-selected)': {
                  bgcolor: 'action.hover',
                  '& .MuiListItemIcon-root': { color: 'primary.main' }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: isActive(item.path) ? 'white' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: isActive(item.path) ? 700 : 600, fontSize: '0.95rem' }}
              />
              {isActive(item.path) && <ArrowIcon sx={{ fontSize: 12, opacity: 0.6 }} />}
            </ListItemButton>
          </ListItem>
        ))}

        <Box sx={{ mt: 4, mb: 2 }}>
          <Divider sx={{ opacity: 0.4 }} />
        </Box>

        <Typography variant="overline" sx={{ px: 2, mb: 1.5, display: 'block', fontWeight: 800, color: 'text.secondary', opacity: 0.8 }}>
          APPLICATION
        </Typography>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 3,
                py: 1.2,
                '&:hover': {
                  bgcolor: 'action.hover',
                  '& .MuiListItemIcon-root': { color: 'primary.main' }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 42 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Quick Profile */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          borderRadius: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              fontWeight: 800,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            {user?.name?.charAt(0) || 'A'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Admin'}
            </Typography>

          </Box>
          <IconButton size="small" onClick={handleLogout} color="error">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { lg: `${open ? drawerWidth : 0}px` },
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, minHeight: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              sx={{
                bgcolor: 'action.hover',
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.selected' }
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Breadcrumbs
                separator={<Typography sx={{ opacity: 0.3, mx: 0.5 }}>/</Typography>}
                sx={{ '& .MuiBreadcrumbs-ol': { alignItems: 'center' } }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Admin</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {menuItems.find(item => isActive(item.path))?.text || 'Dashboard'}
                </Typography>
              </Breadcrumbs>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton sx={{ bgcolor: 'action.hover' }}>
                <NotificationsIcon size="small" />
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ p: 0.5, border: '2px solid', borderColor: 'primary.main' }}
            >
              <Avatar
                sx={{
                  width: { xs: 32, md: 24, lg: 28 },
                  height: { xs: 32, md: 24, lg: 28 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '0.85rem', md: '0.7rem', lg: '0.75rem' },
                  fontWeight: 700,
                  color: 'white'
                }}
              >
                {user?.name?.charAt(0) || 'A'}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 4,
                sx: { mt: 1.5, minWidth: 220, borderRadius: 4, p: 1, border: '1px solid', borderColor: 'divider' }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{user?.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{user?.email}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem component={Link} to="/admin/profile" onClick={handleProfileMenuClose} sx={{ borderRadius: 2 }}>
                <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
                Account Profile
              </MenuItem>

              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main', fontWeight: 700 }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { lg: open ? drawerWidth : 0 },
          flexShrink: { lg: 0 },
          transition: 'width 0.2s',
          zIndex: theme.zIndex.drawer + 2
        }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: isMobile ? '20px 0 40px rgba(0,0,0,0.15)' : 'none'
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, md: 5 },
          width: { lg: `calc(100% - ${open ? drawerWidth : 0}px)` },
          minHeight: '100vh',
          pt: { xs: 20, md: 10 },
          bgcolor: 'background.default',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter,
          }),
        }}
      >
        <Container maxWidth="xl" sx={{ p: '0 !important' }}>
          <Fade in={true} timeout={800}>
            <Box>{children}</Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;

