import React, { useState } from 'react';
import { createAccount } from '../services/accountService';
import {
  TextField, Button, Grid, Typography, MenuItem, Select, InputLabel, FormControl,
  Card, CardContent, CardHeader, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { AddCircle, AttachMoney, CheckCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AccountForm = ({ onSuccess }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('savings');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', open: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (balance < 0) {
      setMessage({ type: 'error', text: 'Le solde ne peut pas être négatif.', open: true });
      return;
    }

    setLoading(true);
    try {
      const accountData = { accountNumber, accountType, balance };
      await createAccount(accountData);
      setMessage({ type: 'success', text: 'Compte créé avec succès !', open: true });
      onSuccess();
      setAccountNumber('');
      setAccountType('savings');
      setBalance('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création du compte.', open: true });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{
        mb: 3, p: 3, boxShadow: 6, borderRadius: 3,
        background: 'linear-gradient(to right, #1e3c72, #2a5298)', color: 'white'
      }}>
        <CardHeader
          title={<Typography variant="h5" sx={{ fontWeight: 'bold' }}>Créer un Compte</Typography>}
          avatar={<AddCircle sx={{ fontSize: 40, color: 'white' }} />}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Numéro de Compte"
                  variant="outlined"
                  fullWidth
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                  InputProps={{ style: { color: 'white' } }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: 'white' }}>Type de Compte</InputLabel>
                  <Select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    sx={{ color: 'white', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}
                  >
                    <MenuItem value="savings">Épargne</MenuItem>
                    <MenuItem value="current">Courant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Solde"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ color: 'white' }} />, style: { color: 'white' }
                  }}
                  InputLabelProps={{ style: { color: 'white' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      backgroundColor: '#ffffff',
                      color: '#1e3c72',
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                    endIcon={<CheckCircle />}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Créer le Compte"}
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Snackbar pour afficher les messages */}
      <Snackbar open={message.open} autoHideDuration={4000} onClose={() => setMessage({ ...message, open: false })}>
        <Alert onClose={() => setMessage({ ...message, open: false })} severity={message.type} sx={{ width: '100%' }}>
          {message.text}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default AccountForm;
