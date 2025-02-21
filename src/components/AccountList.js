import React, { useEffect, useState } from 'react';
import { getAllAccounts, deleteAccount, updateAccount } from '../services/accountService';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, Button, TextField, Typography, IconButton, Box, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Delete, Edit, Search, Visibility, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des comptes');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce compte ?')) {
      try {
        await deleteAccount(id);
        setAccounts(accounts.filter(account => account._id !== id));
        toast.success('Compte supprimé avec succès !');
      } catch (error) {
        toast.error('Erreur lors de la suppression du compte');
      }
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAccount(null);
  };

  const handleUpdate = async () => {
    try {
      await updateAccount(selectedAccount._id, selectedAccount);
      fetchAccounts();
      toast.success('Compte mis à jour avec succès !');
      handleClose();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du compte');
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAccounts = accounts.filter(account =>
    account.accountNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Liste des Comptes ({filteredAccounts.length})
      </Typography>

      {/* Barre de recherche */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <TextField
          label="Rechercher un compte"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'gray', mr: 1 }} />
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Tableau des comptes */}
      <TableContainer component={Paper} sx={{ boxShadow: 6, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#2193b0' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Numéro de Compte</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Solde</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((account) => (
              <motion.tr key={account._id} whileHover={{ scale: 1.02 }}>
                <TableCell>{account.accountNumber}</TableCell>
                <TableCell>{account.accountType === 'savings' ? 'Épargne' : 'Courant'}</TableCell>
                <TableCell>{account.balance} €</TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton color="warning" onClick={() => handleEdit(account)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(account._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredAccounts.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Popup d'édition */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Modifier le Compte</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          {selectedAccount && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Numéro de Compte"
                variant="outlined"
                fullWidth
                value={selectedAccount.accountNumber}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, accountNumber: e.target.value })}
              />
              <TextField
                label="Type de Compte"
                variant="outlined"
                fullWidth
                value={selectedAccount.accountType}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, accountType: e.target.value })}
              />
              <TextField
                label="Solde (€)"
                type="number"
                variant="outlined"
                fullWidth
                value={selectedAccount.balance}
                onChange={(e) => setSelectedAccount({ ...selectedAccount, balance: e.target.value })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">Annuler</Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountList;
