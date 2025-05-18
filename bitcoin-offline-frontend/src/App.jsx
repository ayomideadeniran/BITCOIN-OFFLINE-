import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Paper, Typography, Container, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import CreateWallet from './pages/CreateTx';
import GenerateAddress from './pages/GenerateAddress';
import GetBalance from './pages/GetBalance';
import ListTransactions from './pages/ListTransactions';
import SendToAddress from './pages/SendToAddress';
import CreateTx from './pages/CreateTx';
import SignTx from './pages/SignTx';
import BroadcastTx from './pages/BroadcastTx';

const bitcoinTheme = createTheme({
  palette: {
    primary: {
      main: '#F7931A',
      contrastText: '#ffffff',
    },
  },
});

const uniqueTabs = [
  { label: 'Create Tx', component: <CreateTx /> },
  { label: 'Generate Address', component: <GenerateAddress /> },
  { label: 'Get Balance', component: <GetBalance /> },
  { label: 'List Transactions', component: <ListTransactions /> },
  { label: 'Send To Address', component: <SendToAddress /> },
  { label: 'Sign Tx', component: <SignTx /> },
  { label: 'Broadcast Tx', component: <BroadcastTx /> },
];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <ThemeProvider theme={bitcoinTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: bitcoinTheme.palette.background.default,
        }}
      >
        <Container maxWidth="sm" sx={{ p: { xs: 1, sm: 2 } }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              color="primary"
              sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' } }}
            >
              Bitcoin Regtest Wallet
            </Typography>
            <AppBar
              position="static"
              color="default"
              sx={{
                borderRadius: 1,
                mb: 2,
                boxShadow: 'none',
                background: 'transparent',
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, idx) => setActiveTab(idx)}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
                textColor="primary"
                allowScrollButtonsMobile
              >
                {uniqueTabs.map((tab, idx) => (
                  <Tab key={idx} label={tab.label} />
                ))}
              </Tabs>
            </AppBar>
            <Box sx={{ pt: 2, minHeight: 300 }}>
              {uniqueTabs[activeTab].component}
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;







