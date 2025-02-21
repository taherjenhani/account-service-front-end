import axios from 'axios';

const API_URL = 'http://localhost:5008/api/accounts'; 

export const getAllAccounts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes', error);
    throw error;
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await axios.post(API_URL, accountData);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la création du compte', error);
    throw error;
  }
};

export const updateAccount = async (accountId, accountData) => {
  try {
    const response = await axios.put(`${API_URL}/${accountId}`, accountData);
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compte', error);
    throw error;
  }
};

export const deleteAccount = async (accountId) => {
  try {
    await axios.delete(`${API_URL}/${accountId}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du compte', error);
    throw error;
  }
};
