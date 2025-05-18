import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import api from '../services/api';

function GenerateAddress() {
  const [walletName, setWalletName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!walletName.trim()) {
      setError('Wallet name cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    setAddress('');
    try {
      const res = await api.get(`/generate-address/${walletName}`);
      setAddress(res.data.address);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate address.');
      console.error('Error generating address:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <AddCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Generate New Address
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} noValidate>
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
          onClick={handleGenerate}
          disabled={!walletName || loading}
          fullWidth
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />}
          sx={{ py: 1.2, fontWeight: 600, fontSize: 16 }}
        >
          {loading ? 'Generating...' : 'Generate Address'}
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2, wordBreak: 'break-all' }}>{error}</Alert>}
      {address && <Alert severity="success" sx={{ mt: 2, wordBreak: 'break-all' }}><strong>Generated Address:</strong><br />{address}</Alert>}
    </Paper>
  );
}

export default GenerateAddress;
