import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Divider } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor'; // Icon for signing
import api from '../services/api';

function SignTx() {
  const [walletName, setWalletName] = useState('');
  const [psbt, setPsbt] = useState('');
  const [signedPsbt, setSignedPsbt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSign = async () => {
    if (!walletName.trim() || !psbt.trim()) {
      setError('Wallet name and PSBT are required.');
      return;
    }
    setLoading(true);
    setError('');
    setSignedPsbt('');
    try {
      const cleanPsbt = psbt.replace(/\n/g, '').trim();
      const res = await api.post('/sign-tx', { walletName, psbt: cleanPsbt });
      setSignedPsbt(res.data.signedPsbt || JSON.stringify(res.data));
    } catch (err) {
      console.error('Error signing PSBT:', err);
      setError(err.response?.data?.error || err.message || 'Failed to sign PSBT.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <BorderColorIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Sign PSBT
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSign(); }} noValidate>
        <TextField
          label="Wallet Name"
          placeholder="Enter wallet name"
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          label="PSBT (Partially Signed Bitcoin Transaction)"
          placeholder="Paste your PSBT here"
          value={psbt}
          onChange={(e) => setPsbt(e.target.value)}
          multiline
          minRows={4}
          fullWidth
          required
          sx={{ mb: 2 }}
          disabled={loading}
          helperText="Ensure the PSBT is in the correct format (usually base64)."
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSign}
          disabled={!walletName || !psbt || loading}
          fullWidth
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <BorderColorIcon />}
          sx={{ py: 1.2, fontWeight: 600, fontSize: 16 }}
        >
          {loading ? 'Signing...' : 'Sign Transaction'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2, wordBreak: 'break-all' }}>{error}</Alert>}

      {signedPsbt && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>Signed PSBT:</Typography>
          <TextField
            value={signedPsbt}
            multiline
            minRows={6}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{ mt: 1, '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.875rem', bgcolor: 'grey.100' } }}
          />
        </Box>
      )}
    </Paper>
  );
}

export default SignTx;
