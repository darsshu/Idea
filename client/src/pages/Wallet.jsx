import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Paper, 
    Grid, 
    Button, 
    TextField, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    IconButton,
    Divider
} from '@mui/material';
import { 
    AccountBalanceWallet, 
    AddCircle, 
    RemoveCircle, 
    History,
    ContentCopy,
    InfoOutlined
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Wallet = () => {
    const { user, refreshUser } = useAuth();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Deposit Dialog State
    const [showDeposit, setShowDeposit] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [utr, setUtr] = useState('');
    const [submittingDeposit, setSubmittingDeposit] = useState(false);

    // Withdrawal Dialog State
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [upiId, setUpiId] = useState('');
    const [submittingWithdraw, setSubmittingWithdraw] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const UPI_ID = 'bbtvala1@okaxis'; // Placeholder UPI ID for GPay

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/wallet`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(res.data.balance);
            setTransactions(res.data.transactions);
        } catch (err) {
            setError('Failed to fetch wallet data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleDeposit = async () => {
        if (!depositAmount || !utr) {
            setError('Please fill all fields');
            return;
        }
        try {
            setSubmittingDeposit(true);
            setError('');
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/wallet/deposit`, 
                { amount: Number(depositAmount), utr },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Deposit request submitted! Wait for admin approval.');
            setShowDeposit(false);
            setDepositAmount('');
            setUtr('');
            fetchWalletData();
            refreshUser();
        } catch (err) {
            setError(err.response?.data?.error || 'Deposit failed');
        } finally {
            setSubmittingDeposit(false);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || !upiId) {
            setError('Please fill all fields');
            return;
        }
        if (Number(withdrawAmount) > balance) {
            setError('Insufficient balance');
            return;
        }
        try {
            setSubmittingWithdraw(true);
            setError('');
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/wallet/withdraw`, 
                { amount: Number(withdrawAmount), upiId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Withdrawal request submitted!');
            setShowWithdraw(false);
            setWithdrawAmount('');
            setUpiId('');
            fetchWalletData();
            refreshUser();
        } catch (err) {
            setError(err.response?.data?.error || 'Withdrawal failed');
        } finally {
            setSubmittingWithdraw(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('UPI ID copied to clipboard!');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
                    My Wallet
                </Typography>

                {(error || success) && (
                    <Box sx={{ mb: 3 }}>
                        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}
                        {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}
                    </Box>
                )}

                <Grid container spacing={3}>
                    {/* Balance Card */}
                    <Grid item xs={12} md={5}>
                        <Paper 
                            sx={{ 
                                p: 3, 
                                display: 'flex', 
                                flexDirection: 'column',
                                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                                color: 'white',
                                borderRadius: 4,
                                height: '100%',
                                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={2}>
                                <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
                                <Typography variant="h6">Current Balance</Typography>
                            </Box>
                            <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
                                ₹{balance.toFixed(2)}
                            </Typography>
                            <Box display="flex" gap={2}>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    startIcon={<AddCircle />}
                                    onClick={() => setShowDeposit(true)}
                                    sx={{ 
                                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } 
                                    }}
                                >
                                    Add Money
                                </Button>
                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    startIcon={<RemoveCircle />}
                                    onClick={() => setShowWithdraw(true)}
                                    sx={{ 
                                        bgcolor: 'rgba(255, 255, 255, 0.2)', 
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' } 
                                    }}
                                >
                                    Withdraw
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Stats/Info Card */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }}>
                            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                                <InfoOutlined sx={{ mr: 1, color: 'primary.main' }} />
                                Wallet Information
                            </Typography>
                            <Divider sx={{ my: 1.5 }} />
                            <Box mt={2}>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    • Minimum deposit: ₹10
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    • Tracker Fee: ₹10 per activated tracker (non-refundable).
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    • Withdrawal processing time: 2-24 hours.
                                </Typography>
                                <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.main', mt: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        GPay/UPI Deposit Address:
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <Typography variant="h6">{UPI_ID}</Typography>
                                        <IconButton size="small" onClick={() => copyToClipboard(UPI_ID)} sx={{ ml: 1 }}>
                                            <ContentCopy fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Transaction History */}
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <History sx={{ mr: 1 }} />
                            Transaction History
                        </Typography>
                        <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden' }}>
                            <Table>
                                <TableHead sx={{ bgcolor: 'grey.100' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <AnimatePresence>
                                        {transactions.length > 0 ? (
                                            transactions.map((tx) => (
                                                <TableRow key={tx.id} component={motion.tr} layout>
                                                    <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ textTransform: 'capitalize', fontWeight: 'medium' }}>
                                                            {tx.type.replace('_', ' ')}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>{tx.description}</TableCell>
                                                    <TableCell>
                                                        <Typography sx={{ 
                                                            fontWeight: 'bold', 
                                                            color: tx.type === 'deposit' ? 'success.main' : 'error.main' 
                                                        }}>
                                                            {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={tx.status} 
                                                            size="small" 
                                                            color={getStatusColor(tx.status)} 
                                                            sx={{ textTransform: 'capitalize' }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                    <Typography color="text.secondary">No transactions yet</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                {/* Deposit Dialog */}
                <Dialog open={showDeposit} onClose={() => setShowDeposit(false)} fullWidth maxWidth="xs">
                    <DialogTitle>Add Money to Wallet</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            1. Open GPay/PhonePe and pay to {UPI_ID}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            2. Enter the amount and Transaction ID (UTR) below.
                        </Typography>
                        <TextField
                            margin="dense"
                            label="Amount (₹)"
                            type="number"
                            fullWidth
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Transaction UTR / Ref ID"
                            fullWidth
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setShowDeposit(false)}>Cancel</Button>
                        <Button 
                            onClick={handleDeposit} 
                            variant="contained" 
                            disabled={submittingDeposit}
                        >
                            {submittingDeposit ? <CircularProgress size={24} /> : 'Submit Deposit'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Withdraw Dialog */}
                <Dialog open={showWithdraw} onClose={() => setShowWithdraw(false)} fullWidth maxWidth="xs">
                    <DialogTitle>Withdraw Money</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Available Balance: ₹{balance.toFixed(2)}
                        </Typography>
                        <TextField
                            margin="dense"
                            label="Amount (₹)"
                            type="number"
                            fullWidth
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Your UPI ID (e.g. user@okaxis)"
                            fullWidth
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setShowWithdraw(false)}>Cancel</Button>
                        <Button 
                            onClick={handleWithdraw} 
                            variant="contained" 
                            color="error"
                            disabled={submittingWithdraw}
                        >
                            {submittingWithdraw ? <CircularProgress size={24} /> : 'Request Withdrawal'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </motion.div>
        </Container>
    );
};

export default Wallet;
