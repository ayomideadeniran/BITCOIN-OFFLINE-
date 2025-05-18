import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper, Divider, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../services/api';

function BroadcastTx() {
  const [psbt, setPsbt] = useState('');
  const [txid, setTxid] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const broadcast = async () => {
    setError('');
    setTxid('');
    setLoading(true);
    try {
      const res = await api.post('/broadcast-tx', { psbt });
      setTxid(res.data.txid);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Broadcast failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, maxWidth: 500, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <SendIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h5" fontWeight={600}>
          Broadcast Transaction
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <TextField
        label="Signed PSBT (base64)"
        placeholder="Paste your fully signed PSBT here"
        value={psbt}
        onChange={(e) => setPsbt(e.target.value)}
        multiline
        minRows={4}
        fullWidth
        sx={{ mb: 2 }}
        helperText="Ensure your PSBT is fully signed and in base64 format."
      />
      <Button
        variant="contained"
        color="primary"
        onClick={broadcast}
        disabled={!psbt || loading}
        fullWidth
        size="large"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        sx={{ mb: 2, py: 1.2, fontWeight: 600, fontSize: 16 }}
      >
        {loading ? 'Broadcasting...' : 'Broadcast'}
      </Button>
      {txid && (
        <Alert severity="success" sx={{ wordBreak: 'break-all', mb: 1 }}>
          Transaction broadcast!<br />
          <strong>TxID:</strong> {txid}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ wordBreak: 'break-all' }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
}

export default BroadcastTx;