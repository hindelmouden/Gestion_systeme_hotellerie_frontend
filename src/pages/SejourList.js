import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSejours, searchSejoursByClient } from '../api';

export default function SejourList() {
  const [sejours, setSejours] = useState([]);
  const [searchClientId, setSearchClientId] = useState('');

  useEffect(() => {
    loadSejours();
  }, []);

  const loadSejours = async () => {
    try {
      const res = await fetchSejours();
      setSejours(res.data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors du chargement des séjours');
    }
  };

  const handleSearch = async () => {
    if (!searchClientId.trim()) {
      loadSejours();
      return;
    }
    try {
      const res = await searchSejoursByClient(searchClientId);
      setSejours(res.data);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la recherche');
    }
  };

  return (
    <div>
      <h2>Liste des séjours</h2>
      <Link to="/sejours/ajouter" style={{ display: 'inline-block', marginBottom: 15 }}>
        Ajouter un séjour
      </Link>
      <br />
      <input
        type="text"
        placeholder="Rechercher par Client ID"
        value={searchClientId}
        onChange={(e) => setSearchClientId(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <button onClick={handleSearch}>Rechercher</button>

      <table border="1" cellPadding="8" style={{ marginTop: 20, borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#4B2E0E', color: 'white' }}>
          <tr>
            <th>ID</th>
            <th>Client ID</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Hotel ID</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {sejours.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.client_id}</td>
              <td>{new Date(s.date_debut).toLocaleDateString()}</td>
              <td>{new Date(s.date_fin).toLocaleDateString()}</td>
              <td>{s.hotel_id}</td>
              <td>{s.montant}</td>
            </tr>
          ))}
          {sejours.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Aucun séjour trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
