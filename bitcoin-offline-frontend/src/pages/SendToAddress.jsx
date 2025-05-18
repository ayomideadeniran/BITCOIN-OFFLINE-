import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../services/api';

function SendToAddress() {
  const [walletName, setWalletName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txid, setTxid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!walletName.trim() || !recipientAddress.trim() || !amount.trim()) {
      setError('All fields are required.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    setLoading(true);
    setError('');
    setTxid('');
    try {
      const res = await api.post('/send-to-address', {
        walletName,
        address: recipientAddress,
        amount: parsedAmount,
      });
      setTxid(res.data.txid);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send transaction.');
      console.error('Error sending transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <SendIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Send Bitcoin
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSend(); }} noValidate>
        <TextField
          label="Wallet Name (Sender)"
          placeholder="Enter your wallet name"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          label="Recipient Address"
          placeholder="Enter recipient's Bitcoin address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          label="Amount (BTC)"
          placeholder="Enter amount to send"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
          InputProps={{ inputProps: { step: "any", min: "0" } }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={!walletName || !recipientAddress || !amount || loading}
          fullWidth
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{ py: 1.2, fontWeight: 600, fontSize: 16 }}
        >
          {loading ? 'Sending...' : 'Send Bitcoin'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2, wordBreak: 'break-all' }}>{error}</Alert>}
      {txid && <Alert severity="success" sx={{ mt: 2, wordBreak: 'break-all' }}><strong>Transaction Sent!</strong><br />TxID: {txid}</Alert>}
    </Paper>
  );
}

export default SendToAddress;
