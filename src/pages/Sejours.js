import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/sejours.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Sejours() {
  const [sejours, setSejours] = useState([]);
  const [form, setForm] = useState({ id: '', client_id: '', hotel_id: '', date_debut: '', date_fin: '', montant: '' });
  const [editing, setEditing] = useState(false);
  const [filters, setFilters] = useState({ client_id: '', hotel_id: '', start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSejours = async () => {
    try {
      const params = {};
      if (filters.client_id) params.client_id = filters.client_id;
      if (filters.hotel_id) params.hotel_id = filters.hotel_id;
      if (filters.start) params.start = filters.start;
      if (filters.end) params.end = filters.end;
      const res = await axios.get('/api/sejours', { params });
      setSejours(res.data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du chargement des séjours.');
    }
  };

  useEffect(() => {
    fetchSejours();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/sejours/${form.id}`, form);
      } else {
        await axios.post('/api/sejours', form);
      }
      setForm({ id: '', client_id: '', hotel_id: '', date_debut: '', date_fin: '', montant: '' });
      setEditing(false);
      fetchSejours();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde.');
    }
  };

  const handleEdit = sejour => {
    setForm({
      id: sejour.id,
      client_id: sejour.client_id,
      hotel_id: sejour.hotel_id,
      date_debut: sejour.date_debut.split('T')[0],
      date_fin: sejour.date_fin.split('T')[0],
      montant: sejour.montant
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    if (window.confirm('Supprimer ce séjour ?')) {
      try {
        await axios.delete(`/api/sejours/${id}`);
        fetchSejours();
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  // Pagination
  const totalPages = Math.ceil(sejours.length / itemsPerPage);
  const paginatedSejours = sejours.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container my-4">
      <h2 className="text-center page-title">Gestion des Séjours</h2>

      {/* Filtres */}
      <div className="custom-card">
        <div className="row g-2">
          <div className="col"><input className="form-control" placeholder="Client ID" value={filters.client_id} onChange={e => setFilters({ ...filters, client_id: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Hotel ID" value={filters.hotel_id} onChange={e => setFilters({ ...filters, hotel_id: e.target.value })} /></div>
          <div className="col"><input type="date" className="form-control" value={filters.start} onChange={e => setFilters({ ...filters, start: e.target.value })} /></div>
          <div className="col"><input type="date" className="form-control" value={filters.end} onChange={e => setFilters({ ...filters, end: e.target.value })} /></div>
          <div className="col-auto"><button className="custom-btn" onClick={fetchSejours}>Filtrer</button></div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="custom-card">
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col"><input required className="form-control" placeholder="Client ID" value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} /></div>
          <div className="col"><input required className="form-control" placeholder="Hotel ID" value={form.hotel_id} onChange={e => setForm({ ...form, hotel_id: e.target.value })} /></div>
          <div className="col"><input required type="date" className="form-control" value={form.date_debut} onChange={e => setForm({ ...form, date_debut: e.target.value })} /></div>
          <div className="col"><input required type="date" className="form-control" value={form.date_fin} onChange={e => setForm({ ...form, date_fin: e.target.value })} /></div>
          <div className="col"><input required type="number" className="form-control" placeholder="Montant" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} /></div>
          <div className="col-auto">
            <button type="submit" className="custom-btn">{editing ? 'Modifier' : 'Ajouter'}</button>
          </div>
          {editing && <div className="col-auto"><button type="button" className="cancel-btn custom-btn" onClick={() => { setEditing(false); setForm({ id: '', client_id: '', hotel_id: '', date_debut: '', date_fin: '', montant: '' }); }}>Annuler</button></div>}
        </form>
      </div>

      {/* Liste */}
      <div className="custom-card">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Hotel ID</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Montant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSejours.map(s => (
              <tr key={s.id}>
                <td>{s.client_id}</td>
                <td>{s.hotel_id}</td>
                <td>{new Date(s.date_debut).toLocaleDateString()}</td>
                <td>{new Date(s.date_fin).toLocaleDateString()}</td>
                <td>{s.montant.toFixed(2)} MAD</td>
                <td>
                  <button className="icon-btn" onClick={() => handleEdit(s)}>🖊️</button>
                  <button className="icon-btn" onClick={() => handleDelete(s.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i+1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(i+1)}>{i+1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
