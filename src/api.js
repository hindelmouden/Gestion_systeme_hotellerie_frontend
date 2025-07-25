import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});
// Clients
export const getClients = (params) => api.get('/clients', { params });
export const searchClients = (term) => api.get(`/clients/search?term=${term}`);
export const deleteClient = (id) => api.delete(`/clients/${id}`);
export const getClientById = (id) => api.get(`/clients/${id}`);
export const addClient = (data) => api.post('/clients', data);
export const updateClient = (id, client) => api.put(`/clients/${id}`, client);
// Paiements
export const getPayments = () => api.get('/paiements');
export const addPayment = (data) => api.post('/paiements',data);
// Séjours
export const fetchSejours = () => api.get('/sejours');
export const addSejour = (sejour) => api.post('/sejours', sejour);
export const searchSejoursByClient = (clientId) => api.get(`/sejours/search?client_id=${clientId}`);
export const getFactures = (clientId) =>
  clientId ? api.get('/factures', { params: { clientId } }) : api.get('/factures');
  export const addFacture = (data) => api.post('/factures', data);
  export const updateFacture = (id, data) => api.put(`/factures/${id}`, data);
  export const deleteFacture = (id) => api.delete(`/factures/${id}`);  
// Rapports
export const getPaymentsReport = (hotelId, start, end) =>
  api.get('/reports/paiements', { params: { hotelId, start, end } });
export const getClientsActivityReport = (hotelId, start, end) =>
  api.get('/reports/clients-activity', { params: { hotelId, start, end } });
export const getOccupationReport = (hotelId, startDate, endDate) =>
  api.get('/reports/occupation', { params: { hotel_id: hotelId, start_date: startDate, end_date: endDate } });
export const getTauxOccupation = (hotel_id, start_date, end_date) =>
  api.get('/reports/taux-occupation', { params: { hotel_id, start_date, end_date } });
export const getChiffreAffaires = (hotel_id, start_date, end_date) =>
  api.get('/reports/chiffre-affaires', { params: { hotel_id, start_date, end_date } });
export const getTotalSejours = (hotel_id, start_date, end_date) =>
  api.get('/reports/total-sejours', { params: { hotel_id, start_date, end_date } });
export const getPaiementsParType = (start_date, end_date) =>
  api.get('/reports/paiements-par-type', { params: { start_date, end_date } });
export const updatePayment = async (id, data) => axios.put(`/paiements/${id}`, data);
export default api;
