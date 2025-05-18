import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Divider } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import api from '../services/api';

function GetBalance() {
  const [walletName, setWalletName] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetBalance = async () => {
    if (!walletName.trim()) {
      setError('Wallet name cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    setBalance('');
    try {
      const res = await api.get(`/get-balance/${walletName}`);
      setBalance(res.data.balance.toString()); 
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to get balance.');
      console.error('Error getting balance:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Get Wallet Balance
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleGetBalance(); }} noValidate>
        <TextField
          label="Wallet Name"
          placeholder="Enter the wallet name"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetBalance}
          disabled={!walletName || loading}
          fullWidth
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
          sx={{ py: 1.2, fontWeight: 600, fontSize: 16 }}
        >
          {loading ? 'Fetching...' : 'Get Balance'}
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2, wordBreak: 'break-all' }}>{error}</Alert>}
      {balance !== '' && <Alert severity="success" sx={{ mt: 2, wordBreak: 'break-all' }}><strong>Balance:</strong> {balance} BTC</Alert>}
    </Paper>
  );
}

export default GetBalance;
