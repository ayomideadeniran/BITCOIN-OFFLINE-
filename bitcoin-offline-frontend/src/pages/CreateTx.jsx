import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Divider, Grid } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox'; // Icon for creating
import api from '../services/api';
import QRCode from 'react-qr-code';

function CreateTx() {
  const [walletName, setWalletName] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [psbt, setPsbt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!walletName.trim() || !recipientAddress.trim() || !amount.trim()) {
      setError('All fields (Wallet Name, Recipient Address, Amount) are required.');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    setLoading(true);
    setError('');
    setQrCode('');
    setPsbt('');
    try {
      const outputs = [{ [recipientAddress]: parseFloat(amount) }];
      const res = await api.post('/create-tx', { walletName, outputs });

      setQrCode(res.data.qrCode); // Assuming this is an image data URL or direct data for QRCode component
      setPsbt(res.data.psbt);
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.response?.data?.error || err.message || 'Failed to create transaction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <AddBoxIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Create PSBT (Partially Signed Bitcoin Transaction)
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          placeholder="Wallet Name"
          label="Wallet Name"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          placeholder="Recipient Address"
          label="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          type="number"
          placeholder="Amount"
          label="Amount (BTC)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
          InputProps={{ inputProps: { step: "any", min: "0" } }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!walletName || !recipientAddress || !amount || loading}
          fullWidth
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddBoxIcon />}
          sx={{ py: 1.2, fontWeight: 600, fontSize: 16 }}
        >
          {loading ? 'Creating...' : 'Create Transaction'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2, wordBreak: 'break-all' }}>{error}</Alert>}

      {qrCode && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>PSBT QR Code:</Typography>
          {/* If qrCode is data for the component, use <QRCode value={qrCode} size={128} /> */}
          {/* If qrCode is an image URL (e.g., data:image/png;base64,...), img is fine */}
          <Box sx={{ p: 1, border: '1px solid', borderColor: 'divider', display: 'inline-block', borderRadius: 1 }}>
            <img src={qrCode} alt="PSBT QR Code" style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
          </Box>
        </Box>
      )}

      {psbt && (
        <Box sx={{ mt: qrCode ? 2 : 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>Raw PSBT:</Typography>
          <TextField
            value={psbt}
            multiline
            minRows={4}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{ mt: 1, '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.875rem', bgcolor: 'grey.100' } }}
          />
        </Box>
      )}
    </Paper>
  );
}

export default CreateTx;
