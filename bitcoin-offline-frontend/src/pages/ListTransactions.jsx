import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Divider,
  List, ListItem, ListItemText, IconButton, Collapse
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import api from '../services/api';

function ListTransactions() {
  const [walletName, setWalletName] = useState('');
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openTx, setOpenTx] = useState(null); // To track which transaction details are open

  const handleListTransactions = async () => {
    if (!walletName.trim()) {
      setError('Wallet name cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    setTxs([]);
    setOpenTx(null);
    try {
      const res = await api.get(`/list-tx/${walletName}`);
      setTxs(res.data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to list transactions.');
      console.error('Error listing transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTxDetails = (index) => {
    setOpenTx(openTx === index ? null : index);
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <ListAltIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          List Wallet Transactions
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box component="form" onSubmit={(e) => { e.preventDefault(); handleListTransactions(); }} noValidate>
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
          onClick={handleListTransactions}
          disabled={!walletName || loading}
          fullWidth
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ListAltIcon />}
          sx={{ py: 1.2, fontWeight: 600, fontSize: 16 }}
        >
          {loading ? 'Fetching...' : 'List Transactions'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mt: 2, wordBreak: 'break-all' }}>{error}</Alert>}

      {txs.length > 0 && (
        <List sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          {txs.map((tx, index) => (
            <React.Fragment key={tx.txid || index}>
              <ListItem button onClick={() => toggleTxDetails(index)} secondaryAction={
                <IconButton edge="end" onClick={() => toggleTxDetails(index)}>
                  {openTx === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              }>
                <ListItemText primary={`TxID: ${tx.txid?.substring(0, 20)}...`} secondary={`Confirmations: ${tx.confirmations}, Amount: ${tx.amount || 'N/A'}`} />
              </ListItem>
              <Collapse in={openTx === index} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                    {JSON.stringify(tx, null, 2)}
                  </Typography>
                </Box>
              </Collapse>
              {index < txs.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
      {!loading && !error && txs.length === 0 && walletName && (
        <Alert severity="info" sx={{ mt: 2 }}>No transactions found for this wallet or wallet is empty.</Alert>
      )}
    </Paper>
  );
}

export default ListTransactions;
