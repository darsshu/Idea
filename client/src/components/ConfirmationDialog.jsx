import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Zoom,
  Fade,
  useTheme,
  useMediaQuery,
  Backdrop
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { motion } from 'framer-motion';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // 'primary', 'danger', 'success'
  icon
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'danger': return <WarningRoundedIcon sx={{ fontSize: 40 }} />;
      case 'success': return <CheckCircleRoundedIcon sx={{ fontSize: 40 }} />;
      default: return <InfoRoundedIcon sx={{ fontSize: 40 }} />;
    }
  };

  const getThemeColor = () => {
    switch (type) {
      case 'danger': return theme.palette.error.main;
      case 'success': return theme.palette.success.main;
      case 'primary': return theme.palette.primary.main;
      default: return theme.palette.primary.main;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'danger': return 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)';
      case 'success': return 'linear-gradient(135deg, #52c41a 0%, #237804 100%)';
      case 'primary': return 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)';
      default: return 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Zoom}
      transitionDuration={400}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 5,
          background: theme.palette.mode === 'dark'
            ? 'rgba(30, 41, 59, 0.9)'
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid',
          borderColor: theme.palette.divider,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2
        }
      }}
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
          }
        }
      }}
    >
      {/* Decorative Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: `${getThemeColor()}20`,
        filter: 'blur(40px)',
        zIndex: 0
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        filter: 'blur(30px)',
        zIndex: 0
      }} />

      <DialogTitle sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        p: 1,
        zIndex: 1
      }}>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        pb: 2,
        pt: 0,
        zIndex: 1
      }}>
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: getGradient(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: 24,
            boxShadow: `0 12px 24px -6px ${getThemeColor()}40`
          }}
        >
          {getIcon()}
        </motion.div>

        <Typography variant="h5" sx={{
          fontWeight: 900,
          mb: 1.5,
          color: 'text.primary',
          letterSpacing: '-0.5px'
        }}>
          {title}
        </Typography>

        {message && (
          <Typography variant="body1" sx={{
            color: 'text.secondary',
            lineHeight: 1.6,
            mb: 2,
            px: 2
          }}>
            {message}
          </Typography>
        )}

        {children && (
          <Box sx={{ width: '100%', mt: 1 }}>
            {children}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{
        width: '100%',
        pb: 3,
        px: 3,
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        zIndex: 1,
        '& > button': {
          flex: 1,
          maxWidth: '200px'
        }
      }}>
        <Button
          fullWidth
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontWeight: 800,
            color: 'text.secondary',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          fullWidth
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          sx={{
            borderRadius: 3,
            py: 1.5,
            fontWeight: 800,
            textTransform: 'none',
            fontSize: '1rem',
            background: getGradient(),
            boxShadow: `0 8px 16px -4px ${getThemeColor()}40`,
            '&:hover': {
              background: getGradient(),
              filter: 'brightness(1.1)',
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 20px -4px ${getThemeColor()}60`,
            },
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
