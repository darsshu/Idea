import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmationDialog.css';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

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
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'danger': return <WarningRoundedIcon fontSize="large" />;
      case 'success': return <CheckCircleRoundedIcon fontSize="large" />;
      default: return <InfoRoundedIcon fontSize="large" />;
    }
  };

  const getIconClass = () => {
    switch (type) {
      case 'danger': return 'icon-danger';
      case 'success': return 'icon-success';
      case 'primary': return 'icon-primary';
      default: return 'icon-primary';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="confirmation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="confirmation-card"
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirmation-content">
              <motion.div 
                className={`confirmation-icon-wrapper ${getIconClass()}`}
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                {getIcon()}
              </motion.div>
              <h3 className="confirmation-title">{title}</h3>
              {message && <p className="confirmation-message">{message}</p>}
              {children && <div className="confirmation-custom-content">{children}</div>}
            </div>
            <div className="confirmation-actions">
              <button className="cancel-btn" onClick={onClose}>
                {cancelText}
              </button>
              <button 
                className={`confirm-btn ${type}`} 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationDialog;
