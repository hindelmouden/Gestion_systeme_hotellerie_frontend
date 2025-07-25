import React, { useEffect, useState } from 'react';
import {
  getFactures,
  addFacture,
  updateFacture,
  deleteFacture,
  fetchSejours
} from '../api';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function FacturesList() {
  const [factures, setFactures] = useState([]);
  const [filteredFactures, setFilteredFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [sejours, setSejours] = useState([]);
  const [editingFacture, setEditingFacture] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    montant_total: '',
    date_facture: '',
    sejour_id: '',
    type_facture: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const facturesPerPage = 10;
  const [searchNom, setSearchNom] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const indexOfLastFacture = currentPage * facturesPerPage;
  const indexOfFirstFacture = indexOfLastFacture - facturesPerPage;
  const currentFactures = filteredFactures.slice(indexOfFirstFacture, indexOfLastFacture);
  const totalPages = Math.ceil(filteredFactures.length / facturesPerPage);

  useEffect(() => {
    loadFactures();
    loadClients();
    loadSejours();
  }, []);

  useEffect(() => {
    const result = factures.filter((f) => {
      const nomClient = getClientName(f.client_id)?.toLowerCase() || '';
      const matchNom = nomClient.includes(searchNom.toLowerCase());
      const dateFacture = new Date(f.date_facture);
      const matchDebut = !dateDebut || dateFacture >= new Date(dateDebut);
      const matchFin = !dateFin || dateFacture <= new Date(dateFin);
      return matchNom && matchDebut && matchFin;
    });
    setFilteredFactures(result);
  }, [searchNom, dateDebut, dateFin, factures]);

  const loadFactures = async () => {
    try {
      const res = await getFactures();
      setFactures(res.data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du chargement des factures');
    }
  };

  const loadClients = async () => {
    try {
      const res = await axios.get(`${API_BASE}/clients`);
      const data = res.data;

      if (Array.isArray(data)) {
        setClients(data);
      } else if (data && Array.isArray(data.clients)) {
        setClients(data.clients);
      } else {
        console.warn('Format inattendu des clients:', data);
        setClients([]);
      }
    } catch (error) {
      console.error('Erreur lors du fetch des clients:', error);
      setClients([]);
    }
  };

  const loadSejours = async () => {
    try {
      const res = await fetchSejours();
      const sejoursList = Array.isArray(res.data) ? res.data : res.data.sejours || [];
      setSejours(sejoursList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (facture) => {
    try {
      await loadClients(); // pour rafraîchir les clients
      setEditingFacture(facture);
      setFormData({
        client_id: facture.client_id || '',
        montant_total: facture.montant_total || '',
        date_facture: facture.date_facture ? facture.date_facture.substring(0, 10) : '',
        sejour_id: facture.sejour_id || '',
        type_facture: facture.type_facture || ''
      });
    } catch (err) {
      console.error('Erreur chargement clients pour modification:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      montant_total: '',
      date_facture: '',
      sejour_id: '',
      type_facture: ''
    });
    setEditingFacture(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFacture) {
        await updateFacture(editingFacture.id, formData);
        alert('Facture modifiée');
      } else {
        await addFacture(formData);
        alert('Facture ajoutée');
      }
      resetForm();
      loadFactures();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      try {
        await deleteFacture(id);
        alert('Facture supprimée');
        loadFactures();
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getClientName = (id) => {
    const client = clients.find(c => c.id === id);
    return client ? `${client.prenom} ${client.nom}` : '';
  };

  const getSejourInfo = (id) => {
    const sejour = sejours.find(s => s.id === id);
    return sejour
      ? `(${new Date(sejour.date_debut).toLocaleDateString()}) → (${new Date(sejour.date_fin).toLocaleDateString()})`
      : '';
  };

  return (
    <div className="container mt-4">
      <h2>Liste des Factures</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Choisir un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.prenom} {client.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="montant_total"
              placeholder="Montant Total"
              value={formData.montant_total}
              onChange={handleChange}
              className="form-control"
              step="0.01"
              required
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              name="date_facture"
              className="form-control"
              value={formData.date_facture}
              onChange={handleChange}
              disabled={!!editingFacture}
              style={editingFacture ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
            />
          </div>
          <div className="col-md-3">
            <select
              name="sejour_id"
              value={formData.sejour_id}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Choisir un séjour</option>
              {sejours.map(sejour => (
                <option key={sejour.id} value={sejour.id}>
                  ({new Date(sejour.date_debut).toLocaleDateString()}) → ({new Date(sejour.date_fin).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input
              type="text"
              name="type_facture"
              placeholder="Type de facture"
              value={formData.type_facture}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-12 mt-2">
            <button type="submit" className="btn btn-primary">
              {editingFacture ? 'Modifier' : 'Ajouter'}
            </button>
            {editingFacture && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Filtres */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Rechercher par nom client"
            value={searchNom}
            onChange={(e) => setSearchNom(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
      </div>

      {/* Tableau des factures */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Client</th>
            <th>Montant</th>
            <th>Date Facture</th>
            <th>Séjour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentFactures.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Aucune facture trouvée</td>
            </tr>
          ) : (
            currentFactures.map((facture) => (
              <tr key={facture.id}>
                <td>{getClientName(facture.client_id)}</td>
                <td>{facture.montant_total}</td>
                <td>{new Date(facture.date_facture).toLocaleDateString()}</td>
                <td>{facture.type_facture} {getSejourInfo(facture.sejour_id)}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(facture)}>✏️ Modifier</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(facture.id)}>🗑️ Supprimer</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">       

          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
            </li>
              {(() => {
                const maxVisiblePages = 10;
                let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
                let endPage = startPage + maxVisiblePages - 1;

                if (endPage > totalPages) {
                  endPage = totalPages;
                  startPage = Math.max(endPage - maxVisiblePages + 1, 1);
                }

                const pageNumbers = [];
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }

                return pageNumbers.map((number) => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(number)}>{number}</button>
                  </li>
                ));
              })()}


            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
            </li>
          </ul>
        </nav>
      )}
              <hr/>

    </div>
            
  );  
}
